import { json } from '@sveltejs/kit';
import TunnelStatus from '../../../model/TunnelStatus';
import TunnelRoute from '../../../model/TunnelRoute';

import { env } from '$env/dynamic/private';

const CLOUDFLARE_METRICS_URL = 'http://' + env.CLOUDFLARED_HOSTNAME + ':' + env.CLOUDFLARED_METRICS_PORT


/** @type {import('./$types').RequestHandler} */
export async function GET() {
    try {
        let cloudflaredHealth = (await getCloudflaredHealth()).trim()
        let cloudflaredConfig = await getCloudflaredConfig()
        let routes = cloudflaredConfig
            ?.config
            ?.ingress
            ?.map(TunnelRoute.from)
            ?.filter(route => route.publicHostname != "")
            || []

        return json(new TunnelStatus(cloudflaredHealth, routes))
    } catch (err) {
        console.warn('status.GET: server_unreachable:', err)

        return json(new TunnelStatus('UNREACHABLE'))
    }
}

/**
 * @returns {Promise<string>}
 */
async function getCloudflaredHealth() {    
    let response = await fetch(CLOUDFLARE_METRICS_URL + '/healthcheck')
    if (response.ok) {
        return response.text();
    } else {
        console.error('status.getCloudflaredHealth: request_failed:', {
            status: response.status
        })

        throw new Error('Health request failed')
    }
}

/**
 * @returns {Promise<any>}
 */
async function getCloudflaredConfig() {
    let response = await fetch(CLOUDFLARE_METRICS_URL + '/config')
    if (response.ok) {
        return response.json();
    } else {
        console.error('status.getCloudflaredConfig: request_failed:', {
            status: response.status
        })

        throw new Error('Config request failed')
    }
}
