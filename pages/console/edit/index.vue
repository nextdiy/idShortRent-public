<template>
    <div class="console-edit-container">
        <app-header slot="app-header"/>
        <div class="console-edit__form">
            <md-field title="设置店铺资料">
                <md-field-item solid title="店铺logo" content="">
                    <div class="form-upload" slot="default">
                        <app-image-upload-picker 
                            :images="imageList" 
                            :imgNum="1" 
                            @onReaderComplete="handleOnReaderComplete"
                            @onDeleteImage="handleOnDeleteImage"/>
                    </div>
                </md-field-item>
                <md-input-item
                    title="店铺名称"
                    placeholder="请输入店铺名称"
                    v-model="editForm.shopName"
                    :maxlength="8"
                ></md-input-item>
                <md-textarea-item
                    title="店铺公告"
                    autosize
                    class="example"
                    v-model="editForm.shopIntroduce"
                    placeholder="请输入店铺公告"
                />
                <md-input-item
                    title="联系手机"
                    placeholder="请输入联系手机号"
                    type="phone"
                    v-model="editForm.shopPhone"
                ></md-input-item>
                <md-input-item
                    title="联系微信"
                    placeholder="请输入联系微信号"
                    v-model="editForm.shopWcNumber"
                ></md-input-item>
                <md-input-item
                    title="联系QQ"
                    type="digit"
                    placeholder="请输入联系QQ号"
                    v-model="editForm.shopQqNumber"
                ></md-input-item>
                <div class="edit-btn-box">
                    <md-button @click="editSubmit" :loading="subLoading" :inactive="subLoading" type="primary">确认保存</md-button>
                </div>
            </md-field>
        </div>
        <!-- 上传图片进度框 -->
        <md-popup v-model="isShowProgress" slot="app-other" :mask-closable="false">
            <div class="md-example-popup md-example-popup-center">
                <div class="loader-loading">
                    <div></div>
                </div>
                正在上传头像
            </div>
        </md-popup>
    </div>
</template>
<script>
const IMAGE_URL = 'http://image.idsdz.com/images/'
import AppImageUploadPicker from '~/components/AppImageUploadPicker'
import { Popup } from 'mand-mobile'
export default {
    name: 'app-console-edit',
    head () {
        return {
            title: '店铺装修 - 店铺工作台',
            meta: [
                { hid: 'description', name: 'description', content: '号子短租，店铺装修' }
            ]
        }
    },
    fetch({store, route, params}) {
        store.commit('SET_HEAD_TITLE', '店铺装修');
        store.commit('SET_IS_HOME', false);
    },
    components: {
        [Popup.name]: Popup,
        'app-image-upload-picker': AppImageUploadPicker
    },
    computed: {
        appToken() {
            return this.$store.state.user.token;
        }
    },
    data() {
        return {
            editForm: {},
            imageList: [],
            //上传进度显示框
            isShowProgress: false,
            subLoading: false
        }
    },
    methods: {
        async editSubmit() {
            console.log(this.editForm);
            this.subLoading = true;
            let { result } = await this.startUploadImg();
            if(result === 'ok') {
                let { logo, shopName, shopIntroduce, shopPhone, shopWcNumber, shopQqNumber } = this.editForm
                let params = {
                    logo,
                    shopName,
                    introduce: shopIntroduce,
                    phone: shopPhone,
                    wcNumber: shopWcNumber,
                    qqNumber: shopQqNumber
                };
                let { code, data } = await this.$api.updateBenchDetails(params, this.appToken);
                if(code != 200) {
                    this.$Dialog.alert({
                        title: '编辑失败',
                        content: '请重新尝试',
                        confirmText: '确定',
                        onConfirm: () => console.log('[Dialog.alert] confirm clicked'),
                    })
                    return;
                }
                this.$Toast.succeed("编辑成功");
                //刷新店铺信息
                this.getBenchShopDetails();
                // this.$Dialog.succeed({
                //     title: '编辑成功',
                //     content: '',
                //     confirmText: '确定',
                //     onConfirm: () => {
                //         //更新店铺信息

                //     },
                // })
            }
            this.subLoading = false;
        },
        //data = {dataUrl, blob}
        handleOnReaderComplete(data) {
            this.imageList.push(data);
        },
        handleOnDeleteImage(index) {
            this.imageList.splice(index, 1)
        },
        async initData() {
            this.$Toast.loading("Loading...")
            await this.getBenchShopDetails();
            this.$Toast.hide();
        },
        async initLoadRefresh(callback) {
            await this.getBenchShopDetails();
            callback && callback();
        },
        async getBenchShopDetails() {
            let { code, data = {} } = await this.$api.getBenchDetail(this.appToken);
            if(code == 200) {
                this.imageList = [].concat({
                    dataUrl: data.shopAvatar,
                    uploaded: /^(http|https)/.test(data.shopAvatar) ? true : false
                })
                this.editForm = {
                    ...data,
                    shopWcNumber: data.shopWcNumber || '',
                    shopQqNumber: data.shopQqNumber || ''
                };
                this.$store.commit('app/SET_BENCH_DETAIL', Object.assign({}, data));
            }
        },
        startUploadImg() {
            return new Promise(async (resolve, reject) => {
                this.isShowProgress = true;
                try {
                    let list = this.imageList;
                    //this.uploadedNum = 0;
                    //this.editForm.logo = '';
                    for(let i=0; i<list.length; i++) {
                        console.log(list[i]);
                        if(!list[i].uploaded) {
                            let formData = new FormData();
                            formData.append('file', list[i].blob, new Date().getTime() + '.png');
                            let { code, data} = await this.$api.uploadImgFile(formData, this.appToken);
                            if(code == 200) {
                                list[i].uploaded = true;
                                this.editForm.logo = IMAGE_URL + data.url;
                            }
                        } else {
                            //无需再上传，直接保存
                            this.editForm.logo = list[i].dataUrl;
                        }
                        //this.uploadedNum = this.editForm.descriptionImages.length;
                    }
                    console.log(this.editForm);
                } catch (error) {
                    console.log(error);
                    this.isShowProgress = false;
                    this.$Dialog.alert({
                        title: '上传图片失败',
                        content: '请重新尝试',
                        confirmText: '确定',
                        onConfirm: () => console.log('[Dialog.alert] confirm clicked'),
                    })
                    this.subLoading = false;
                    resolve({result: 'error'})
                }
                this.isShowProgress = false;
                resolve({result: 'ok'})
            })
        },
    },
    mounted() {
        this.initData();
    },
}
</script>
<style lang="scss">
.console-edit__form{
    .md-field {
        border-radius: 16px;
    }
}
</style>
<style lang="scss" scope>
.console-edit__form{
    padding: 32px 32px 0 32px;
    .form-upload {
        font-size: 28px;
    }
    .md-textarea-item__textarea {
        font-size: 28px;
    }
    .edit-btn-box {
        padding-top: 100px;
    }
}
.md-example-popup {
    position: relative;
    font-size: 28px;
    font-weight: 500;
    box-sizing: border-box;
    text-align: center;
    background-color: #FFF;
}
.md-example-popup-center {
    padding: 50px;
    border-radius: 16px;
}
.loader-loading {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 32px 0;
	div {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: 4px solid $app-primary-color;
        border-bottom-color: transparent;
        background: transparent;
        -webkit-animation: loaderAnimate 1s 0.23s linear infinite;
    }
}
@-webkit-keyframes loaderAnimate {
	0% {
		-webkit-transform: rotate(0);
	}
	50% {
		-webkit-transform: rotate(180deg);
	}
	100% {
		-webkit-transform: rotate(360deg);
	}
}
</style>