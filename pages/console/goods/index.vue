<template>
    <app-scroll-view
        class="app-console-goods"
        :isLoadRefresh="true"
        @loadRefresh="initLoadRefresh">
        <app-header slot="app-header"/>
        <!-- 商家 - 商品管理 -->
        <div v-if="goodsList.length > 0" class="console-goods-container">
            <div class="console-goods__list">
                <md-field title="货架列表">
                    <div class="action-container" slot="action">
                        你还可以发布 {{totalBenchOffCount}} 个商品
                    </div>
                    <div :class="['console-goods__item', {'row-bottom-line': $index != goodsList.length - 1}]" :key="$index" v-for="(item, $index) in goodsList">
                        <div class="item-body">
                            <div v-if="item.shelfStatus != 0" class="item-body-on">
                                <div class="item-body__img">
                                    <img v-lazy="item.shelfImage" :src="item.shelfImage" alt="">
                                </div>
                                <div class="item-body__desc">
                                    <p class="title">{{item.shelfName}}</p>
                                    <div class="stock-remaining">库存：{{item.stock}}</div>
                                    <div class="stock-leased">租用中：{{item.stockTotal - item.stock || 0}}</div>
                                    <div class="price"><i>&yen; </i>{{$Utils.formatMoney(item.minPrice)}} ~ {{$Utils.formatMoney(item.maxPrice)}}</div>
                                </div>
                            </div>
                            <div v-else class="item-body-off">
                                <md-button type="link" @click="$router.push(`/console/goods/add/${item.id}`)">
                                    <md-icon name="edit" size="md"></md-icon>发布商品
                                </md-button>
                            </div>
                        </div>
                        <div class="item-footer">
                            <div class="item-footer__status">
                                状态：
                                <span :class="`status-code-${item.shelfStatus}`">
                                    {{$Utils.transShelfStatus(item.shelfStatus)}}
                                </span>
                            </div>
                            <div class="item-footer__control">
                                <md-button :inactive="item.shelfStatus == 0" @click="editGoods(item.id, item.goodsId)" type="link">{{item.shelfStatus == 4 ? '更新密码' : '编辑'}}</md-button>
                                <md-button v-if="item.shelfStatus == 1" :inactive="item.shelfStatus == 0" @click="takeOnGoods(item.id)" type="link">上架</md-button>
                                <md-button v-else :inactive="item.shelfStatus == 0" @click="takeOffGoods(item.id)" type="link" :style="`color:${item.shelfStatus != 0?'#ff5257':'none'}`">下架</md-button>
                                <md-button :inactive="item.shelfStatus == 0 || item.shelfStatus == 2" @click="deleteGoods(item.id)" type="link" :style="`color:${(item.shelfStatus != 0 || item.shelfStatus != 2)?'none':'#ff5257'}`">删除</md-button>
                            </div>
                        </div>
                    </div>
                </md-field>
            </div>
        </div>
        <md-result-page
            v-else
            class="empty-result-wrapper"
            :img-url="`${require('~/static/icons/main_loading.png')}`"
            text="正在努力加载中..."
            subtext="">
        </md-result-page>
        <!-- <md-button @click="$router.push('/console/goods/add')" type="primary">前往发布商品</md-button> -->
    </app-scroll-view>
</template>
<script>
import { Icon, ResultPage } from 'mand-mobile'
export default {
    name: 'app-console-goods',
    head () {
        return {
            title: '货架管理 - 店铺工作台',
            meta: [
                { hid: 'description', name: 'description', content: '号子短租，货架管理' }
            ]
        }
    },
    components: {
        [Icon.name]: Icon,
        [ResultPage.name]: ResultPage
    },
    fetch({store, route, params}) {
        store.commit('SET_HEAD_TITLE', '货架管理');
        store.commit('SET_IS_HOME', false);
    },
    computed: {
        getAppToken() {
            return this.$store.state.user.token
        },
        //货架空闲数量
        totalBenchOffCount() {
            let list = this.goodsList.filter(item => {
                return item.shelfStatus == 0
            })
            return list.length;
        }
    },
    data() {
        return {
            menuConfig: [],
            // menuConfig: [
            //     {
            //         icon: 'icon-release',
            //         desc: '发布商品',
            //         eventCode: 'other',
            //         callback: () => {
            //             this.$router.push('/console/goods/add')
            //         }
            //     }
            // ],
            goodsList: []
        }
    },
    created() {
        this.$store.commit('SET_HEAD_MENU_CONFIG', this.menuConfig);
    },
    methods: {
        async getGoodsList() {
            let res = await this.$api.getBenchGoods(this.getAppToken);
            let { data = [] } = res;
            this.goodsList = data || [];
        },
        async initLoadRefresh(callback) {
            await this.getGoodsList();
            callback && callback();
        },
        editGoods(id, goodsId) {
            this.$router.push({
                path: `/console/goods/edit/${id}`,
                query: {
                    goodsId
                }
            });
        },
        async takeOnGoods(id) {
            this.$Toast.loading('Loading...');
            let { code, msg } = await this.$api.setBenchGoodsOn(id, this.getAppToken);
            this.$Toast.hide();
            if(code == 200) {
                //this.$Toast.info('上架成功');
                this.getGoodsList();
            } else {
                this.$Toast.failed(msg)
            }
        },
        async takeOffGoods(id) {
            this.$Toast.loading("Loading...");
            let {code, msg} = await this.$api.setBenchGoodsOff(id, this.getAppToken);
            this.$Toast.hide();
            if(code == 200) {
                //this.$Toast.info('下架成功');
                this.getGoodsList();
            } else {
                this.$Toast.failed(msg);
            }
        },
        deleteGoods(id) {
            this.$Dialog.confirm({
                title: '提示',
                content: '请确认是否删除当前商品',
                confirmText: '确定',
                onConfirm: async () => {
                    console.log("删除" + id);
                    this.$Toast.loading("Loading...");
                    let { code, msg } = await this.$api.setBenchGoodsDel(id, this.getAppToken);
                    this.$Toast.hide();
                    if(code == 200) {
                        //this.$Toast.info('删除成功');
                        this.getGoodsList();
                    } else {
                        this.$Toast.failed(msg);
                    }
                },
            })
        }
    },
    mounted() {
        this.getGoodsList();
    },
}
</script>
<style lang="scss" scope>
.console-goods__list {
    padding: 32px;
    .md-field {
        border-radius: 16px;
        padding-bottom: 16px;
    }
    .action-container {
        font-size: 26px;
    }
}
.console-goods__item {
    width: 100%;
    margin-bottom: 32px;
    &:last-child {
        margin-bottom: 0;
    }
    // border: 1px solid red;
    .item-body {
        margin-bottom: 16px;
    }
    .status-code-0, status-code-1, status-code-2, status-code-3, status-code-4, status-code-5, status-code-6 {
        color: #666;
    }
    .status-code-4 {
        color: rgb(255, 82, 87);
    }
    .item-body-on {
        display: flex;
    }
    .item-body-off {
        height: 172px;
        border: 1px solid #ddd;
        border-radius: 8px;
        display: flex;
        justify-content: center;
        align-items: center;
        .md-button.link {
            color: #999;
        }
    }
    .item-body__img {
        width: 172px;
        height: 172px;
        padding: 16px;
        img {
            width: 100%;
            height: auto;
            border-radius: 50%;
        }
    }
    .item-body__desc {
        flex: 1;
        position: relative;
        padding-left: 24px;
        .title {
            color: #333;
            font-size: 28px;
            font-weight: bold;
            @include overflow-ellipsis(2);
        }
        .stock-remaining, .stock-leased, .price {
            font-size: 26px;
            position: absolute;
        }
        .stock-remaining {
            color: #666;
            bottom: 36px;
        }
        .stock-leased {
            color: #666;
            bottom: 0;
        }
        .price {
            color: $app-primary-color;
            right: 0;
            bottom: 0;
            i {
                font-size: 22px;
                font-style: normal;
            }
        }
    }
    .item-footer {
        font-size: 26px;
        padding: 16px 0;
        display: flex;
        align-content: center;
        justify-content: space-between;
        // border-top: 1px solid #e2e4ea;
    }
}
.empty-result-wrapper {
    height: 50vh;
}
</style>