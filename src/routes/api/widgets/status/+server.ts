import { json } from '@sveltejs/kit';

import { getCloudflaredStatus } from '$lib/server/cloudflared';

/** @type {import('./$types').RequestHandler} */
export async function GET() {
    const status = await getCloudflaredStatus();

    return json({
        type: 'three-stats',
        refresh: '15s',
        link: '/',
        items: [
            {
                icon: statusIcon(status.status),
                subtext: 'Status',
                text: statusText(status.status),
            },
            {
                icon: 'route',
                subtext: 'Routes',
                text: String(status.routes.length),
            },
            {
                icon: 'versions',
                subtext: 'Version',
                text: status.version,
            },
        ],
    });
}

function statusText(status: string): string {
    if (status === 'OK') {
        return 'On';
    }

    if (status === 'RESTARTING') {
        return 'Restart';
    }

    return 'Off';
}

function statusIcon(status: string): string {
    if (status === 'OK') {
        return 'circle-check';
    }

    if (status === 'RESTARTING') {
        return 'refresh';
    }

    return 'circle-x';
}
