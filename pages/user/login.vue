<template>
    <div class="login-container">
        <app-header slot="app-header"/>
        <div class="login-form-wrapper">
            <div class="login-form__header">
                <h3 class="title">号子短租</h3>
                <p class="desc">VIP，随租随用，用短租</p>
            </div>
            <div class="login-form__content">
                <div class="login-form__body">
                    <div class="login-form__item">
                        <p class="login-form__title">用户名/邮箱</p>
                        <input class="login-form__input" v-model="loginForm.account" type="text" placeholder="请输入用户名/邮箱">
                    </div>
                    <div class="login-form__item">
                        <p class="login-form__title">密码</p>
                        <input class="login-form__input" v-model="loginForm.password" type="password" placeholder="请输入密码">
                    </div>
                    <div class="login-form__forget">
                        <span @click="$router.push('/user/forget')">忘记密码？</span>
                    </div>
                    <div class="login-form__submit">
                        <md-button type="primary" :loading="subLoading" :inactive="subLoading" @click="loginSubmit">登录</md-button>
                    </div>
                    <div class="login-form__toggle">
                        <span @click="$router.replace('/user/register')">还没有账号？去注册</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="login-from-other">
            <h3 class="title">选择其他方式登录</h3>
            <div class="login-form__selection">
                <div class="selection-item" @click="linkToWxLogin">
                    <i style="color: #46bb36;" class="iconfont icon-weixin"></i>
                    <span class="sub-title">微信</span>
                </div>
            </div>
        </div>
        <md-landscape v-model="showAppCode">
            <div class="app-qrcode-wrapper">
                <div id="qrcode"></div>
                <span class="please-tips">请使用微信扫码进行登录</span>
            </div>
            <!-- <img src="//manhattan.didistatic.com/static/manhattan/do1_6VL7HL8TYaUMsIfygfpz"> -->
        </md-landscape>
    </div>
</template>
<script>
import { Landscape } from 'mand-mobile'
export default {
    name: 'app-login',
    middleware: 'notAuth',
    head () {
        return {
            title: '登录 - VIP，随租随用，用短租',
            meta: [
                { hid: 'description', name: 'description', content: '号子短租，登录' }
            ]
        }
    },
    fetch({store, route, params}) {
        store.commit('SET_HEAD_TITLE', '登录');
        store.commit('SET_IS_HOME', false);
    },
    components: {
        [Landscape.name]: Landscape
    },
    data() {
        return {
            loginForm: {},
            subLoading: false,
            showAppCode: false,
            qrcode: null
        }
    },
    created() {
        this.$store.commit('SET_HEAD_MENU_CONFIG', []);
    },
    methods: {
        verifyForm() {
            let { account, password } = this.loginForm;
            if(!account) {
                this.showToast("请输入用户名 / 邮箱");
                return false;
            }
            if(!password) {
                this.showToast("请输入密码");
                return false;
            }
            return true;
        },
        async loginSubmit() {
            let { account, password } = this.loginForm;
            if(this.verifyForm()) {
                this.subLoading = true;
                let data = await this.$store.dispatch('user/Login', {
                    username: account,
                    password: password
                });
                this.subLoading = false;
                if(data.code != 200) {
                    this.$Dialog.failed({
                        title: '登录失败',
                        content: '请检查账号或密码是否正确',
                        confirmText: '确定',
                    })
                    return;
                }
                let { ref = '/' } = this.$route.query;
                //console.log(decodeURIComponent(ref));
                this.$router.push(ref);
            }
        },
        showToast(val) {
            this.$Toast({
                icon: 'fail',
                content: val,
                position: 'top'
            });
        },
        async linkToWxLogin() {
            let { ref = '/' } = this.$route.query;
            ref = encodeURIComponent(ref);
            const redirectUrl = `http://${window.location.host}/user/login?a=1&ref=${ref}`;
            //判断是否是微信内
            if(this.isWeixin()) {
                try {
                    this.$Toast.loading("Loading...")
                    let { code, data, msg } = await this.$api.getWxLoginUrl(redirectUrl);
                    this.$Toast.hide();
                    if(code == 200 && data.code == 0) {
                        window.location.href = data.data;   
                    } else {
                        this.$Toast.failed("获取微信授权地址失败，请重试")
                    }
                } catch (error) {
                    console.log(error);
                }
            } else {
                if(!this.qrcode) {
                    //创建二维码，请用户使用微信扫码进行登录
                    this.qrcode = new QRCode('qrcode', {
                        text: `${redirectUrl}`,
                        width: 256,
                        height: 256,
                        colorDark : "#000000",
                        colorLight : "#ffffff",
                        correctLevel : QRCode.CorrectLevel.H
                    });
                }
                this.showAppCode = true;
            }
        },
        async goToWxLogin(wxCode) {
            this.$Toast.loading("登录中...");
            let { code, msg, data } = await this.$store.dispatch('user/wxLogin', wxCode);
            console.log(code, msg, data);
            this.$Toast.hide();
            if(code == 200) {
                let { ref = '/' } = this.$route.query;
                this.$router.push(ref);
            } else {
                this.$Dialog.failed({
                    title: '微信授权登录失败',
                    content: '请稍后重试',
                    confirmText: '确定',
                })
            }
        },
        isWeixin () { //判断是否是微信
            var ua = navigator.userAgent.toLowerCase();
            return ua.match(/MicroMessenger/i) == "micromessenger";
        }
    },
    mounted() {
        let { code, a } = this.$route.query;
        if(code) {
            this.goToWxLogin(code);
        }
        if(!code && a == 1) {
            this.linkToWxLogin();
        }
    }
}
</script>
<style lang="scss" scope>
.login-form-wrapper {
    .login-form__header {
        color: #fff;
        background-color: $app-primary-color;
        height: 280px;
        padding: 0 32px;
        .title {
            font-size: 45px;
            padding-top: 72px;
            padding-bottom: 12px;
        }
        .desc {
            font-size: 24px;
        }
    }
    .login-form__item {
        margin-bottom: 24px;
    }
    .login-form__title {
        color: #fff;
        .title {
            font-size: 45px;
            padding-top: 72px;
            padding-bottom: 12px;
        }
        .desc {
            font-size: 24px;
        }
    }
    .login-form__content {
        padding: 0 32px 32px;
        transform: translateY(-60px);
    }
    .login-form__body {
        background-color: #fff;
        border-radius: 16px;
        padding: 32px 24px 0 24px;
        .login-form__title {
            color: #666;
            font-size: 24px;
            margin-bottom: 12px;
        }
        .login-form__input {
            font-size: 28px;
            height: 92px;
            padding: 22px 16px;
            border: 2px solid #333;
            border-radius: 8px;
            width: 100%;
            transition: all 0.3s;
            &:focus {
                outline: none;
                border-color: $app-primary-color;
            }
        }
    }
    .login-form__submit {
        padding-top: 72px;
        padding-bottom: 24px;
        .md-button {
            font-size: 28px;
            border-radius: 8px;
        }
        .md-button.primary {
            background: $app-primary-color;
        }
        .md-button.primary:after {
            border: none;
            border-radius: 8px;
        }
    }
    .login-form__toggle {
        font-size: 26px;
        color: $app-primary-color;
        // position: absolute;
        padding-bottom: 24px;
    }
    .login-form__forget {
        font-size: 26px;
        color: $app-primary-color;
        text-align: right;
    }
}
.login-from-other {
    .title {
        display: block;
        font-size: 28px;
        color: #666;
        text-align: center;
    }
    .login-form__selection {
        font-size: 28px;
        display: flex;
        justify-content: center;
        .selection-item {
            padding: 32px;
            text-align: center;
            .iconfont {
                font-size: 112px;
            }
            .sub-title {
                display: block;
                margin-top: 8px;
                color: #333;
                font-size: 26px;
            }
        }
        
    }
}
.app-qrcode-wrapper {
    background-color: #fff;
    padding: 82px 64px 64px;
    border-radius: 12px;
    #qrcode{
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        img {
            width: 350px;
            height: 350px;
        }
    }
    .please-tips {
        color: #666;
        text-align: center;
        display: block;
        padding-top: 12px;
    }
}
</style>