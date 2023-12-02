import { error, json } from '@sveltejs/kit';
import {
    constants as fsConstants,
    promises as fsPromises
} from 'fs';

import TunnelSettings from '$lib/model/TunnelSettings';
import { env } from '$env/dynamic/private';

const TOKEN_FILE_ENCODING = 'utf8'
const CLOUDFLARED_CONTROL_URL = 'http://' + env.CLOUDFLARED_HOSTNAME + ':' + 8018

/** @type {import('./$types').RequestHandler} */
export async function GET() {
    let token = await getTokenFromFile()
    return json(new TunnelSettings(token))
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    const { token } = await request.json();
    if (token && typeof token == 'string') {
        await saveTokenToFile(token)
    } else {
        throw error(400, '"token" is required and must be a string')
    }

    await restartConnector()

    return GET()
}

async function getTokenFromFile(): Promise<string | null> {
    let tokenFileHandle
    try {
        try {
            await fsPromises.access(env.CLOUDFLARED_TOKEN_FILE!, fsConstants.R_OK)
        } catch(err) {
            console.warn('settings.getTokenFromFile: file_not_accessible:', {
                message: (err as Error).message,
                file: env.CLOUDFLARED_TOKEN_FILE
            })

            return null
        }

        tokenFileHandle = await fsPromises.open(env.CLOUDFLARED_TOKEN_FILE!, 'r')
        return (await tokenFileHandle.readFile(TOKEN_FILE_ENCODING)).trim()
    } finally {
        if (tokenFileHandle !== undefined) {
            await tokenFileHandle.close();
        }
    }
}

/**
 * @param token value to save
 */
async function saveTokenToFile(token: string) {
    let tokenFileHandle
    try {
        tokenFileHandle = await fsPromises.open(env.CLOUDFLARED_TOKEN_FILE!, 'w')
        await tokenFileHandle.writeFile(token, {
            encoding: TOKEN_FILE_ENCODING,
            flag: 'w'
        })
    } finally {
        if (tokenFileHandle !== undefined) {
            await tokenFileHandle.close();
        }
    }
}

async function restartConnector() {
    let response = await fetch(CLOUDFLARED_CONTROL_URL + '/cfd-restart', {
        method: "POST",
    })

    if (response.status != 202) {
        console.error('settings.restartConnector: unexpected_response', {
            status: response.status,
        })

        throw new Error('Unexpected response from the restart: ' + response.status)
    }
}
