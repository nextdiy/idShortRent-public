<template>
    <app-scroll-view
        class="app-container"
        :isLoadRefresh="true"
        @loadRefresh="onLoadRefreshList"
        :isLoadMore="true"
        :isFinished="isFinished"
        @loadMore="onLoadMore">
        <app-header slot="app-header" :menu="menuConfig" />
        <app-search-bar 
            slot="app-other"
            placeHolder="请输入商品名称/订单号"
            :isClose="true"
            :visiabled.sync="isSearch"
            :content.sync="searchConent" 
            @change="handleDebounce"
            @search="handleSearchSubmit" />
        <div v-show="!isSearch" class="order-tabs">
            <md-tab-bar
                v-model="current"
                :items="orderTabs"
                :ink-length="80"
                @change="selectedOnChange($event)"
                />
        </div>
        <div class="order-content">
            <div v-if="orderList.length > 0" class="order-content__list">
                <app-order-item :linkTo="`/order/detail/${item.id}`" :orderItem="item" :key="$index" v-for="(item, $index) in orderList" />
            </div>
            <md-result-page 
                v-else
                text="你还没有相关订单 ^_^" 
                :img-url="`${require('~/static/icons/empty.png')}`"
                subtext="快去看看哪些有需要的" 
                class="app-empty-result">
            </md-result-page>
        </div>
    </app-scroll-view>
</template>
<script>
import { ResultPage } from 'mand-mobile'
import AppSearchBar from '~/components/AppSearchBar'
import AppOrderItem from '~/components/AppOrderItem'
export default {
    name: 'app-order',
    middleware: 'auth',
    head () {
        return {
            title: '你的订单 - VIP，随租随用，用短租',
            meta: [
                { hid: 'description', name: 'description', content: '号子短租，你的订单，订单列表，订单中心' }
            ]
        }
    },
    loading: false,
    fetch({store, route, params}) {
        store.commit('SET_HEAD_TITLE', '你的订单');
        store.commit('SET_IS_HOME', false);
    },
    components: {
        'app-search-bar': AppSearchBar,
        'app-order-item': AppOrderItem,
        [ResultPage.name]: ResultPage
    },
    computed: {
        getAppToken() {
            return this.$store.state.user.token
        },
        orderList() {
            return this.isSearch ? this.searchOrderList : this.defaultOrderList;
        }
    },
    created() {
        //搜索自动提交防抖
       this.handleDebounce = this.$Utils.debounce(this.handleSearchByDebounce, 800);
        //点击请求节流
        this.handleGetOrderList = this.$Utils.throttle(this.getOrderList, 3000);
    },
    data() {
        return {
            menuConfig: [
                {
                    icon: 'icon-suosou',
                    desc: '搜索订单',
                    eventCode: 'search',
                    callback: this.searchCallback
                }
            ],
            current: 1,
            orderTabs: [
                {name: 1, label: '全部订单', statusIds: null},
                {name: 2, label: '待付款', statusIds: [1]},
                {name: 3, label: '租用中', statusIds: [2, 10]},
                {name: 4, label: '已完成', statusIds: [3, 11]},
                {name: 5, label: '其他', statusIds: [4, 5, 6, 7, 12]}
                //1:待付款、2:出租中、3:交易成功、4:已取消、5:退货中、6:退货成功、7:退货失败
            ],
            defaultOrderList: [],
            searchOrderList: [],
            isSearch: false,
            searchConent: '',
            //防抖 setTimeout
            stockTimer: null,
            pageParams: {},
            tabStatusIds: [], //当前选择tab状态
            //数据是否加载完毕
            isFinished: true,
        }
    },
    methods: {
        searchCallback() {
            this.isSearch = true;
        },
        selectedOnChange(item, index, prevIndex) {
            this.defaultOrderList = [];
            let status = item.statusIds ? item.statusIds.join(',') : null
            let params = {
                status
            }
            this.tabStatusIds = status;
            this.handleGetOrderList(params);
        },
        handleSearchSubmit(val) {
            if(!val) return;
            this.searchOrderList = [];
            let params = {
                name: val
            }
            this.handleGetOrderList(params);
        },
        handleSearchByDebounce(val) {
            console.log("hei " + val)
            if(!val) return;
            this.searchOrderList = [];
            let params = {
                name: val
            }
            this.getOrderList(params);
        },
        async getOrderList(params = null) {
            //this.pageParams = params;
            this.$Toast.loading("Loading...");
            try {
                let { code, data } = await this.$api.getOrderList(params, this.getAppToken);
                this.$Toast.hide();
                if(code == 200) {
                    console.log(data);
                    let { page = 1, total = 0, list = []} = data;
                    this.pageParams['page'] = page;
                    this.pageParams['total'] = total;
                    //标志订单列表是否已加载完
                    this.isFinished = page >=total;
                    let tempOrderList = this.isSearch ? this.searchOrderList : this.defaultOrderList;
                    tempOrderList.push(...list);
                } else {
                    this.$Dialog.failed({
                        title: '提示',
                        content: '获取订单信息失败，请重试',
                        cancelText: '取消',
                        confirmText: '确定',
                        onConfirm: () => {
                            this.getOrderList(params);
                        }
                    })
                }
            } catch (error) {
                //this.$Toast.hide();
            }
        },
        onLoadRefreshList(callback) {
            if(this.isSearch && this.searchConent.length <= 0) {
                callback && callback();
                return ;
            }
            setTimeout(async () => {
                this.isSearch ? this.searchOrderList = [] : this.defaultOrderList = [];
                this.pageParams = this.isSearch ? { name: this.searchConent } : { status: this.tabStatusIds };
                await this.getOrderList(this.pageParams);
                callback && callback();
            }, 300)
        },
        async onLoadMore(callback) {
            if(this.isFinished) {
                return;
            }
            let { page = null } = this.pageParams;
            let params = {
                ...this.pageParams,
                page: page ? page + 1 : 1,
                status: this.tabStatusIds
            }
            await this.getOrderList(params);
            callback && callback();
        }
    },
    async mounted() {
        await this.getOrderList();
    }
}
</script>
<style lang="scss">
.order-tabs {
    .md-tab-bar {
        background-color: #fff;
        padding-left: 0;
        padding-right: 0;
    }
    .md-tab-bar-ink {
        background-color: $app-primary-color;
    }
    .md-tab-bar-item.is-active {
        color: $app-primary-color;
    }
}
</style>
<style lang="scss" scope>
.order-content {
    padding: 32px 32px 0 32px;
    .app-empty-result {
        height: 50vh;
        .md-result-text {
            font-size: 28px;
            color: #666;
        }
    }
}
</style>