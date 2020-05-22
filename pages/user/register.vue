<template>
    <div class="register-container">
        <app-header slot="app-header"/>
        <div class="register-form-wrapper">
            <div class="register-form__header">
                <h3 class="title">欢迎注册 - 号子短租</h3>
                <p class="desc">VIP，随租随用，用短租</p>
            </div>
            <div class="register-form__content">
                <div class="register-form__body">
                    <div class="register-form__item">
                        <p class="register-form__title">用户名</p>
                        <input class="register-form__input" v-model="registerForm.account" type="text" placeholder="请输入用户名">
                        <p class="register-form__tip">* 4-16位（中文、字母、数字、下划线、减号）</p>
                    </div>
                    <div class="register-form__item">
                        <p class="register-form__title">密码</p>
                        <input class="register-form__input" v-model="registerForm.password" type="password" placeholder="请输入密码">
                        <p class="register-form__tip">* 6-20位（字母、数字、下划线）</p>
                    </div>
                    <div class="register-form__item">
                        <p class="register-form__title">确认密码</p>
                        <input class="register-form__input" v-model="registerForm.rePassword" type="password" placeholder="请输入确认密码">
                        <p class="register-form__tip">* 6-20位（字母、数字、下划线）</p>
                    </div>
                    <div class="register-form__item">
                        <p class="register-form__title">邮箱（用于找回密码，请认真填写）</p>
                        <input class="register-form__input" v-model="registerForm.email" type="text" placeholder="请输入邮箱">
                        <p class="register-form__tip">* 请使用常用邮箱，如：QQ邮箱、163邮箱等</p>
                    </div>
                    <div class="register-form__item">
                        <md-agree
                            v-model="isAgreeChecked"
                            size="lg"
                            @change="onAgreeChange('agreenChecked')"
                            >
                                注册即代表同意
                                <md-button @click="$router.push('/user/agreement')" type="link">《平台服务协议》</md-button>
                            </md-agree>
                    </div>
                    <div class="register-form__submit">
                        <md-button type="primary" :loading="subLoading" :inactive="subLoading" @click="registerSubmit">注册</md-button>
                    </div>
                    <div class="register-form__toggle">
                        <span @click="$router.replace('/user/login')">已有账号，去登录</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { Agree } from 'mand-mobile'
import { verifyUsername, verifyPassword, verifyRePassword, verifyEmail } from '~/assets/js/verify.js'
export default {
    name: 'app-register',
    components: {
        [Agree.name]: Agree
    },
    middleware: 'notAuth',
    head () {
        return {
            title: '注册 - VIP，随租随用，用短租',
            meta: [
                { hid: 'description', name: 'description', content: '号子短租，注册' }
            ]
        }
    },
    fetch({store, route, params}) {
        store.commit('SET_HEAD_TITLE', '注册');
        store.commit('SET_IS_HOME', false);
    },
    data() {
        return {
            registerForm: {},
            isAgreeChecked: false,
            subLoading: false,
        }
    },
    created() {
        this.$store.commit('SET_HEAD_MENU_CONFIG', []);
    },
    methods: {
        verifyForm() {
            let { account, password, rePassword, email} = this.registerForm;
            let obj = {};
            obj = verifyUsername(account);
            if(!obj.result) {
                this.showToast(obj.errorTip);
                return false;
            }
            obj = verifyPassword(password);
            if(!obj.result) {
                this.showToast(obj.errorTip);
                return false;
            }
            obj = verifyRePassword(rePassword, password);
            if(!obj.result) {
                this.showToast(obj.errorTip);
                return false;
            }
            obj = verifyEmail(email);
            if(!obj.result) {
                this.showToast(obj.errorTip);
                return false;
            }
            if(!this.isAgreeChecked) {
                this.showToast("请阅读并同意平台服务协议");
                return false;
            }
            return true;
        },
        async registerSubmit() {
            let { account, password, rePassword, email } = this.registerForm;
            if(this.verifyForm()) {
                console.log(this.registerForm);
                this.subLoading = true;
                let res = await this.$api.register({
                    username: account,
                    password,
                    email,
                })
                this.subLoading = false;
                console.log(res);
                if(res.code == 200) {
                    this.$Dialog.succeed({
                        title: '注册成功',
                        content: '请前往登录页面',
                        confirmText: '确定',
                        onConfirm: () => {
                            this.$router.replace('/user/login');
                        },
                    })
                } else {
                    this.$Dialog.failed({
                        title: '注册失败',
                        content: res.msg,
                        confirmText: '确定',
                        onConfirm: () => console.log('[Dialog.failed] confirm clicked'),
                    })
                }
            }
        },
        onAgreeChange(name) {
            console.log(name);
        },
        showToast(val) {
            this.$Toast({
                icon: 'fail',
                content: val,
                position: 'top'
            });
        }
    },
    mounted() {
        this.$nextTick(() => {
            setTimeout(() => this.$nuxt.$loading.finish(), 500)
        })
    },
}
</script>
<style lang="scss" scope>
.register-form-wrapper {
    .register-form__header {
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
    .register-form__item {
        margin-bottom: 24px;
    }
    .md-agree-content {
        font-size: 28px;
    }
    .md-agree-icon .md-agree-icon-container .md-icon.md-icon-check,
    .md-agree-icon.checked .md-agree-icon-container .md-icon-checked {
        color: $app-primary-color;
    }
    
    .register-form__title {
        color: #fff;
    }
    .register-form__content {
        padding: 0 32px 32px;
        transform: translateY(-60px);
    }
    .register-form__body {
        background-color: #fff;
        border-radius: 16px;
        padding: 32px 24px 0 24px;
        .register-form__title {
            color: #666;
            font-size: 26px;
            margin-bottom: 12px;
        }
        .register-form__input {
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
        .register-form__tip {
            color: #999;
            font-size: 24px;
            padding-top: 12px;
        }
    }
    .register-form__submit {
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
    .register-form__toggle {
        font-size: 26px;
        color: $app-primary-color;
        // position: absolute;
        padding-bottom: 24px;
    }
}
</style>