export default class TunnelRoute {
    /**
     * Route identifier
     */
    id: string;

    /**
     * Route public hostname
     */    
    publicHostname: string;

    /**
     * Optional route path under the public hostname
     */        
    path: string | null;
    
    /**
     * Route destination service URL
     */
    serviceUrl: string;

    /**
     * Route public endpoint, without scheme
     */
    publicEndpoint: string;
    /**
     * @param id Route identifier
     * @param publicHostname Route public hostname
     * @param path Optional route path under the public hostname
     * @param serviceUrl Route destination service URL
     */
    constructor(id: string, publicHostname: string, path: string | null, serviceUrl: string) {
        this.id = id;
        this.publicHostname = publicHostname
        this.path = path
        this.serviceUrl = serviceUrl
        this.publicEndpoint = this.path
            ? this.publicHostname + '/' + this.path
            : this.publicHostname
    }

    /**
     * @param ingressItem cloudflared /config ingress array item 
     * @param index item index
     */
    static from(ingressItem: any, index: number): TunnelRoute {
        let hostname = "" + ingressItem.hostname
        let path = ingressItem.path || null
        let service = "" + ingressItem.service
        return new TunnelRoute(index.toString(), hostname, path, service)
    }
}
