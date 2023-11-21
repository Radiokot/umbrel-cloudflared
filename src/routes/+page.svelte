<script>
    import TunnelRoute from "../model/TunnelRoute";
    import TunnelStatus from "../model/TunnelStatus";

    /** @type {import('../model/TunnelRoute').default[]}*/
    let tunnelRoutes = [new TunnelRoute()];

    async function getTunnelStatus() {
        let response = await fetch("/api/status");
        if (!response.ok) {
            throw new Error(
                "getTunnelStatus(): request_failed: " + response.status
            );
        } else {
            return TunnelStatus.from(await response.json());
        }
    };
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
    {:catch error}
        <b>Failed to load</b>
    {/await}
</p>

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
