import { error, json } from '@sveltejs/kit';
import {
    constants as fsConstants,
    promises as fsPromises
} from 'fs';

import TunnelSettings from '../../../model/TunnelSettings';
import {
    CLOUDFLARED_TOKEN_FILE,
} from '$env/static/private';

const TOKEN_FILE_ENCODING = 'utf8'

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

    return GET()
}

/**
 * @returns {Promise<string?>}
 */
async function getTokenFromFile() {
    let tokenFileHandle
    try {
        try {
            await fsPromises.access(CLOUDFLARED_TOKEN_FILE, fsConstants.R_OK)
        } catch {
            console.warn('settings.getTokenFromFile: file_not_accessible:', {
                file: CLOUDFLARED_TOKEN_FILE
            })

            return null
        }

        tokenFileHandle = await fsPromises.open(CLOUDFLARED_TOKEN_FILE, 'r')
        return (await tokenFileHandle.readFile(TOKEN_FILE_ENCODING)).trim()
    } finally {
        if (tokenFileHandle !== undefined) {
            await tokenFileHandle.close();
        }
    }
}

/**
 * 
 * @param {string} token value to save
 */
async function saveTokenToFile(token) {
    let tokenFileHandle
    try {
        tokenFileHandle = await fsPromises.open(CLOUDFLARED_TOKEN_FILE, 'w')
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
