const cookieparser = process.server ? require('cookieparser') : undefined
const Cookie = process.client ? require('js-cookie') : undefined

export const state = () => ({
    isFixed: false, //头部浮动状态
    scrollTop: 0, //头部滚动距离
    isHome: true, //是否是首页
    headTitle: '', //导航标题
    headMenuConfig: [], //导航菜单
})

export const getters = {
    isFixed: state => state.isFixed,
    scrollTop: state => state.scrollTop,
    isHome: state => state.isHome,
    headTitle: state => state.headTitle,
    headMenuConfig: state => state.headMenuConfig
}
  
export const mutations = {
    SET_IS_FIXED (state, data) {
        state.isFixed = data;
    },
    SET_SCROLL_TOP (state, data) {
        state.scrollTop = data;
    },
    SET_IS_HOME (state, data) {
        state.isHome = data;
    },
    SET_HEAD_TITLE (state, data) {
        state.headTitle = data;
    },
    SET_HEAD_MENU_CONFIG(state, data) {
        state.headMenuConfig = data;
    }
}

export const actions = {
    nuxtServerInit ({ commit }, { req }) {
        let token = null
        if (req.headers.cookie) {
          const parsed = cookieparser.parse(req.headers.cookie)
          try {
            token = parsed.token;
          } catch (err) {
            // No valid cookie found
          }
        }
        commit('user/SET_TOKEN', token)
    },
    UserSignOut ({ state, commit }) {
        return new Promise(async (resolve, reject) => {
            let data = await this.$api.userSignOut(state.user.token);
            console.log(data);
            commit('user/SET_TOKEN', null);
            commit('user/SET_USER_INFO', {});
            commit('app/SET_RECOMMENT_GOODS', []);
            commit('app/SET_BENCH_DETAIL', {});
            Cookie.set("token", '');
            resolve()
        })
    }
}