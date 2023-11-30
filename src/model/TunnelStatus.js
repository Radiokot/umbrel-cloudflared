
export default class TunnelStatus {
    /**
     * @param {string} status 
     * @package {string} version
     * @param {import('./TunnelRoute').default[]} routes
     */
    constructor(status, version = "unknown", routes = []) {
        /**
         * @type {string}
         */
        this.status = status

        /**
         * @type {string}
         */
        this.version = version

        /**
         * @type {import('./TunnelRoute').default[]}
         */
        this.routes = routes
    }

    /**
     * @returns {boolean} if the tunnel is unreachable
     */
    isUnreachable() {
        return this.status == 'UNREACHABLE'
    }

    /**
     * 
     * @returns {boolean} if the tunnel is fine
     */
    isOk() {
        return this.status == 'OK'
    }

    /**
     * @param {any} json 
     * @returns {TunnelStatus}
     */
    static from(json) {
        return new TunnelStatus(json.status, json.version, json.routes);
    }
}
