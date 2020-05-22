<template>
    <app-scroll-view
        class="console-container"
        :isLoadRefresh="true"
        @loadRefresh="initLoadRefresh">
        <app-header slot="app-header"/>
        <div class="console-store__info">
            <md-skeleton avatar title :loading="pageLoading" :row="2" avatar-size="lg" class="info-wrapper">
                <div class="info-wrapper-top">
                    <div class="info-wrapper__logo">
                        <img :src="shopAvatar" :alt="`${benchDetail.shopName}`">
                    </div>
                    <div class="info-wrapper__box">
                        <div class="info-wrapper__title">
                            <span class="title">
                                {{benchDetail.shopName}}
                                <small v-if="benchDetail.shopLevel">Lv.{{benchDetail.shopLevel}}</small>
                            </span>
                        </div>
                        <div class="info-wrapper__notice">ID: {{benchDetail.id}}</div>
                    </div>
                    <div class="info-wrapper__edit">
                        <md-button @click="$router.push(`/console/edit`)" type="link" icon="edit" inline>店铺装修</md-button>
                    </div>
                </div>
            </md-skeleton>
        </div>
        <div class="console-order__report">
            <div class="report-choose-date row-bottom-line">
                <span class="this-date">日期：{{datePickerValue ? datePickerValue : '2020-01-01'}}</span>
                <md-button type="link" inline @click="isDatePickerShow = true">选择日期</md-button>
            </div>
            <div class="report-show-data">
                <div class="order-amount">
                    <small>订单金额</small>
                    <span>
                        <i>&yen;</i>
                        <md-amount
                            :value="dayData.totalPrice"
                            :duration="500"
                            transition />
                    </span>
                </div>
                <div class="column-left-line"></div>
                <div class="order-num">
                    <small>订单数量</small>
                    <span>{{dayData.orderCount || 0}}</span>
                </div>
            </div>
        </div>
        <div class="console-menu__list">
            <md-field>
                <md-cell-item @click="$router.push({path:'/console/order', query:{type:0}})" title="全部订单" arrow>
                    <div class="user-menu__item" slot="left">
                        <i class="iconfont icon-order"></i>
                    </div>
                </md-cell-item>
                <!-- <md-cell-item @click="$router.push({path:'/console/order', query:{type:1}})" title="投诉订单" arrow>
                    <div class="user-menu__item" slot="left">
                        <i class="iconfont icon-tousu"></i>
                    </div>
                </md-cell-item> -->
                <md-cell-item @click="$router.push('/console/goods')" title="货架管理" arrow>
                    <div class="user-menu__item" slot="left">
                        <i class="iconfont icon-goods-manager"></i>
                    </div>
                </md-cell-item>
                <md-cell-item @click="$router.push('/console/income')" title="收益管理" arrow no-border>
                    <div class="user-menu__item" slot="left">
                        <i class="iconfont icon-income"></i>
                    </div>
                </md-cell-item>
            </md-field>
        </div>
        <!-- 日期选择器 -->
        <div slot="app-other" class="app-date-picker">
            <md-date-picker
                ref="datePicker"
                v-model="isDatePickerShow"
                type="custom"
                title="选择日期"
                today-text="今天"
                :line-height="112"
                :min-date.sync="minDate"
                :max-date.sync="maxDate"
                :default-date.sync="currentDate"
                :custom-types="['yyyy', 'MM','dd']"
                @confirm="onDatePickerConfirm" />
        </div>
    </app-scroll-view>
</template>
<script>
import { DatePicker } from 'mand-mobile'
export default {
    name: 'app-console',
    middleware: 'auth',
    head () {
        return {
            title: '首页 - 店铺工作台',
            meta: [
                { hid: 'description', name: 'description', content: '号子短租，店铺工作台' }
            ]
        }
    },
    fetch({store, route, params}) {
        store.commit('SET_HEAD_TITLE', '店铺工作台');
        store.commit('SET_IS_HOME', false);
    },
    components: {
        [DatePicker.name]: DatePicker,
    },
    data() {
        return {
            pageLoading: false,
            minDate: undefined,
            maxDate: undefined,
            currentDate: undefined,
            isDatePickerShow: false,
            datePickerValue: '',
            dayData: {
                totalPrice: 0,
                orderCount: 0,
            }

        }
    },
    created() {
        this.$store.commit('SET_HEAD_MENU_CONFIG', []);
    },
    mounted() {
        this.initData();
    },
    computed: {
        appToken() {
            return this.$store.state.user.token;
        },
        benchDetail() {
            return this.$store.state.app.benchDetail;
        },
        shopAvatar() {
            let shopAvatar = this.benchDetail.shopAvatar;
            return /^(http|https)/.test(shopAvatar) ? shopAvatar : require('~/static/icons/store_avatar.png');
        }
    },
    methods: {
        async initData() {
            this.minDate = new Date('2020-2-20');
            this.maxDate = new Date();
            this.currentDate = new Date();
            this.datePickerValue = this.$Utils.formatDate(this.currentDate);
            //获取店铺信息
            try {
                //缓存存在则不加载
                if(!this.benchDetail.shopName) {
                    this.pageLoading = true;
                    await this.getBenchDetail();
                    this.pageLoading = false;
                }
                //店铺收益
                this.$Toast.loading("Loading...");
                await this.getShopIncomeByDay(this.datePickerValue);
                this.$Toast.hide();
            } catch (error) {
                this.pageLoading = false;
                //this.$Toast.hide();
            }
        },
        async initLoadRefresh(callback) {
            this.minDate = new Date('2020-2-20');
            this.maxDate = new Date();
            this.currentDate = new Date();
            this.datePickerValue = this.$Utils.formatDate(this.currentDate);
            //获取店铺信息
            await this.getBenchDetail();
            //店铺收益
            await this.getShopIncomeByDay(this.datePickerValue);
            callback && callback();
        },
        async onDatePickerConfirm(columnsValue) {
            //console.log(`[Mand Mobile] DatePicker Confirm\nvalue: ${JSON.stringify(columnsValue)}`)
            this.datePickerValue = this.$refs.datePicker.getFormatDate('yyyy-MM-dd');
            console.log(this.datePickerValue);
            this.$Toast.loading("Loading...");
            await this.getShopIncomeByDay(this.datePickerValue);
            this.$Toast.hide();
        },
        async getBenchDetail() {
            try {
                let {code, data = {}} = await this.$api.getBenchDetail(this.appToken);
                if(code == 200) {
                    //this.benchDetail = data || {};
                    this.$store.commit('app/SET_BENCH_DETAIL', data || {})
                }
            } catch (error) {
                console.log(error)
            }
        },
        async getShopIncomeByDay(day) {
            try {
                let {code, data} = await this.$api.getShopIncomeByDay(day, this.appToken);
                if(code == 200) {
                    this.dayData = {
                        ...data,
                        totalPrice: Number(data.totalPrice) / 100 || 0
                    };
                }
            } catch (error) {
                console.log(error);
            }
        }
        
    }
}
</script>
<style lang="scss">
.console-menu__list {
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
.console-store__info {
    .md-button.inline {
        padding: 0;
    }
}
</style>
<style lang="scss" scope>
.console-store__info {
    background-color: #fff;
    margin-bottom: 32px;
    .info-wrapper {
        height: 196px;
        padding: 24px 32px;
    }
    .info-wrapper-top {
        display: flex;
        position: relative;
    }
    .info-wrapper__logo {
        width: 148px;
        height: 148px;
        border-radius: 50%;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
            width: 100%;
            height: auto;
        }
    }
    .info-wrapper__box {
        flex: 1;
        padding-left: 24px;
        display: flex;
        justify-content: center;
        flex-direction: column;
        .info-wrapper__title {
            color: #333;
            font-size: 34px;
            font-weight: bold;
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
            // @include overflow-ellipsis(2);
        }
    }
    .info-wrapper__edit {
        position: absolute;
        right: 0;
        bottom: 8px;
    }
}
.console-order__report {
    background-color: #fff;
    color: #333;
    padding: 24px 32px;
    font-size: 30px;
    margin-bottom: 32px;
    .report-choose-date {
        padding-bottom: 16px;
    }
    .report-show-data {
        padding-top: 16px;
        display: flex;
        .order-amount, .order-num {
            flex: 1;
            height: 150px;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            small {
                font-size: 28px;
                color: #666;
                margin-bottom: 16px;
            }
            span {
                font-size: 48px;
                color: $app-primary-color;
                font-weight: bold;
            }
            i {
                font-style: normal;
                font-size: 36px;
            }
        }
    }
}
.console-menu__list {
    min-height: 150px;
    background-color: #fff;
    .md-cell-item-left {
        margin-right: 16px;
    }
    .md-cell-item-content {
        font-size: 28px;
    }
    .user-menu__item {
        .iconfont {
            color: #333;
            font-size: 64px;
        }
    }
}
</style>