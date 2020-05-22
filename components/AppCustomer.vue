<template>
    <div class="app-customer-container">
        <md-popup
            class="inner-popup"
            v-model="isPopupShow"
            @hide="hidePopUp('align')"
            position="bottom">
            <md-popup-title-bar
                only-close
                large-radius
                :title="`${customerInfo.shopName} - 联系方式`"
                describe=""
                title-align="left"
                @cancel="hidePopUp('align')"/>
            <div class="md-example-popup customer-popup-align">
                <div class="customer-pupup-wrap">
                    <div v-if="customerInfo.shopWcNumber" class="customer-item" @click="copyText($event, customerInfo.shopWcNumber, '微信号')">
                        <i style="color: #46bb36;" class="iconfont icon-weixin"></i>
                    </div>
                    <div v-if="customerInfo.shopQqNumber" class="customer-item" @click="copyText($event, customerInfo.shopQqNumber, 'QQ号')">
                        <a :href="`mqqwpa://im/chat?chat_type=wpa&uin=${customerInfo.shopQqNumber}&version=1&src_type=web&web_src=oicqzone.com`">
                            <i style="color: #1296db;" class="iconfont icon-qq"></i>
                        </a>
                    </div>
                    <p v-if="customerInfo.shopWcNumber || customerInfo.shopQqNumber" class="tips">点击图标即可复制联系方式</p>
                    <p v-if="!customerInfo.shopWcNumber && !customerInfo.shopQqNumber" >暂无号主联系方式</p>
                </div>
            </div>
        </md-popup>
    </div>
</template>
<script>
import { Popup, PopupTitleBar } from 'mand-mobile'
export default {
    name: 'app-customer',
    props: {
        isPopup: {
            type: Boolean,
            default: false
        },
        customerInfo: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    components: {
        [Popup.name]: Popup,
        [PopupTitleBar.name]: PopupTitleBar
    },
    watch: {
        isPopup(val) {
            this.isPopupShow = val;
        },
        isPopupShow(val) {
            this.$emit('update:isPopup', val);
        }
    },
    data() {
        return {
            isPopupShow: this.isPopup
        }
    },
    methods: {
        hidePopUp(val) {
            this.$emit('update:isPopup', false);
        },
        copyText(e, content, msg = '') {
            this.$Utils.copyText(e, content).then(res => {
                this.$Toast.info(`复制${msg}成功`)
            }).catch(error => {
                console.log(error);
                this.$Toast.failed("当前浏览器不支持复制")
            })
        }
    }
}
</script>
<style lang="scss" scope>
.md-example-popup {
    position: relative;
    font-size: font-minor-large;
    background: color-bg-base;
    box-sizing: border-box;
    text-align: center;
    background-color: #FFF;
  }
  .customer-popup-align {
    padding: 0 40px;
    .customer-pupup-wrap {
      font-size: 64px;
      font-weight: 200;
      color: $app-primary-color;
      padding: 80px 0 150px 0;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      .customer-item {
        width: 148px;
        height: 148px;
        text-align: center;
        line-height: 148px;
        background-color: #f9fbfa;
        border-radius: 16px;
        margin-right: 32px;
        .iconfont {
            font-size: 96px;
        }
        &:active {
            background-color: #eef3fa;
        }
      }
      .customer-item:nth-last-child(2) {
        margin-right: 0;
      }
      .tips {
        color: #666;
        font-size: 28px;
        padding-top: 16px;
        position: absolute;
        bottom: 80px;
        width: 100%;
        display: inline-block;
        text-align: center;
      }
    }
}
</style>