export default class TunnelSettings {
    /**
     * @param {string?} token Cloudflare connector token 
     */
    constructor(token) {
        /**
         * @type {string?} Cloudflare connector token
         */
        this.token = token
    }

    /**
     * @param {any} json 
     * @returns {TunnelSettings}
     */
    static from(json) {
        return new TunnelSettings(json.token ? "" + json.token : null);
    }
}
