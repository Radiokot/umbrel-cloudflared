import { env } from '$env/dynamic/private';

import TunnelRoute from '$lib/model/TunnelRoute';
import TunnelStatus from '$lib/model/TunnelStatus';

const metricsUrl = `http://${env.CLOUDFLARED_HOSTNAME}:${env.CLOUDFLARED_METRICS_PORT}`;

/**
 * Reads cloudflared's health, version, and configured public routes.
 *
 * The caller receives UNREACHABLE rather than a transport error so that both
 * the app UI and UmbrelOS widgets can render a useful offline state.
 */
export async function getCloudflaredStatus(): Promise<TunnelStatus> {
    try {
        const cloudflaredHealth = (await getCloudflaredHealth()).trim();
        const cloudflaredConfig = await getCloudflaredConfig();
        const cloudflaredVersion = await getCloudflaredVersion();
        const routes = cloudflaredConfig
            ?.config
            ?.ingress
            ?.map(TunnelRoute.from)
            ?.filter((route: TunnelRoute) => route.publicHostname !== '') || [];

        return new TunnelStatus(cloudflaredHealth, cloudflaredVersion, routes);
    } catch (err) {
        console.warn('cloudflared.getStatus: server_unreachable:', err);

        return new TunnelStatus('UNREACHABLE');
    }
}

async function getCloudflaredHealth(): Promise<string> {
    const response = await fetch(metricsUrl + '/healthcheck');
    if (response.ok) {
        return response.text();
    }

    console.error('cloudflared.getHealth: request_failed:', { status: response.status });
    throw new Error('Health request failed');
}

async function getCloudflaredConfig(): Promise<any> {
    const response = await fetch(metricsUrl + '/config');
    if (response.ok) {
        return response.json();
    }

    console.error('cloudflared.getConfig: request_failed:', { status: response.status });
    throw new Error('Config request failed');
}

async function getCloudflaredVersion(): Promise<string> {
    const response = await fetch(metricsUrl + '/metrics');
    if (!response.ok) {
        console.error('cloudflared.getVersion: request_failed:', { status: response.status });
        throw new Error('Metrics request failed');
    }

    const responseText = await response.text();
    const versionRegex = /^build_info.*?[,\{]version="(.+?)".+?\s1$/m;
    const matchedValue = versionRegex.exec(responseText);
    if (matchedValue?.length === 2) {
        return matchedValue[1];
    }

    console.error('cloudflared.getVersion: parsing_failed:', { metrics: responseText });
    return 'unknown';
}
