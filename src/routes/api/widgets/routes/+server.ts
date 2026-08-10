import { json } from '@sveltejs/kit';

import { getCloudflaredStatus } from '$lib/server/cloudflared';

const MAX_VISIBLE_ROUTES = 5;

/** @type {import('./$types').RequestHandler} */
export async function GET() {
    const status = await getCloudflaredStatus();
    const visibleRoutes = status.routes.slice(0, MAX_VISIBLE_ROUTES);
    const hiddenRouteCount = status.routes.length - visibleRoutes.length;

    return json({
        type: 'list',
        refresh: '15s',
        link: '/',
        noItemsText: status.isUnreachable() ? 'Tunnel is offline.' : 'No active routes.',
        items: [
            ...visibleRoutes.map((route) => ({
                text: route.publicEndpoint,
                subtext: route.serviceUrl,
            })),
            ...(hiddenRouteCount > 0
                ? [{ text: `+${hiddenRouteCount} more`, subtext: 'Open Cloudflare Tunnel to view all routes' }]
                : []),
        ],
    });
}
