import { json } from '@sveltejs/kit';
import TunnelStatus from '../../../model/TunnelStatus';

import {
    CLOUDFLARED_HOSTNAME,
    CLOUDFLARED_METRICS_PORT
} from '$env/static/private';

/** @type {import('./$types').RequestHandler} */
export async function GET() {
    try {
        let cloudflaredHealth = (await getCloudflaredHealth()).trim()
        return json(new TunnelStatus(cloudflaredHealth))
    } catch (err) {
        console.warn('status.GET: server_unreachable:', err)

        return json(new TunnelStatus('UNREACHABLE'))
    }
}

/**
 * @returns {Promise<string>}
 */
async function getCloudflaredHealth() {

    let response = await fetch('http://' + CLOUDFLARED_HOSTNAME + ':' + CLOUDFLARED_METRICS_PORT + '/healthcheck')
    if (response.ok) {
        return response.text();
    } else {
        console.error('status.getCloudflaredHealth: request_failed:', {
            status: response.status
        })
        
        throw new Error('Health request failed')
    }
}
