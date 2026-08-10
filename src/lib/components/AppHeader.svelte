<script>
    import tunnelStatus from "$lib/stores/tunnel-status";

    $: isTunnelStatusLoading = $tunnelStatus == null;
    $: tunnelStatusString = $tunnelStatus?.isUnreachable()
        ? "Unreachable"
        : $tunnelStatus?.isOk()
          ? "Running"
          : $tunnelStatus?.isRestarting()
            ? "Restarting"
            : $tunnelStatus?.status;
    $: isTunnelHealthy = $tunnelStatus?.isOk() == true;
    $: isTunnelRestarting = $tunnelStatus?.isRestarting() == true;
    $: isTunnelUnreachable = $tunnelStatus?.isUnreachable() == true;
    $: connectorVersion = $tunnelStatus?.version;
</script>

<div class="app-identity">
    <img class="logo" src="/logo.svg" alt="Cloudflare Tunnel" />
    <div class="app-details">
        <div class="app-meta">
            {#if !isTunnelStatusLoading}
                <span
                    class="status-badge"
                    class:status-ok={isTunnelHealthy}
                    class:status-warning={isTunnelRestarting}
                    class:status-error={isTunnelUnreachable}
                    aria-live="polite"
                >
                    <span class="status-dot"></span>
                    {tunnelStatusString}
                </span>
            {:else}
                <span class="status-badge status-loading" aria-live="polite">
                    <span class="status-dot"></span>
                    Loading status
                </span>
            {/if}

            {#if connectorVersion != null && connectorVersion !== "unknown"}
                <span class="version">v{connectorVersion}</span>
            {/if}
        </div>

        <h1>Cloudflare Tunnel</h1>
        <p>Secure access to your Umbrel apps</p>
    </div>
</div>

<style>
    .app-identity { display:flex; align-items:center; gap:18px; min-width:0; }
    .logo { width:70px; height:70px; flex:0 0 auto; border:0.5px solid rgba(255,255,255,.2); border-radius:19px; box-shadow:inset 0 1px 0 rgba(255,255,255,.24),0 12px 30px rgba(0,0,0,.22); }
    .app-details { min-width:0; }
    .app-meta { display:flex; align-items:center; gap:9px; min-height:22px; }
    h1 { margin:5px 0 4px; font-size:1.55rem; line-height:1.08; letter-spacing:-.045em; }
    p { margin:0; overflow:hidden; color:var(--secondary-text-color); font-size:.78rem; line-height:1.3; text-overflow:ellipsis; white-space:nowrap; }
    .status-badge { display:inline-flex; align-items:center; gap:6px; min-height:22px; padding:0 9px; border:0.5px solid currentColor; border-radius:999px; background:rgba(255,255,255,.045); color:var(--secondary-text-color); font-size:.68rem; font-weight:600; letter-spacing:-.01em; }
    .status-dot { width:6px; height:6px; border-radius:50%; background:currentColor; box-shadow:0 0 9px currentColor; }
    .status-ok { color:var(--success-color); }
    .status-warning { color:var(--warning-color); }
    .status-error { color:var(--danger-color); }
    .status-loading .status-dot { animation:pulse 1.4s ease-in-out infinite; }
    .version { color:var(--tertiary-text-color); font-size:.69rem; font-weight:500; }

    @keyframes pulse { 50% { opacity:.3; transform:scale(.75); } }

    @media (max-width: 30em) {
        .app-identity { gap:13px; }
        .logo { width:56px; height:56px; border-radius:15px; }
        h1 { margin-top:3px; font-size:1.22rem; }
        p { display:none; }
        .status-badge { min-height:20px; padding:0 7px; font-size:.63rem; }
    }
</style>
