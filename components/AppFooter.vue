<template>
    <div id="footer" class="app-footer-container">
        <div class="footer-wrapper">
            Copyright &copy; 2020 <a href="/">号子短租</a>
            <span>粤ICP备17031751号-3</span>
        </div>
    </div>
</template>
<script>
export default {
    name: 'app-footer'
}
</script>
<style lang="scss" scope>
#footer {
    height: 80px;
    background-color: #fff;
    .footer-wrapper {
        font-size: 26px;
        color: #666;
        text-align: center;
        line-height: 70px;
        a {
            color: #666;
        }
    }
}
</style>