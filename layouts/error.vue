<template>
    <div class="app-error-container">
         <md-result-page
            class="empty-result-wrapper"
            :img-url="checkResultPage.img"
            :text="checkResultPage.text">
        </md-result-page>
        <md-button v-if="error.statusCode != 404" class="nav-refresh-button" @click="refreshPage" type="primary">刷新一下</md-button>
        <md-button class="nav-home-button" @click="$router.push('/')" type="default">返回首页</md-button>
    </div>
</template>
<script>
import { ResultPage } from 'mand-mobile'
export default {
    name: 'app-error',
    props: ['error'],
    layout: 'otherMain',
    components: {
        [ResultPage.name]: ResultPage
    },
    computed: {
        checkResultPage() {
            return this.error.statusCode === 404 ? this.resultPage['404'] : this.resultPage['500'];
        }
    },
    data() {
        return {
            resultPage: {
                404: {
                    img: require('~/static/icons/404.png'),
                    text: '抱歉，你需要的页面找不到了~'
                },
                500: {
                    img: require('~/static/icons/500.png'),
                    text: '服务器发生错误，请稍后再重试'
                }
            },
        }
    },
    mounted() {
        
    },
    methods: {
        refreshPage() {
            window.location.reload();
        }
    }
}
</script>
<style lang="scss" scope>
.app-error-container {
    width: 100%;
    padding: 0 32px;
    .nav-refresh-button {
        margin-bottom: 64px;
    }
    .nav-refresh-button {
        &.md-button {
            font-size: 28px;
        }
        &.md-button.primary {
            background: $app-primary-color;
        }
        &.md-button.primary:after {
            border: 2px solid $app-primary-color;
        }
    }
    .nav-home-button {
        &.md-button {
            font-size: 28px;
        }
    }
    .empty-result-wrapper {
        height: 50vh;
        .md-result-image {
            width: 375px;
        }
    }
}
</style>