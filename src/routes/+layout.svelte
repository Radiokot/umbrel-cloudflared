<script>
    import "$lib/vendor/bootstrap/bootstrap-grid.min.css";
</script>

<div id="content" class="mx-auto px-2 pt-2 pt-md-4 pb-4">
    <slot />
    <br />
    <br />
    <br />
    <center>
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
    </center>
</div>

<style>
    :root {
        --background-color: #f7f9fb;
        --text-color: #141821;
        --link-color: #0055dc;
        --secondary-text-color: #6b7280;
        --primary-button-color: #003882;
        --primary-button-hover-color: #0055dc;

        background-color: var(--background-color);
        color: var(--text-color);
        font-family:
            -apple-system,
            BlinkMacSystemFont,
            Inter,
            Helvetica Neue,
            Segoe UI,
            Arial,
            Noto Sans,
            sans-serif,
            Apple Color Emoji,
            Segoe UI Emoji,
            Segoe UI Symbol,
            Noto Color Emoji;
    }

    :global(a) {
        text-decoration: none;
        color: var(--link-color);
    }

    #content {
        max-width: 1024px;
    }

    :global(.button) {
        display: block;
        background: none;
        border: 1px solid;
        border-radius: 4px;
        padding-left: 2.25em;
        padding-right: 2.25em;
        text-align: center;
        font-size: 12pt;
        line-height: 24pt;
        transition: 150ms cubic-bezier(0.215, 0.61, 0.355, 1);
    }

    :global(.button-secondary) {
        color: var(--secondary-text-color);
        border-color: var(--secondary-text-color) !important;
    }

    :global(.button-secondary:hover) {
        background: var(--secondary-text-color);
        color: #ffffff;
    }

    :global(.button-primary) {
        color: #ffffff;
        border-color: var(--primary-button-color) !important;
        background: var(--primary-button-color);
    }

    :global(.button-primary:hover) {
        border-color: var(--primary-button-hover-color) !important;
        background: var(--primary-button-hover-color);
    }

    :global(.button:disabled, .button-secondary:disabled) {
        opacity: 0.4;
        background: none;
    }

    :global(.button-primary:disabled) {
        border-color: var(--primary-button-color) !important;
        background: var(--primary-button-color);
    }

    @media (prefers-color-scheme: dark) {
        :root {
            --background-color: #262626;
            --text-color: #fcfcfc;
            --link-color: #337ef6;
            --secondary-text-color: #878d9b;
            --primary-button-color: #264773;
        }
    }
</style>
