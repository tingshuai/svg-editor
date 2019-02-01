import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";
import vuescroll from "vuescroll";
import "vuescroll/dist/vuescroll.css";
import "./axios";
import "./mathjax";
import Snap from "imports-loader?this=>window,fix=>module.exports=0!snapsvg/dist/snap.svg.js";
import "./css/common.css";
import "../public/font/iconfont.css";
import "../public/font/iconfont.js";
import 'svg.js'
import 'svg.draggable.js'
// import 'svg.draw.js'
// import 'svg.select.js'
// import 'svg.resize.js'
// import 'svg.select.js/dist/svg.select.min.css'
Vue.prototype.Snap = Snap;

Vue.config.productionTip = false;

Vue.use(vuescroll, {
  ops: {
    vuescroll: {
      mode: "slide",
      zooming: false
    },
    rail: {
      background: "",
      size: "15px"
    },
    bar: {
      keepShow: true,
      size: "8px"
    },
    scrollButton: {
      enable: true
    }
  } // 在这里设置全局默认配置
});
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
