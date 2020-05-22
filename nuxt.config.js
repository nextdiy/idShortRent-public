const isDev = process.env.NODE_ENV === 'development';
module.exports = {
  mode: 'universal',
  render: {
    resourceHints: false
  },
  server: {
    host: '0.0.0.0',
  },
  /*
  ** Headers of the page
  */
  head: {
    title: '号子短租 - VIP，随租随用，用短租',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'user-scalable=no, viewport-fit=cover' },
      { name: 'keywords', content: '闲置vip权益账号出租-转让-合租-共享平台' },
      { hid: 'description', name: 'description', content: '一个闲置VIP权益共享租号平台，随租随用，快速便捷，闲置权益共享化，利益化。' },
      { hid: 'sharename', name: 'sharename', itemprop: 'name', content: '号子短租 - VIP权益，随租随用，用短租'},
      { hid: 'shareimage', name: 'shareimage', itemprop: 'image', content: 'http://image.idsdz.com/category/other_vip.png' },
      { hid: 'shareogimage', name: 'shareogimage', property: 'og:image', content: 'http://image.idsdz.com/category/other_vip.png' },
      { hid: 'sharedesc', name: 'sharedesc', itemprop: 'description', content: '一个闲置VIP权益共享租号平台，随租随用，快速便捷，闲置权益共享化，利益化。' },
      { name: '360-site-verification', content:'8e7631ef5fcb4a7eecbc3f46db6a77e9'}
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: '//at.alicdn.com/t/font_1644067_4tgdr949mht.css' },
      { rel: 'stylesheet', href:'//cdn.bootcss.com/spinkit/1.2.5/spinkit.min.css'}
    ],
    script: [
      { type: 'text/javascript', src:'/js/qrcode.min.js' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  // loading: '#fff',
  /*
  ** Global CSS
  */
  css: [
    '~assets/css/reset.css',
    '~assets/css/global.css',
    'mand-mobile/lib/mand-mobile.css'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '~/plugins/mand-mobile', ssr: true },
    { src: '~/plugins/vue-lazyload.js', ssr: false },
    { src: '~/plugins/axios.js', ssr: true},
    { src: '~/plugins/api.js', ssr: true},
    { src: '~/plugins/image-proessor.js', ssr: false },
    { src: '~/plugins/utils.js', ssr: true },
    { src: '~/static/js/statistics.js', ssr: false },
    { src: '~/plugins/vconsole.js', ssr: false }
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/style-resources',
    '@nuxtjs/axios',
    '@nuxtjs/proxy'
  ],
  axios: {
    // proxyHeaders: false,
    proxy: true,
    //retry: { retries: 3 },
    //开发模式下开启debug
    debug: process.env.NODE_ENV == "production" ? false : true,
    //设置不同环境的请求地址
    prefix: "/api",
    withCredentials: true,
  },
  proxy: {
    //开启代理
    "/api": {
      target: "http://numshare.natapp1.cc",
      pathRewrite: { "^/api": "" }
    }
  },
  styleResources: {
    scss: [
      '~assets/scss/*.scss'
    ]
  },
  /*
  ** Build configuration
  */
  build: {
    vendor:['axios'],
    /*
    ** You can extend webpack config here
    */
    cssSourceMap: false,
    publicPath: '/.nuxt/',
    //publicPath: isDev ? '/.nuxt/' : 'http://cdn.xxxx.com/', //这里配置CDN路径配置
    postcss: {
      plugins: {
        'postcss-pxtorem': {
          rootValue: 14,
          minPixelValue: 2,
          propWhiteList: []
        }
      }
    },
    extractCSS: { allChunks: true },    // css 独立打包 link 的形式加载
    //webpack config
    extend (config, ctx) {
      //console.log(config.module.rules);
    }
  }
}