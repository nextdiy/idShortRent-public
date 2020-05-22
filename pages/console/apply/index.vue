<template>
    <div class="console-apply-container">
        <app-header slot="app-header"/>
        <div class="console-apply-form">
            <md-field title="请填写认证资料">
                <md-input-item
                    ref="name"
                    preview-type="text"
                    value=""
                    title="店铺名称"
                    placeholder="请输入店铺名称"
                    v-model="applyForm.name"
                    clearable
                ></md-input-item>
                <md-input-item
                    title="手机号"
                    type="phone"
                    placeholder="请输入联系手机号"
                    v-model="applyForm.phone"
                    clearable
                ></md-input-item>
                <md-input-item
                    title="真实姓名"
                    placeholder="请输入支付宝姓名"
                    v-model="applyForm.realName"
                    clearable
                ></md-input-item>
                <md-input-item
                    title="收款账号"
                    placeholder="请输入支付宝账号"
                    v-model="applyForm.collAccount"
                    clearable
                ></md-input-item>
                <div class="apply-btn-box">
                    <md-button @click="applySubmit" :loading="subLoading" :inactive="subLoading" type="primary">确认开通</md-button>
                </div>
            </md-field>
        </div>
        <div class="console-apply-desc">
            <p>开通店铺成为号主，即可发布账号出租、合租、互换等交易。</p>
        </div>
    </div>
</template>
<script>

export default {
    name: 'app-console-apply',
    middleware: 'auth',
    head () {
        return {
            title: '开通店铺 - 店铺工作台',
            meta: [
                { hid: 'description', name: 'description', content: '号子短租，开通店铺' }
            ]
        }
    },
    fetch({store, route, params}) {
        store.commit('SET_HEAD_TITLE', '开通店铺');
        store.commit('SET_IS_HOME', false);
    },
    data() {
        return {
            applyForm: {},
            subLoading: false
        }
    },
    created() {
        this.$store.commit('SET_HEAD_MENU_CONFIG', []);
    },
    methods: {
        async applySubmit() {
            if(this.vailForm()) {
                this.subLoading = true;
                let { name, phone, realName, collAccount } = this.applyForm;
                let res = await this.$api.openWorkBench({
                    shopName: name,
                    shopPhone: phone,
                    realName,
                    payUsername: collAccount
                }, this.$store.state.user.token);
                this.subLoading = false;
                console.log(res);
                if(res.code == 200) {
                    this.$Dialog.succeed({
                        title: '提交申请成功',
                        content: '请耐心等待平台审核',
                        confirmText: '确定',
                        onConfirm: () =>{
                            this.$router.replace('/user')
                        },
                    })
                } else {
                    this.$Dialog.failed({
                        title: '提交申请失败',
                        content: res.msg,
                        confirmText: '确定',
                    })
                }
            }
        },
        vailForm() {
            let formData = this.applyForm;
            if(!formData.name) {
                this.$Toast.info('请输入店铺名称');
                return false;
            }
            if(!formData.phone) {
                this.$Toast.info('请输入联系手机号');
                return false;
            }
            if(!formData.realName) {
                this.$Toast.info('请输入支付宝姓名');
                return false;
            }
            if(!formData.collAccount) {
                this.$Toast.info('请输入支付宝账号');
                return false;
            }
            return true;
        }
    },
}
</script>
<style lang="scss">
.console-apply-form {
    .md-field {
        border-radius: 16px;
    }
}
</style>
<style lang="scss" scope>
.console-apply-form {
    padding: 32px;
    .apply-btn-box {
        padding-top: 100px;
    }
}
.console-apply-desc {
    padding: 36px;
    p {
        color: #666;
        font-size: 28px;
        text-align: center;
    }
}
</style>