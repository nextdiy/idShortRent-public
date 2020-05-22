<template>
    <app-scroll-view
        class="console-withdraw-container"
        :isLoadRefresh="true"
        @loadRefresh="initLoadRefresh">
        <app-header slot="app-header"/>
        <div class="withdraw-wrapper">
            <md-field title="收款账号">
                <md-cell-item :title="withdrawInfo.name" :brief="withdrawInfo.username" @click="changeAccount" addon="更改" arrow>
                    <span class="withdraw-wrapper__holder" slot="left">
                        <i class="iconfont icon-zhifubao"></i>
                    </span>
                </md-cell-item>
            </md-field>
            <md-field title="提现金额(元)">
                <div
                    class="field-operator"
                    slot="action"
                    @click="onClick"
                >
                    <md-icon name="info"></md-icon>
                </div>
                <md-input-item
                    type="money"
                    v-model="value"
                    :is-virtual-keyboard="true"
                    brief="一般提现之后24小时之内到账，特殊情况除外"
                    :placeholder="`最多 ${withdrawInfo.price || 0} 元`"
                    :size="size"
                    @change="withdrawPriceChange"
                    @confirm="withdrawSubmitSure"
                    is-amount
                    is-highlight
                >
                    <div class="input-operator" slot="right" @click="takeAll">全部提现</div>
                </md-input-item>
                <div class="withdraw-submit">
                    <md-button type="primary" :inactive="value.length <= 0 || subLoading" :loading="subLoading" @click="withdrawSubmitSure">确认提现</md-button>  
                </div>
            </md-field>
        </div>
        <div class="withdraw-desc">
            <p class="withdraw-desc__title">提现说明</p>
            <p class="withdraw-desc__list">1. 每天可提现一次，未结算金额不可提现</p>
            <p class="withdraw-desc__list">2. 每次提现金额不少于2元</p>
            <p class="withdraw-desc__list">3. 提现金额不满10元收取1元手续费，满10及以上免手续费</p>
            <p class="withdraw-desc__list">4. 一般情况提现之后24小时内到账，特殊情况除外</p>
            <p class="withdraw-desc__list">5. 申请提现后，请联系微信：Misser168 加速审核打款</p>
        </div>
    </app-scroll-view>
</template>
<script>
import { Icon } from 'mand-mobile'
export default {
    name: 'app-console-withdraw',
    head () {
        return {
            title: '提现 - 店铺工作台',
            meta: [
                { hid: 'description', name: 'description', content: '号子短租，提现' }
            ]
        }
    },
    fetch({store, route, params}) {
        store.commit('SET_HEAD_TITLE', '提现');
        store.commit('SET_IS_HOME', false);
    },
    components: {
        [Icon.name]: Icon
    },
    data() {
        return {
            withdrawInfo: {}, //提现信息
            value: '',
            subLoading: false,
            config: {
                minWithdraw: 2, //最低提现金额
                minFee: 10, //最低免手续费金额
                commission: 1, //手续费
            }
        }
    },
    computed: {
        size() {
            return this.value.length > 10 ? 'small' : 'large'
        },
        appToken() {
            return this.$store.state.user.token;
        }
    },
    created() {
        this.$store.commit('SET_HEAD_MENU_CONFIG', []);
    },
    methods: {
        takeAll() {
            this.value = this.withdrawInfo.price;
        },
        onClick() {
            this.$Toast({
                content: '仅可提现已结算的金额',
                icon: 'warn',
            })
        },
        changeAccount() {
            this.$Toast({
                content: '暂不支持更改账号',
                icon: 'warn',
            })
        },
        withdrawPriceChange(name, value) {
            if(Number(value) > Number(this.withdrawInfo.price)) {
                this.value = this.withdrawInfo.price;
            }
        },
        //确认提现金额、询问提示
        withdrawSubmitSure() {
            console.log(this.config.minWithdraw);
            let value = Number(this.value);
            if(value && value >= this.config.minWithdraw) {
                let content = '';
                if(value < this.config.minFee) {
                    content = `提现金额：￥${this.$Utils.formatMoney(value * 100)}<br>实际到账：￥${this.$Utils.formatMoney((value - this.config.commission) * 100)}（手续费${this.config.commission}元）`
                } else {
                    content = `提现金额：￥${this.$Utils.formatMoney(value * 100)}<br>实际到账：￥${this.$Utils.formatMoney(value * 100)}（免手续费）`
                }
                this.$Dialog.confirm({
                    title: '提现提示',
                    content,
                    confirmText: '确定',
                    onConfirm: () => {
                        this.requestWithdraw();
                    },
                })
                
            } else {
                this.$Dialog.failed({
                    title: `提现金额不能低于${this.config.minWithdraw}元`,
                    content: '请继续努力',
                    confirmText: '确定',
                    onConfirm: () => {
                        this.value = '';
                    },
                })
            }
        },
        //请求提现
        async requestWithdraw() {
            let params = {
                payUsername: this.withdrawInfo.username,
                realName: this.withdrawInfo.name,
                price: Number(this.value) * 100
            }
            this.subLoading = true;
            let { code, data, msg } = await this.$api.getShopIncomeApply(params, this.appToken);
            this.subLoading = false;
            if(code == 200) {
                this.$Dialog.succeed({
                    title: '提现申请已提交',
                    content: '请耐心等待平台审核',
                    confirmText: '确定',
                    onConfirm: () => {
                        //console.log('[Dialog.succeed] confirm clicked');
                        this.value = '';
                    },
                })
            } else {
                this.$Dialog.failed({
                    title: '提现申请提交失败',
                    content: msg || '请稍后重新提交',
                    confirmText: '确定',
                    onConfirm: () => {
                        //console.log('[Dialog.succeed] confirm clicked');
                        this.value = '';
                        this.initData();
                    },
                })
            }
        },
        async initData() {
            this.$Toast.loading("Loading...");
            await this.getShopWithdrawInfo();
            this.$Toast.hide();
        },
        async initLoadRefresh(callback) {
            await this.getShopWithdrawInfo();
            callback && callback();
        },
        async getShopWithdrawInfo() {
            let { code, data = {} } = await this.$api.getShopWithdrawInfo(this.appToken);
            if(code == 200) {
                this.withdrawInfo = {
                    ...data,
                    price: Number(data.price) / 100
                }
            }
            
        }
    },
    mounted() {
        this.initData();
    }
}
</script>
<style lang="scss" scope>
.withdraw-wrapper {
    .md-field {
        padding-bottom: 20px;
        border-radius: 0;
        .md-field-title {
            .value {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                .field-operator {
                    display: flex;
                    align-items: center;
                }
            }
        }
        .md-field-item-content::before {
            background-color: #C5CAD5;
        }
        .input-operator {
            font-size: 28px;
            color: #5878B4;
        }
    }
    .withdraw-submit {
        padding: 60px 0 24px 0;
    }
    .withdraw-wrapper__holder {
        display: block;
        width: 88px;
        height: 88px;
        border-radius: 44px;
        background-color: #fff;
        line-height: 88px;
        text-align: center;
        .iconfont {
            color: #108ee9;
            font-size: 92px;
        }
    }
}
.withdraw-desc {
    padding: 120px 32px 32px;
    .withdraw-desc__title {
        font-size: 26px;
        color: #333;
        margin-bottom: 12px;
    }
    .withdraw-desc__list {
        font-size: 26px;
        color: #666;
    }
}
</style>