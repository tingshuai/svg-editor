import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";
import vuescroll from "vuescroll";
import "./axios";
import VueMathjax from 'vue-mathjax'
import Snap from "imports-loader?this=>window,fix=>module.exports=0!snapsvg/dist/snap.svg.js";
import "./css/common.css";
import "../public/font/iconfont.css";
import "../public/font/iconfont.js";
import 'svg.js'
import 'svg.draggable.js'
import $ from "jquery"
require('./js/svg.foreignobject.js');
// import 'svg.draw.js'
// import 'svg.select.js'
// import 'svg.resize.js'
// import 'svg.select.js/dist/svg.select.min.css'
import VueDraggableResizable from 'vue-draggable-resizable'
// import 'vue-draggable-resizable.css'
Vue.component('vue-draggable-resizable', VueDraggableResizable)
Vue.prototype.Snap = Snap;

Vue.config.productionTip = false;

window.MathJax.Ajax.config.path["mhchem"] = "https://cdnjs.cloudflare.com/ajax/libs/mathjax-mhchem/3.3.0";
window.MathJax.Hub.Config({
  showProcessingMessages: false, //关闭js加载过程信息
  messageStyle: "none", //不显示信息
  jax: ["input/TeX", "output/HTML-CSS"],
  tex2jax: {
    inlineMath: [["$", "$"], ["\\{", "\\}"]], //行内公式选择符
    displayMath: [["$$", "$$"], ["\\[", "\\]"]], //段内公式选择符
    skipTags: ["script", "noscript", "style", "textarea", "pre", "code", "a"], //避开某些标签
    processEscapes:true,
    processRefs:true
  },
  TeX: {
    extensions: ["https://cdnjs.cloudflare.com/ajax/libs/mathjax-mhchem/3.3.0/mhchem.js"]
  },
  "HTML-CSS": {
    availableFonts: ["STIX", "TeX"], //可选字体
    showMathMenu: false //关闭右击菜单显示
  },
  displayIndent:"50px",
});
Vue.use(VueMathjax)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
