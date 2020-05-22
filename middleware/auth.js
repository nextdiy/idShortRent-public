export default function ({ store, redirect, route }) {
    let { token = null } = store.state.user;
    if (!token) {
      return redirect('/user/login?ref=' + encodeURIComponent(route.fullPath))
    }
}