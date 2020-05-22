<template>
    <app-scroll-view 
        class="user-container"
        :isLoadRefresh="true"
        :refreshText="refreshTip"
        @loadRefresh="getUserInfo">
        <app-header :menu="menuConfig" slot="app-header"/>
        <md-skeleton avatar title :loading="pageLoading" avatar-size="lg" :row="1" class="user-background-wrapper">
            <div class="user-avatar">
                <img :src="userInfo.avatar || require('~/static/icons/default_avatar.png')" :alt="`${userInfo.username}`">
            </div>
            <div class="user-info">
                <p v-if="!userInfo.username" class="user-info__name" @click="$router.push('/user/login')">登录 / 注册</p>
                <p v-if="userInfo.username" class="user-info__name">{{userInfo.username}}</p>
                <!-- <small>Lv12</small> -->
                <p v-if="userInfo.email" class="user-info__id">邮箱：{{userInfo.email}}</p>
                <!-- <div class="user-sign">签到</div> -->
            </div>
        </md-skeleton>
        <div class="user-menu-wrapper">
            <div class="user-menu__list">
                <md-field>
                    <!-- <md-cell-item title="你的钱包" addon="8000.34" arrow>
                        <div class="user-menu__item" slot="left">
                            <i class="iconfont icon-wallet"></i>
                        </div>
                    </md-cell-item> -->
                    <md-cell-item v-if="userInfo.isOpenJob != 1" @click="$router.push('/console/apply')" title="开通店铺" arrow>
                        <div class="user-menu__item" slot="left">
                            <i class="iconfont icon-ruzhu"></i>
                        </div>
                    </md-cell-item>
                    <md-cell-item v-if="userInfo.isOpenJob == 1" @click="$router.push('/console')" title="店铺工作台" arrow no-border>
                        <div class="user-menu__item" slot="left">
                            <i class="iconfont icon-gongzuotai"></i>
                        </div>
                    </md-cell-item>
                </md-field>
            </div>
        </div>
    </app-scroll-view>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
    name: 'app-user',
    head () {
        return {
            title: '个人中心 - VIP，随租随用，用短租',
            meta: [
                { hid: 'description', name: 'description', content: '号子短租，个人中心' }
            ]
        }
    },
    fetch({store, route, params}) {
        store.commit('SET_HEAD_TITLE', '个人中心');
        store.commit('SET_IS_HOME', false);
    },
    data() {
        return {
            defaultMenuConfig: [
                {
                    icon: 'icon-sign-out',
                    desc: '退出登录',
                    eventCode: 'other',
                    callback: this.userSignOut
                },
            ],
            pageLoading: false,
        }
    },
    computed: {
        userInfo() {
            return this.$store.state.user.userInfo || {};
        },
        appToken() {
            return this.$store.state.user.token;
        },
        menuConfig() {
            return this.appToken ? this.defaultMenuConfig : [];
        },
        refreshTip() {
            return this.appToken ? '下拉刷新' : '请先登录';
        }
    },
    watch: {
        'appToken'() {
            this.$store.commit('SET_HEAD_MENU_CONFIG', this.menuConfig);
        }
    },
    created() {
        this.$store.commit('SET_HEAD_MENU_CONFIG', this.menuConfig);
    },
    mounted() {
        this.initUserInfo();
    },
    methods: {
        async initUserInfo() {
            if(this.appToken && !this.userInfo.name) {
                this.$Toast.loading("Loading");
                this.pageLoading = true;
                try {
                    await this.getUserInfo();
                } catch (error) {
                    this.pageLoading = false;
                    this.$Toast.hide();
                }
                this.pageLoading = false;
                this.$Toast.hide();
            }
        },
        async getUserInfo(callback) {
            console.log("Hello")
            if(!this.appToken) {
                callback && callback();
                return;
            }
            let data = await this.$store.dispatch('user/GetUserInfo');
            console.log(data);
            callback && callback();
        },
        userSignOut() {
            this.$Dialog.confirm({
                title: '确认',
                content: '是否退出登录？',
                confirmText: '确定',
                onConfirm: async () => {
                    this.$Toast.loading("Loading...");
                    await this.$store.dispatch('UserSignOut');
                    this.$Toast.hide();
                },
            })
            
        }
    }
}
</script>
<style lang="scss">
.user-menu-wrapper {
    .md-field {
        border-radius: 16px;
        padding: 28px 24px 0 24px;
    }
    .md-cell-item-body {
        padding: 24px 0;
    }
}
</style>
<style lang="scss" scope>
.user-container {
    position: relative;
}
.user-background-wrapper {
    background-color: $app-primary-color;
    height: 280px;
    padding: 0px 64px 60px 64px;
    display: flex;
    align-items: center;
    // justify-content: flex-start;
    .user-avatar {
        width: 150px;
        height: 150px;
        // overflow: hidden;
        position: relative;
        &::after {
            content: '';
            display: inline-block;
            width: 180px;
            height: 180px;
            position: absolute;
            top: 50%;
            left: 50%;
            -webkit-transform: translate(-50%, -50%);
            transform: translate(-50%, -50%);
            border-radius: 50%;
            background-color: rgba( 0, 0, 0, 0.1);
        }
        img {
            width: 100%;
            height: auto;
            border-radius: 50%;
        }
    }
    .user-info {
        margin-left: 52px;
        color: #fff;
        .user-info__name {
            font-size: 28px;
            margin-bottom: 16px;
            position: relative;
            font-weight: bold;
            small {
                color: #fff;
                font-size: 22px;
                display: inline-block;
                border: 1px solid #fff;
                padding: 0px 8px;
                border-radius: 8px;
                position: absolute;
                right: -80px;
                top: 50%;
                min-width: 56px;
                text-align: center;
                -webkit-transform: translateY(-50%);
                transform: translateY(-50%);
                font-weight: normal;
            }
        }
        .user-info__id {
            font-size: 26px;
        }
    }
    .user-sign {
        position: absolute;
        right: 64px;
        padding: 10px 32px;
        color: $app-primary-color;
        font-size: 26px;
        border-radius: 8px;
        background-color: #fff;
        &:active {
            opacity: 0.9;
        }
    }
}
.user-menu-wrapper {
    width: 100%;
    position: absolute;
    top: 220px;
    .user-menu__list {
        padding: 0 32px
    }
    .md-cell-item-left {
        margin-right: 16px;
    }
    .md-cell-item-content {
        font-size: 28px;
    }
    .user-menu__item {
        .iconfont {
            color: #333;
            font-size: 64px;
        }
    }
}
</style>