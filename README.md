# Umbrel Cloudflare Tunnel client
Access your [Umbrel](https://umbrel.com/) apps from the Internet using Cloudflare network. Learn more about tunnels on [Cloudflare website](https://www.cloudflare.com/products/tunnel/).

![Screenshot](repository-assets/screen-1.png)

Get the app from:
- [Umbrel app store](https://apps.umbrel.com/app/cloudflared)
- [Radiokot's Umbrel apps](https://github.com/Radiokot/umbrel-app-store)

## How to use it

To use this app, you must have a set up Cloudflare account with added domains. Once you've done setting it up, check out [the guide with examples](https://github.com/Radiokot/umbrel-cloudflared/wiki/How-to-set-up-Cloudflare-Tunnel-on-your-Umbrel) to configure your own tunnel.

## Sponsors
[<img src="https://avatars.githubusercontent.com/u/103765434?s=100" alt="BrutusBondBTC" height=70 />](https://github.com/BrutusBondBTC)
<br>
…and 1 anonymous sponsor.

*I am very grateful to everyone [supporting this project](https://radiokot.com.ua/tip) ❤️ To join this public list, email me the transaction reference once it is complete.*

## Development notes
This web UI for [cloudflared](https://github.com/cloudflare/cloudflared) is intended to be used only in docker-compose deployment under Umbrel. The connector image it uses is [umbrel-cloudflared-connector](https://github.com/Radiokot/umbrel-cloudflared-connector).

### Versioning
This app uses [Semantic Versioning 2.0.0](https://semver.org/#spec-item-11).
All the user-facing changes in the app are listed in the [changelog file](CHANGELOG.md).

### Environment variables
|Name|Meaning|
|-|-|
|`CLOUDFLARED_HOSTNAME`|Hostname or IP of the connector container|
|`CLOUDFLARED_METRICS_PORT`|`cloudflared` metrics server port in the connector container. The corresponding value must be set for connector|
|`CLOUDFLARED_TOKEN_FILE`|Path to a file to store the connector token. The corresponding value must be set for the connector|
