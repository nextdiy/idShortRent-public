<template>
    <div class="app-alliance-container">
        <app-header />
        <div>号子联盟</div>
    </div>
</template>
<script>
export default {
    name: 'app-console-alliance',
    fetch({store, route, params}) {
        store.commit('SET_HEAD_TITLE', '号子联盟');
        store.commit('SET_IS_HOME', false);
    },
}
</script>
<style lang="scss" scope>
    
</style>