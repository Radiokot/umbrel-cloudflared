<script>
    import TunnelRoute from "../model/TunnelRoute";

    let tunnelStatus = "Not running";
    /** @type {import('../model/TunnelRoute').default[]}*/
    let tunnelRoutes = [new TunnelRoute()];
</script>

<svelte:head>
    <title>Cloudflare Tunnel client</title>
</svelte:head>

<h1>Cloudflare Tunnel client</h1>

<p>Status: {tunnelStatus}</p>

{#if tunnelRoutes.length > 0}
    <p>Routes:</p>
    <ul>
        {#each tunnelRoutes as tunnelRoute (tunnelRoute.id)}
            <li>{tunnelRoute.publicHostname} => {tunnelRoute.serviceUrl}</li>
        {/each}
    </ul>
{:else}
    <p>The tunnel has no routes</p>
{/if}

<a href="/settings">Settings</a>
