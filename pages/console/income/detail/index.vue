<template>
    <app-scroll-view
        class="withdraw-desc-container"
        :isLoadRefresh="true"
        @loadRefresh="initLoadRefresh">
        <app-header slot="app-header"/>
        <div v-if="incomeDetails.length > 0" class="withdraw-desc-wrapper">
            <md-field>
                <md-cell-item 
                    :key="item.id" 
                    v-for="(item, $index) in incomeDetails" 
                    :title="item.remark" 
                    :brief="`${$Utils.formatTime(item.createTime)}`"
                    :no-border="$index === incomeDetails.length - 1">
                    <span :class="['holder', {'holder-expend':item.type == 2}]" slot="left">
                        <i :class="['iconfont', [item.type == 1 ? 'icon-zhuanru':'icon-zhuanchu']]"></i>
                    </span>
                    <span :class="['amount', {'amount-expend':item.type == 2}]" slot="right">
                       {{item.type == 1 ? '+' : '-'}} {{$Utils.formatMoney(item.price)}}
                    </span>
                </md-cell-item>
                <!-- <md-cell-item title="订单交易收入 - 独享百度网盘超级会员（一天）" brief="2020-03-12 22:00:08">
                    <span class="holder" slot="left">
                        <i class="iconfont icon-zhuanru"></i>
                    </span>
                    <span class="amount" slot="right">
                        + 1.20
                    </span>
                </md-cell-item> -->
            </md-field>
        </div>
        <md-result-page 
            v-else
            text="店铺目前还没有收益 ^_^" 
            :img-url="`${require('~/static/icons/empty.png')}`"
            subtext="需要稍微继续努力一下" 
            class="app-empty-result">
        </md-result-page>
    </app-scroll-view>
</template>
<script>
import { ResultPage } from 'mand-mobile';
export default {
    name: 'app-console-withdraw',
    head () {
        return {
            title: '收益明细 - 店铺工作台',
            meta: [
                { hid: 'description', name: 'description', content: '号子短租，收益明细' }
            ]
        }
    },
    fetch({store, route, params}) {
        store.commit('SET_HEAD_TITLE', '收益明细');
        store.commit('SET_IS_HOME', false);
    },
    components: {
        [ResultPage.name]: ResultPage,
    },
    data() {
        return {
            incomeDetails: []
        }
    },
    created() {
        this.$store.commit('SET_HEAD_MENU_CONFIG', []);
    },
    computed: {
        appToken() {
            return this.$store.state.user.token;
        }
    },
    methods: {
        async initData() {
            this.$Toast.loading("Loading...");
            await this.getShopIncomeDetails();
            this.$Toast.hide();
        },
        async initLoadRefresh(callback) {
            await this.getShopIncomeDetails();
            callback && callback();
        },
        async getShopIncomeDetails() {
            let { code, data = [] } = await this.$api.getShopIncomeDetails(this.appToken);
            if(code == 200) {
                console.log(data);
                this.incomeDetails = data || [];
            }
        }
    },
    mounted() {
        this.initData();
    }
}
</script>
<style lang="scss" scope>
.withdraw-desc-container {
    .withdraw-desc-wrapper {
        .md-field {
            padding: 16px 32px;
            .md-cell-item-title {
                @include overflow-ellipsis(1);
            }
            .holder {
                display: block;
                width: 64px;
                height: 64px;
                border-radius: 32px;
                background-color: $app-primary-color;
                line-height: 64px;
                text-align: center;
                .iconfont {
                    color: #fff;
                    font-size: 42px;
                }
            }
            .amount {
                color: $app-primary-color;
                font-size: 30px;
            }
            .holder-expend {
                background-color: #67C23A;
            }
            .amount-expend {
                color: #67C23A;
            }
        }
    }
    .app-empty-result {
        height: 50vh;
        .md-result-text {
            font-size: 28px;
            color: #666;
        }
    }
}

</style>