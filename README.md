# Bookmark Cleaner

English | [中文](./README.CN.md)

> 🚀 Check and clean invalid browser bookmarks. [Installation page](https://microsoftedge.microsoft.com/addons/detail/bookmark-cleaner-%E4%B8%80%E9%94%AE%E6%B8%85%E7%90%86%E5%A4%B1%E6%95%88%E4%B9%A6%E7%AD%BE/ngmgejoidapgeildppmahnlegckjdggm).

[![OE2ivj.png](https://s1.ax1x.com/2022/05/04/OE2ivj.png)](https://imgtu.com/i/OE2ivj)

[![OVl8PS.png](https://s1.ax1x.com/2022/05/04/OVl8PS.png)](https://imgtu.com/i/OVl8PS)

[![OE2m5T.png](https://s1.ax1x.com/2022/05/04/OE2m5T.png)](https://imgtu.com/i/OE2m5T)

*I couldn't find the same extension, so I made it...*

## Development

```sh
pnpm install
pnpm dev
```
1. Open the extension management page: [edge://extensions](#)
2. Open `Developer Mode`
3. Click `Load Unpacked`, and select the `dist` directory in this project

*Support for hot reloading: Modified source code, auto-recompile and browser auto-refresh!*

## Publish

```sh
pnpm dist
```
Open [Microsoft Partner Center](https://partner.microsoft.com/en-us/dashboard/microsoftedge/overview),  create a new extension and upload `dist/dist.zip`.
