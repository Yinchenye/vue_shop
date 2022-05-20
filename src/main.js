// 引入公共样式
import "./assets/css/publicstyle.css";
import Vue from "vue";
import App from "./App.vue";
// 引入vue-router
import vueRouter from "vue-router";
import router from "./router/index.js";
Vue.use(vueRouter);
// 引入Element-Ui文件
import "./plugins/elementui.js";
// import ElementUI from "element-ui";
// import "element-ui/lib/theme-chalk/index.css";
// Vue.use(ElementUI);

// 引入并配置axios
import axios from "axios";
// 设置axios的基准路径
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/";
// 将axios挂载到vue原型对象中，避免后续每个文件引入，使用$http代替axios
Vue.prototype.$http = axios;

Vue.config.productionTip = false;
new Vue({
  render: (h) => h(App),
  router,
}).$mount("#app");
