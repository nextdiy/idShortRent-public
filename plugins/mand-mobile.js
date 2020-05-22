import Vue from 'vue'
//RadioList,DatePicker,Selector,Stepper,Tag,DropMenu,RadioBox,RadioGroup,ActionBar,Icon
import {
    Field,
    Button,
    Dialog,
    InputItem,
    Toast,
    TextareaItem,
    FieldItem,
    CellItem,
    TabBar,
    Amount,
    Skeleton
} from 'mand-mobile'

import AppScrollView from '~/components/AppScrollView'
import AppHeader from '~/components/AppHeader'

Vue.component(AppHeader.name, AppHeader);
Vue.component(AppScrollView.name, AppScrollView);
Vue.component(Field.name, Field);
Vue.component(Button.name, Button);
Vue.component(InputItem.name, InputItem);
Vue.component(TextareaItem.name, TextareaItem);
Vue.component(FieldItem.name, FieldItem);
Vue.component(CellItem.name, CellItem);
Vue.component(TabBar.name, TabBar);
Vue.component(Amount.name, Amount);
Vue.component(Skeleton.name, Skeleton)


// Vue.prototype.$Dialog = Dialog;
// Vue.prototype.$Toast = Toast;

export default ({ $axios }, inject) => {
    //axios = $axios;
    //将自定义函数交于nuxt
    // 使用方式1：在vue中，this.$api.函数名()
    // 使用方式2：在nuxt的asyncData中，content.app.$api.函数名()
    inject('Dialog', Dialog);
    inject('Toast', Toast);
}



