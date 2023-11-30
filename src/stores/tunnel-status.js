import { readable } from "svelte/store";
import { browser } from '$app/environment';

import TunnelStatus from "../model/TunnelStatus";

/**
 * Auto-updating tunnel status store.
 * 
 * @type {import("svelte/store").Readable<TunnelStatus?>}
 */
export default readable(null, (set) => {
    const updateValue = async () => {
        let response = await fetch("/api/status");
        if (!response.ok) {
            console.error(
                "tunnel-status.updateValue(): request_failed: " + response.status,
            );
        } else {
            set(TunnelStatus.from(await response.json()));
        }
    }

    // Do the initial value update only if running in a browser.
    if (browser) {
        updateValue()
    }

    /**
     * @type {NodeJS.Timeout}
     */
    let updateInterval = setInterval(updateValue, 4000);

    return () => clearInterval(updateInterval);
})
