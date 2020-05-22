<template lang="html">
  <div class="loading-page" v-if="loading">
   <div class="sk-wave">
      <div class="sk-rect sk-rect1"></div>
      <div class="sk-rect sk-rect2"></div>
      <div class="sk-rect sk-rect3"></div>
      <div class="sk-rect sk-rect4"></div>
      <div class="sk-rect sk-rect5"></div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    loading: true
  }),
  methods: {
    start () {
      this.loading = true;
    },
    finish () {
      this.loading = false;
    }
  }
}
</script>
<style lang="scss" scoped>
.loading-page {
  color: #fff;
  position: fixed;
  right: 0;
  top: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  text-align: center;
  z-index: 999999;
  display: flex;
  align-items: center;
  padding-bottom: 200px;
}
.sk-wave {
  margin: 40px auto;
  width: 80px;
  height: 60px;
  text-align: center;
  font-size: 10px; }
  .sk-wave .sk-rect {
    background-color: $app-primary-color;
    height: 100%;
    width: 8px;
    display: inline-block;
    -webkit-animation: sk-waveStretchDelay 1.2s infinite ease-in-out;
            animation: sk-waveStretchDelay 1.2s infinite ease-in-out; }
  .sk-wave .sk-rect1 {
    -webkit-animation-delay: -1.2s;
            animation-delay: -1.2s; }
  .sk-wave .sk-rect2 {
    -webkit-animation-delay: -1.1s;
            animation-delay: -1.1s; }
  .sk-wave .sk-rect3 {
    -webkit-animation-delay: -1s;
            animation-delay: -1s; }
  .sk-wave .sk-rect4 {
    -webkit-animation-delay: -0.9s;
            animation-delay: -0.9s; }
  .sk-wave .sk-rect5 {
    -webkit-animation-delay: -0.8s;
            animation-delay: -0.8s; }

@-webkit-keyframes sk-waveStretchDelay {
  0%, 40%, 100% {
    -webkit-transform: scaleY(0.4);
            transform: scaleY(0.4); }
  20% {
    -webkit-transform: scaleY(1);
            transform: scaleY(1); } }

@keyframes sk-waveStretchDelay {
  0%, 40%, 100% {
    -webkit-transform: scaleY(0.4);
            transform: scaleY(0.4); }
  20% {
    -webkit-transform: scaleY(1);
            transform: scaleY(1); } }
</style>