<script>
    import tunnelStatus from "../stores/tunnel-status";

    $: tunnelStatusString = $tunnelStatus
        ? $tunnelStatus.isUnreachable()
            ? "Unreacahable"
            : $tunnelStatus.isOk()
              ? "Running"
              : $tunnelStatus.status
        : "Loading…";
    $: isTunnelHealthy = $tunnelStatus?.isOk() == true;
    $: tunnelRoutes = $tunnelStatus?.routes;
</script>

<svelte:head>
    <title>Cloudflare Tunnel client</title>
</svelte:head>

<div class="header-row">
    <img class="logo" width="120" height="120" src="/logo.svg" alt="Logo" />
    <div>
        <span>
            <svg
                width="8"
                height="8"
                viewBox="0 0 8 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle
                    class={isTunnelHealthy ? "status-ok" : "status-warning"}
                    cx="4"
                    cy="4"
                    r="4"
                    fill="#000000"
                />
            </svg>
            <small class={isTunnelHealthy ? "status-ok" : "status-warning"}
                >{tunnelStatusString}</small
            >
        </span>
        <h3>Cloudflare Tunnel</h3>
        <span id="connector-version">2023.10.0</span>
    </div>
    <div style="margin-left: auto;">
        <a href="/settings">Settings</a>
    </div>
</div>

<br />
<br />

{#if isTunnelHealthy && tunnelRoutes != null && tunnelRoutes.length == 0}
    <center><p>No active routes</p></center>
{:else if tunnelRoutes != null && tunnelRoutes.length > 0}
    <div class="card">
        <p class="label">Routes</p>

        {#each tunnelRoutes as tunnelRoute (tunnelRoute.id)}
            <div class="route-row">
                <img class="route-image" src="/route-image.svg" alt="Route" />
                <div>
                    <p class="route-endpoint">
                        <b>
                            <a
                                href="https://{tunnelRoute.publicEndpoint}"
                                target="_blank"
                            >
                                {tunnelRoute.publicEndpoint}
                            </a>
                        </b>
                    </p>
                    <small>{tunnelRoute.serviceUrl}</small>
                </div>
            </div>
        {/each}
    </div>
{/if}

<style>
    :root {
        --status-ok-color: #00cd98;
        --status-warning-color: #f6b900;
        --card-background-color: #ffffff;
        --card-shadow-color: rgba(209, 213, 223, 0.5);
        --secondary-text-color: #6b7280;
    }

    .header-row {
        display: flex;
        flex-direction: row;
    }

    .logo {
        border-radius: 22%;
        border: 1px solid #e1e6ea;
        margin-right: 1.5rem !important;
    }

    .header-row h3 {
        font-size: 2rem;
        margin-top: 0;
        margin-bottom: 0.375rem;
    }

    #connector-version {
        color: var(--secondary-text-color);
    }

    .status-ok {
        color: var(--status-ok-color);
        fill: var(--status-ok-color);
    }

    .status-warning {
        color: var(--status-warning-color);
        fill: var(--status-warning-color);
    }

    .card {
        position: relative;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        -ms-flex-direction: column;
        flex-direction: column;
        min-width: 0;
        word-wrap: break-word;
        background-color: var(--card-background-color);
        -webkit-box-shadow: 0 10px 30px var(--card-shadow-color);
        box-shadow: 0 10px 30px var(--card-shadow-color);
        border-radius: 1rem;
        padding-left: 2.25rem;
        padding-right: 2.25rem;
        padding-top: 1.25rem;
        padding-bottom: 2.25rem;
    }

    .card .label {
        color: var(--secondary-text-color);
    }

    .route-row {
        display: flex;
        flex-direction: row;
        margin-top: 1.25em;
    }

    .route-row .route-image {
        height: 5.25em;
        margin-right: 1.25em;
    }

    .route-row .route-endpoint {
        margin-top: 0.5em;
        margin-bottom: 1.5em;
    }

    .route-row .route-endpoint a {
        text-decoration: none;
    }

    @media (prefers-color-scheme: dark) {
        :root {
            --card-shadow-color: rgba(16, 16, 17, 0.5);
            --card-background-color: #2e2e2e;
            --secondary-text-color: #878d9b;
        }
    }
</style>
