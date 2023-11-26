<script>
    import TunnelRoute from "../components/TunnelRoute.svelte";
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

<header class="row justify-content-between align-items-center my-3">
    <div class="d-flex col-md-auto mb-3">
        <img class="logo me-3" src="/logo.svg" alt="Logo" />
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
    </div>
    <div class="col-md-auto">
        <a class="button button-secondary" href="/settings">Settings</a>
    </div>
</header>

{#if isTunnelHealthy && tunnelRoutes != null && tunnelRoutes.length == 0}
    <center><p>No active routes</p></center>
{:else if tunnelRoutes != null && tunnelRoutes.length > 0}
    <div class="card p-3 p-md-4">
        <p class="label">Routes</p>

        <div class="row">
            {#each tunnelRoutes as tunnelRoute (tunnelRoute.id)}
                <span class="col mt-3 mt-md-4">
                    <TunnelRoute
                        publicEndpoint={tunnelRoute.publicEndpoint}
                        serviceUrl={tunnelRoute.serviceUrl}
                    />
                </span>
            {/each}
        </div>
    </div>
{/if}

<style>
    :root {
        --status-ok-color: #00cd98;
        --status-warning-color: #f6b900;
        --card-background-color: #ffffff;
        --card-shadow-color: rgba(209, 213, 223, 0.5);
    }

    header .logo {
        width: 120px;
        height: 120px;
        border-radius: 22%;
        border: 1px solid #e1e6ea;
    }

    header h3 {
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
    }

    .card .label {
        color: var(--secondary-text-color);
        margin-top: 0.5em;
        margin-bottom: 0.5em;
    }

    @media (prefers-color-scheme: dark) {
        :root {
            --card-shadow-color: rgba(16, 16, 17, 0.5);
            --card-background-color: #2e2e2e;
        }
    }

    @media (max-width: 30em) {
        header .logo {
            width: 80px;
            height: 80px;
        }

        header h3 {
            font-size: 1.5rem;
        }
    }
</style>
