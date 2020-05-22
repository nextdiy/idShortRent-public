export const state = () => ({
    recommendGoodsList: [], //首页推荐列表
    recommendParams: {
        page: 1,
        total: 1
    },
    isFinished: true,
    benchDetail: {}, //店铺基本信息
})

export const getters = {
    recommendGoodsList: state => state.recommendGoodsList,
    benchDetail: state => state.benchDetail,
    recommendParams: state => state.recommendParams,
    isFinished: state => state.isFinished
}
  
export const mutations = {
    SET_RECOMMENT_GOODS (state, data) {
        state.recommendGoodsList = data;
    },
    SET_BENCH_DETAIL (state, data) {
        state.benchDetail = data;
    },
    SET_RECOMMEND_PARAMS (state, data) {
        state.recommendParams = data;
    },
    SET_IS_FINISHED (state, data) {
        state.isFinished = data;
    }
}

export const actions = {
    async GetRecommendList ({ state, commit }) {
        let { data = [] } = await this.$api.getRecommendGoodsList();
        commit('app/SET_RECOMMENT_GOODS', data);
    }
}