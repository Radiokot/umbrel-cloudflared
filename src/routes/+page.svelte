<script lang="ts">
    import PageHeader from "$lib/components/PageHeader.svelte";
    import TunnelRoute from "$lib/components/TunnelRoute.svelte";
    import tunnelStatus from "$lib/stores/tunnel-status";
    import { PUBLIC_GUIDE_URL } from "$env/static/public";

    $: isTunnelHealthy = $tunnelStatus?.isOk() == true;
    $: isTunnelUnreachable = $tunnelStatus?.isUnreachable() == true;
    $: isTunnelRestarting = $tunnelStatus?.isRestarting() == true;
    $: isTunnelStatusLoading = $tunnelStatus == null;
    $: tunnelRoutes = $tunnelStatus?.routes;
</script>

<svelte:head>
    <title>Cloudflare Tunnel client</title>
</svelte:head>

<PageHeader actionHref="/settings" actionLabel="Settings" actionIcon="settings" />

{#if isTunnelStatusLoading}
    <section class="state-card loading-card" aria-live="polite">
        <span class="spinner"></span>
        <div><h2>Connecting to tunnel</h2><p>Loading connector status and routes…</p></div>
    </section>
{:else if tunnelRoutes != null && tunnelRoutes.length > 0}
    <section class="card">
        <div class="section-heading">
            <div><p class="eyebrow">TUNNEL ROUTES</p><h2>Public access</h2><p class="section-description">Domains currently exposed through Cloudflare</p></div>
            <span class="route-count" aria-label="{tunnelRoutes.length} routes">{tunnelRoutes.length}</span>
        </div>

        <div class="routes">
            {#each tunnelRoutes as tunnelRoute (tunnelRoute.id)}
                <TunnelRoute publicEndpoint={tunnelRoute.publicEndpoint} serviceUrl={tunnelRoute.serviceUrl} />
            {/each}
        </div>
    </section>
{:else if isTunnelHealthy && tunnelRoutes != null && tunnelRoutes.length == 0}
    <section class="state-card empty-card">
        <div class="state-icon success-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="m7 12 3 3 7-7"/></svg>
        </div>
        <div><p class="eyebrow">CONNECTED</p><h2>No active routes</h2><p>Your tunnel is online and ready for a public route.</p></div>
    </section>
{:else if isTunnelUnreachable}
    <section class="setup-card">
        <div class="setup-illustration">
            <img src="/hero-image.svg" alt="Cloudflare Tunnel setup" />
            <span class="illustration-glow"></span>
        </div>
        <div class="setup-copy">
            <p class="eyebrow">GET STARTED</p><h2>Set up your tunnel</h2><p class="setup-intro">Connect Cloudflare to securely reach your Umbrel apps from anywhere.</p>
            <ol>
                <li><span>1</span><p><a href="/settings">Add your connector token</a> from the Cloudflare dashboard.</p></li>
                <li><span>2</span><p>Create public hostnames for the apps you want to access.</p></li>
            </ol>
            <a class="button button-primary" target="_blank" rel="noreferrer" href={PUBLIC_GUIDE_URL}>Open setup guide <span aria-hidden="true">↗</span></a>
        </div>
    </section>
{:else if isTunnelRestarting}
    <section class="state-card" aria-live="polite">
        <span class="spinner"></span>
        <div><p class="eyebrow">APPLYING SETTINGS</p><h2>Connector restarting</h2><p>Your tunnel will be available again in a moment.</p></div>
    </section>
{:else}
    <section class="state-card">
        <div class="state-icon error-icon" aria-hidden="true">!</div>
        <div><p class="eyebrow">STATUS UNAVAILABLE</p><h2>Can’t read tunnel status</h2><p>Check the connector service and try again.</p></div>
    </section>
{/if}

<style>
    .card,.setup-card,.state-card { overflow:hidden; border:0.5px solid var(--border-color); border-radius:var(--card-radius); background:var(--surface-color); box-shadow:var(--glass-shadow); backdrop-filter:blur(28px) saturate(125%); }
    .card { padding:var(--panel-padding); }
    .section-heading { display:flex; align-items:center; justify-content:space-between; gap:24px; margin-bottom:13px; }
    .eyebrow { margin:0 0 7px; color:var(--secondary-text-color); font-size:.64rem; font-weight:650; letter-spacing:.1em; }
    h2 { margin:0; font-size:1.35rem; line-height:1.15; letter-spacing:-.04em; }
    .section-description { margin:7px 0 0; color:var(--secondary-text-color); font-size:.75rem; }
    .route-count { display:grid; min-width:30px; height:30px; place-items:center; border:0.5px solid var(--border-color); border-radius:50%; background:rgba(255,255,255,.06); color:var(--secondary-text-color); font-size:.74rem; font-weight:600; }
    .routes { display:grid; }
    .routes :global(.route-row + .route-row) { border-top:0.5px solid rgba(255,255,255,.07); }
    .setup-card { display:grid; min-height:360px; grid-template-columns:minmax(250px,.92fr) 1.08fr; }
    .setup-illustration { position:relative; display:grid; overflow:hidden; place-items:center; padding:38px; border-right:0.5px solid var(--border-color); background:radial-gradient(circle at 50% 45%,rgba(44,126,217,.22),transparent 55%),rgba(0,0,0,.13); }
    .setup-illustration::before { position:absolute; width:240px; height:240px; border:1px solid rgba(108,174,255,.1); border-radius:50%; content:""; box-shadow:0 0 0 38px rgba(85,147,235,.035),0 0 0 76px rgba(85,147,235,.018); }
    .setup-illustration img { position:relative; z-index:1; max-width:82%; max-height:210px; filter:drop-shadow(0 18px 30px rgba(0,0,0,.28)); }
    .illustration-glow { position:absolute; width:130px; height:70px; border-radius:50%; background:rgba(36,133,238,.26); filter:blur(35px); }
    .setup-copy { align-self:center; padding:42px; }
    .setup-intro { max-width:390px; margin:12px 0 23px; color:var(--secondary-text-color); font-size:.82rem; line-height:1.55; }
    ol { display:grid; gap:14px; margin:0; padding:0; list-style:none; }
    li { display:flex; align-items:flex-start; gap:11px; }
    li > span { display:grid; width:22px; height:22px; flex:0 0 auto; place-items:center; border-radius:50%; background:rgba(255,255,255,.08); color:var(--secondary-text-color); font-size:.68rem; font-weight:600; }
    li p { margin:2px 0 0; color:var(--secondary-text-color); font-size:.78rem; line-height:1.45; }
    .setup-copy .button { gap:7px; margin-top:26px; }
    .state-card { display:flex; min-height:180px; align-items:center; justify-content:center; gap:18px; padding:36px; text-align:left; }
    .state-card > div:last-child { max-width:420px; }
    .state-card p:not(.eyebrow) { margin:8px 0 0; color:var(--secondary-text-color); font-size:.8rem; line-height:1.45; }
    .state-icon { display:grid; width:46px; height:46px; flex:0 0 auto; place-items:center; border:0.5px solid currentColor; border-radius:14px; background:rgba(255,255,255,.05); }
    .state-icon svg { width:24px; height:24px; fill:none; stroke:currentColor; stroke-linecap:round; stroke-linejoin:round; stroke-width:2; }
    .success-icon { color:var(--success-color); }
    .error-icon { color:var(--danger-color); font-weight:700; }
    .spinner { width:28px; height:28px; flex:0 0 auto; border:2px solid rgba(255,255,255,.14); border-top-color:rgba(255,255,255,.82); border-radius:50%; animation:spin .8s linear infinite; }
    @keyframes spin { to { transform:rotate(360deg); } }

    @media (max-width:700px) {
        .setup-card { min-height:auto; grid-template-columns:1fr; }
        .setup-illustration { min-height:190px; padding:24px; border-right:0; border-bottom:0.5px solid var(--border-color); }
        .setup-illustration img { max-height:145px; }
        .setup-copy { padding:30px 25px 32px; }
    }

    @media (max-width:480px) {
        .section-heading { align-items:flex-start; }
        .section-description { max-width:230px; }
        .state-card { min-height:210px; flex-direction:column; padding:30px 24px; text-align:center; }
    }
</style>
