<script>
    /**
     * @type {string}
     */
    export let publicEndpoint;

    /**
     * @type {string}
     */
    export let serviceUrl;

    $: tunnelHref = `https://${publicEndpoint}`;
</script>

<article class="route-row">
    <div class="route-icon" aria-hidden="true">
        <img class="image" src="/route-image.svg" alt="" />
    </div>
    <div class="route-addresses">
        <a class="endpoint line-clamp" href={tunnelHref} target="_blank" rel="noreferrer">
            {publicEndpoint}
        </a>
        <span class="service-url line-clamp">
            {serviceUrl}
        </span>
    </div>
    <a class="open-icon" href={tunnelHref} target="_blank" rel="noreferrer" aria-label={`Open ${publicEndpoint}`}>
        ↗
    </a>
</article>

<style>
    .route-row { display:flex; align-items:center; gap:14px; min-width:0; padding:15px 4px; }
    .route-icon { display:grid; width:42px; height:42px; flex:0 0 auto; place-items:center; overflow:hidden; border:0.5px solid var(--border-color); border-radius:11px; background:rgba(255,255,255,.075); box-shadow:inset 0 1px 0 rgba(255,255,255,.08); }
    .image { width:auto; height:31px; object-fit:contain; }
    .route-addresses { display:flex; min-width:0; flex:1; flex-direction:column; gap:5px; }
    .endpoint { color:var(--text-color); font-size:.88rem; font-weight:600; letter-spacing:-.02em; }
    .endpoint:hover { color:#fff; }
    .service-url { color:var(--secondary-text-color); font-size:.73rem; letter-spacing:-.01em; }
    .open-icon { display:grid; width:27px; height:27px; flex:0 0 auto; place-items:center; border-radius:50%; background:rgba(255,255,255,.06); color:var(--secondary-text-color); font-size:.8rem; transition:background-color 180ms ease,color 180ms ease; text-decoration:none; }
    .open-icon:focus-visible { outline:2px solid rgba(106,170,255,.72); outline-offset:2px; }
    .route-row:hover .open-icon { background:rgba(255,255,255,.11); color:var(--text-color); }

    .line-clamp {
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
    }

    @media (max-width:480px) {
        .route-row { gap:11px; }
        .route-icon { width:38px; height:38px; border-radius:10px; }
        .image { height:28px; }
        .open-icon { display:none; }
    }
</style>
