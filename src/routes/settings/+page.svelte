<script>
    import TunnelSettings from "../../model/TunnelSettings";

    const tokenRegex = /[A-Za-z0-9+/]+={0,2}$/g;

    let tokenInput = "";
    let isSavingSettings = false;
    $: parsedToken = parseToken(tokenInput);
    $: isSaveEnabled = parsedToken != null && !isSavingSettings;

    async function onSaveClicked() {
        isSavingSettings = true;
        try {
            await saveTunnelSettings();
        } finally {
            isSavingSettings = false;
        }
    }

    /**
     * @param {string} input Base64 Cloudflare token or the whole cloudflared start command
     * @returns {string?} parsed Cloudflare token or null if the input is not valid
     */
    function parseToken(input) {
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

    /**
     * @returns {Promise<TunnelSettings>}
     */
    async function getTunnelSettings() {
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

    /**
     * @param {TunnelSettings} tunnelSettings
     */
    function onTunnelSettingsLoaded(tunnelSettings) {
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
        } else {
            let updatedSettings = TunnelSettings.from(await response.json());
            onTunnelSettingsLoaded(updatedSettings);
        }
    }
</script>

<svelte:head>
    <title>Settings | Cloudflare Tunnel client</title>
</svelte:head>

<h1>Settings</h1>
{#await loadTunnelSettings()}
    <p>Loading...</p>
{:then}
    <p><label for="tokenInput">Connector token</label></p>
    <textarea
        id="tokenInput"
        name="tokenInput"
        rows="4"
        cols="50"
        placeholder="Paste the token or the complete connection command"
        bind:value={tokenInput}
    />
    <br />
    <br />
    <button disabled={!isSaveEnabled} on:click={onSaveClicked}>
        Save & Restart
    </button>
{:catch}
    <b>Failed to load</b>
{/await}
