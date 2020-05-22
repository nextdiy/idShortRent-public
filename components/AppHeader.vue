<template>
    <div id="header" :class="{'header-fixed':isFixed}">
        <div v-show="isHome" class="header-home-container">
            <div class="logo" @click="$router.push('/')">
                <span>号子短租</span>
            </div>
            <div class="header-menu">
                <ul class="header-menu__list">
                    <template v-for="item in menu">
                        <nuxt-link v-if="item.url" :to="item.url" :key="item.desc" tag="li" class="header-menu__item">
                            <i :class="['iconfont', item.icon]"></i>
                        </nuxt-link>
                        <li v-else :key="item.desc" @click="item.callback && item.callback" class="header-menu__item">
                            <i :class="['iconfont', item.icon]"></i>
                        </li>
                    </template>
                </ul>
            </div>
        </div>
        <div v-show="!isHome" 
            class="header-other-container"
            :style="headerBackground">
            <div class="back" @click="linkBack">
                <i :class="['iconfont', [watchIsLogin ? 'icon-close' : 'icon-back']]"></i>
            </div>
            <div class="title">{{headTitle}}</div>
            <div class="header-menu">
                <ul class="header-menu__list">
                    <template v-for="item in menu">
                        <nuxt-link v-if="item.url" :to="item.url" :key="item.desc" tag="li" class="header-menu__item">
                            <i :class="['iconfont', item.icon]"></i>
                        </nuxt-link>
                        <li v-else :key="item.desc" @click="handleClickEven(item)" class="header-menu__item">
                            <i :class="['iconfont', item.icon]"></i>
                        </li>
                    </template>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
    name: 'app-header',
    props: {
        menu: {
            type: Array,
            default: () => {
                return []
            }
        },
        backgroundImg: {
            type: String,
            default: () => {
                return null
            }
        }
    },
    data() {
        return {
            timer: null
        }
    },
    computed: {
        ...mapGetters(['isFixed', 'scrollTop', 'isHome', 'headTitle']),
        watchIsLogin() {
            let bool = this.$route.fullPath === '/user/login' || this.$route.fullPath === '/user/register';
            return bool;
        },
        headerBackground() {
            return this.backgroundImg ? `background-image: url(${this.backgroundImg}); background-color: #fff;` : '';
        }
    },
    methods: {
        linkBack() {
            if(window.history.length > 1) {
                this.$router.go(-1);
            } else {
                this.$router.push('/');
            }
            //如果无法返回，则跳转到首页
            this.timer = setTimeout(() => {
                this.$router.push('/');
            }, 1500)
        },
        handleClickEven(item) {
            item.callback && item.callback();
        },
    },
    destroyed() {
        clearTimeout(this.timer);
    }
}
</script>
<style lang="scss" scope>
#header {
    width: 100%;
    height: $app-header-height;
    z-index: 1000;
    position: relative;
    overflow: hidden;
    .header-home-container, .header-other-container, .header-search-container{
        width: 100%;
        height: 100%;
        padding: 0 32px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .header-home-container {
        background-color: #fff;
        .logo {
            color: #333;
            font-size: 36px;
            display: inline-block;
            background-image: url('../static/icons/logo_primary.png');
            background-repeat: no-repeat;
            background-size: auto 50px;
            padding-left: 84px;
        }
    }
    .header-menu {
        .header-menu__item {
            width: 88px;
            height: 88px;
            line-height: 88px;
            border-radius: 50%;
            background-color: #fff;
            float: left;
            margin-left: 16px;
            text-align: center;
            .iconfont {
                font-size: 62px;
            }
            a {
                color: #333;
            }
        }
    }
    .header-other-container {
        color: #fff;
        background-color: $app-primary-color;
        position: relative;
        background-repeat: no-repeat;
        background-size: 100% auto;
        &.header-transparent {
            background-color:rgba(0, 0, 0, 0);
        }
        .back, .header-menu {
            position: absolute;
        }
        .back {
            left: 32px;
            .iconfont {
                font-size: 62px;
            }
        }
        .header-menu {
            right: 32px;
            .header-menu__item {
                background-color: rgba(0, 0, 0, 0.15);
                a {
                    color: #fff;
                }
            }
        }
        .title {
            flex: 1;
            text-align: center;
            font-size: 36px;
        }
    }
    .header-search-container {
        color: #fff;
        background-color: $app-primary-color;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        .close {
           width: 88px;
            .iconfont {
                font-size: 62px;
            }
        }
        .search-box {
            flex: 1;
            color: #fff;
            background-color: #fff;
            border-radius: 8px;
            display: flex;
            justify-content: space-between;
            height: 96px;
            padding: 12px 0;
            .search-box__input {
                color: $app-primary-color;
                font-size: 28px;
                flex: 1;
                background: none;
                border: none;
                padding: 0 24px;
                &:focus {
                    outline: none;
                }
            }
            .search-box__line {
                width: 1px;
                height: 100%;
                background-color: #f3f3f3;
                
            }
            .search-box__btn {
                width: 112px;
                background: none;
                border: none;
                font-size: 28px;
                color: $app-primary-color;
                &:focus {
                    outline: none;
                }
            }
        }
    }
}
#header.header-fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    animation: slideDown 0.3s forwards;
    .header-home-container {
        background-color: $app-primary-color;
    }
    .header-other-container {
        &.header-transparent {
            background-color:$app-primary-color;
        }
    }
    .logo {
        color: #fff;
        background-image: url('../static/icons/logo_white.png');
    }
    .header-menu {
        .header-menu__item {
            color: #fff;
            background-color: rgba(0, 0, 0, 0.15);
            a {
                color: #fff;
            }
        }
    }
}
@keyframes slideDown {
    from {
        display: block;
        top: -$app-header-height;
    }
    to {
        top: 0;
    }
}
</style>