import { json } from '@sveltejs/kit';
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
