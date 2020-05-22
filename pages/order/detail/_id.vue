<template>
    <app-scroll-view class="app-container">
        <app-header slot="app-header" />
        <div class="order-detail-wrap">
            <md-skeleton avatar title :row="2" class="order-goods__info" :loading="pageLoading" @click="$router.push(`/goods/${goodsInfo.id}`)">
                <div class="box-left">
                    <img class="box-left__icon" v-lazy="goodsInfo.goodsImage" :alt="`${goodsInfo.goodsName}`">
                </div>
                <div class="box-right">
                    <div class="box-right__title">
                        <p>{{goodsInfo.goodsName}}</p>
                    </div>
                    <div class="box-right__spec">规格：{{orderDetail.specName}}</div>
                    <div class="box-right__price">价格：<small>&yen;</small>{{$Utils.formatMoney(orderDetail.orderPrice)}}</div>
                </div>
            </md-skeleton>
            <div class="order-item__banner">
                <a href="http://suo.im/6c8aFd"><img src="//image.idsdz.com/banner/order_ele.png" alt="推荐饿了么外卖红包，抢最高66元霸王餐"></a>
            </div>
            <div class="order-item__info">
                <p class="info-title">支付信息</p>
                <md-skeleton :class="{'info-content':pageLoading}" title :loading="pageLoading">
                    <md-field>
                        <md-cell-item title="订单号" :addon="`${orderDetail.orderNum}`" />
                        <md-cell-item title="商品价格" :addon="`￥${$Utils.formatMoney(orderDetail.orderPrice)}`" />
                        <md-cell-item title="支付金额" :addon="`￥${$Utils.formatMoney(orderDetail.realPrice)}`" />
                        <md-cell-item title="创建时间" :addon="`${$Utils.formatTime(orderDetail.createTime)}`" />
                        <md-cell-item title="订单状态" :addon="`${$Utils.transOrderStatus(orderDetail.status)}`" />
                        <md-cell-item v-if="orderDetail.type == 1" title="充值账号" :addon="`${orderDetail.remark}`" />
                        <md-cell-item title="商品售后" no-border>
                            <md-button type="link" @click="applyAfterSale" class="app-primary-color" slot="right" :inactive="orderDetail.status != 2 && orderDetail.type == 0 || orderDetail.status != 11 && orderDetail.type == 1">
                                <span v-if="orderDetail.type == 1">充值未到账，点击联系平台客服</span>
                                <span v-else>需要验证码的，请点我联系号主</span>
                            </md-button>
                        </md-cell-item>
                    </md-field>
                </md-skeleton>
            </div>
            <div v-if="orderDetail.status == 2 && orderDetail.type != 1" class="key-item__info">
                <p class="info-title">卡密信息</p>
                <md-skeleton :class="{'info-content':pageLoading}" title :loading="pageLoading">
                    <md-field :no-border="true">
                        <md-cell-item title="卡密类型" :addon="`${orderDetail.categoryName}`" />
                        <md-cell-item title="卡密规格" :addon="`${orderDetail.specName}`" />
                        <md-cell-item title="账号"
                            @click="copyText($event, orderDetail.goodsUsername, '账号')">
                            <div slot="right">
                                <span>{{orderDetail.goodsUsername}}</span>
                                <span style="color: #2f86f6;">复制</span>
                            </div>
                        </md-cell-item>
                        <md-cell-item title="密码" 
                            @click="copyText($event, orderDetail.goodsPassword, '密码')">
                            <div slot="right">
                                <span>{{orderDetail.goodsPassword}}</span>
                                <span style="color: #2f86f6;">复制</span>
                            </div>
                        </md-cell-item>
                        <md-cell-item title="租用到期时间" :addon="`${$Utils.formatTime(orderDetail.leaseExpireTime)}`" />
                        <md-cell-item title="商品说明" brief="" :no-border="!goodsDescIsOpen">
                            <div @click="toggleGoodsDesc" class="app-primary-color" slot="right">
                                <span v-if="!goodsDescIsOpen">点击展开</span>
                                <span v-else>点击收缩</span>
                            </div>
                            <div slot="children" v-show="goodsDescIsOpen" class="goods-item__desc">
                                <p class="desc-text">{{goodsInfo.description}}</p>
                                <div class="desc-preview-imgs">
                                    <div v-for="(img,$index) in goodsInfo.descriptionImages" :key="$index" class="preview-img">
                                        <img v-lazy="img" alt="">
                                    </div>
                                </div>
                            </div>
                        </md-cell-item>
                    </md-field>
                </md-skeleton>
            </div>
            <md-button v-if="orderDetail.status == 1" class="pay-btn-submit" @click="createCashierPay" :loading="subLoading" :inactive="subLoading" type="primary">立即支付</md-button>
            <div class="store-item__info">
                <p class="info-title">商家信息</p>
                <md-skeleton avatar title class="info-wrapper" :loading="pageLoading">
                    <div class="info-wrapper-top">
                        <div class="info-wrapper__logo">
                            <img :src="shopInfo.shopAvatar || require('~/static/icons/default_avatar.png')" alt="号子旗舰店">
                        </div>
                        <div class="info-wrapper__box">
                            <div class="info-wrapper__title">
                                <span class="title">
                                    {{shopInfo.shopName}}
                                    <small v-if="shopInfo.shopLevel">{{`Lv.${shopInfo.shopLevel}`}}</small>
                                </span>
                            </div>
                            <p class="info-wrapper__notice">
                                公告：{{shopInfo.shopIntroduce || '店主太懒了,还没有公告~~'}}
                            </p>
                        </div>
                    </div>
                    <div class="info-wrapper-bottom">
                        <md-button @click="openCustomerBox" type="link" icon="message">联系客服</md-button>
                        <md-button @click="$router.push(`/store/${shopInfo.sid}`)" type="link" icon="home">店铺主页</md-button>
                    </div>
                </md-skeleton>
            </div>
        </div>
        <!-- 客服窗口 -->
        <app-customer 
            slot="app-other"
            :isPopup.sync="isPopupShow" 
            :customerInfo="shopInfo"
            @close="handleClosePopup" />
    </app-scroll-view>
</template>
<script>
import ClipboardJS from 'clipboard'
import AppCustomer from '~/components/AppCustomer.vue'
import AppGoodsItem from '~/components/AppGoodsItem'
import AppOrderItem from '~/components/AppOrderItem'
export default {
    name: 'app-order-detail',
    middleware: 'auth',
    head () {
        return {
            title: '订单详情 - VIP，随租随用，用短租',
            meta: [
                { hid: 'description', name: 'description', content: '号子短租，订单详情' }
            ]
        }
    },
    fetch({store, route, params}) {
        store.commit('SET_HEAD_TITLE', '订单详情');
        store.commit('SET_IS_HOME', false);
    },
    components: {
        'app-customer': AppCustomer,
        'app-goods-item': AppGoodsItem,
        'app-order-item': AppOrderItem
    },
    computed: {
        appToken() {
            return this.$store.state.user.token;
        },
        goodsInfo() {
            return JSON.parse(this.orderDetail.goodsInfo || "{}");
        },
        shopInfo() {
            return JSON.parse(this.orderDetail.shopInfo || "{}");
        }
    },
    data() {
        return {
            goodsDescIsOpen: false,
            isPopupShow: false,
            orderDetail: {},
            pageLoading: false,
            subLoading: false,
        }
    },
    created() {
        this.$store.commit('SET_HEAD_MENU_CONFIG', []);
    },
    methods: {
        applyAfterSale() {
            // this.$Dialog.alert({
            //     title: '申请售后',
            //     content: '暂无售后操作，请联系店铺客服',
            //     cancelText: '取消',
            //     confirmText: '确定',
            //     onConfirm: () => console.log('[Dialog.alert] confirm clicked'),
            // })
            this.openCustomerBox();
        },
        toggleGoodsDesc() {
            this.goodsDescIsOpen = !this.goodsDescIsOpen;
        },
        openCustomerBox() {
            this.isPopupShow = true;
        },
        handleClosePopup(bool) {
            this.isPopupShow = bool;
        },
        async getOrderDetails(id) {
            this.pageLoading = true;
            let { code, data } = await this.$api.getOrderDetails(id, this.appToken);
            this.pageLoading = false;
            if(code == 200) {
                console.log(data);
                this.orderDetail = data;
            } else {
                this.$Dialog.failed({
                    title: '提示',
                    content: '获取订单信息失败，请重试',
                    cancelText: '取消',
                    confirmText: '确定',
                    onConfirm: () => {
                        this.getOrderDetails(id);
                    }
                })
            }
        },
        //创建支付订单
        async createCashierPay() {
            let { orderNum, realPrice, categoryName, specName } = this.orderDetail;
            let params = {
                goodsDescribe: `${categoryName} - ${specName}`,
                orderNum,
                totalFee: realPrice
            }
            this.subLoading = true;
            let { code, data, msg } = await this.$api.putUpCashierPay(params, this.appToken);
            this.subLoading = false;
            if(code == 200) {
                console.log(data);
                let link = data.data;
                window.location.href = link;
            } else {
                this.$Dialog.failed({
                    title: '提示',
                    content: msg || '创建支付订单失败，请重试',
                    cancelText: '取消',
                    confirmText: '确定',
                    onConfirm: () => {
                        this.createCashierPay();
                    },
                    onCancel: () => {
                        //返回上一页
                        this.linkBack();
                    }
                })
            }
        },
        copyText(e, content, msg = '') {
            this.$Utils.copyText(e, content).then(res => {
                this.$Toast.info(`复制${msg}成功`)
            }).catch(error => {
                console.log(error);
                this.$Toast.failed("当前浏览器不支持复制")
            })
        }
    },
    mounted() {
        let { id } = this.$route.params;
        console.log(id);
        this.getOrderDetails(id);
        console.log("Hello", this.$Utils);
    },
}
</script>
<style lang="scss">
.order-detail-wrap {
    .md-field {
        padding: 12px 32px;
        border-radius: 16px;
    }
    .md-cell-item-content {
        color: #858b9c;
        font-size: 28px;
    }
    .md-cell-item-body {
        min-height: 80px;
        padding: 12px 0;
    }
    .md-cell-item-right {
        color: #41485d
    }
    .md-cell-item-children {
        padding: 0;
    }
}
</style>
<style lang="scss" scope>
.order-detail-wrap {
    padding: 32px;
    .order-goods__info {
        width: 100%;
        padding: 24px;
        background-color: #fff;
        border-radius: 16px;
        margin-bottom: 24px;
        font-size: 28px;
        display: flex;
        .box-left {
            height: 156px;
            width: 156px;
            // padding: 24px;
            overflow: hidden;
        }
        .box-right {
            flex: 1;
            position: relative;
            margin-left: 24px;
        }
        .box-left__icon {
            width: auto;
            height: 100%;
            border-radius: 24px;
        }
        .box-right__title {
            padding: 0 24px 16px 0;
            p {
                color: #333;
                font-size: 26px;
                font-weight: bold;
                @include overflow-ellipsis(2);
            }
        }
        .box-right__spec, .box-right__price {
            font-size: 26px;
        }
        .box-right__spec {
            color: #666;
            position: absolute;
            bottom: 36px;
        }
        .box-right__price {
            color: $app-primary-color;
            position: absolute;
            bottom: 0;
            small {
                margin-right: 8px;
            }
        }
    }
    .pay-btn-submit {
        margin: 32px 0;
    }
}
.order-item__info, .key-item__info {
    margin-bottom: 32px;
    .md-button-content {
        padding: 0;
    }
}
.order-item__info, .key-item__info, .store-item__info {
    .info-title {
        font-size: 28px;
        margin-bottom: 12px;
        color: #666;
    }
    .info-content {
        background-color: #fff;
        padding: 32px;
        border-radius: 16px;
    }
}
.app-primary-color {
    color: $app-primary-color;
}
.order-detail-wrap .goods-item__desc {
    padding: 24px 0;
    .desc-text {
      color: #333;
      font-size: 30px;
      line-height: 40px;
      margin-bottom: 12px;
    }
    .desc-preview-imgs {
      .preview-img img{
        width: 100%;
        height: auto;
      }
    }
}
.store-item__info {
    .info-wrapper {
        background-color: #fff;
        border-radius: 16px;
        padding: 24px;
    }
    .info-wrapper-top {
        display: flex;
        border-bottom: 1px solid #f3f3f3;
        padding-bottom: 32px;
    }
    .info-wrapper__logo {
        width: 148px;
        height: 148px;
        border-radius: 50%;
        overflow: hidden;
        img {
            width: 100%;
            height: auto;
        }
    }
    .info-wrapper__box {
        flex: 1;
        padding-left: 24px;
        .info-wrapper__title {
            color: #41485d;
            font-size: 32px;
            font-weight: bold;
            padding-top: 12px;
            margin-bottom: 12px;
            .title {
                position: relative;
                small {
                    color: #fff;
                    font-size: 22px;
                    background-color: $app-primary-color;
                    padding: 0 8px;
                    border-radius: 8px;
                    position: absolute;
                    right: -80px;
                    top: 50%;
                    min-width: 56px;
                    text-align: center;
                    -webkit-transform: translateY(-50%);
                    transform: translateY(-50%);
                }
            }
        }
        .info-wrapper__notice {
            color: #858b9c;
            font-size: 26px;
            @include overflow-ellipsis(2);
        }
    }
    .info-wrapper-bottom {
        padding-top: 32px;
        display: flex;
        justify-content: flex-end;
        .md-button {
            margin-left: 16px;
        }
    }
}
.order-item__banner {
    width: 100%;
    padding: 6px 0 16px 0;
    img {
        width: 100%;
        height: auto;
        border-radius: 16px;
    }
}
</style>