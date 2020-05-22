<template>
    <app-scroll-view
        class="console-income-container"
        :isLoadRefresh="true"
        @loadRefresh="initLoadRefresh">
        <app-header slot="app-header"/>
        <!-- <md-notice-bar
                mode="closable"
                icon="volumn"
                scrollable
                >
                公告：每天凌晨0:00更新结算收益
            </md-notice-bar> -->
        <div class="income-wrapper">
            
            <div class="total-balance">
                <p class="title">总余额</p>
                <span class="amount">
                    <small>&yen;</small>
                    <md-amount
                        :value="shopIncome.totalPrice || 0"
                        :duration="500"
                        transition />
                </span>
                <span class="amount-unsettle">（ 未结算： <small>&yen; </small>{{shopIncome.unSettlement || 0}} ）</span>
            </div>
        </div>
        <div class="income-menu-list">
            <md-field>
                <md-cell-item @click="$router.push({path:'/console/income/withdraw'})" title="可提现" :addon="`￥${shopIncome.settlement || 0}`" arrow>
                    <div class="income-menu__item" slot="left">
                        <i class="iconfont icon-tixian"></i>
                    </div>
                </md-cell-item>
                <md-cell-item @click="$router.push({path:'/console/income/detail'})" title="收益明细" arrow>
                    <div class="income-menu__item" slot="left">
                        <i class="iconfont icon-income-desc"></i>
                    </div>
                </md-cell-item>
            </md-field>
        </div>
    </app-scroll-view>
</template>
<script>
import { Icon, NoticeBar } from 'mand-mobile'
export default {
    name: 'app-console-income',
    head () {
        return {
            title: '收益管理 - 店铺工作台',
            meta: [
                { hid: 'description', name: 'description', content: '号子短租，收益管理' }
            ]
        }
    },
    components: {
        [Icon.name]: Icon,
        [NoticeBar.name]: NoticeBar,
    },
    fetch({store, route, params}) {
        store.commit('SET_HEAD_TITLE', '收益管理');
        store.commit('SET_IS_HOME', false);
    },
    data() {
        return {
            shopIncome: {}
        }
    },
    created() {
        this.$store.commit('SET_HEAD_MENU_CONFIG', []);
    },
    mounted() {
       this.initData();
    },
    methods: {
        async initData() {
            this.$Toast.loading("Loading...");
            await this.getShopIncomeInfo();
            this.$Toast.hide();
        },
        async initLoadRefresh(callback) {
            await this.getShopIncomeInfo();
            callback && callback();
        },
        async getShopIncomeInfo() {
            let { code, data = {} } = await this.$api.getShopIncomeInfo(this.appToken);
            console.log(data)
            if(code == 200) {
                console.log(data);
                this.shopIncome = {
                    totalPrice: Number(this.$Utils.formatMoney(data.totalPrice || 0)),
                    unSettlement: this.$Utils.formatMoney(data.unSettlement || 0),
                    settlement: this.$Utils.formatMoney(data.settlement || 0)

                }
            }
        }
    },
    computed: {
        appToken() {
            return this.$store.state.user.token;
        }
    }
}
</script>
<style lang="scss">
.income-menu-list {
    .md-field {
        border-radius: 16px;
        padding: 0 24px;
    }
    .md-cell-item-body {
        padding: 24px 0;
    }
}
</style>
<style lang="scss" scope>
.income-wrapper {
    // min-height: 250px;
    background-color: $app-primary-color;
    padding: 32px;
    // margin-bottom: 32px;
    .total-balance {
        color: #fff;
        display: flex;
        flex-direction: column;
        .title {
            font-size: 28px;
            margin-bottom: 32px;
        }
        .amount {
            small {
                font-size: 54px;
            }
            font-size: 80px;
            margin-bottom: 12px;
        }
        .amount-unsettle {
            font-size: 32px;
        }
    }
}
.income-menu-list {
    background-color: #fff;
    .md-cell-item-left {
        margin-right: 16px;
    }
    .md-cell-item-content {
        font-size: 28px;
    }
    .income-menu__item {
        .iconfont {
            color: #333;
            font-size: 64px;
        }
    }
}
</style>