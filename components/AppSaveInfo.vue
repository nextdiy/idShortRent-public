<template>
    <div class="app-save-container">
        <md-dialog
            class="app-save-info"
            title="请完善联系方式"
            :closable="true"
            v-model="isOpenShow"
            :btns="basicDialog.btns"
            transition="md-zoom"
        >
            <md-field>
                <md-input-item
                    ref="name"
                    preview-type="text"
                    v-model="contactValue"
                    title="微信/QQ/手机号"
                    placeholder="请输入你的联系方式"
                    brief="以便在租用账号使用过程中出现问题，号主能及时联系上你。"
                    is-title-latent
                ></md-input-item>
            </md-field>
        </md-dialog>
    </div>
</template>
<script>
import { Dialog } from 'mand-mobile'
export default {
    name: 'app-save-info',
    components: {
        [Dialog.name]: Dialog
    },
    props: {
        isOpen: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        isOpen(val) {
            this.isOpenShow = val;
        },
        isOpenShow(val) {
            this.$emit('update:isOpen', val);
        }
    },
    data() {
        return {
            isOpenShow: this.isOpen,
            basicDialog: {
                btns: [
                    {
                        text: '取消',
                        handler: this.onBasicCancel,
                    },
                    {
                        text: '确认保存',
                        handler: this.onBasicConfirm,
                    },
                ],
            },
            contactValue: ''
        }
    },
    computed: {
        appToken() {
            return this.$store.state.user.token;
        }
    },
    methods: {
        onBasicCancel() {
            this.isOpenShow = false
            this.$emit('onCancel');
        },
        async onBasicConfirm() {
            if(!this.contactValue) {
                this.$Toast.failed("请填写联系方式")
                return;
            }
            this.$Toast.loading("Loading...")
            let {code} = await this.$api.savaUserContact(this.contactValue, this.appToken);
            this.$Toast.hide();
            if(code == 200) {
                //刷新用户信息
                await this.$store.dispatch('user/GetUserInfo');
            }
            this.isOpenShow = false
            this.$emit('onConfirm');
        }
    } 
}
</script>

<style lang="scss" scope>
.app-save-info {
    border: 1px solid red;
    .md-field {
        padding: 0 32px;
    }
    .md-field-item-children {
        margin-top: 32px;
    }
}
</style>