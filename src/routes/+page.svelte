<script>
    import TunnelRoute from "../model/TunnelRoute";
    import TunnelStatus from "../model/TunnelStatus";

    // /** @type {import('../model/TunnelRoute').default[]}*/
    // let tunnelRoutes = [];

    async function getTunnelStatus() {
        let response = await fetch("/api/status");
        if (!response.ok) {
            throw new Error(
                "getTunnelStatus(): request_failed: " + response.status
            );
        } else {
            return TunnelStatus.from(await response.json());
        }
    }
</script>

<svelte:head>
    <title>Cloudflare Tunnel client</title>
</svelte:head>

<h1>Cloudflare Tunnel client</h1>

<p>
    Status:
    {#await getTunnelStatus()}
        Loading...
    {:then tunnelStatus}
        {#if tunnelStatus.isUnreachable()}
            Unreachable
        {:else if tunnelStatus.isOk()}
            Healty
        {:else}
            {tunnelStatus.status}
        {/if}

        {#if tunnelStatus.routes.length > 0}
            <p>Routes:</p>
            <ul>
                {#each tunnelStatus.routes as tunnelRoute (tunnelRoute.id)}
                    <li>
                        {tunnelRoute.publicUrl} => {tunnelRoute.serviceUrl}
                    </li>
                {/each}
            </ul>
        {:else}
            <p>The tunnel has no routes</p>
        {/if}
    {:catch}
        <b>Failed to load</b>
    {/await}
</p>

<a href="/settings">Settings</a>
