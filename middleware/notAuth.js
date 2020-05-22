export default function ({ store, redirect, route }) {
    let { token = null } = store.state.user;
    if (token) {
      let { ref = '/' } = route.query;
      ref = decodeURIComponent(ref);
      return redirect(ref);
    }
}