import type TunnelRoute from '$lib/model/TunnelRoute'

export default class TunnelStatus {
    status: string
    version: string
    routes: TunnelRoute[]

    constructor(status: string, version = "unknown", routes: TunnelRoute[] = []) {
        this.status = status
        this.version = version
        this.routes = routes
    }

    /**
     * @returns if the tunnel is unreachable
     */
    isUnreachable(): boolean {
        return this.status == 'UNREACHABLE'
    }

    /**
     * @returns if the tunnel is restarting
     */
    isRestarting(): boolean {
        return this.status == 'RESTARTING'
    }

    /**
     * @returns if the tunnel is fine
     */
    isOk(): boolean {
        return this.status == 'OK'
    }

    static from(json: any): TunnelStatus {
        return new TunnelStatus(json.status, json.version, json.routes);
    }

    /**
     * Creates status of a restartung tunnel
     */
    static restarting(): TunnelStatus {
        return new TunnelStatus('RESTARTING')
    }
}
