<template>
  <app-scroll-view
    class="app-goods-container"
    :isLoadRefresh="true"
    @loadRefresh="getGoodsDetails">
    <app-header :menu="menuConfig" slot="app-header"/>
    <div class="goods-box">
      <app-goods-item :goodsItem="parseGoodsDetails" :mini="true"/>
      <div class="goods-item__default">
        <div class="default-title">
          <h5>选择租用时长</h5>
        </div>
        <div class="default-box">
          <div class="goods-item__spec">
            <md-radio-group v-model="selectedSpecIndex">
              <md-radio-box :key="$index" v-for="(item, $index) in parseSpecList" :name="`${$index + ''}`">{{item.name}}</md-radio-box>
            </md-radio-group>
          </div>
        </div>
      </div>
      <div class="goods-item__default">
        <div class="default-title">
          <h5>商品说明</h5>
        </div>
        <div class="default-box">
          <div class="goods-item__desc">
            <p class="desc-text">{{goodsDetails.description || '无商品描述'}}</p>
            <div class="desc-preview-imgs">
              <div class="preview-img" :key="$index" v-for="(item, $index) in getGoodsDescImg">
                <img v-lazy="item" :src="item" alt="goodsDetails.description">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="goods-footer-bar" slot="app-footer">
      <md-notice-bar
        icon="warn"
        type="warning">
        <span @click.stop="$router.push('/faq')">注意：首次租号必看《租用教程》，点击查看</span>
      </md-notice-bar>
      <md-action-bar :actions="footerData" @click="onBtnClick">
        <span class="price">
          <small>&yen;</small>
            <md-amount
            :value="computedTotalPrice"
            :duration="200"
            transition
          ></md-amount>
        </span>
      </md-action-bar>
    </div>
    <!-- 客服窗口 -->
    <app-customer 
      slot="app-other"
      :isPopup.sync="isPopupShow" 
      :customerInfo="shopDetails"
      @close="handleClosePopup" />
    <!-- 完善用户联系方式 -->
    <app-save-info :isOpen.sync="isOpenSaveInfo" @onConfirm="onBtnClick"/>
  </app-scroll-view>
</template>
<script>
import {RadioBox, RadioGroup, ActionBar, Icon, NoticeBar} from 'mand-mobile'
import AppCustomer from '~/components/AppCustomer.vue'
import AppGoodsItem from '~/components/AppGoodsItem'
import AppSaveInfo from '~/components/AppSaveInfo'
export default {
  name: 'app-goods',
  head () {
    return {
        title: `商品详情 - ${this.goodsDetails.goodsName}出租`,
        meta: [
            { hid: 'description', name: 'description', content: `${this.goodsDetails.description || '暂无商品描述'}` },
            { hid: 'sharename', name: 'sharename', itemprop: 'name', content: `商品详情 - ${this.goodsDetails.goodsName}`},
            { hid: 'shareimage', name: 'shareimage', itemprop: 'image', content: `${this.goodsDetails.shelfImage}`},
            { hid: 'shareogimage', name: 'shareogimage', property: 'og:image', content: `${this.goodsDetails.shelfImage}` },
            { hid: 'sharedesc', name: 'sharedesc', itemprop: 'description', content: '给你推荐个商品，快来看看吧~~' }
        ]
    }
  },
  fetch({store, route, params}) {
    store.commit('SET_HEAD_TITLE', '商品详情');
    store.commit('SET_IS_HOME', false);
  },
  validate ({ params }) {
      // Must be a number
      return /^\d+$/.test(params.id)
  },
  async asyncData({ app, params }) {
    let id = params.id;
    let res = await app.$api.getGoodsDetails(id);
    let data = res.code == 200 ? res.data : {};
    return {
      goodsDetails: data,
    }
  },
  components: {
    [RadioBox.name]: RadioBox,
    [RadioGroup.name]: RadioGroup,
    [ActionBar.name]: ActionBar,
    [Icon.name]: Icon,
    'app-customer': AppCustomer,
    'app-goods-item': AppGoodsItem,
    [NoticeBar.name]: NoticeBar,
    [AppSaveInfo.name]: AppSaveInfo
  },
  computed: {
    parseSpecList: function () {
      return this.goodsDetails && JSON.parse(this.goodsDetails.skuJson) || [];
    },
    getGoodsDescImg: function () {
      return this.goodsDetails && this.goodsDetails.descriptionImages || [];
    },
    parseGoodsDetails: function () {
      let priceList = this.parseSpecList.map(item => {
        return item.price;
      })
      let min = 0, max = 0;
      min = Math.min(...priceList);
      max = Math.max(...priceList);
      this.goodsDetails.minPrice = Math.min(...priceList);
      this.goodsDetails.maxPrice = Math.max(...priceList);
      return this.goodsDetails
    },
    computedTotalPrice: function() {
      let index = parseInt(this.selectedSpecIndex);
      return this.parseSpecList[index].price / 100;
    },
    //底部动作栏
    footerData: function () {
      let data = this.goodsDetails;
      let actionText = () => {
        if(new Date().getTime() >= new Date(data.expireTime).getTime()) {
          return '已过期'
        }
        return data.stock > 0 ? '立即租用' : '租完了'
      }
      return [
        {
          text: actionText(),
          round: true,
          inactive: data.stock <= 0 || new Date().getTime() >= new Date(data.expireTime).getTime() || !this.shopDetails.shopWcNumber
        }
      ]
    },
    userInfo() {
      return this.$store.state.user.userInfo || {};
    },
    appToken() {
      return this.$store.state.user.token;
    },
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
        {
            icon: 'icon-store',
            desc: '店铺主页',
            callback: this.goToStore
        },
      ],
      selectedSpecIndex: '0',
      isPopupShow: false,
      goodsDetails: {},
      shopDetails: {},
      isOpenSaveInfo: false
    }
  },
  created() {
    this.$store.commit('SET_HEAD_MENU_CONFIG', this.menuConfig);
  },
  methods: {
    onBtnClick(event, action) {
      let { id } = this.$route.params;
      if(this.appToken && !this.userInfo.remark) {
        this.isOpenSaveInfo = true;
        return;
      }
      //跳转到支付台
      this.$router.push({
        path: `/cashier/${id}`,
        query: {
          skuIds: this.parseSpecList[parseInt(this.selectedSpecIndex) || 0].skuIds
        }
      });
    },
    async openCustomerBox() {
      this.isPopupShow = true;
    },
    goToStore() {
      this.$router.push(`/store/${this.goodsDetails.sid}`)
    },
    handleClosePopup(bool) {
      this.isPopupShow = bool;
    },
    async getGoodsDetails(callback) {
      let { id } = this.$route.params;
      let {code, data = {}} = await this.$api.getGoodsDetails(id);
      if(code == 200) {
        this.goodsDetails = data || {};
      }
      this.initCustomer();
      callback && callback();
    },
    async initCustomer() {
      try {
        this.$Toast.loading("Loading...");
        //店铺信息
        let shopRes = await this.$api.getShopDetail(this.goodsDetails.sid);
        this.$Toast.hide();
        let { data: shopData = {} } = shopRes;
        this.shopDetails = shopData;
      } catch (error) {
        console.log(error);
      }
    }
  },
  mounted() {
    this.initCustomer();
  },
}
</script>
<style lang="scss">
.goods-item__spec {
  .md-check-base-box {
    padding: 12px 48px;
    margin-right: 24px;
    margin-bottom: 24px;
  }
}
.goods-footer-bar {
  .md-notice-bar {
    bottom: 148px;
    bottom: calc(148px + constant(safe-area-inset-bottom));
    span {
      font-size: 28px;
    }
  }
  .md-action-bar {
    padding: 16px 32px;
    padding-bottom: calc(16px + constant(safe-area-inset-bottom));
  }
}
</style>
<style lang="scss" scope>
.app-goods-container {
  .md-scroll-view .scroll-view-container {
    padding-bottom: 92px;
  }
  .goods-box {
    padding: 32px 32px 64px 32px;
  }
}
.goods-item__default {
  .default-title {
    margin-bottom: 12px;
    h5 {
      font-size: 28px;
      color: #666;
    }
  }
  .default-box {
    width: 100%;
    min-height: 100px;
    background-color: #fff;
    border-radius: 16px;
    margin-bottom: 32px;
  }
}
.goods-item__spec {
  padding: 24px 24px 0 24px;
}
.goods-item__desc {
  padding: 24px;
  .desc-text {
    color: #333;
    font-size: 30px;
    line-height: 45px;
    margin-bottom: 12px;
  }
  .desc-preview-imgs {
    .preview-img img{
      width: 100%;
      height: auto;
    }
  }
}
.goods-footer-bar {
  .price {
    font-weight: 500;
    font-size: 48px;
    color: $app-primary-color;
    small {
      margin-left: 10px;
      font-size: 32px;
      margin-right: 8px;
    }
  }
}
.md-example-popup {
  position: relative;
  font-size: font-minor-large;
  background: color-bg-base;
  box-sizing: border-box;
  text-align: center;
  background-color: #FFF;
}
.customer-popup-align {
  padding: 0 40px;
  .customer-pupup-wrap {
    font-size: 64px;
    font-weight: 200;
    color: $app-primary-color;
    padding: 80px 0 150px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    .customer-number {
      padding: 16px 0;
    }
    .tips {
      color: #666;
      font-size: 28px;
      padding-top: 16px;
    }
  }
}
</style>