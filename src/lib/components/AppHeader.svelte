<script>
    import tunnelStatus from "$lib/stores/tunnel-status";

    $: isTunnelStatusLoading = $tunnelStatus == null;
    $: tunnelStatusString = $tunnelStatus?.isUnreachable()
        ? "Unreacahable"
        : $tunnelStatus?.isOk()
          ? "Running"
          : $tunnelStatus?.isRestarting()
            ? "Restarting"
            : $tunnelStatus?.status;
    $: isTunnelHealthy = $tunnelStatus?.isOk() == true;
    $: connecorVersion = $tunnelStatus?.version;
</script>

<div class="d-flex">
    <img class="logo me-3" src="/logo.svg" alt="Logo" />
    <div>
        <span>
            {#if !isTunnelStatusLoading}
                <svg
                    width="8"
                    height="8"
                    viewBox="0 0 8 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <circle
                        class:status-ok={isTunnelHealthy}
                        class:status-warning={!isTunnelHealthy}
                        cx="4"
                        cy="4"
                        r="4"
                        fill="#000000"
                    />
                </svg>
                <small
                    class:status-ok={isTunnelHealthy}
                    class:status-warning={!isTunnelHealthy}
                >
                    {tunnelStatusString}
                </small>
            {:else}
                <small class="secondary-text">&nbsp;Loading status…</small>
            {/if}
        </span>

        <h3>Cloudflare Tunnel</h3>

        <span class="secondary-text">
            {#if isTunnelHealthy && connecorVersion != null}
                {connecorVersion}
            {:else}
                &nbsp;…
            {/if}
        </span>
    </div>
</div>

<style>
    :root {
        --status-ok-color: #00cd98;
        --status-warning-color: #f6b900;
    }

    .logo {
        width: 120px;
        height: 120px;
        border-radius: 22%;
        border: 1px solid #e1e6ea;
    }

    h3 {
        font-size: 2rem;
        margin-top: 0;
        margin-bottom: 0.375rem;
    }

    .secondary-text {
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

    @media (max-width: 30em) {
        .logo {
            width: 80px;
            height: 80px;
        }

        h3 {
            font-size: 1.5rem;
        }
    }
</style>
