<template>
    <app-scroll-view class="app-container">
        <app-header slot="app-header"/>
        <div class="cashier-box">
            <div class="cashier-payment">
                <p class="pay-title">支付金额</p>
                <p class="pay-amount"><small>&yen;</small>{{$Utils.formatMoney(orderForm.price)}}</p>
                <p class="pay-tips">提示：请10分钟内支付，订单超时自动取消</p>
            </div>
            <div class="cashier-pay-methods">
                <p class="pay-methods-title">选择支付方式</p>
                <md-field class="radio-field">
                    <md-radio-list
                        v-model="payMethodValue"
                        :options="payMethods"
                        icon-size="lg"
                        icon="checked"
                        icon-inverse="check"
                        icon-disabled=""
                        icon-position="right">
                        <template slot-scope="{ option, index, selected }">
                            <div class="custom-icon">
                                <i :class="['iconfont', option.iconName]" 
                                    :style="{'color':option.iconColor ? option.iconColor : '#333'}">
                                </i>
                            </div>
                            <div class="custom-title">{{ option.text }}</div>
                            <div class="custom-brief">{{ option.brief}}</div>
                        </template>
                    </md-radio-list>
                </md-field>
            </div>
            <div class="cashier-pay-submit">
                <md-button type="primary" @click="createOrder" :loading="subLoading" :inactive="subLoading">立刻下单</md-button>
            </div>
        </div>
        <!-- 完善用户联系方式 -->
        <app-save-info :isOpen.sync="isOpenSaveInfo"/>
    </app-scroll-view>
</template>
<script>
import {RadioList} from 'mand-mobile'
import AppSaveInfo from '~/components/AppSaveInfo'
export default {
    name: 'app-cashier',
    middleware: 'auth',
    head () {
        return {
            title: '确认付款 - VIP，随租随用，用短租',
            meta: [
                { hid: 'description', name: 'description', content: '号子短租，确认付款' }
            ]
        }
    },
    components: {
        [RadioList.name]: RadioList,
        [AppSaveInfo.name]: AppSaveInfo
    },
    fetch({store, route, params}) {
        store.commit('SET_HEAD_TITLE', '确认订单');
        store.commit('SET_IS_HOME', false);
    },
    data() {
        return {
            payMethodValue: '0',
            payMethods: [
                {
                    value: '0',
                    text: '微信支付',
                    brief: '',
                    disabled: false,
                    iconName: 'icon-weixinzhifu',
                    iconColor: '#24db5a'
                },
                {
                    value: '1',
                    text: '支付宝（暂不支持）',
                    brief: '',
                    disabled: true,
                    iconName: 'icon-zhifubao',
                    iconColor: '#108ee9'
                }
            ],
            //是否开始支付
            subLoading: false,
            //下单Form
            orderForm: {},
            //订单准备数据
            orderData: null,
            //是否显示完善信息框
            isOpenSaveInfo: false,
        }
    },
    computed: {
        getAppToken() {
            return this.$store.state.user.token
        },
        userInfo() {
            return this.$store.state.user.userInfo || {};
        }
    },
    methods: {
        //确认订单 初始化
        async initCashier(id, skuIds, type, remark) {
            this.$Toast.loading("Loading...");
            try {
                if(type == 1) {
                    //获取直充商品
                    await this.getDirectGoods(id, skuIds, remark)
                } else {
                    //获取短租商品
                    await this.getGoodsDetails(id, skuIds);
                }
                //订单准备
                await this.startOrderPrepare();
                this.$Toast.hide();
            
            } catch (error) {
                console.log(error);
            }
        },
        //短租 获取商品详情
        async getGoodsDetails(goodsId, skuIds) {
            let { code, data } = await this.$api.getGoodsDetails(goodsId);
            console.log(code, data);
            if(code == 200) {
                console.log(data);
                let { sid, shelfId, categoryId, goodsName, skuJson, shopName } = data;
                let parseSkuList = JSON.parse(skuJson) || [];
                let specList = parseSkuList.filter(item => {
                    return item.skuIds == skuIds;
                })
                console.log(specList);
                let spec = specList.length > 0 ? specList[0] : null;
                this.orderForm = {
                    goodsId,
                    sid,
                    shelfId,
                    categoryId,
                    goodsName,
                    spec,
                    shopName,
                    price: spec.price
                }
            } else {
                this.$Dialog.failed({
                    title: '提示',
                    content: '商品加载失败，请重试',
                    cancelText: '取消',
                    confirmText: '确定',
                    onConfirm: () => {
                        this.getGoodsDetails(goodsId);
                    },
                    onCancel: () => {
                        //返回上一页
                        this.linkBack();
                    }
                })
            }
        },
        //直充 获取商品详情
        async getDirectGoods(categoryId, skuIds, remark) {
            this.$Toast.loading("Loading...");
            try {
                //value
                let {code, data} = await this.$api.getDirectGoods(categoryId);
                this.$Toast.hide();
                if(code == 200) {
                    let selectedGoodsItem = null;
                    //取出相应的商品
                    let sku = data.forEach(goodsItem => {
                        let skuSpec = goodsItem.spec.filter(item => {
                            return item.skuIds == skuIds;
                        })
                        if(skuSpec.length > 0) {
                            this.orderForm = {
                                goodsId: goodsItem.id,
                                categoryId: goodsItem.categoryId,
                                goodsName: goodsItem.goodsName,
                                spec: skuSpec[0],
                                shopName: goodsItem.shopName,
                                price: skuSpec[0].price,
                                type: 1,
                                remark
                            }
                        }
                    })
                   //this.specList = data;
                    //console.log("guige", this.specList)
                }
            } catch (error) {
                console.error(error);
            }
        },
        //下单准备
        async startOrderPrepare() {
            let { msg, code, data } = await this.$api.orderPrepare(this.orderForm, this.getAppToken);
            if(code == 200) {
                console.log(data);
                let { orderSign, sign } = data;
                //保存订单准备信息
                this.orderData = {
                    orderSign,
                    sign
                };
                console.log("保存order信息:", this.orderData);
            } else {
                this.$Dialog.failed({
                    title: '提示',
                    content: msg || '订单准备失败，请重试',
                    cancelText: '取消',
                    confirmText: '确定',
                    onConfirm: () => {
                        if(!msg) {
                            this.startOrderPrepare();
                        } else {
                             //返回上一页
                            this.linkBack();
                        }
                    },
                    onCancel: () => {
                        //返回上一页
                        this.linkBack();
                    }
                })
            }
        },
        linkBack() {
            if(window.history.length > 1) {
                this.$router.go(-1);
            } else {
                this.$router.push('/');
            }   
        },
        //创建订单
        async createOrder() {
            //判断用户是否已经完善联系信息
            if(!this.userInfo.remark) {
                this.isOpenSaveInfo = true;
                return;
            }
            this.subLoading = true;
            let {code, data, msg} = await this.$api.createOrder(this.orderData, this.getAppToken);
            this.subLoading = false;
            if(code == 200) {
                console.log(data);
                let {orderId} = data;
                //this.$Toast.info("创建订单成功");
                //查订单详情
                this.getOrderDetails(orderId);
            } else {
                this.$Dialog.failed({
                    title: '提示',
                    content: msg || '创建订单失败，请重试',
                    cancelText: '取消',
                    confirmText: '确定',
                    onConfirm: () => {
                        if(!msg) {
                            this.createOrder();
                        } else {
                            //返回上一页
                            this.linkBack();
                        }
                    },
                    onCancel: () => {
                        //返回上一页
                        this.linkBack();
                    }
                })
            }
        },
        //查订单详情
        async getOrderDetails(orderId) {
            let { code, data } = await this.$api.getOrderDetails(orderId, this.getAppToken);
            if(code == 200) {
                console.log(data);
                //let {orderId} = data;
                this.createCashierPay(data);
            } else {
                this.$Dialog.failed({
                    title: '提示',
                    content: '查询订单失败，请重试',
                    cancelText: '取消',
                    confirmText: '确定',
                    onConfirm: () => {
                        this.getOrderDetails(orderId);
                    },
                    onCancel: () => {
                        //返回上一页
                        this.linkBack();
                    }
                })
            }
        },
        //创建支付订单
        async createCashierPay(orderData) {
            this.$Toast.loading("Loading...");
            let { orderNum, realPrice, categoryName, specName } = orderData;
            //是否是微信端
            const isWX = this.isWeixin();
            let params = {
                goodsDescribe: `${categoryName} - ${specName}`,
                orderNum,
                totalFee: realPrice,
                returnUrl: isWX ? `http://${window.location.host}/pay_result` : null
            }
            //const requestPaymentPay = isWX ? this.$api.putUpCashierPay : this.$api.generateNativePay;
            const requestPaymentPay = this.$api.putUpCashierPay;
            let { code, data:{data}, msg } = await requestPaymentPay(params, this.getAppToken);
            this.$Toast.hide();
            if(code == 200) {
                console.log(data);
                //编码
                let link = encodeURIComponent(data);
                //判断是否微信内置浏览器，支付直接跳转到收银台，否则生成二维码支付
                let type = isWX ? 'redirect' : 'scan';
                this.$router.replace(`/pay_result?type=${type}&link=${link}&outTradeNo=${orderNum}`);
            } else {
                this.$Dialog.failed({
                    title: '提示',
                    content: msg || '创建支付订单失败，请重试',
                    cancelText: '取消',
                    confirmText: '确定',
                    onConfirm: () => {
                        this.createCashierPay(orderData);
                    },
                    onCancel: () => {
                        //返回上一页
                        this.linkBack();
                    }
                })
            }
        },
        isWeixin: function () { //判断是否是微信
            var ua = navigator.userAgent.toLowerCase();
            return ua.match(/MicroMessenger/i) == "micromessenger";
        }
    },
    mounted() {
        //商品id
        let { id = null } = this.$route.params;
        let { skuIds = null, type = 0, remark } = this.$route.query;
        if(id && skuIds) {
            this.initCashier(id, skuIds, type, remark);
            //判断用户是否已经完善联系信息
            if(!this.userInfo.remark) {
                this.isOpenSaveInfo = true;
            }
        } else {
            this.$Dialog.alert({
                title: '警告',
                content: '非法访问',
                confirmText: '确定',
                onConfirm: () => {
                    this.linkBack();
                },
            })
        }
    },
}
</script>
<style lang="scss">
.cashier-pay-methods {
    .md-field {
        padding: 8px 32px;
        border-radius: 16px;
    }
    .md-cell-item-content {
        padding-left: 74px;
        position: relative;
        .custom-icon {
            position: absolute;
            left: 0;
            top: 50%;
            -webkit-transform: translateY(-50%);
            transform: translateY(-50%);
        }
    }
    .md-cell-item-body {
        padding-top: 48px;
        padding-bottom: 48px;
    }
}
</style>
<style lang="scss" scope>
.cashier-box {
    padding: 32px;
    .cashier-payment {
        padding: 64px 0;
        text-align: center;
        background-color: #fff;
        border-radius: 16px;
        margin-bottom: 32px;
        .pay-title, .pay-tips {
            font-size: 28px;
            color: #666;
        }
        .pay-amount {
            color: $app-primary-color;
            font-size: 80px;
            margin: 20px 0 10px 0;
            small {
                font-size: 52px;
                margin-right: 12px;
            }
        }
    }
    .cashier-pay-methods {
        margin-bottom: 64px;
        .pay-methods-title {
            font-size: 28px;
            margin-bottom: 12px;
            color: #666;
        }
        .iconfont {
            font-size: 62px;
        }
    }
}
</style>