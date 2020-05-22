<template>
    <div class="goods-item-container">
        <!-- 原版 -->
        <nuxt-link :to="`/goods/${goodsItem.id}`" tag="div" :title="`${goodsItem.goodsName || goodsItem.shelfName}`" :class="['goods-item__box',{'goods-item-mini':mini}]">
            <div class="box-left">
                <img class="box-left__icon" v-lazy="goodsItem.goodsImage || goodsItem.shelfImage" :alt="`${goodsItem.goodsName || goodsItem.shelfName}`">
            </div>
            <div class="box-right">
                <div class="box-right__title">
                    <p>{{goodsItem.goodsName || goodsItem.shelfName}}</p>
                </div>
                <div v-if="!mini" class="box-right__spec">可选规格：{{goodsItem.specName}}</div>
                <div v-if="!mini" class="box-right__price"><small>&yen;</small>{{$Utils.formatMoney(goodsItem.minPrice)}}</div>
                <div v-else class="box-right__price"><small>&yen;</small>{{$Utils.formatMoney(goodsItem.minPrice)}} - {{$Utils.formatMoney(goodsItem.maxPrice)}}</div>
                <a :href="`/goods/${goodsItem.goodsId || goodsItem.id}`" :title="`${goodsItem.goodsName || goodsItem.shelfName}`" class="box-right__subbtn">马上租</a>
            </div>
        </nuxt-link>
        <!-- 新版式 -->
        <!-- <nuxt-link to="/goods" tag="div" class="goods-item__box">
            <div class="goods-item__head">
                <div class="store">
                    <md-icon name="home"></md-icon>
                    <span>号子旗舰店</span>
                </div>
            </div>
            <div class="goods-item__body">
                <div class="title">
                    <p><span class="goods-class">芒果tv</span>超值芒果tv会员，移动影视会员（手机/网页/电脑）可用，非电视端，请注意慎拍</p>
                </div>
                <div class="price">
                    <small>&yen;</small>
                    <span>1.25 ~ 13.80</span>
                </div>
                <div class="desc-img">
                    <div class="desc-img__i"><img src="~/static/icons/mgtv.png" alt="芒果tv出租"></div>
                    <div class="desc-img__i"><img src="~/static/img/demo02.jpg" alt="芒果tv出租"></div>
                    <div class="desc-img__i"><img src="~/static/img/demo01.jpg" alt="芒果tv出租"></div>
                </div>
            </div>
        </nuxt-link> -->
    </div>
</template>
<script>
import { Icon } from 'mand-mobile'
export default {
    name: 'app-goods-item',
    props: {
        goodsItem: {
            type: Object,
            default: () => {
                return {}
            }
        },
        mini: {
            type: Boolean,
            default: () => {
                return false
            }
        }
    },
    components: {
        [Icon.name]: Icon
    },
}
</script>
<style lang="scss" scope>
//旧版
.goods-item__box {
    width: 100%;
    padding: 0 12px;
    background-color: #fff;
    border-radius: 16px;
    margin-bottom: 24px;
    font-size: 28px;
    display: flex;
    .box-left {
      width: 200px;
      height: 220px;
      padding: 32px 20px 32px 20px;
      overflow: hidden;
    }
    .box-right {
      flex: 1;
      position: relative;
    }
    .box-left__icon {
      width: auto;
      height: 100%;
      border-radius: 24px;
    }
    .box-right__title {
      padding: 24px 24px 16px 0;
      p {
        color: #333;
        font-size: 28px;
        font-weight: bold;
        @include overflow-ellipsis(2);
      }
    }
    .box-right__spec, .box-right__price {
      font-size: 26px;
    }
    .box-right__spec {
      color: #666;
      position: absolute;
      bottom: 66px;
      @include overflow-ellipsis(1);
    }
    .box-right__price {
      color: $app-primary-color;
      position: absolute;
      bottom: 24px;
      small {
        margin-right: 8px;
      }
    }
    .box-right__subbtn {
      position: absolute;
      right: 24px;
      bottom: 32px;
      width: 120px;
      height: 65px;
      line-height: 65px;
      text-align: center;
      color: #fff;
      display: block;
      background-color: $app-primary-color;
      border-radius: 6px;
    }
}
.goods-item-mini {
    // height: 204px;
    padding: 0;
    .box-left {
        height: 180px;
        width: 180px;
        padding: 24px;
        overflow: hidden;
    }
    .box-right__spec, .box-right__subbtn {
        display: none;
    }
    .box-right__title {
        p {
            font-size: 26px;
        }
    }
}
// 新版样式
// .goods-item__box {
//     width: 100%;
//     min-height: 236px;
//     background-color: #fff;
//     border-radius: 16px;
//     margin-bottom: 24px;
//     font-size: 28px;
//     padding: 12px 0;
// }
// .goods-item__head {
//     height: 68px;
//     display: flex;
//     align-items: center;
//     position: relative;
//     padding: 0 24px;
//     .store {
//         font-size: 26px;
//         color: #333;
//     }
// }
// .goods-item__body {
//     padding: 0 24px 12px 24px;
//     .title {
//         color: #333;
//         font-size: 28px;
//         margin-bottom: 12px;
//         line-height: 48px;
//         p {
//             font-weight: bold;
//             @include overflow-ellipsis(2);
//         }
//         .goods-class {
//             font-size: 28px;
//             color: #fff;
//             background: $app-primary-color;
//             padding: 0px 10px;
//             border-radius: 8px;
//             margin-right: 12px;
//             text-align: center;
//         }
//     }
//     .price {
//         color: $app-primary-color;
//         span {
//             font-size: 32px;
//         }
//     }
//     .desc-img {
//         display: flex;
//         border: 1px solid #d1e1e1;
//         border-radius: 16px;
//         overflow: hidden;
//         margin-top: 16px;
//         .desc-img__i {
//             flex: 1;
//             margin-right: 12px;
//             max-height: 180px;
//             display: flex;
//             align-items: center;
//             overflow: hidden;
//             &:nth-child(3n), &:last-child {
//                 margin-right: 0;
//             }
//             img {
//                 width: 100%;
//             }
//         }
//     }
// }
</style>