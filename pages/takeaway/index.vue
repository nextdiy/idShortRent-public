<template>
    <app-scroll-view class="app-takeaway-container">
        <app-header slot="app-header"/>
        <div class="takeaway-background"></div>
        <div class="takeaway-coupon-wrapper">
            <div class="takeaway-coupon__list">
                <a href="http://suo.im/5PDJAO" class="takeaway-coupon__item">
                    <div class="type">
                        <img class="type-icon" v-lazy="require('~/static/icons/ele.png')" src="~/static/icons/ele.png" alt="">
                    </div>
                    <div class="desc">
                        <p class="desc-title">饿了么特价水果天天吃（生鲜红包）</p>
                        <p class="desc-sub-title">领最高20元外卖补贴 天天红包 下单更优惠</p>
                    </div>
                    <span>
                        <i class="iconfont icon-arrow-right"></i>
                    </span>
                </a>
                <a href="http://suo.im/6c8aFd" class="takeaway-coupon__item">
                    <div class="type">
                        <img class="type-icon" v-lazy="require('~/static/icons/ele.png')" src="~/static/icons/ele.png" alt="">
                    </div>
                    <div class="desc">
                        <p class="desc-title">饿了么天天抢红包活动（外卖红包）</p>
                        <p class="desc-sub-title">抢最高66元霸王餐 人人有红包 下单更优惠</p>
                    </div>
                    <span>
                        <i class="iconfont icon-arrow-right"></i>
                    </span>
                </a>
                <a href="http://suo.im/5Xa05h" class="takeaway-coupon__item">
                    <div class="type">
                        <img class="type-icon" v-lazy="require('~/static/icons/meituan.png')" src="~/static/icons/meituan.png" alt="">
                    </div>
                    <div class="desc">
                        <p class="desc-title">美团外卖红包天天领</p>
                        <p class="desc-sub-title">最高￥41外卖超值大礼包</p>
                    </div>
                    <span>
                        <i class="iconfont icon-arrow-right"></i>
                    </span>
                </a>
            </div>
        </div>
    </app-scroll-view>
</template>
<script>
export default {
    name: 'app-search',
    head () {
        return {
            title: '外卖领券 - 饿了么、美团天天抢红包活动',
            meta: [
                { hid: 'description', name: 'description', content: '号子短租 - 外卖红包，饿了么红包优惠券，美团红包优惠券' },
                { hid: 'sharename', name: 'sharename', itemprop: 'name', content: '饿了么、美团天天抢红包活动'},
                { hid: 'shareimage', name: 'shareimage', itemprop: 'image', content: 'http://image.idsdz.com/icons/coupon.png'},
                { hid: 'shareogimage', name: 'shareogimage', property: 'og:image', content: `http://image.idsdz.com/icons/coupon.png` },
                { hid: 'sharedesc', name: 'sharedesc', itemprop: 'description', content: '抢最高66元霸王餐，人人有红包，下单更优惠' }
            ]
        }
    },
    fetch({store, route, params}) {
        store.commit('SET_HEAD_TITLE', '外卖领券');
        store.commit('SET_IS_HOME', false);
    },
    created() {
        this.$store.commit('SET_HEAD_MENU_CONFIG', []);
    },
    mounted() {
        this.$nextTick(() => {
            setTimeout(() => this.$nuxt.$loading.finish(), 500)
        })
    },
}
</script>
<style lang="scss" scope>
.app-takeaway-container {
    .takeaway-background {
        width: 100%;
        min-height: 360px;
        background-image: url('~static/img/takeaway.png');
        background-repeat: no-repeat;
        background-position: center;
        background-size: 100% auto;
    }
    .takeaway-coupon-wrapper {
        padding: 32px;
    }
    .takeaway-coupon__list {
        .takeaway-coupon__item {
            width: 100%;
            display: inline-block;
            background-color: #fff;
            border-radius: 8px;
            display: flex;
            padding: 32px 24px;
            margin-bottom: 24px;
            align-items: center;
            .type {
                .type-icon {
                    width: 88px;
                    height: 88px;
                    border-radius: 50%;
                }
            }
            .desc {
                flex: 1;
                margin-left: 16px;
                .desc-title {
                    color: #333;
                    font-size: 28px;
                    margin-bottom: 8px;
                    @include overflow-ellipsis(1);
                }
                .desc-sub-title {
                    color: #999;
                    font-size: 24px;
                    @include overflow-ellipsis(2);
                }
            }
            span {
                display: inline-block;
                width: 56px;
                height: 56px;
                line-height: 56px;
                text-align: center;
                border-radius: 50%;
                background-color: $app-primary-color;
                color: #fff;
                .iconfont {
                    font-size: 26px;
                }
            }
        }
    }
}
</style>