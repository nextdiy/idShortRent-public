<template>
    <div class="forget-container">
        <app-header slot="app-header"/>
        <div class="forget-form-wrapper">
            <div class="forget-form__header">
                <h3 class="title">找回密码 - 号子短租</h3>
                <!-- <p class="desc">VIP，随租随用，用短租</p> -->
            </div>
            <div class="forget-form__content">
                <div class="forget-form__body">
                    <div class="forget-form__item">
                        <p class="forget-form__title">邮箱</p>
                        <input class="forget-form__input" v-model="forgetForm.email" type="text" placeholder="请输入邮箱">
                        <p class="forget-form__tip">* 请输入注册时填写邮箱</p>
                    </div>
                    <div class="forget-form__submit">
                        <md-button type="primary" @click="forgetSubmit">确定</md-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'app-forget',
    middleware: 'notAuth',
    head () {
        return {
            title: '找回密码 - VIP，随租随用，用短租',
            meta: [
                { hid: 'description', name: 'description', content: '号子短租，找回密码' }
            ]
        }
    },
    fetch({store, route, params}) {
        store.commit('SET_HEAD_TITLE', '找回密码');
        store.commit('SET_IS_HOME', false);
    },
    data() {
        return {
            forgetForm: {}
        }
    },
    created() {
        this.$store.commit('SET_HEAD_MENU_CONFIG', []);
    },
    methods: {
        linkToReplace(url) {
            this.$router.replace(url);
        },
        forgetSubmit() {
            this.$Toast.info("当前功能正在开发~")
            return;
            let { email } = this.forgetForm;
            if(!email) {
                this.$Toast({
                    icon: 'fail',
                    content: '请输入邮箱',
                    position: 'top'
                });
                return;
            }
            this.$Dialog.succeed({
                title: '密码已重置',
                content: '新密码已发送到你的邮箱，请登录邮箱查看！',
                confirmText: '确定',
                onConfirm: () => console.log('[Dialog.succeed] confirm clicked'),
            })
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
.forget-form-wrapper {
    .forget-form__header {
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
    .forget-form__item {
        margin-bottom: 24px;
    }
    .forget-form__title {
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
    .forget-form__content {
        padding: 0 32px 32px;
        transform: translateY(-60px);
    }
    .forget-form__body {
        background-color: #fff;
        border-radius: 16px;
        padding: 32px 24px 0 24px;
        .forget-form__title {
            color: #666;
            font-size: 26px;
            margin-bottom: 12px;
        }
        .forget-form__input {
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
        .forget-form__tip {
            color: #999;
            font-size: 24px;
            padding-top: 12px;
        }
    }
    .forget-form__submit {
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
    .forget-form__toggle {
        font-size: 26px;
        color: $app-primary-color;
        // position: absolute;
        padding-bottom: 24px;
    }
}
</style>