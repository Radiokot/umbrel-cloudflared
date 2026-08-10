<div id="content">
    <main>
        <slot />
    </main>
    <footer>
        <small>
            <img
                src="/umbrel-logo.svg"
                alt="Umbrel"
                style="width: 1.25em; display: inline-block;  vertical-align: baseline;"
            />
            Cloudflare Tunnel app by
            <a
                href="https://github.com/Radiokot/umbrel-cloudflared"
                target="_blank"
            >
                Radiokot
            </a>
        </small>
    </footer>
</div>

<style>
    :global(:root) {
        color-scheme: dark;
        --background-color: #07080d;
        --surface-color: rgba(255, 255, 255, 0.065);
        --surface-hover-color: rgba(255, 255, 255, 0.1);
        --surface-muted-color: rgba(255, 255, 255, 0.045);
        --border-color: rgba(255, 255, 255, 0.1);
        --border-strong-color: rgba(255, 255, 255, 0.18);
        --text-color: rgba(255, 255, 255, 0.94);
        --secondary-text-color: rgba(255, 255, 255, 0.48);
        --tertiary-text-color: rgba(255, 255, 255, 0.3);
        --link-color: #8eb6ff;
        --brand-color: #4f7df3;
        --brand-hover-color: #638df7;
        --success-color: #51cb41;
        --warning-color: #f5b942;
        --danger-color: #ff6262;
        --card-radius: 18px;
        --panel-padding: 28px;
        --panel-padding-negative: -28px;
        --control-radius: 999px;
        --glass-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 22px 55px rgba(0, 0, 0, 0.22);
        font-family: Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        font-synthesis: none;
        text-rendering: geometricPrecision;
    }

    :global(*) { box-sizing: border-box; }

    :global(html) {
        min-width: 320px;
        min-height: 100%;
        background: var(--background-color);
    }

    :global(body) {
        min-width: 320px;
        min-height: 100vh;
        margin: 0;
        overflow-x: hidden;
        background:
            radial-gradient(circle at 12% 8%, rgba(35, 98, 179, 0.48), transparent 31rem),
            radial-gradient(circle at 88% 2%, rgba(37, 118, 159, 0.25), transparent 29rem),
            radial-gradient(circle at 54% 110%, rgba(52, 38, 120, 0.34), transparent 36rem),
            linear-gradient(145deg, #0a1220 0%, #080a11 44%, #06070b 100%);
        background-attachment: fixed;
        color: var(--text-color);
        -webkit-font-smoothing: antialiased;
    }

    :global(body::before) {
        position: fixed;
        inset: 0;
        z-index: -1;
        background-image: radial-gradient(rgba(255, 255, 255, 0.08) 0.5px, transparent 0.5px);
        background-size: 6px 6px;
        content: "";
        opacity: 0.09;
        pointer-events: none;
    }

    :global(a) {
        text-decoration: none;
        color: var(--link-color);
        transition: color 180ms ease, opacity 180ms ease;
    }

    :global(a:hover) { color: #b2ccff; }

    :global(button, textarea) { font: inherit; }

    #content {
        display: flex;
        flex-direction: column;
        width: min(100%, 1080px);
        min-height: 100vh;
        margin: 0 auto;
        padding: 42px 28px 28px;
    }

    main { flex: 1; }

    :global(.button) {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        min-height: 36px;
        border: 0.5px solid;
        border-radius: var(--control-radius);
        padding: 0 16px;
        text-align: center;
        font-size: 0.82rem;
        font-weight: 600;
        letter-spacing: -0.015em;
        line-height: 1;
        cursor: pointer;
        transition: transform 160ms ease, background-color 200ms ease, border-color 200ms ease, box-shadow 200ms ease, opacity 200ms ease;
    }

    :global(.button-secondary) {
        color: var(--text-color);
        border-color: var(--border-strong-color) !important;
        background: rgba(255, 255, 255, 0.08);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
        backdrop-filter: blur(18px);
    }

    :global(.button-secondary:hover) {
        border-color: rgba(255, 255, 255, 0.25) !important;
        background: rgba(255, 255, 255, 0.13);
    }

    :global(.button-primary) {
        color: #ffffff;
        border-color: rgba(255, 255, 255, 0.16) !important;
        background: linear-gradient(180deg, var(--brand-hover-color), var(--brand-color));
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.28), 0 7px 22px rgba(42, 92, 219, 0.24);
    }

    :global(.button-primary:hover) {
        background: linear-gradient(180deg, #779df9, var(--brand-hover-color));
    }

    :global(.button:hover:not(:disabled)) {
        transform: translateY(-1px);
    }

    :global(.button:active:not(:disabled)) { transform: scale(0.97); }

    :global(.button:focus-visible),
    :global(a:focus-visible),
    :global(textarea:focus-visible) {
        outline: 3px solid rgba(112, 154, 255, 0.42);
        outline-offset: 2px;
    }

    :global(.button:disabled, .button-secondary:disabled) {
        cursor: not-allowed;
        opacity: 0.38;
    }

    :global(.button-primary:disabled) {
        background: var(--brand-color);
        box-shadow: none;
    }

    footer {
        margin-top: 72px;
        padding-top: 20px;
        text-align: center;
        color: var(--secondary-text-color);
    }

    @media (max-width: 600px) {
        #content { padding: 24px 16px 22px; }
        footer { margin-top: 44px; }
    }

    @media (max-width: 700px) {
        :global(:root) {
            --panel-padding: 20px;
            --panel-padding-negative: -20px;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        :global(*) { scroll-behavior: auto !important; transition-duration: 0.01ms !important; }
    }
</style>
