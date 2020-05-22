<template>
  <app-scroll-view 
    class="app-home-container" 
    :isLoadRefresh="true"
    @loadRefresh="getList" 
    :isLoadMore="true"
    :isFinished="isFinished"
    @loadMore="getListByPage">
    <app-header :menu="menuConfig" slot="app-header"/>
    <div class="app-home-swiper">
      <md-swiper
        :autoplay="5000"
        :is-prevent="false"
        ref="swiper">
        <md-swiper-item :key="$index" v-for="(item, $index) in swiperList">
          <img @click="linkTo(item.url)" :src="item.image" class="swiper-banner-item" :alt="item.title" />
        </md-swiper-item>
      </md-swiper>
    </div>
    <!-- 导航菜单 -->
    <div class="app-nav-menu">
      <md-notice-bar
        icon="warn"
        mode="closable"
        type="warning"
      >
      有问题请及时联系平台客服微信：Misser168
    </md-notice-bar>
      <div class="nav-menu__list">
        <a href="/recharge" class="nav-menu__item">
            <img src="~/static/icons/recharge.png" alt="会员直充">
            <span>会员直充</span>
        </a>
        <a href="/takeaway" class="nav-menu__item">
            <img src="~/static/icons/coupon.png" alt="外卖领券">
            <span>外卖领券</span>
        </a>
        <a href="javascript:;" @click="$Toast.info('该功能还在开发中...')"  class="nav-menu__item">
            <img src="~/static/icons/discount.png" alt="优惠资讯">
            <span>优惠资讯</span>
        </a>
        <a href="/search" class="nav-menu__item">
            <img src="~/static/icons/search.png" alt="商品搜索">
            <span>商品搜索</span>
        </a>
      </div>
    </div>
    <!-- 首页推荐 -->
    <div class="app-home-recommend">
      <!-- <div class="recommend-title">
        <h4>首页推荐</h4>
      </div> -->
      <div class="recommend-box">
        <div v-if="goodsList.length > 0" class="recommend-box__list">
          <app-goods-item :key="$index" v-for="(item,$index) in goodsList" :goodsItem="item" />
        </div>
        <md-result-page
          v-else
          :img-url="`${require('~/static/icons/empty.png')}`"
          text="商品都卖完了 ^_^" 
          subtext="快去开通店铺发布你的闲置账号吧"
          class="recommend-box__list app-empty-result">
        </md-result-page>
      </div>
    </div>
    <!-- <app-footer slot="app-footer"/> -->
  </app-scroll-view>
</template>

<script>
import {Swiper, SwiperItem, ResultPage, NoticeBar} from 'mand-mobile'
import AppGoodsItem from '~/components/AppGoodsItem'
import AppFooter from '~/components/AppFooter'
import {mapGetters} from 'vuex'
export default {
  name: 'app-home',
  components: {
    [Swiper.name]: Swiper,
    [SwiperItem.name]: SwiperItem,
    [ResultPage.name]: ResultPage,
    'app-goods-item': AppGoodsItem,
    'app-footer': AppFooter,
    [NoticeBar.name]: NoticeBar,
  },
  fetch({store, route, params}) {
    store.commit('SET_IS_HOME', true);
  },
  async asyncData({app, store}) {
    if(store.state.app.recommendGoodsList.length === 0) {
      let appData = {};
      try {
        let {code: goodsCode, data: goodsData} = await app.$api.getRecommendGoodsList();
        if(goodsCode == 200) {
          let { page = 1, total = 1, list = []} = goodsData || {};
          //appData['isFinished'] = page >= total;
          store.commit('app/SET_IS_FINISHED', page >= total);
          store.commit('app/SET_RECOMMEND_PARAMS', {
            page, total
          })
          store.commit('app/SET_RECOMMENT_GOODS', list);
        }
        let { code: bannerCode, data: bannerData } = await app.$api.getHomeBanner();
        if(bannerCode == 200) {
          appData['swiperList'] = bannerData || [];
        }
      } catch (error) {
        console.log(error);
        store.commit('app/SET_RECOMMENT_GOODS', []);
      }
      return appData;
    }
  },
  computed: {
    //读缓存 推荐商品列表
    goodsList() {
      return this.$store.state.app.recommendGoodsList;
    },
    userInfo() {
      return this.$store.state.user.userInfo || {};
    },
    menuConfig() {
      if(this.userInfo.isOpenJob == 1) {
        return [
          {
            icon: 'icon-order',
            url: '/order',
            desc: '订单中心',
          },
          {
            icon: 'icon-user',
            url: '/user',
            desc: '个人中心',
          },
        ]
      } else {
        return [
          {
            icon: 'icon-order',
            url: '/order',
            desc: '订单中心',
          }
        ]
      }
    },
    pageParams() {
      return this.$store.state.app.recommendParams;
    },
    isFinished() {
      return this.$store.state.app.isFinished;
    }
  },
  data() {
    return {
      // menuConfig: [
      //   {
      //     icon: 'icon-order',
      //     url: '/order',
      //     desc: '订单中心',
      //   },
      //   {
      //     icon: 'icon-user',
      //     url: '/user',
      //     desc: '个人中心',
      //   },
      // ],
      //banner 906 * 365
      swiperList: [
        {
          url: null,
          image: '//image.idsdz.com/banner/banner_01.png',
          title: '号子短租 - VIP权益，随租随用，用短租'
        }
      ],
      pageLoading: true,
    }
  },
  mounted() {
    console.log("Loading");
    if(this.$store.state.user.token) {
      this.$store.dispatch('user/GetUserInfo')
    }
    //this.init();
  },
  methods: {
    async init() {
      this.pageLoading = true;
      try {
        await this.getList();
        this.pageLoading = false;
      } catch (error) {
        this.pageLoading = false;
      }
    },
    async getList(callback) {
      //this.isFinished = false;
      this.$store.commit('app/SET_IS_FINISHED', false);
      this.$store.commit('app/SET_RECOMMEND_PARAMS', { page: 1, total: 1 })
      this.$store.commit('app/SET_RECOMMENT_GOODS', []);
      await this.getRecommendGoodsList();
      await this.getHomeBanner();
      callback && callback();
    },
    async getRecommendGoodsList(params = {}) {
      console.log("ues", params);
      let { code, data = {}} = await this.$api.getRecommendGoodsList(params);
      if(code == 200) {
        let { page = 1, total = 1, list = []} = data;
        let pageParams = {
          page,
          total
        }
        this.$store.commit('app/SET_RECOMMEND_PARAMS', pageParams)
        let newGoodsList = this.goodsList.slice();
        newGoodsList.push(...list);
        //标志推荐列表是否已加载完
        this.$store.commit('app/SET_IS_FINISHED', page >= total);
        this.$store.commit('app/SET_RECOMMENT_GOODS', newGoodsList);
      }
    },
    async getHomeBanner() {
      let { code, data = [] } = await this.$api.getHomeBanner();
      console.log(data);
      if(code == 200) {
        this.swiperList = data || [];
      }
    },
    async getListByPage(callback) {
      if(this.isFinished) {
        console.log("加载完了");
        return;
      }
      console.log("加载更多...");
      let { page = 1} = this.pageParams;
      let params = {
        page: page + 1
      }
      console.log(params);
      try {
        await this.getRecommendGoodsList(params);
      } catch (error) {
        callback && callback();
      }
      callback && callback();
    },
    linkTo(url) {
      if(!url) return;
      if(/^(http|https)/.test(url)) {
        window.location.href = url;
        return;
      }
      this.$router.push(url);
    }
  }
}
</script>

<style lang="scss" scope>
.app-home-container {
  .md-scroll-view .scroll-view-container {
    padding-bottom: 64px;
  }
}
.app-home-swiper {
  height: 383px;
  padding: 32px;
  overflow: hidden;
  position: relative;
  &::after {
    content: 'Ad Loading';
    position: absolute;
    top: 32px;
    left: 32px;
    bottom: 32px;
    right: 32px;
    border-radius: 16px;
    font-size: 46px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #ccc;
    z-index: -1;
    background-color: #fff;
  }
  .md-swiper, .md-swiper-box {
    border-radius: 16px;
    overflow: hidden;
  }
  .swiper-banner-item {
    width: 100%;
    height: 320px;
    border-radius: 16px;
    overflow: hidden;
  }
}
.app-home-recommend {
  padding: 32px 0;
  //padding-bottom: 32px;
  .recommend-title {
    height: 30px;
    margin-left: 32px;
    margin-bottom: 24px;
  }
  .recommend-title h4 {
    font-size: 28px;
  }
  .recommend-box {
    padding: 0 32px;
    .recommend-box__list, .recommend-box__loading {
      min-height: 50vh;
    }
    .recommend-box__loading {
      background-color: #fff;
      border-radius: 16px;
      padding: 24px;
      display: flex;
      align-items: center;
    }
  }
  .app-empty-result {
    height: 100%;
     background-color: #fff;
      border-radius: 16px;
      padding: 24px;
      display: flex;
      align-items: center;
    .md-result-text {
      font-size: 28px;
      color: #666;
    }
  }
}
.app-nav-menu {
  padding: 0 32px;
  .nav-menu__list {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    // background-color: #fff;
    // padding: 24px 0;
    border-radius: 16px;
  }
  .nav-menu__item {
    color: #333;
    display: flex;
    flex-direction: column;
    align-items: center;
    img {
      width: 112px;
      height: 112px;
      padding: 16px;
      // margin-bottom: 12px;
    }
    span {
      font-size: 24px;
    }
  }
}
</style>
