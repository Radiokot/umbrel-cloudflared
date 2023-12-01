import { readable } from "svelte/store";
import { browser } from '$app/environment';

import TunnelStatus from "../model/TunnelStatus";

export let setTunnelStatusRestarting: (() => void) | null = null

/**
 * Auto-updating tunnel status store.
 */
export default readable<TunnelStatus | null>(null, (set) => {
    setTunnelStatusRestarting = () => {
        set(TunnelStatus.restarting())
    }

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

    let updateInterval = setInterval(updateValue, 4000);

    return () => clearInterval(updateInterval);
})
