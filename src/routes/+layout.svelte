<div class="content-container">
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
        padding-left: 1rem;
        padding-right: 1rem;
    }

    :global(a) {
        text-decoration: none;
        color: var(--link-color);
    }

    .content-container {
        width: 100%;
        max-width: 1024px;
        margin: auto;
        padding-top: 3.25rem;
    }

    @media (prefers-color-scheme: dark) {
        :root {
            --background-color: #262626;
            --text-color: #fcfcfc;
            --link-color: #337ef6;
        }
    }
</style>
