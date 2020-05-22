<template>
    <app-scroll-view
        class="app-container"
        :isLoadRefresh="true"
        @loadRefresh="onLoadRefreshList"
        :isLoadMore="true"
        :isFinished="isFinished"
        @loadMore="onLoadMore">
        <app-header :menu="menuConfig" slot="app-header"/>
        <app-search-bar
            slot="app-other"
            placeHolder="请输入商品名称/订单号"
            :isClose="true"
            :visiabled.sync="isSearch"
            :content.sync="searchConent"
            @search="handleSearchSubmit" />
        <div v-show="!isSearch" class="order-tabs">
            <md-tab-bar
                v-model="currentTab"
                :items="orderTabs"
                :ink-length="80"
                @change="selectedOnChange"
                />
        </div>
        <div class="order-content">
            <div v-if="orderList.length > 0" class="order-content__list">
                <app-order-item :linkTo="`/console/order/detail/${item.id}`" :orderItem="item" :key="$index" v-for="(item, $index) in orderList" />
            </div>
            <md-result-page 
                v-else
                text="店铺还没有相关订单 ^_^" 
                :img-url="`${require('~/static/icons/empty.png')}`"
                :subtext="currentTab == 3 && !this.isSearch ? '你是最棒的，继续保持' : '还需要稍微努力一下'" 
                class="app-empty-result">
            </md-result-page>
        </div>
    </app-scroll-view>
</template>
<script>
import {ResultPage} from 'mand-mobile';
import AppSearchBar from '~/components/AppSearchBar';
import AppOrderItem from '~/components/AppOrderItem'
export default {
    name: 'console-order',
    head () {
        return {
            title: '订单列表 - 店铺工作台',
            meta: [
                { hid: 'description', name: 'description', content: '号子短租，店铺工作台' }
            ]
        }
    },
    loading: false,
    fetch({store, route, params}) {
        store.commit('SET_HEAD_TITLE', '订单列表');
        store.commit('SET_IS_HOME', false);
    },
    components: {
        [ResultPage.name]: ResultPage,
        'app-search-bar': AppSearchBar,
        'app-order-item': AppOrderItem
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
            currentTab: 1,
            orderTabs: [
                {name: 1, label: '全部订单', statusIds: null},
                {name: 2, label: '租用中', statusIds: [2]},
                {name: 3, label: '投诉订单', statusIds: [6, 7, 8]},
                {name: 4, label: '其他', statusIds: [1, 3, 4, 5]}
            ],
            defaultOrderList: [],
            searchOrderList: [],
            isSearch: false,
            searchConent: '',
            //防抖 setTimeout
            stockTimer: null,
            pageParams: {},
            tapStatusIds: [],
            isFinished: true
        }
    },
    created() {
        //console.log(this.$route.query);
        let { type = 0 } = this.$route.query;
        //this.currentTab = Number(type);
    },
    computed: {
        appToken() {
            return this.$store.state.user.token;
        },
        orderList() {
            return this.isSearch ? this.searchOrderList : this.defaultOrderList;
        }
    },
    methods: {
        searchCallback(val) {
            this.isSearch = true;
        },
        selectedOnChange(item, index, prevIndex) {
            console.log(item)
            this.defaultOrderList = [];
            let status = item.statusIds ? item.statusIds.join(',') : null;
            let params = {
                status
            }
            this.tapStatusIds = status;
            this.handleGetOrderList(params);
        },
        //防止点击过快，产生过多请求
        handleGetOrderList(params) {
            if(this.stockTimer) {
                clearTimeout(this.stockTimer);
            }
            this.stockTimer = setTimeout(() => {
                this.getShopOrderList(params);
            }, 300)
        },
        handleSearchSubmit(val) {
            //this.searchConent = val;
            this.searchOrderList = [];
            this.$Toast.info("搜索" + val);
            let params = {
                name: val
            }
            this.getShopOrderList(params);
        },
        async getShopOrderList(params = {}) {
            //this.pageParams = params;
            try {
                this.$Toast.loading("Loading...")
                let { code, data = {} } = await this.$api.getShopOrderList(params, this.appToken);
                this.$Toast.hide();
                if(code == 200) {
                    let { page = 1, total = 0, list = []} = data;
                    this.pageParams['page'] = page;
                    this.pageParams['total'] = total;
                    //标志订单列表是否已加载完
                    this.isFinished = page >=total;
                    let tempOrderList = this.isSearch ? this.searchOrderList : this.defaultOrderList;
                    tempOrderList.push(...list);
                }
            } catch (error) {
                console.log(error)
            }
        },
        async onLoadRefreshList(callback) {
            console.log("下拉刷新")
            if(this.isSearch && this.searchConent.length <= 0) {
                callback && callback();
                return ;
            }
            setTimeout(async () => {
                this.isSearch ? this.searchOrderList = [] : this.defaultOrderList = [];
                this.pageParams = this.isSearch ? { name: this.searchConent } : { status: this.tabStatusIds };
                await this.getShopOrderList(this.pageParams);
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
            await this.getShopOrderList(params);
            callback && callback();
        }
    },
    mounted() {
        this.getShopOrderList();
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
    padding: 32px;
    .app-empty-result {
        height: 50vh;
        .md-result-text {
            font-size: 28px;
            color: #666;
        }
    }
}
</style>