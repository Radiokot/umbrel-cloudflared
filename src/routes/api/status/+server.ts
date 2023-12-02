import { json } from '@sveltejs/kit';
import TunnelStatus from '$lib/model/TunnelStatus';
import TunnelRoute from '$lib/model/TunnelRoute';

import { env } from '$env/dynamic/private';

const CLOUDFLARE_METRICS_URL = 'http://' + env.CLOUDFLARED_HOSTNAME + ':' + env.CLOUDFLARED_METRICS_PORT

/** @type {import('./$types').RequestHandler} */
export async function GET() {
    try {
        let cloudflaredHealth = (await getCloudflaredHealth()).trim()
        let cloudflaredConfig = await getCloudflaredConfig()
        let cloudflaredVersion = await getCloudflaredVersion()
        let routes = cloudflaredConfig
            ?.config
            ?.ingress
            ?.map(TunnelRoute.from)
            ?.filter((route: TunnelRoute) => route.publicHostname != "")
            || []

        return json(new TunnelStatus(cloudflaredHealth, cloudflaredVersion, routes))
    } catch (err) {
        console.warn('status.GET: server_unreachable:', err)

        return json(new TunnelStatus('UNREACHABLE'))
    }
}

async function getCloudflaredHealth(): Promise<string> {
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

async function getCloudflaredConfig(): Promise<any> {
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

async function getCloudflaredVersion(): Promise<string> {
    let response = await fetch(CLOUDFLARE_METRICS_URL + '/metrics')
    if (response.ok) {
        let responseText = await response.text()
        const versionRegex = /^build_info.*?[,\{]version="(.+?)".+?\s1$/m
        let matchedValue = versionRegex.exec(responseText)
        if (matchedValue?.length == 2) {
            return matchedValue[1]
        } else {
            console.error('status.getCloudflaredVersion: version_parsing_failed:', {
                metrics: responseText,
            })

            return "unknown"
        }
    } else {
        console.error('status.getCloudflaredVersion: metrics_request_failed:', {
            status: response.status
        })

        throw new Error('Metrics request failed')
    }
}
