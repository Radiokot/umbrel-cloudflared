# umbrel-cloudflared
Umbrel web app for Cloudflare Tunnel client (cloudflared)

## Environment variables
|Name|Meaning|
|-|-|
|`CLOUDFLARED_HOSTNAME`|Hostname or IP of the `cloudflared` container|
|`CLOUDFLARED_METRICS_PORT`|`cloudflared` metrics server port on the corresponding container|
|`CLOUDFLARED_TOKEN_FILE`|Path to a file to store the connector token|
