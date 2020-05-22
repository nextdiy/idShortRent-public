const Cookie = process.client ? require('js-cookie') : undefined
 export default function({ app, $axios, redirect, store, route }) {
    $axios.onRequest(config => {
        // if(config.method === 'post') {
        //     config.headers['Content-Type'] = 'application/json'
        // }
        // config.data = qs.stringify(config.data, {
        //     allowDots: true //Option allowDots can be used to enable dot notation
        // });
        return config;
    });
 
    $axios.onResponse(response => {
        return Promise.resolve(response);
    });
    
    $axios.onError(error => {
        const code = parseInt(error.response && error.response.status)
        if (code === 404 || code === 504) {
            //redirect('/404')
            app.$Toast.info("服务器开小差了~~")
        }
        if (code === 500) {
            app.$Toast.info("服务器发生错误，请稍后重试")
        }
        if (code === 400) {
            app.$Toast.info("请求无效")
        }
        if (code === 401) {
            Cookie.set('token', '');
            store.commit('user/SET_TOKEN', null);
            store.commit('user/SET_USER_INFO', {});
            redirect('/user/login?ref=' + encodeURIComponent(route.fullPath));
        }
        setTimeout(() => {
            app.$Toast.hide();
        }, 3000)
    });
}