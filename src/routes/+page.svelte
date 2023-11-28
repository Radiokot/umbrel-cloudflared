<script>
    import AppHeader from "../components/AppHeader.svelte";
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
    $: isTunnelUnreachable = $tunnelStatus?.isUnreachable() == true;
    $: tunnelRoutes = $tunnelStatus?.routes;
</script>

<svelte:head>
    <title>Cloudflare Tunnel client</title>
</svelte:head>

<header class="row justify-content-between my-3">
    <span class="col-md-auto mb-3">
        <AppHeader />
    </span>
    <div class="col-md-auto my-md-4">
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
{:else if isTunnelUnreachable}
    <div class="row justify-content-center align-items-center">
        <div class="col-auto">
            <img class="d-none d-sm-block" src="/hero-image.svg" alt="Start" />
        </div>
        <div class="col-12 col-sm-6">
            <h3>Set up your tunnel</h3>
            <p>
                1. <a href="/settings">Configure the app</a> with the start command
                of your Cloudflare tunnel
            </p>
            <p>2. Create routes to access your Umbrel apps from the Internet</p>
            <br />
            <div class="d-block d-sm-flex">
                <!-- d-block d-sm-flex makes the button full width only on xs-->
                <a
                    class="button button-primary"
                    target="_blank"
                    href="https://github.com/Radiokot/umbrel-cloudflared/wiki/How-to-set-up-Cloudflare-Tunnel-on-your-Umbrel#add-routes-to-expose-apps"
                >
                    Learn more
                </a>
            </div>
        </div>
    </div>
{/if}

<style>
    :root {
        --card-background-color: #ffffff;
        --card-shadow-color: rgba(209, 213, 223, 0.5);
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
</style>
