# idShortRent-public
## 号子短租 - 前端开源版

### 一个租号共享平台，主要提供影视、工具、办公等会员充值以及出租，号主可发布闲置会员账号获取收益；用户可以快速根据实际情况租号。

1. 采用前后端分离模式开发
2. 前端基于Nuxt.js +  Mand Mobile UI
3. 后端：Java开发（暂不考虑开源）
4. 暂只支持微信支付（YunGou OS提供个人签约的支付SDK），以及微信授权登录功能
5. ...


## Build Setup

``` bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).


## 部署到服务器

``` bash
# UAT
$ pm2-uat-init #第一次部署需初始化
$ pm2-uat #部署到UAT

# LIVE
$ pm2-live-init #第一次部署需初始化
$ pm2-live #部署到LIVE
```
