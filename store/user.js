const Cookie = process.client ? require('js-cookie') : undefined

export const state = () => ({
    token: '',
    userInfo: {}
})

export const getters = {
    token: state => state.token,
    userInfo: state => state.userInfo
}
  
export const mutations = {
    SET_TOKEN (state, data) {
        //console.log("设置token");
        state.token = data;
    },
    SET_USER_INFO (state, data) {
        state.userInfo = data;
    }
}

export const actions = {
    Login ({ commit }, params) {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await this.$api.login(params);
                if(res.code == 200) {
                    let { access_token, token_type, expires_in } = res.data;
                    //let access_token = 'f7eec6c5-4ce5-4b78-8ef2-3ec69e40b63d'
                    commit('SET_TOKEN', access_token);
                    Cookie.set("token", access_token);
                }
                resolve(res)
            } catch (error) {
                reject(error);
                // if (error.response && error.response.status === 401) {
                //     throw new Error('Bad credentials')
                // }
                // throw error
            }
        })
    },
    wxLogin ({ commit }, wxCode) {
        return new Promise(async (resolve, reject) => {
            try {
                const resData = await this.$api.requestToWxLogin(wxCode);
                let { code, data } = resData;
                if(code == 200) {
                    let { access_token, token_type, expires_in } = data;
                    //let access_token = 'f7eec6c5-4ce5-4b78-8ef2-3ec69e40b63d'
                    commit('SET_TOKEN', access_token);
                    Cookie.set("token", access_token);
                }
                resolve(resData)
            } catch (error) {
                reject(error);
                // if (error.response && error.response.status === 401) {
                //     throw new Error('Bad credentials')
                // }
                // throw error
            }
        })
    },
    GetUserInfo ({ state, commit }) {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await this.$api.getUserInfo(state.token);
                if(res.code == 200) {
                    commit('SET_USER_INFO', res.data || {});
                }
                resolve(res)
            } catch (error) {
                reject(error)
            }
        })
    },
    
}