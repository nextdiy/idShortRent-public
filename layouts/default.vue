<template>
  <div id="app">
    <!-- <app-header :menu="headMenuConfig"/> -->
    <nuxt ref="nuxtView" />
    <!-- <app-footer /> -->
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import AppHeader from '~/components/AppHeader'
import AppFooter from '~/components/AppFooter'
export default {
  components: {
    'app-header': AppHeader,
    'app-footer': AppFooter,
  },
  computed: {
    ...mapGetters(['isFixed', 'headMenuConfig']),
  },
  mounted() {
    console.log(this.$store.state)
    //监控页面滚动条
    //window.addEventListener('scroll', this.handleScroll);
  },
  methods: {
    //滚动事件处理
    // handleScroll: function() {
    //     let scrollTop = Math.floor(window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop);
    //     //是否浮动
    //     let isFixed = scrollTop > 145;
    //     this.$store.commit('SET_IS_FIXED', isFixed);
    //     this.$store.commit('SET_SCROLL_TOP', scrollTop);
    // },
  },
  destroyed() {
    //window.removeEventListener("scroll", this.handleScroll); // 监听（绑定）滚轮滚动事件
  }
}
</script>
<style lang="scss" scope>

</style>
