<script>
    import "$lib/bootstrap-grid.min.css";
</script>

<div id="content" class="mx-auto px-2 pt-2 pt-md-4 pb-4">
    <slot />
</div>

<style>
    :root {
        --background-color: #f7f9fb;
        --text-color: #141821;
        --link-color: #0055dc;

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

    @media (prefers-color-scheme: dark) {
        :root {
            --background-color: #262626;
            --text-color: #fcfcfc;
            --link-color: #337ef6;
        }
    }
</style>
