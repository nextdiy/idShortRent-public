<template>
    <div class="app-recharge-container">
        <app-header slot="app-header"/>
        <div class="recharge-class-list">
            <md-cell-item
                :title="selectedClassOption.text"
                brief=""
                addon="充值其他会员"
                arrow
                @click="showSelector">
                <span class="class-holder" slot="left">
                    <img v-lazy="selectedClassOption.images" :src="selectedClassOption.images" alt="selectedClassOption.name">
                </span>
            </md-cell-item>
        </div>
        <md-field :title="`${selectedClassOption.text}账号（${selectedClassOption.remark || '手机号'}）`" brief="该商品为自动充值，一般 1 至 10 分钟左右到账">
            <md-input-item
                v-model="selectedRechargeValue"
                brief=""
                type="digit"
                :placeholder="`请输入${this.selectedClassOption.text}账号`"
                :size="size"
                is-highlight
            />
            <div v-if="specList.length > 0" class="recharge-spec__item">
                <h4 class="recharge-spec__title">充值类型</h4>
                <div>
                    <md-radio-group v-model="goodsName">
                        <md-radio-box v-for="(item) in specList" :key="item.id" :name="item.goodsName">{{item.goodsName}}</md-radio-box>
                    </md-radio-group>
                </div>
            </div>
            <div v-if="subSpecList.length > 0" class="recharge-spec__item">
                <h4 class="recharge-spec__title">时长</h4>
                <div>
                    <md-radio-group v-model="subSpecIds">
                        <md-radio-box v-for="(item) in subSpecList" :key="item.sku" :disabled="item.status == 1" :name="item.skuIds">
                            {{item.name}}
                            <span v-if="item.status == 0">&yen; {{$Utils.formatMoney(item.price)}}</span>
                            <span v-else>维护中</span>
                        </md-radio-box>
                    </md-radio-group>
                </div>
            </div>
            <div class="recharge-sub__btn">
                <md-button @click="submitRecharge" :inactive="specList.length <= 0" type="primary">立即充值： &yen; {{computedTotalPrice}}</md-button>
            </div>
        </md-field>
        <!-- 会员类型选择器 -->
        <!-- 商品分类选择 -->
        <md-selector
            class="goods-class-selector"
            v-model="classIsSelectorShow"
            :default-value="classDefaultValue"
            :data="classData"
            hide-title-bar
            is-check
            iconSize="lg"
            @choose="classOnSelectorChoose">
            <template slot-scope="{ option, index, selected }">
                <!-- <div class="md-selector-custom-brief">{{ option.text }}使用slot-scope</div> -->
                <div class="selector-item-body" :class="{disabled: option.disabled, selected}">
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
    </div>
</template>
<script>
import {Selector, RadioBox, RadioGroup} from 'mand-mobile'
export default {
    name: 'app-recharge',
    head () {
        return {
            title: `充值中心 - 号子短租`,
            meta: [
                { hid: 'keywords', name: 'keywords', content: `号子短租,充值中心` },
                { hid: 'description', name: 'description', content: `提供各种视频会员直充,下单之后,一般一分钟左右到账` },
                { hid: 'sharename', name: 'sharename', itemprop: 'name', content: `号子短租 - 充值中心`},
                { hid: 'shareimage', name: 'shareimage', itemprop: 'image', content: '/icons/recharge.png'},
                { hid: 'shareogimage', name: 'shareogimage', property: 'og:image', content: '/icons/recharge.png' },
                { hid: 'sharedesc', name: 'sharedesc', itemprop: 'description', content: '提供各种视频会员直充,下单之后,一般一分钟左右到账' }
            ]
        }
    },
    fetch({store, route, params}) {
        store.commit('SET_HEAD_TITLE', '充值中心');
        store.commit('SET_IS_HOME', false);
    },
    components: {
        [Selector.name]: Selector,
        [RadioBox.name]: RadioBox,
        [RadioGroup.name]: RadioGroup,
    },
    watch: {
        goodsName(newVal) {
            console.log(newVal)
            let selectedSpec = this.specList.filter(item => {
                return item.goodsName == newVal
            })
            if(selectedSpec.length > 0) {
                this.subSpecList = selectedSpec[0].spec;
                for(let v=0; v<this.subSpecList.length; v++) {
                    if(this.subSpecList[v].status == 0) {
                        this.subSpecIds = this.subSpecList[v].skuIds;
                        break;
                    }
                }
            }else {
                this.subSpecList = [];
            }
        }
    },
    data() {
        return {
            selectedRechargeValue: '',
            selectedClassOption: {
                value: 1, 
                text: '芒果TV',
                describe: '',
                images: '//image.idsdz.com/category/other_vip.png'
            },
            classIsSelectorShow: false,
            classData: [],
            classDefaultValue: 1,
            goodsName: '',
            subSpecIds: '',
            specList: [],
            subSpecList:[]
        }
    },
    computed: {
        size() {
            return this.selectedRechargeValue.length > 15 ? 'small' : 'large'
        },
        computedTotalPrice: function() {
            let subSpecIds = this.subSpecIds;
            let specList = this.subSpecList.filter(item => {
                return item.skuIds == subSpecIds
            })
            return this.$Utils.formatMoney(specList[0] && specList[0].price || 0);
        },
        goodsSpecName: function() {
            let subSpecIds = this.subSpecIds;
            let specList = this.subSpecList.filter(item => {
                return item.skuIds == subSpecIds
            })
            return specList[0] && specList[0].name || '未知';
        }
    },
    methods: {
        showSelector() {
            if(this.classData.length <= 0) {
                this.$Toast.info('暂无其他会员');
                return;
            }
            this.classIsSelectorShow = true
        },
        async classOnSelectorChoose(val) {
            console.log(val);
            this.selectedClassOption = val;
            let id = val.value;
            //获取该商品
            await this.getDirectGoods(id);
            let specList = this.specList;
            if(specList.length > 0) {
                this.goodsName = specList[0].goodsName;
                this.subSpecList = specList[0].spec;
                for(let v=0; v<this.subSpecList.length; v++) {
                    if(this.subSpecList[v].status == 0) {
                        this.subSpecIds = this.subSpecList[v].skuIds;
                        break;
                    }
                }
            } else {
                this.subSpecList = [];
            }
        },
        submitRecharge() {
            let value = this.selectedRechargeValue;
            if(!value) {
                this.$Toast.info("请输入需要充值的账号");
                return;
            }
            this.$Dialog.confirm({
                title: `${this.selectedClassOption.text}（${this.goodsName}）- ${this.goodsSpecName}`,
                content: `请确认充值的账号：${value}`,
                confirmText: '确定',
                onConfirm: () => {
                    //跳转到支付台
                    this.$router.push({
                        path: `/cashier/${this.selectedClassOption.value}`,
                        query: {
                            skuIds: this.subSpecIds,
                            type: 1,
                            remark: value
                        }
                    });
                },
            })
        },
        async initData() {
            await this.getDirectCategory();
            //取第一个类目
            if(this.classData.length > 0) {
                this.selectedClassOption = this.classData[0];
                let id = this.classDefaultValue = this.selectedClassOption.value;
                //获取该商品
                await this.getDirectGoods(id);
                let specList = this.specList;
                if(specList.length > 0) {
                    this.goodsName = specList[0].goodsName;
                    this.subSpecList = specList[0].spec;
                    for(let v=0; v<this.subSpecList.length; v++) {
                        if(this.subSpecList[v].status == 0) {
                            this.subSpecIds = this.subSpecList[v].skuIds;
                            break;
                        }
                    }
                } else {
                    this.subSpecList = [];
                }
            }
        },
        async getDirectCategory() {
            this.$Toast.loading("Loading...");
            try {
                let { code, data } = await this.$api.getDirectCategory();
                this.$Toast.hide();
                if(code == 200) {
                    let { categorySub = [] } = data;
                    this.classData = categorySub.map(item => {
                        return {
                            ...item,
                            value: item.id, 
                            text: item.name,
                            images: item.images
                        }
                    })
                }
            } catch (error) {
                console.error(error)
            }
        },
        async getDirectGoods(categoryId) {
            this.$Toast.loading("Loading...");
            try {
                //value
                let { code, data } = await this.$api.getDirectGoods(categoryId);
                this.$Toast.hide();
                if(code == 200) {
                    this.specList = data;
                    //console.log("guige", this.specList)
                }
            } catch (error) {
                console.error(error);
            }
        }
    },
    mounted() {
        this.initData();
    }
}
</script>
<style lang="scss" scoped>
.app-recharge-container {
    .recharge-class-list {
        padding: 0 32px;
        background-color: #fff;
    }
    .class-holder {
        width: 96px;
        height: 96px;
        display: block;
        overflow: hidden;
        img {
            width: 100%;
            height: auto;
            border-radius: 50%;
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
    .recharge-spec__item {
        padding-top: 36px;
        .recharge-spec__title {
            font-size: 32px;
            margin-bottom: 32px;
        }
    }
    .recharge-sub__btn {
        padding-top: 82px;
    }
    .md-radio-group {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-column-gap: 5%;
        grid-row-gap: 38px;
        .md-check-base-box {
            padding: 26px 16px;
            border-radius: 8px;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            font-weight: bold;
            span {
                font-size: 26px;
                margin-top: 8px;
            }
        }
    }

}
</style>