export default class TunnelSettings {
    /**
     * Cloudflare connector token
     */
    token: string | null;

    /**
     * Optional extra arguments for the connector
     */
    extraArgs: string | null;

    /**
     * @param token Cloudflare connector token
     */
    constructor(token: string | null, extraArgs: string | null) {
        this.token = token;
        this.extraArgs = extraArgs;
    }

    static from(json: any): TunnelSettings {
        return new TunnelSettings(
            json.token ? "" + json.token : null,
            json.extraArgs ? "" + json.extraArgs : null,
        );
    }
}
