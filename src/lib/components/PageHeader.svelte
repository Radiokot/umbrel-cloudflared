<script lang="ts">
    import AppHeader from "$lib/components/AppHeader.svelte";

    export let actionHref: string;
    export let actionLabel: string;
    export let actionIcon: "settings" | "back";
</script>

<header class="page-header">
    <div class="identity">
        <AppHeader />
    </div>
    <a class="button button-secondary page-action" href={actionHref} aria-label={actionLabel}>
        {#if actionIcon === "settings"}
            <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="M12 15.25a3.25 3.25 0 1 0 0-6.5 3.25 3.25 0 0 0 0 6.5Z" />
                <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V21h-4v-.09A1.7 1.7 0 0 0 8.97 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.56-1.03H3v-4h.09A1.7 1.7 0 0 0 4.6 8.94a1.7 1.7 0 0 0-.34-1.88L4.2 7l2.83-2.83.06.06a1.7 1.7 0 0 0 1.88.34A1.7 1.7 0 0 0 10 3.01V3h4v.09a1.7 1.7 0 0 0 1.03 1.51 1.7 1.7 0 0 0 1.88-.34l.06-.06L19.8 7l-.06.06a1.7 1.7 0 0 0-.34 1.88A1.7 1.7 0 0 0 20.96 10H21v4h-.09A1.7 1.7 0 0 0 19.4 15Z" />
            </svg>
        {:else}
            <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="m15 18-6-6 6-6" />
            </svg>
        {/if}
        <span>{actionLabel}</span>
    </a>
</header>

<style>
    .page-header { display:flex; align-items:center; justify-content:space-between; gap:24px; margin-bottom:42px; }
    .identity { min-width:0; }
    .page-action { flex:0 0 auto; gap:7px; }
    .page-action svg { width:15px; height:15px; fill:none; stroke:currentColor; stroke-linecap:round; stroke-linejoin:round; stroke-width:1.6; }

    @media (max-width:700px) {
        .page-header { align-items:flex-start; margin-bottom:30px; }
    }

    @media (max-width:480px) {
        .page-action { width:38px; min-width:38px; height:38px; min-height:38px; padding:0; }
        .page-action span { display:none; }
        .page-action svg { width:16px; height:16px; }
    }
</style>
