<template>
    <div class="app-scroll-wrapper">
        <slot name="app-header" />
        <div class="app-scroll-view" :style="computedWinInnerHeight">
            <md-scroll-view
                ref="scrollView"
                :scrolling-x="false"
                :auto-reflow="true"
                @refreshing="$_onRefresh"
                @end-reached="$_onEndReached">
                <slot name="header" slot="header" />
                <md-scroll-view-refresh
                    v-if="isLoadRefresh"
                    slot="refresh"
                    :refresh-text="refreshText"
                    slot-scope="{ scrollTop, isRefreshActive, isRefreshing }"
                    :scroll-top="scrollTop"
                    :is-refreshing="isRefreshing"
                    :is-refresh-active="isRefreshActive"/>
                <slot />
                <md-scroll-view-more
                    v-if="isLoadMore"
                    slot="more"
                    :is-finished="isFinished"/>
                <slot name="app-footer" slot="footer" />
            </md-scroll-view>
        </div>
        <slot name="app-other" class="app-other-container" />
    </div>
</template>
<script>
import {ScrollView, ScrollViewRefresh, ScrollViewMore} from 'mand-mobile'
export default {
    name: 'app-scroll-view',
    props: {
        isLoadMore: {
            type: Boolean,
            default: () => {
                return false
            }
        },
        isLoadRefresh: {
            type: Boolean,
            default: () => {
                return false
            }
        },
        refreshText: {
            type: String,
            default: () => {
                return '下拉刷新'
            }
        },
        isFinished: {
            type: Boolean,
            default: () => {
                return false
            }
        }
    },
    components: {
        [ScrollView.name]: ScrollView,
        [ScrollViewRefresh.name]: ScrollViewRefresh,
        [ScrollViewMore.name]: ScrollViewMore
    },
    data() {
        return {
            winInnerHeight: 0,
            initTimer: null
        }
    },
    computed: {
        computedWinInnerHeight() {
            return this.winInnerHeight > 0 ? `height: ${this.winInnerHeight}px` : `height: calc(100vh - 132px)`;
        }
    },
    methods: {
        $_onRefresh() {
            if(!this.isLoadRefresh) {
                this.$refs.scrollView.finishRefresh();
                return;
            }
            // async data
            this.$emit('loadRefresh', () => {
                setTimeout(() => {
                    this.$refs.scrollView.finishRefresh();
                }, 500)
            })
        },
        $_onEndReached() {
            if (this.isFinished || !this.isLoadMore) {
                this.$refs.scrollView.finishLoadMore();
                return;
            }
            // async data
            this.$emit('loadMore', () => {
                this.$refs.scrollView.finishLoadMore();
            })
        },
        initWinInnerHeight() {
            if(this.initTimer) {
                clearTimeout(this.initTimer);
            }
            this.initTimer = setTimeout(() => {
                this.winInnerHeight = window.innerHeight - 132;
            }, 100)
        }
    },
    mounted() {
        this.initWinInnerHeight();
        // window.ScrollViewTrigger1 = () => {
        //     this.$refs.scrollView.triggerRefresh()
        // }
        window.addEventListener('resize', this.initWinInnerHeight);
    },
    destroyed() {
        window.removeEventListener('resize', this.initWinInnerHeight)
    }
}
</script>
<style lang="scss" scope>
.app-scroll-wrapper {
    .md-scroll-view-more {
        padding: 0 0 32px 0;
    }
    .app-other-container {
        z-index: 99999;
    }
}

</style>