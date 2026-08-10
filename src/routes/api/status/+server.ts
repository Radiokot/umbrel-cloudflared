import { json } from '@sveltejs/kit';
import { getCloudflaredStatus } from '$lib/server/cloudflared';

/** @type {import('./$types').RequestHandler} */
export async function GET() {
    return json(await getCloudflaredStatus());
}
