<template>
    <div class="app-search-container">
        <div class="search-bar-wrapper" :class="{'slide-down':isVisiabled}">
            <div v-if="isClose" class="close" @click="closeSearchBar">
                <i class="iconfont icon-close"></i>
            </div>
            <div v-else class="close" @click="linkBack">
                <i class="iconfont icon-back"></i>
            </div>
            <div class="search-box">
                <input type="text" v-model="searchContent" @input="handleContentChange" class="search-box__input" :placeholder="placeHolder">
                <i class="search-box__line"></i>
                <button @click="handleSearchSubmit" class="search-box__btn">搜索</button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'app-search-bar',
    props: {
        visiabled: {
            type: Boolean,
            default: () => {
                return false;
            }
        },
        content: {
            type: String,
            default: ''
        },
        placeHolder: {
            type: String,
            default: '请输入内容'
        },
        isClose: {
            type: Boolean,
            default: () => {
                return false
            }
        }
    },
    data() {
        return {
            searchContent: this.content,
            isVisiabled: this.visiabled
        }
    },
    watch: {
        visiabled(val) {
            this.isVisiabled = val;
        },
        isVisiabled(val) {
            this.$emit('update:visiabled', val)
        },
        content(val) {
            this.searchContent = val;
        },
        searchContent(val) {
            this.$emit('update:content', val)
        }
    },
    methods: {
        linkBack() {
            if(window.history.length > 1 && this.$router.go(-1)) {
                this.$router.go(-1);
            } else {
                this.$router.push('/');
            }  
        },
        closeSearchBar() {
            this.$emit('update:content', '')
            this.$emit('update:visiabled', false)
            this.$emit('close', false);
        },
        handleSearchSubmit() {
            this.$emit('search', this.searchContent);
        },
        handleContentChange() {
            this.$emit('change', this.searchContent);
        }
    }
}
</script>
<style lang="scss" scope>
.search-bar-wrapper {
    width: 100%;
    height: $app-header-height;
    padding: 0 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #fff;
    background-color: $app-primary-color;
    position: fixed;
    top: -$app-header-height;
    left: 0;
    right: 0;
    z-index: 100001;
    .close {
        width: 88px;
        .iconfont {
            font-size: 54px;
        }
    }
    .search-box {
        flex: 1;
        color: #fff;
        background-color: #fff;
        border-radius: 8px;
        display: flex;
        justify-content: space-between;
        height: 96px;
        padding: 12px 0;
        .search-box__input {
            color: $app-primary-color;
            font-size: 28px;
            flex: 1;
            background: none;
            border: none;
            padding: 0 24px;
            &:focus {
                outline: none;
            }
        }
        .search-box__line {
            width: 1px;
            height: 100%;
            background-color: #f3f3f3;
            
        }
        .search-box__btn {
            width: 112px;
            background: none;
            border: none;
            font-size: 28px;
            color: $app-primary-color;
            &:focus {
                outline: none;
            }
        }
    }
}
.search-bar-wrapper.slide-down {
    animation: slideDown 0.15s forwards;
}
.search-bar-wrapper.slide-up {
    animation: slideUp 0.15s forwards;
}
@keyframes slideDown {
    from {
        display: block;
        top: -$app-header-height;
    }
    to {
        top: 0;
    }
}
@keyframes slideUp {
    from {
        top: 0;
    }
    to {
        top: -$app-header-height;
        display: none;
    }
}
</style>