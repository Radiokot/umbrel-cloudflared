<script lang="ts">
    import { PUBLIC_GUIDE_URL } from "$env/static/public";
    import TunnelSettings from "$lib/model/TunnelSettings";
    import { setTunnelStatusRestarting } from "$lib/stores/tunnel-status";

    const tokenRegex = /[A-Za-z0-9+/]+={0,2}$/g;

    let tokenInput = "";
    let isSavingSettings = false;
    $: parsedToken = parseToken(tokenInput);
    $: isSaveEnabled = parsedToken != null && !isSavingSettings;
    let saveResult: string | null = null;

    async function onSaveClicked() {
        isSavingSettings = true;
        saveResult = null;
        try {
            await saveTunnelSettings();
            try {
                if (setTunnelStatusRestarting) {
                    setTunnelStatusRestarting();
                }
            } catch {}
            saveResult = "The connector will restart in a moment.";
        } catch (err) {
            console.error("onSaveClicked(): save_failed:", err);

            saveResult =
                "Failed to save the settings. Check the dev console for errors.";
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

<header class="row justify-content-between align-items-center my-3">
    <h3 class="d-block col-auto">Settings</h3>
    <div class="col-auto my-md-4">
        <a class="button button-secondary" href="/">Back</a>
    </div>
</header>

{#await loadTunnelSettings()}
    <p>Loading…</p>
{:then}
    <div class="row">
        <p class="d-block col-12">
            <label for="tokenInput">Connector token</label>
            <span>&nbsp;</span>
            <a href={PUBLIC_GUIDE_URL} target="_blank">(?)</a>
        </p>

        <div class="col-12 col-sm-9 col-md-7">
            <textarea
                id="tokenInput"
                name="tokenInput"
                rows="5"
                placeholder="Paste the token or the complete connection command"
                bind:value={tokenInput}
            />
        </div>
    </div>
    <button
        class="button button-primary mt-3 col-12 col-sm-auto"
        disabled={!isSaveEnabled}
        on:click={onSaveClicked}
    >
        Save & Restart
    </button>
    {#if saveResult}
        <p>{saveResult} <a href="/">Go back</a></p>
    {/if}
{:catch}
    <b>Failed to load</b>
{/await}

<style>
    header h3 {
        font-size: 2rem;
        margin: 0px;
    }

    #tokenInput {
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        width: 100%;
    }

    @media (max-width: 30em) {
        header h3 {
            font-size: 1.5rem;
        }
    }
</style>
