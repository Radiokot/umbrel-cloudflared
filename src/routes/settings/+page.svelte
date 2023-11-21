<script>
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
</script>

<svelte:head>
    <title>Settings | Cloudflare Tunnel client</title>
</svelte:head>

<h1>Settings</h1>
<label for="tokenInput">Tunnel token or connection string</label>
<input id="tokenInput" bind:value={tokenInput} />
<br />
<button disabled={!isSaveEnabled} on:click={onSaveClicked}>Save & Restart</button>
