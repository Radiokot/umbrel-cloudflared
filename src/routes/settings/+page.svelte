<script lang="ts">
    import PageHeader from "$lib/components/PageHeader.svelte";
    import { PUBLIC_GUIDE_URL } from "$env/static/public";
    import TunnelSettings from "$lib/model/TunnelSettings";
    import { setTunnelStatusRestarting } from "$lib/stores/tunnel-status";

    const tokenRegex = /[A-Za-z0-9+/]+={0,2}$/g;

    let tokenInput = "";
    let isSavingSettings = false;
    $: parsedToken = parseToken(tokenInput);
    $: isSaveEnabled = parsedToken != null && !isSavingSettings;
    let saveResult: string | null = null;
    let saveResultKind: "success" | "error" | null = null;

    async function onSaveClicked() {
        isSavingSettings = true;
        saveResult = null;
        saveResultKind = null;
        try {
            await saveTunnelSettings();
            try {
                if (setTunnelStatusRestarting) {
                    setTunnelStatusRestarting();
                }
            } catch {
                // Saving succeeded even if the local status indicator cannot update.
            }
            saveResult = "The connector will restart in a moment.";
            saveResultKind = "success";
        } catch (err) {
            console.error("onSaveClicked(): save_failed:", err);

            saveResult =
                "Failed to save the settings. Check the dev console for errors.";
            saveResultKind = "error";
        } finally {
            isSavingSettings = false;
        }
    }

    /**
     * @param input Base64 Cloudflare token or the whole cloudflared start command
     * @returns parsed Cloudflare token or null if the input is not valid
     */
    function parseToken(input: string): string | null {
        let matchedValue = input.match(tokenRegex)?.[0];
        if (!matchedValue) {
            return null;
        }

        let decodedValue = null;
        let decodedObject = null;
        try {
            decodedValue = atob(matchedValue);
            decodedObject = JSON.parse(decodedValue);
        } catch (err) {
            return null;
        }

        if (
            decodedObject &&
            "a" in decodedObject &&
            "s" in decodedObject &&
            "t" in decodedObject
        ) {
            return matchedValue;
        } else {
            return null;
        }
    }

    async function getTunnelSettings(): Promise<TunnelSettings> {
        let response = await fetch("/api/settings");
        if (!response.ok) {
            console.error("getTunnelSettings(): request_failed:", {
                status: response.status,
            });

            throw new Error("Tunnel settings loading failed");
        } else {
            return TunnelSettings.from(await response.json());
        }
    }

    async function loadTunnelSettings() {
        let tunnelSettings = await getTunnelSettings();
        onTunnelSettingsLoaded(tunnelSettings);
    }

    function onTunnelSettingsLoaded(tunnelSettings: TunnelSettings) {
        if (tunnelSettings.token != null) {
            tokenInput = tunnelSettings.token;
        }
    }

    async function saveTunnelSettings() {
        let tunnelSettings = new TunnelSettings(parsedToken);
        let response = await fetch("/api/settings", {
            method: "POST",
            body: JSON.stringify(tunnelSettings),
            headers: {
                "content-type": "application/json",
            },
        });
        if (!response.ok) {
            console.error("saveTunnelSettings(): request_failed:", {
                status: response.status,
                test: response.text,
            });

            throw new Error("Tunnel settings saving failed");
        } else {
            let updatedSettings = TunnelSettings.from(await response.json());
            onTunnelSettingsLoaded(updatedSettings);
        }
    }
</script>

<svelte:head>
    <title>Settings | Cloudflare Tunnel client</title>
</svelte:head>

<PageHeader actionHref="/" actionLabel="Back" actionIcon="back" />

{#await loadTunnelSettings()}
    <section class="settings-card loading" aria-live="polite">
        <span class="spinner"></span>
        <div><h2>Loading settings</h2><p>Reading your connector configuration…</p></div>
    </section>
{:then}
    <section class="settings-card">
        <div class="card-heading">
            <div><p class="eyebrow">CONNECTION</p><h2>Tunnel settings</h2><p>Update the token used by the Cloudflare connector.</p></div>
            <a class="button button-secondary guide" href={PUBLIC_GUIDE_URL} target="_blank" rel="noreferrer">Setup guide <span aria-hidden="true">↗</span></a>
        </div>
        <div class="divider"></div>
        <div class="field-heading">
            <div><label for="tokenInput">Connector token</label><p>Paste a Cloudflare Tunnel token or the complete connection command.</p></div>
            <span
                class="field-state"
                class:field-valid={parsedToken != null}
                class:field-invalid={tokenInput.trim().length > 0 && parsedToken == null}
            >{parsedToken != null ? "Valid token" : tokenInput.trim().length > 0 ? "Invalid token" : "Required"}</span>
        </div>
        <div class="textarea-shell">
            <textarea
                id="tokenInput"
                name="tokenInput"
                rows="5"
                placeholder="Paste the token or the complete connection command"
                aria-describedby="tokenHelp"
                aria-invalid={tokenInput.trim().length > 0 && parsedToken == null}
                autocomplete="off"
                autocapitalize="none"
                spellcheck="false"
                bind:value={tokenInput}
            />
        </div>
        <p id="tokenHelp" class="privacy-note">
            <svg aria-hidden="true" viewBox="0 0 24 24"><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>
            Stored only on your Umbrel and sent directly to the local connector.
        </p>
        <div class="actions">
        <button
            class="button button-primary save-button"
            disabled={!isSaveEnabled}
            on:click={onSaveClicked}
        >
            {#if isSavingSettings}<span class="button-spinner"></span> Saving…{:else}Save & Restart{/if}
        </button>
        {#if saveResult}
            <p class="save-result" class:result-error={saveResultKind === "error"} aria-live="polite">
                <span aria-hidden="true">{saveResultKind === "success" ? "✓" : "!"}</span>
                {saveResult} {#if saveResultKind === "success"}<a href="/">Go back</a>{/if}
            </p>
        {/if}
        </div>
    </section>
{:catch}
    <section class="settings-card error-state">
        <span class="error-icon" aria-hidden="true">!</span>
        <div><h2>Settings unavailable</h2><p>Couldn’t load the connector configuration. Please refresh and try again.</p></div>
    </section>
{/await}

<style>
    .settings-card { width:100%; padding:var(--panel-padding); overflow:hidden; border:0.5px solid var(--border-color); border-radius:var(--card-radius); background:var(--surface-color); box-shadow:var(--glass-shadow); backdrop-filter:blur(28px) saturate(125%); }
    .card-heading { display:flex; justify-content:space-between; align-items:flex-start; gap:24px; }
    .eyebrow { margin:0 0 7px; color:var(--secondary-text-color); font-size:.64rem; font-weight:650; letter-spacing:.1em; }
    h2 { margin:0; font-size:1.35rem; line-height:1.15; letter-spacing:-.04em; }
    .card-heading p:not(.eyebrow),.loading p,.error-state p { margin:8px 0 0; color:var(--secondary-text-color); font-size:.78rem; line-height:1.45; }
    .guide { flex:0 0 auto; gap:7px; }
    .divider { height:0.5px; margin:24px var(--panel-padding-negative); background:rgba(255,255,255,.08); }
    .field-heading { display:flex; justify-content:space-between; align-items:flex-start; gap:20px; margin-bottom:14px; }
    label { display:block; font-size:.86rem; font-weight:600; letter-spacing:-.02em; }
    .field-heading p { margin:6px 0 0; color:var(--secondary-text-color); font-size:.73rem; line-height:1.45; }
    .field-state { flex:0 0 auto; padding:5px 8px; border-radius:999px; background:rgba(255,255,255,.055); color:var(--secondary-text-color); font-size:.64rem; font-weight:600; }
    .field-valid { background:rgba(81,203,65,.1); color:var(--success-color); }
    .field-invalid { background:rgba(255,98,98,.1); color:var(--danger-color); }
    .textarea-shell { padding:1px; border-radius:13px; background:linear-gradient(145deg,rgba(255,255,255,.14),rgba(255,255,255,.045)); }

    #tokenInput {
        display:block;
        width: 100%;
        min-height:142px;
        padding:15px 16px;
        resize:vertical;
        border:0;
        border-radius:12px;
        outline:0;
        background:rgba(2,5,10,.48);
        color:var(--text-color);
        font-family:"SFMono-Regular",Consolas,"Liberation Mono",monospace;
        font-size:.78rem;
        line-height:1.55;
        transition:background-color 180ms ease,box-shadow 180ms ease;
    }
    #tokenInput::placeholder { color:var(--tertiary-text-color); }
    #tokenInput:focus { background:rgba(2,5,10,.66); box-shadow:0 0 0 1px rgba(126,165,255,.55); }
    .privacy-note { display:flex; align-items:center; gap:7px; margin:10px 2px 0; color:var(--tertiary-text-color); font-size:.66rem; line-height:1.4; }
    .privacy-note svg { width:13px; height:13px; flex:0 0 auto; fill:none; stroke:currentColor; stroke-linecap:round; stroke-linejoin:round; stroke-width:1.7; }
    .actions { display:flex; align-items:center; gap:16px; margin-top:24px; }
    .save-button { min-width:128px; }
    .button-spinner,.spinner { border:2px solid rgba(255,255,255,.2); border-top-color:#fff; border-radius:50%; animation:spin .8s linear infinite; }
    .button-spinner { width:13px; height:13px; }
    .spinner { width:28px; height:28px; flex:0 0 auto; }
    .save-result { display:flex; align-items:center; gap:7px; margin:0; color:var(--success-color); font-size:.72rem; line-height:1.4; }
    .save-result > span { display:grid; width:18px; height:18px; flex:0 0 auto; place-items:center; border-radius:50%; background:rgba(81,203,65,.1); font-size:.65rem; font-weight:700; }
    .result-error { color:var(--danger-color); }
    .result-error > span { background:rgba(255,98,98,.1); }
    .loading,.error-state { display:flex; min-height:180px; align-items:center; justify-content:center; gap:18px; }
    .error-icon { display:grid; width:44px; height:44px; flex:0 0 auto; place-items:center; border:0.5px solid var(--danger-color); border-radius:14px; background:rgba(255,98,98,.08); color:var(--danger-color); font-weight:700; }
    @keyframes spin { to { transform:rotate(360deg); } }

    @media (max-width: 30em) {
        .card-heading { display:block; }
        .guide { margin-top:17px; }
        .divider { margin-top:22px; margin-bottom:22px; }
        .field-heading { gap:12px; }
        .field-heading p { max-width:240px; }
        .actions { align-items:stretch; flex-direction:column; }
        .save-button { width:100%; }
        .save-result { align-items:flex-start; }
        .loading,.error-state { min-height:210px; flex-direction:column; text-align:center; }
    }
</style>
