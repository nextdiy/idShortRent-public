<template>
    <app-scroll-view
        class="app-search-container"
        :isLoadMore="true"
        :isFinished="isFinished"
        @loadMore="getSearchListByPage">
        <app-header/>
        <app-search-bar
            placeHolder="请输入搜索内容"
            :visiabled.sync="isSearch"
            :content.sync="searchConent"
            @search="handleSearchSubmit" />
        <div v-if="searchGoodsList.length > 0" class="search-goods-list">
            <app-goods-item :key="$index" v-for="(item,$index) in searchGoodsList" :goodsItem="item" />
        </div>
        <md-result-page
          v-else
          :img-url="`${require('~/static/icons/empty.png')}`"
          text="这里空空如也 ^_^" 
          subtext="快去开通店铺发布你的闲置账号吧"
          class="recommend-box__list app-empty-result">
        </md-result-page>
    </app-scroll-view>
</template>
<script>
import {ResultPage} from 'mand-mobile';
import AppSearchBar from '~/components/AppSearchBar';
import AppGoodsItem from '~/components/AppGoodsItem'
export default {
    name: 'app-search',
    head () {
        return {
            title: '商品搜索 - VIP，随租随用，用短租',
            meta: [
                { hid: 'description', name: 'description', content: '号子短租，商品搜索' }
            ]
        }
    },
    fetch({store, route, params}) {
        store.commit('SET_HEAD_TITLE', '');
        store.commit('SET_IS_HOME', false);
    },
    components: {
        [ResultPage.name]: ResultPage,
        'app-search-bar': AppSearchBar,
        'app-goods-item': AppGoodsItem
    },
    data() {
        return {
            isSearch: true,
            searchConent: '',
            searchGoodsList: [],
            pageParams: {},
            isFinished: true,
        }
    },
    methods: {
        handleSearchSubmit() {
            console.log(this.searchConent);
            let params = {
                goodsName: this.searchConent
            };
            this.getRecommendGoodsList(params);
        },
        getSearchListByPage(callback) {
            if(this.isFinished) {
                return;
            }
            let { page, goodsName = '' } = this.pageParams;
            let params = {
                goodsName,
                page: page ? page + 1 : 1
            }
            this.getRecommendGoodsList(params);
            callback && callback();
        },
        async getRecommendGoodsList(params) {
            if(!params.goodsName) {
                this.$Toast.failed("请输入搜索内容");
                return;
            }
            try {
                this.$Toast.loading("Loading...");
                let { code, data } = await this.$api.getRecommendGoodsList(params);
                this.$Toast.hide();
                if(code == 200) {
                    let {page = 1, total = 1, list = []} = data;
                    this.pageParams = {
                        goodsName: params.goodsName,
                        page,
                        total
                    }
                    this.isFinished = page >= total;
                    this.searchGoodsList = list;
                }
            } catch (error) {
                console.error(error);
            }
        }
    }
}
</script>
<style lang="scss" scope>
.app-search-container {
    .app-empty-result {
        height: 50vh;
        border-radius: 16px;
        padding: 24px;
        display: flex;
        align-items: center;
        .md-result-text {
            font-size: 28px;
            color: #666;
        }
    }
    .search-goods-list {
        padding: 32px;
    }
}
    
</style>