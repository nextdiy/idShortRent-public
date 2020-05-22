<template>
  <div id="other-main">
    <div class="header-other-container">
        <div class="logo" @click="$router.push('/')">
            <span>号子短租</span>
        </div>
    </div>
    <nuxt />
  </div>
</template>
<script>
import AppHeader from '~/components/AppHeader'
export default {
    name: 'app-other-main',
    components: {
        'app-header': AppHeader
    }
}
</script>
<style lang="scss" scope>
.header-other-container {
    width: 100%;
    height: $app-header-height;
    padding: 0 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #fff;
    .logo {
        color: #333;
        font-size: 36px;
        display: inline-block;
        background-image: url('../static/icons/logo_primary.png');
        background-repeat: no-repeat;
        background-size: auto 50px;
        padding-left: 84px;
    }
}
</style>