import qs from "qs";

const api = {

    //用户登录
    login: function (params) {
        return axios.$post('/user/login', params)
        //headers => application/x-www-form-urlencoded
    },
    //用户注册
    register: function (params) {
        return axios.$post('/user/reg', params)
    },
    //用户信息
    getUserInfo: function (token) {
        return axios.$get('/applet-user/user/info', setHeader({
            'Authorization': `Bearer ${token}`
        }))
    },
    //工作台 - 开通店铺
    openWorkBench: function (params, token) {
        return axios.$post('applet-shop/workbench/open', params, setHeader({
            'Authorization': `Bearer ${token}`
        }))
    },
    //工作台 - 店铺信息
    getBenchDetail: function (token) {
        return axios.$get('applet-shop/workbench/detail', setHeader({
            'Authorization': `Bearer ${token}`
        }))
    },
    //工作台 - 店铺商品列表
    getBenchGoods: function (token) {
        return axios.$get('applet-shop/workbench/shelflist', setHeader({
            'Authorization': `Bearer ${token}`
        }))
    },
    //工作台 - 发布商品
    releaseBenchGoods: function (params, token) {
        return axios.$post('applet-shop/workbench/releasegoods', params, setHeader({
            'Authorization': `Bearer ${token}`
        }))
    },
    //工作台 - 商品详情
    getBenchGoodsDetail: function (goodsId, token) {
        return axios.$get('applet-shop/workbench/goodsdetail', {
            params: {
                goodsId
            },
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    },
    //工作台 - 修改商品
    updateBenchGoods: function (params, token) {
        return axios.$post('applet-shop/workbench/updategoods', params, setHeader({
            'Authorization': `Bearer ${token}`
        }))
    },
    //工作台 - 商品上架
    setBenchGoodsOn: function (shelfId, token) {
        return axios.$get('applet-shop/workbench/up', {
            params: {
                shelfId
            },
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    },
    //工作台 - 商品下架
    setBenchGoodsOff: function (shelfId, token) {
        return axios.$get('applet-shop/workbench/down', {
            params: {
                shelfId
            },
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    },
    //工作台 - 商品删除
    setBenchGoodsDel: function (shelfId, token) {
        return axios.$get('applet-shop/workbench/del', {
            params: {
                shelfId
            },
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    },
    //店铺首页
    getShopDetail: function (sid) {
        return axios.$get('applet-shop/shop/detail', {
            params: {
                sid
            }
        })
    },
    //店铺首页 - 商品列表
    getShopGoodsList: function (sid) {
        return axios.$get('applet-shop/shop/list', {
            params: {
                sid
            }
        })
    },
    //短租首页 - 推荐列表
    getRecommendGoodsList: function (params) {
        return axios.$get('applet-shop/goods/list', {
            params
        })
    },
    //商品详情
    getGoodsDetails: function (goodsId) {
        return axios.$get('applet-shop/goods/detail', {
            params: {
                goodsId
            }
        })
    },
    //图片文件上传
    uploadImgFile: function (data, token) {
        return axios.$post('/file/upload', data, setHeader({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }))
    },
    //获取商品分类
    getGoodsCategory: function (token) {
        return axios.$get('applet-shop/goods/category', setHeader({
            'Authorization': `Bearer ${token}`
        }))
    },
    //下单准备
    orderPrepare: function (params, token) {
        return axios.$post('applet-order/order/prepare', params, setHeader({
            'Authorization': `Bearer ${token}`
        }))
    },
    //创建订单
    createOrder: function (params, token) {
        return axios.$post('applet-order/order/create', params, setHeader({
            'Authorization': `Bearer ${token}`
        }))
    },
    //订单列表
    getOrderList: function (params, token) {
        return axios.$get('applet-order/order/list', {
            params,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    },
    //订单详情
    getOrderDetails: function (orderId, token) {
        return axios.$get('applet-order/order/detail', {
            params: {
                orderId
            },
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    },
    //拉起收银台支付
    putUpCashierPay: function (params, token) {
        return axios.$post('applet-order/pay/cashierPay', params, setHeader({
            'Authorization': `Bearer ${token}`
        }))
    },
    //生成二维码收款：
    generateNativePay: function (params, token) {
        return axios.$post('applet-order/pay/nativePay', params, setHeader({
            'Authorization': `Bearer ${token}`
        }))
    },
    //订单号 查支付状态
    getOrderPayStatus: function (orderNum, token) {
        return axios.$get('applet-order/order/getPayStatus', {
            params: {
                orderNum
            },
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    },
    //店铺收入信息
    getShopIncomeByDay: function (toDay, token) {
        return axios.$get('applet-order/workOrder/income', {
            params: {
                toDay
            },
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    },
    //店铺订单列表
    getShopOrderList: function (params, token) {
        return axios.$get('applet-order/workOrder/list', {
            params,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    },
    //店铺收益管理
    getShopIncomeInfo: function (token) {
        return axios.$get('applet-user/income/info', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    },
    //店铺提现信息
    getShopWithdrawInfo: function (token) {
        return axios.$get('applet-user/income/withdrawInfo', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    },
    //店铺收益申请提现
    getShopIncomeApply: function (params, token) {
        return axios.$post('applet-user/income/apply', params, setHeader({
            'Authorization': `Bearer ${token}`
        }))
    },
    //店铺收益明细
    getShopIncomeDetails: function (token) {
        return axios.$get('applet-user/income/list', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    },
    //店铺装修
    updateBenchDetails: function (params, token) {
        return axios.$post('applet-shop/workbench/updateShop', params, setHeader({
            'Authorization': `Bearer ${token}`
        }))
    },
    //首页banner广告
    getHomeBanner: function () {
        return axios.$get('applet-user/ad/list')
    },
    //用户退出登录
    userSignOut: function (token) {
        return axios.$get('/user/mylogout', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    },
    //获取微信授权地址
    getWxLoginUrl: function (redirectUrl) {
        return axios.$get('/user/wx/ygUrl', {
            params: {
                redirectUrl
            }
        })
    },
    //使用code请求微信登录
    requestToWxLogin: function (code) {
        return axios.$get('/user/wx/ygCode', {
            params: {
                code
            }
        })
    },
    //获取直充类目
    getDirectCategory: function () {
        return axios.$get('/applet-shop/goods/directgoods/category')
    },
    //获取直充商品
    getDirectGoods: function (categoryId) {
        return axios.$get('applet-shop/goods/directgoods/list', {
            params: {
                categoryId
            }
        })
    },
    //完善用户联系方式
    savaUserContact: function (remark, token) {
        return axios.$get('applet-user/user/savecontact', {
            params: {
                remark
            },
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }
}

//定义axios变量等待接收axios,保证axios可用
var axios = null;
export default ({ $axios }, inject) => {
    axios = $axios;
    //将自定义函数交于nuxt
    // 使用方式1：在vue中，this.$api.函数名()
    // 使用方式2：在nuxt的asyncData中，content.app.$api.函数名()
    inject('api', api);
}

const setHeader = (obj) => {
    return {
        headers: obj
    }
}
