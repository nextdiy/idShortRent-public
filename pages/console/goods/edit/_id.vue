<template>
    <div class="goods-add-container">
        <app-header slot="app-header"/>
        <div class="goods-add__form">
            <md-field title="编辑商品信息">
                <md-field-item
                    title="商品分类"
                    :content="classSelectorValue || '请选择商品分类'"
                    @click.native="showSelector"
                    arrow="arrow-right"
                    align="right"
                />
                <md-input-item
                    title="商品名称"
                    placeholder="请输入商品名称"
                    v-model="editForm.goodsName"
                ></md-input-item>
                <md-input-item
                    title="商品账号"
                    placeholder="请输入商品账号"
                    v-model="editForm.username"
                ></md-input-item>
                <md-input-item
                    title="商品密码"
                    placeholder="请输入商品密码"
                    v-model="editForm.password"
                ></md-input-item>
                <md-field-item
                    title="到期时间"
                    arrow="arrow-right"
                    align="right"
                    :content="editForm.usernameExpire"
                    @click.native="isDatePickerShow = true">
                </md-field-item>
                <md-field-item title="同一时间出租次数">
                    <md-stepper slot="right" v-model="editForm.stockTotal" :step="1" :min="1" :max="5" is-integer />
                </md-field-item>
                <md-field-item solid title="设置规格" class="no-border no-padding-bottom" content="" />
                <md-field-item solid title="" content="">
                    <div class="form-goods-spec" slot="default">
                        <div class="goods-spec__item" v-for="(item, $index) in timeSpecList" :key="$index">
                            <div class="goods-spec__price">
                                <md-input-item
                                    title=""
                                    align="center"
                                    type="money"
                                    placeholder="请输入价格"
                                    v-model="item.price"
                                ></md-input-item>
                            </div>
                            <span class="label"> / 元 </span>
                            <div class="goods-spec__time">
                                <md-input-item
                                    title=""
                                    align="center"
                                    type="digit"
                                    placeholder="请输入时长"
                                    v-model="item.value"
                                ></md-input-item>
                            </div>
                            <div class="label tag-label">
                                 / 
                                <tag size="large" @click.native="openTimeSpecSelector($index)" shape="square" font-color="#FF8843" type="ghost">
                                    {{item.specText}} <i class="md-icon icon-font md-icon-arrow-right arrow-right md"></i>
                                </tag>
                                <md-button @click="deleteTimeSpec($index)" :inactive="$index === 0" type="link">删除</md-button>
                            </div>
                        </div>
                        <div class="goods-spec__add" v-show="this.timeSpecList.length < 5">
                            <md-button @click="addTimeSpec()" type="primary" size="small" inline plain>添加规格</md-button>
                        </div>
                    </div>
                </md-field-item>
                <md-textarea-item
                    title="商品描述"
                    autosize
                    class="no-border"
                    v-model="editForm.description"
                    placeholder="请输入商品描述"
                />
                <md-field-item solid title=" " content="">
                    <div class="form-upload" slot="default">
                        <app-image-upload-picker 
                            :images="imageList" 
                            :imgNum="3" 
                            @onReaderComplete="handleOnReaderComplete"
                            @onDeleteImage="handleOnDeleteImage"/>
                    </div>
                </md-field-item>
                <div class="edit-btn-box">
                    <md-button @click="editSubmit" :loading="subLoading" :inactive="subLoading" type="primary">确认编辑</md-button>
                </div>
            </md-field>
        </div>
        <!-- 商品分类选择 -->
        <md-selector
            slot="app-other"
            class="goods-class-selector"
            v-model="classIsSelectorShow"
            :default-value="editForm.categoryId"
            :data="classData"
            hide-title-bar
            is-check
            iconSize="lg"
            @choose="classOnSelectorChoose">
            <template slot-scope="{ option, index, selected }">
                <!-- <div class="md-selector-custom-brief">{{ option.text }}使用slot-scope</div> -->
                <div class="selector-item-body" :class="{disabled: option.disabled, selected: selected}">
                    <div class="selector-item-left">
                        <span class="holder" :style="`background-color: #ddd`">
                            <!-- <i :class="['iconfont', option.images]"></i> -->
                            <img :src="option.images" alt="">
                        </span>
                    </div>
                    <div class="selector-item-content">
                        <p class="selector-item-title" v-text="option.text"></p>
                        <!-- <p class="selector-item-brief" v-text="`${option.describe}-${index}`"></p> -->
                    </div>
                </div>
            </template>
        </md-selector>
        <!-- 时间规格选择 -->
        <md-selector
            v-model="timeIsSelectorShow"
            :default-value="timeSpecIndex"
            :data="timeSelections"
            max-height="480px"
            title="选择时间规格"
            is-check
            @choose="timeOnSelectorChoose" />
        <!-- 日期选择器 -->
        <div class="app-date-picker">
            <md-date-picker
                ref="datePicker"
                v-model="isDatePickerShow"
                type="custom"
                title="选择日期"
                today-text="今天"
                :line-height="112"
                :min-date="minDate"
                :default-date="currentDate"
                :custom-types="['yyyy', 'MM','dd']"
                @confirm="onDatePickerConfirm" />
        </div>
        <!-- 上传图片进度框 -->
        <md-popup v-model="isShowProgress" :mask-closable="false">
            <div class="md-example-popup md-example-popup-center">
                <div class="loader-loading">
                    <div></div>
                </div>
                正在上传 {{uploadedNum}} / {{this.imageList.length}} 图片
            </div>
        </md-popup>
    </div>
</template>

<script>
const IMAGE_URL = 'http://image.idsdz.com/images/'
import { DatePicker, Selector, Stepper, Tag, Popup } from 'mand-mobile'
import AppImageUploadPicker from '~/components/AppImageUploadPicker'
import md5 from 'md5'
export default {
    name: 'console-goods-add',
    middleware: 'auth',
    head () {
        return {
            title: '编辑商品 - 店铺工作台',
            meta: [
                { hid: 'description', name: 'description', content: '号子短租，编辑商品' }
            ]
        }
    },
    fetch({store, route, params}) {
        store.commit('SET_HEAD_TITLE', '编辑商品');
        store.commit('SET_IS_HOME', false);
    },
    components: {
        [DatePicker.name]: DatePicker,
        [Selector.name]: Selector,
        [Stepper.name]: Stepper,
        [Popup.name]: Popup,
        'app-image-upload-picker': AppImageUploadPicker,
        Tag
    },
    data() {
        return {
            editForm: {},
            minDate: undefined,
            currentDate: undefined,
            isDatePickerShow: false,
            //待上传图片列表
            imageList: [],
            //分类选择器
            classIsSelectorShow: false,
            classData: [],
            classSelectorValue: '',
            timeIsSelectorShow: false,
            //0：hour小时、1：day天、2：week周、3：month月
            timeSelections: [
                {
                    value: 0, //hour
                    text: '按小时'
                },
                {
                    value: 1, //day
                    text: '按天'
                },
                {
                    value: 2, //week
                    text: '按周'
                },
                {
                    value: 3, //month
                    text: '按月'
                }
            ],
            
            timeSelectorValue: '按小时',
            timeSpecList: [
                {
                    price: '',
                    value: '',
                    type: 0,
                    specText: '按小时'
                }
            ],
            timeSpecIndex: 0,
            //货架id
            appShelfId: null,
            subLoading: false,
            //上传进度显示框
            isShowProgress: false,
            uploadedNum: 0,
        }
    },
    computed: {
        getAppToken() {
            return this.$store.state.user.token
        },
        getUploadedImgNum() {
            return this.editForm.descriptionImages && this.editForm.descriptionImages.length || 0
        }
    },
    created() {
        this.$store.commit('SET_HEAD_MENU_CONFIG', []);
    },
    mounted() {
        let { id } = this.$route.params;
        let { goodsId } = this.$route.query;
        this.editForm.shelfId = id;
        this.minDate = new Date();
        this.currentDate = new Date();
        this.$set(this.editForm, 'usernameExpire', this.$Utils.formatDate(this.currentDate));
        this.initData(goodsId);
    },
    methods: {
        async initData(goodsId) {
            this.$Toast.loading('Loading...');
            //先获取类目
            await this.getGoodsCategory();
            //在获取详情
            await this.getBenchGoodsDetail(goodsId);
            this.$Toast.hide();
        },
        async getGoodsCategory() {
            let res = await this.$api.getGoodsCategory(this.getAppToken);
            console.log(res);
            let { code, data } = res;
            if(code == 200) {
                let { categorySub = []} = data;
                this.classData = categorySub.map((item,index) => {
                    return {
                        value: item.id,
                        text: item.name,
                        images: item.images
                    }
                })
            }
        },
        async getBenchGoodsDetail(goodsId) {
            let { code, data } = await this.$api.getBenchGoodsDetail(goodsId, this.getAppToken);
            console.log("加载商品", code);
            if(code != 200) {
                this.$Dialog.succeed({
                    title: '商品信息加载失败',
                    content: '请点击”确定“重新尝试',
                    confirmText: '确定',
                    onConfirm: () => {
                        this.getBenchGoodsDetail(goodsId);
                    },
                })
                return;
            }
            //账号信息处理
            console.log(data);
            let { id, shelfId, categoryId, goodsUsername, goodsPassword, expireTime,
            goodsName, description, stockTotal, skuJson, descriptionImages } = data;
            this.editForm = {
                id,
                shelfId,
                categoryId,
                goodsName,
                username: goodsUsername,
                password: goodsPassword,
                usernameExpire: this.$Utils.formatDate(new Date(expireTime)),
                stockTotal: stockTotal,
                description
            };
            //指向到期时间
            this.currentDate = new Date(expireTime);

            //处理分类选择问题
            this.classData.forEach(item => {
                if(item.value === this.editForm.categoryId) {
                    this.classSelectorValue = item.text;
                }
            })

            //规格
            let specList = JSON.parse(skuJson) || [];
            this.timeSpecList = specList.map(item => {
                console.log(JSON.stringify(item));
                return {
                    ...item,
                    specText: this.getTimeSelectionTag(item.type),
                    price: Number(item.price) / 100,
                    md5Hash: md5(JSON.stringify(item)), //生成md5 hash值，用作编辑提交前比较
                }
            })
            console.log(this.timeSpecList);
            //商品详情图
            this.imageList = descriptionImages.map(item => {
                return {
                    blob: null,
                    dataUrl: item,
                    uploaded: true, //代表已上传
                }
            })
        },
        verifyForm () {
            console.log(this.imageList);
            let { categoryId, goodsName, username, password, usernameExpire, stockTotal, description } = this.editForm;
            if(!categoryId) {
                this.showToast("请选择商品分类")
                return false;
            }
            if(!goodsName) {
                this.showToast("请填写商品名称")
                return false;
            }
            if(!username) {
                this.showToast("请填写商品账号")
                return false;
            }
            if(!password) {
                this.showToast("请填写商品密码")
                return false;
            }
            if(!usernameExpire) {
                this.showToast("请选择会员账号过期时间")
                return false;
            }
            if(!stockTotal) {
                this.showToast("请填写账号同一出租次数")
                return false;
            }
            if(this.timeSpecList[0] && !this.timeSpecList[0].value && !this.timeSpecList[0].price) {
                this.$Dialog.alert({
                    title: '请设置至少一个规格',
                    content: '例如：1 / 元 12 / 小时（按小时）',
                    cancelText: '取消',
                    confirmText: '确定',
                    onConfirm: () => console.log('[Dialog.alert] confirm clicked'),
                })
                return false;
            }
            if(!this.timeSpecList.every(item => item.value && item.price)) {
                this.showToast("请填写完整规格参数")
                return false;
            }
            //保存规格信息
            this.editForm.sku = this.timeSpecList;
            if(!description) {
                this.showToast("请填写商品描述/介绍/用法")
                return false;
            }
            if(this.imageList.length <= 0) {
                this.showToast("请至少上传一张商品描述的图片")
                return false;
            }
            console.log(this.editForm)
            return true;
        },
        async editSubmit() {
            if(this.verifyForm()) {
                this.subLoading = true;
                //开始上传图片
                let { result } = await this.startUploadImg();
                if(result === 'ok') {
                    let sku = this.editForm.sku.map(item => {
                        let {name, sku, skuIds, type, value, price, md5Hash } = item;
                        //价格转换
                        price = Number(price) * 100;
                        //取出sku信息组合生成md5与上次md5值比较（对象顺序，值类型与下面一致）
                        //{"price":200,"name":"24小时","sku":"da4fb5c6e93e74d3df8527599fa62642","skuIds":"120","type":0,"value":24}
                        let tempMd5 = md5(JSON.stringify({
                            price,
                            name,
                            sku,
                            skuIds,
                            type,
                            value: Number(value)
                        }))
                        //md5值不一致代表sku信息修改过了
                        if(md5Hash !== tempMd5) {
                            //sku赋值 = null
                            item.sku = null;
                        }
                        return {
                            ...item,
                            price
                        }
                    })
                    let params = {
                        ...this.editForm,
                        sku
                    }
                    //等待图片上传完毕之后，开始发布
                    let { code, msg } = await this.$api.updateBenchGoods(params, this.getAppToken);
                    this.subLoading = false;
                    if(code != 200) {
                        this.$Dialog.alert({
                            title: '商品编辑失败',
                            content: '请重新尝试',
                            confirmText: '确定',
                            onConfirm: () => console.log('[Dialog.alert] confirm clicked'),
                        })
                        return;
                    }
                    this.$Dialog.succeed({
                        title: '商品编辑成功',
                        content: '',
                        confirmText: '确定',
                        onConfirm: () => {
                            this.$router.replace('/console/goods');
                        },
                    })
                }
                this.subLoading = false;
            }
        },
        startUploadImg() {
            return new Promise(async (resolve, reject) => {
                this.isShowProgress = true;
                try {
                    let list = this.imageList;
                    this.uploadedNum = 0;
                    this.editForm.descriptionImages = [];
                    for(let i=0; i<list.length; i++) {
                        console.log(list[i]);
                        if(!list[i].uploaded) {
                            let formData = new FormData();
                            formData.append('file', list[i].blob, new Date().getTime() + '.png');
                            let { code, data} = await this.$api.uploadImgFile(formData, this.getAppToken);
                            if(code == 200) {
                                list[i].uploaded = true;
                                this.editForm.descriptionImages.push(IMAGE_URL + data.url);
                            }
                        } else {
                            //无需再上传，直接保存
                            this.editForm.descriptionImages.push(list[i].dataUrl);
                        }
                        this.uploadedNum = this.editForm.descriptionImages.length;
                    }
                    console.log(this.editForm);
                } catch (error) {
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
        onDatePickerConfirm(columnsValue) {
            //console.log(`[Mand Mobile] DatePicker Confirm\nvalue: ${JSON.stringify(columnsValue)}`)
            this.editForm.usernameExpire = this.$refs.datePicker.getFormatDate('yyyy-MM-dd');
            console.log(this.editForm.usernameExpire);
        },
        //data = {dataUrl, blob}
        handleOnReaderComplete(data) {
            this.imageList.push(data);
        },
        handleOnDeleteImage(index) {
            this.imageList.splice(index, 1)
        },
        showSelector() {
            this.classIsSelectorShow = true
        },
        classOnSelectorChoose({value, text}) {
            console.log(this.classData);
            console.log(value, text);
            this.classSelectorValue = text;
            this.editForm.categoryId = value;
        },
        timeOnSelectorChoose({value, text}) {
            console.log(value, text);
            //this.timeSelectorValue = text;
            this.$set(this.timeSpecList[this.timeSpecIndex], 'specText', text);
            this.$set(this.timeSpecList[this.timeSpecIndex], 'type', value);
            console.log(this.timeSpecList)
        },
        openTimeSpecSelector(index) {
            this.timeIsSelectorShow = true;
            this.timeSpecIndex = index;
            //this.timeSpecList[index].value;
        },
        deleteTimeSpec(index) {
            this.$Dialog.confirm({
                title: '提示',
                content: '请确认是否删除当前规格',
                confirmText: '确定',
                onConfirm: () => {
                    console.log("删除" + index);
                    this.timeSpecList.splice(index, 1);
                },
            })
        },
        addTimeSpec() {
            if(this.timeSpecList.length < 5) {
                this.timeSpecList.push({
                    price: '',
                    value: '',
                    type: 0,
                    specText: '按小时'
                })
            }
        },
        showToast(val) {
            this.$Toast({
                icon: 'fail',
                content: val,
                position: 'top'
            });
        },
        //获取规格文本
        getTimeSelectionTag(type) {
            let current = this.timeSelections.filter(item => {
                return item.value == type;
            })
            console.log("CURRENT" , current)
            return current.length > 0 && current[0].text || '未知';
        }
    }
}
</script>
<style lang="scss">
.md-field {
    border-radius: 16px;
}
</style>
<style lang="scss" scope>
.goods-add__form {
    padding: 32px;
    .edit-btn-box {
        padding-top: 100px;
    }
    .no-border {
        .md-field-item-content:before {
            border-bottom: none;
        }
    }
    .no-padding-bottom {
        .md-field-item-content {
            padding-bottom: 0;
        }
    }
    .form-goods-spec {
        padding-bottom: 32px;
        .goods-spec__item {
            display: flex;
            align-items: center;
            .goods-spec__price, .goods-spec__time {
                flex: 1;
            }
            .label {
                display: inline-block;
                padding: 0 24px;
                text-align: center;
                .md-tag {
                    margin-left: 12px;
                }
                .md-tag .size-large {
                    font-size: 28px;
                }
                .md-tag .shape-square {
                    padding: 8px 16px;
                    border-radius: 8px;
                }
            }
            .tag-label {
                padding-right: 0;
            }
        }
        .goods-spec__add {
            padding-top: 64px;
        }
    }
}
.goods-class-selector {
    .selector-item-body {
        display: flex;
        align-items: center;
        &.selected {
            .selector-item-content {
                color: #2f86f6;
            }
        }
        &.disabled {
            opacity: 0.3;
        }
    }
    .selector-item-left {
        flex-shrink: 0;
        margin-right: 32px;
        .holder {
            display: block;
            width: 88px;
            height: 88px;
            border-radius: 44px;
            font-size: 32px;
            font-weight: 500;
            color: #fff;
            text-align: center;
            line-height: 88px;
            img {
                width: 100%;
                height: auto;
                border-radius: 50%;
            }
        }
    }
    .selector-item-content {
      flex: 1;
      color: #111a34;
      font-size: 32px;
      line-height: 1.2;
      .selector-item-title {
        line-height: 1.2;
      }
      .selector-item-brief {
        color: #858b9c;
        font-size: 24px;
        line-height: 1.4;
        margin-top: 8px;
      }
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
</style>