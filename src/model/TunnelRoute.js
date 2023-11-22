export default class TunnelRoute {
    /**
     * 
     * @param {string} id Route identifier
     * @param {string} publicHostname Route public hostname
     * @param {string?} path Optional route path under the public hostname
     * @param {string} serviceUrl Route destination service URL
     */
    constructor(id, publicHostname, path, serviceUrl) {
        /**
         * Route identifier
         * 
         * @type {string}
         */
        this.id = id;

        /**
         * Route public hostname
         * 
         * @type {string}
         */
        this.publicHostname = publicHostname

        /**
         * Optional route path under the public hostname
         * 
         * @type {string?}
         */
        this.path = path

        /**
         * Route destination service URL
         * 
         * @type {string}
         */
        this.serviceUrl = serviceUrl

        /**
         * Route public URL
         * 
         * @type {string}
         */
        this.publicUrl = '//' +
            (this.path
                ? this.publicHostname + '/' + this.path
                : this.publicHostname
            )
    }

    /**
     * @param {any} ingressItem cloudflared /config ingress array item 
     * @param {number} index item index
     * @returns {TunnelRoute}
     */
    static from(ingressItem, index) {
        let hostname = "" + ingressItem.hostname
        let path = ingressItem.path || null
        let service = "" + ingressItem.service
        return new TunnelRoute(index.toString(), hostname, path, service)
    }
}
