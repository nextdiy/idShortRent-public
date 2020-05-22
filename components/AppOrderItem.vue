<template>
    <div class="app-order-container">
        <nuxt-link :to="linkTo" tag="div" class="order-content__item">
            <div class="item-order-number">
                <span>订单号：{{orderItem.orderNum}}</span>
                <small v-if="orderItem.accountStatus == 1 && orderItem.status == 2">密码已更新，请查看</small>
                <small v-else>{{$Utils.transOrderStatus(orderItem.status)}}</small>
            </div>
            <div class="item-order-desc">
                <div class="item-left">
                    <img class="item-left__icon" v-lazy="orderItem.goodsImage" :alt="`${orderItem.goodsName}`">
                </div>
                <div class="item-right">
                    <div class="item-right__title">
                        <p>{{orderItem.goodsName}}</p>
                    </div>
                    <div class="item-right__spec">规格：{{orderItem.spec}}</div>
                    <div class="item-right__price">支付金额：<i>&yen;</i>{{$Utils.formatMoney(orderItem.realAmount)}}</div>
                    <md-button @click="$router.push(linkTo)" type="warning" class="item-right__subbtn" size="small" inline>查看详情</md-button>
                </div>
            </div>
        </nuxt-link>
    </div>
</template>
<script>
export default {
    name: 'app-order-item',
    props: {
        orderItem: {
            type: Object,
            default: () => {
                return {}
            }
        },
        linkTo: {
          type: String,
          default: () => {
            return {}
          }
        }
    }
}
</script>
<style lang="scss" scope>
.order-content__item {
    width: 100%;
    background-color: #fff;
    border-radius: 16px;
    margin-bottom: 24px;
    padding: 24px;
    .item-order-number {
        color: #666;
        font-size: 26px;
        border-bottom: 1px solid #f3f3f3;
        padding-bottom: 16px;
        display: flex;
        justify-content: space-between;
        small {
            font-size: 26px;
            color: $app-primary-color;
        }
    }
    .item-order-desc {
        font-size: 28px;
        display: flex;
    }
    .item-left {
      width: 212px;
      height: 212px;
      padding: 36px 36px 12px 12px;
    }
    .item-right {
      flex: 1;
      position: relative;
    }
    .item-left__icon {
      width: 100%;
      height: auto;
      border-radius: 50%;
    }
    .item-right__title {
      padding: 24px 0 16px 0;
      p {
        color: #333;
        font-size: 28px;
        height: 72px;
        font-weight: bold;
        @include overflow-ellipsis(2);
      }
    }
    .item-right__spec, .item-right__price {
      font-size: 26px;
    }
    .item-right__spec {
      color: #666;
      position: absolute;
      bottom: 42px;
    }
    .item-right__price {
      color: $app-primary-color;
      position: absolute;
      bottom: 0px;
      i {
        font-style: normal;
      }
    }
    .item-right__subbtn {
      position: absolute;
      right: 0;
      bottom: 0;
    }
}
</style>