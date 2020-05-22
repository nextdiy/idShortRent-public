<template>
    <app-scroll-view class="app-faq-container">
        <app-header slot="app-header"/>
        <div style="font-size: 42px; font-weight: bold; text-align: center;">
            <div style="padding: 24px 0;">首先打开短租（m.idsdz.com）网页，如下图</div>
            <img src="//image.idsdz.com/other/use_01.jpg" alt="">
            <img src="//image.idsdz.com/other/use_02.jpg" alt="">
            <img src="//image.idsdz.com/other/use_03.jpg" alt="">
            <img src="//image.idsdz.com/other/use_04.jpg" alt="">
            <img src="//image.idsdz.com/other/use_05.jpg" alt="">
            <img src="//image.idsdz.com/other/use_06.jpg" alt="">
            <img src="//image.idsdz.com/other/use_07.jpg" alt="">
            <div style="padding: 24px 0;">支付完找不到账号密码的看这里</div>
            <img src="//image.idsdz.com/other/use_08.jpg" alt="">
        </div>
    </app-scroll-view>
</template>
<script>
export default {
    name: 'app-faq',
    head () {
        return {
            title: '账号租用教程 - 号子短租',
            meta: [
                { hid: 'description', name: 'description', content: '号子短租，账号租用教程' }
            ]
        }
    },
    fetch({store, route, params}) {
        store.commit('SET_HEAD_TITLE', '账号租用教程');
        store.commit('SET_IS_HOME', false);
    },
}
</script>