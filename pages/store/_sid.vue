<template>
    <app-scroll-view
        :isLoadRefresh="true"
        @loadRefresh="initLoadRefresh"
        class="app-container">
        <app-header 
            slot="app-header" 
            :menu="menuConfig" 
            :backgroundImg="require('~/static/img/default_store_bg.png')"/>
        <div class="store-background" :style="`background-image: url(${require('~/static/img/default_store_bg.png')})`"></div>
        <div class="store-show-box">
            <div class="store-show__info">
                <div class="info-wrapper">
                    <div class="info-wrapper-top">
                        <div class="info-wrapper__logo">
                            <img :src="shopAvatar" :alt="`${shopDetails.shopName}`">
                        </div>
                        <div class="info-wrapper__box">
                            <div class="info-wrapper__title">
                                <span class="title">{{shopDetails.shopName || '无名店铺'}}<small>Lv.{{shopDetails.shopLevel || 0}}</small></span>
                            </div>
                            <p class="info-wrapper__notice">
                                公告：{{shopDetails.shopIntroduce || '店主太懒了,还没有公告~~'}}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 商家货架 -->
            <div v-if="goodsList.length > 0" class="store-show-recommend">
                <div class="recommend-title">
                    <h4>商家货架</h4>
                </div>
                <div class="recommend-box">
                    <div class="recommend-box__list">
                        <app-goods-item :key="$index" v-for="(item,$index) in goodsList" :goodsItem="item" />
                    </div>
                </div>
            </div>
            <md-result-page 
                v-else
                text="该店铺目前还没有上架商品 ^_^" 
                :img-url="`${require('~/static/icons/empty.png')}`"
                subtext="" 
                class="app-empty-result">
            </md-result-page>
        </div>
        <!-- 客服窗口 -->
        <app-customer 
            slot="app-other"
            :isPopup.sync="isPopupShow" 
            :customerInfo="shopDetails"
            @close="handleClosePopup" />
    </app-scroll-view>
</template>
<script>
import { ResultPage } from 'mand-mobile';
import AppCustomer from '~/components/AppCustomer.vue'
import AppGoodsItem from '~/components/AppGoodsItem'
export default {
    name: 'app-store',
    head () {
        return {
            title: `店铺主页 - ${this.shopDetails.shopName}`,
            meta: [
                { hid: 'keywords', name: 'keywords', content: `${this.shopDetails.shopName}` },
                { hid: 'description', name: 'description', content: `${this.shopDetails.shopIntroduce || '店主太懒了,还没有公告~~'}` },
                { hid: 'sharename', name: 'sharename', itemprop: 'name', content: `店铺主页 - ${this.shopDetails.shopName}`},
                { hid: 'shareimage', name: 'shareimage', itemprop: 'image', content: `${this.shopDetails.shopAvatar}`},
                { hid: 'shareogimage', name: 'shareogimage', property: 'og:image', content: `${this.shopDetails.shopAvatar}` },
                { hid: 'sharedesc', name: 'sharedesc', itemprop: 'description', content: '给你推荐个店铺，快来看看吧~~' }
            ]
        }
    },
    fetch({store, route, params}) {
        store.commit('SET_HEAD_TITLE', '店铺主页');
        store.commit('SET_IS_HOME', false);
    },
    validate ({ params }) {
        // Must be a number
        return /^\d+$/.test(params.sid)
    },
    async asyncData({ app, params }) {
        let sid = params.sid;
        try {
            //店铺信息
            let shopRes = await app.$api.getShopDetail(sid);
            let { data: shopData = {} } = shopRes;
            //店铺商品
            let goodsRes = await app.$api.getShopGoodsList(sid);
            let { data: goodsData = [] } = goodsRes;
            return {
                shopDetails: shopData,
                goodsList: goodsData
            }
        } catch (error) {
            return {
                shopDetails: {},
                goodsList: []
            }
        }
    },
    components: {
        'app-customer': AppCustomer,
        'app-goods-item': AppGoodsItem,
        [ResultPage.name]: ResultPage,
    },
    computed: {
        shopAvatar() {
            return /^(http|https)/.test(this.shopDetails.shopAvatar) ? this.shopDetails.shopAvatar : require('~/static/icons/store_avatar.png');
        }
    },
    data() {
        return {
            menuConfig: [
                {
                    icon: 'icon-customer',
                    desc: '客服',
                    eventCode: 'other',
                    callback: this.openCustomerBox
                },
            ],
            goodsList: [],
            isPopupShow: false,
            shopDetails: {}
        }
    },
    methods: {
        openCustomerBox() {
            this.isPopupShow = true;
        },
        handleClosePopup(bool) {
            this.isPopupShow = bool;
        },
        async initLoadRefresh(callback) {
            let {sid} = this.$route.params;
            try {
                //店铺商品
                let goodsRes = await app.$api.getShopGoodsList(sid);
                let { data: goodsData = [] } = goodsRes;
                return {
                    goodsList: goodsData
                }
                callback && callback();
            } catch (error) {
                console.log(error);
                callback && callback();
            }
        }
    }
}
</script>
<style lang="scss" scope>
.app-container {
    position: relative;
    .store-background {
        width: 100%;
        height: 310px;
        // position: absolute;
        // top: 0;
        //background-image: url('~static/img/store.png');
        background-repeat: no-repeat;
        background-size: 100% auto;
        background-position: 0 -132px;
        overflow: hidden;
    }
}
.store-show-box {
    // position: absolute;
    // top: 180px;
    width: 100%;
    padding: 0 32px;
    z-index: 99;
    transform: translateY(-130px);
    .store-show__info {
        .info-wrapper {
            background-color: #fff;
            border-radius: 16px;
            padding: 24px;
        }
        .info-wrapper-top {
            display: flex;
        }
        .info-wrapper__logo {
            width: 148px;
            height: 148px;
            border-radius: 50%;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
            background: #eef3fa;
            img {
                width: 100%;
                height: auto;
            }
        }
        .info-wrapper__box {
            flex: 1;
            padding-left: 24px;
            .info-wrapper__title {
                color: #333;
                font-size: 34px;
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
}
.store-show-recommend {
  padding-top: 32px;
  .recommend-title {
    height: 30px;
    margin-bottom: 24px;
  }
  .recommend-title h4 {
    font-size: 28px;
  }
  .recommend-box__item {
    width: 100%;
    height: 236px;
    background-color: #fff;
    border-radius: 16px;
    margin-bottom: 24px;
    font-size: 28px;
    display: flex;
    .item-left {
      width: 236px;
      padding: 24px;
    }
    .item-right {
      flex: 1;
      position: relative;
    }
    .item-left__icon {
      width: 100%;
      height: auto;
    }
    .item-right__title {
      padding: 24px 24px 16px 0;
      p {
        color: #333;
        font-size: 28px;
        height: 72px;
        font-weight: bold;
        overflow:hidden;
        @include overflow-ellipsis(2);
      }
    }
    .item-right__spec, .item-right__price {
      font-size: 26px;
    }
    .item-right__spec {
      color: #666;
      position: absolute;
      bottom: 66px;
    }
    .item-right__price {
      color: $app-primary-color;
      position: absolute;
      bottom: 24px;
      i {
        font-size: 22px;
        font-style: normal;
      }
    }
    .item-right__subbtn {
      position: absolute;
      right: 24px;
      bottom: 24px;
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
</style>