export default class TunnelSettings {
    /**
     * Cloudflare connector token
     */
    token: string | null;

    /**
     * @param token Cloudflare connector token 
     */
    constructor(token: string | null) {
        this.token = token
    }

    static from(json: any): TunnelSettings {
        return new TunnelSettings(json.token ? "" + json.token : null);
    }
}
