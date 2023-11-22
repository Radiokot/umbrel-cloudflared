<script>
    import { onMount } from "svelte";

    import TunnelSettings from "../../model/TunnelSettings";

    const tokenRegex = /[A-Za-z0-9+/]+={0,2}$/g;

    let tokenInput = "";
    $: parsedToken = parseToken(tokenInput);
    $: isSaveEnabled = parsedToken != null;

    function onSaveClicked() {
        // TODO
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
        if (tunnelSettings.token != null) {
            tokenInput = tunnelSettings.token;
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
    <label for="tokenInput">Connector token</label>
    <input id="tokenInput" bind:value={tokenInput} />
    <br />
    <button disabled={!isSaveEnabled} on:click={onSaveClicked}>
        Save & Restart
    </button>
{:catch}
    <b>Failed to load</b>
{/await}
