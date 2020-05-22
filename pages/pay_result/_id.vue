<template>
    <app-scroll-view>
        <app-header slot="app-header"/>
        <div v-if="code == 0 && paymentType == 'scan'" class="app-pay-scan">
            <span class="pay-text">请使用微信扫一扫支付</span>
            <div ref="qrcode" id="qrcode"></div>
            <span class="pay-tips">提示：请10分钟内支付，订单超时自动取消</span>
        </div>
        <div v-else class="app-pay-result">
            <md-result-page
                class="customized"
                :img-url="payStatus.url"
                :text="payStatus.text"
                subtext="提示：请10分钟内支付，订单超时自动取消">
            </md-result-page>
            <md-button v-show="code == 1" @click="goToDetails" type="primary">查看订单</md-button>
        </div>
    </app-scroll-view>
</template>
<script>
import { ResultPage } from 'mand-mobile'
export default {
    name: 'app-pay-result',
    middleware: 'auth',
    components: {
        [ResultPage.name]: ResultPage
    },
    fetch({store, route, params}) {
        store.commit('SET_HEAD_TITLE', '等待支付');
        store.commit('SET_IS_HOME', false);
    },
    computed: {
        appToken() {
            return this.$store.state.user.token;
        },
        payStatus() {
            return {
                url: require(this.code == 0 ? '~/static/icons/pay_wait.png' : '~/static/icons/pay_success.png'),
                text: this.code == 0 ? '等待支付' : '支付成功'
            }
        }
    },
    data() {
        return {
            //支付状态
            code: 0, //0：初始化，1：回调支付成功，2：回调支付失败
            loopTimer: null,
            orderId: null, //订单id
            scanCodeLink: null,
            paymentType: 'redirect', //支付方式，redirect：跳转到收银台 scan:扫码支付
            showScanQR: true,
        }
    },
    methods: {
        goToDetails() {
            let id = this.orderId;
            if(id) {
                this.$router.replace(`/order/detail/${id}`)
            }
        },
        getPayStatus(orderNum) {
            return new Promise(async(resolve, reject) => {
                let { code, msg, data } = await this.$api.getOrderPayStatus(orderNum, this.appToken);
                if(code == 200) {
                    resolve(data)
                } else {
                    resolve({msg})
                }
            })
        },
        async loopGetPayStatus(orderNum) {
            let { status = 0, msg = null, orderId = null } = await this.getPayStatus(orderNum);
            if(status == 1) {
                this.$store.commit('SET_HEAD_TITLE', '支付结果');
                this.code = 1;
                this.orderId = orderId;
                this.$Toast.info("支付成功");
                clearTimeout(this.loopTimer);
                return;
            }
            this.loopTimer = setTimeout(() => {
                this.loopGetPayStatus(orderNum);
            }, 10000)
        }
    },
    mounted() {
        console.log(this.$route.query);
        let { code = 0, outTradeNo = null, type = 'redirect', link = null } = this.$route.query;
        this.paymentType = type;
        //解码
        link = decodeURIComponent(link);
        //跳转到收银台支付
        if(code == 0 && type == 'redirect') {
            window.location.href = link;
        }
        //生成二维码，显示扫码支付
        if(code == 0 && type == 'scan') {
            this.$nextTick(() => {
                //二维码配置
                let qrcode = new QRCode('qrcode', {
                    text: link,
                    width: 256,
                    height: 256,
                    colorDark : "#000000",
                    colorLight : "#ffffff",
                    correctLevel : QRCode.CorrectLevel.H
                });
                //console.log()
                setTimeout(() => {
                    let newLink = document.getElementById('qrcode').querySelector('img').src;
                    this.scanCodeLink = newLink;
                    this.loopGetPayStatus(outTradeNo);
                }, 100)
            })
        }
        //收银台支付回调，检测订单是否支付成功
        if(code == 1 && outTradeNo) {
            console.log(this.appToken)
            this.loopGetPayStatus(outTradeNo);
        }
    },
    destroyed() {
        clearTimeout(this.loopTimer);
    }
}
</script>
<style lang="scss" scope>
.app-pay-result {
    height: 50vh;
    padding: 0 32px;
    .md-result-image {
        img {
            width: 256px;
        }
    }
}
.app-pay-scan {
    width: 100%;
    height: 60vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .pay-text {
        color: #111a34;
        display: block;
        text-align: center;
        font-size: 28px;
        margin-bottom: 32px;
    }
    .pay-tips {
        color: #858b9c;
        display: block;
        text-align: center;
        font-size: 28px;
        margin-top: 32px;
    }
}
#qrcode {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
        width: 524px;
        height: 524px;
        padding: 24px;
        background-color: #fff;
    }
}
</style>