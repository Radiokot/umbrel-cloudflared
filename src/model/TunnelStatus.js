export default class TunnelStatus {
    /**
     * @param {string} status 
     */
    constructor(status) {
        /**
         * @type {string}
         */
        this.status = status
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
        return new TunnelStatus(json.status);
    }
}
