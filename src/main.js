// 引入公共样式
import "./assets/css/publicstyle.css";
// 引入字体图标CSS样式
import "./assets/fonts/iconfont.css";
import Vue from "vue";
import App from "./App.vue";
// 引入vue-router
import vueRouter from "vue-router";
import router from "./router/index.js";
Vue.use(vueRouter);
// 引入Element-Ui文件
import "./plugins/elementui.js";
// 引入vue-table-with-tree-grid文件
import TreeTable from "vue-table-with-tree-grid";
Vue.component("tree-table", TreeTable);
// // 引入并配置axios
import axios from "axios";
// 设置axios的基准路径
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/";
// 通过axios请求拦截器添加token，保证拥有获取数据的权限
axios.interceptors.request.use((config) => {
  // 为请求头对象，添加token验证的Authorization 字段
  config.headers.Authorization = sessionStorage.getItem("token");
  // 这里必须return
  return config;
});
// 将axios挂载到vue原型对象中，避免后续每个文件引入，使用$http代替axios
Vue.prototype.$http = axios;

Vue.config.productionTip = false;
new Vue({
  render: (h) => h(App),
  router,
}).$mount("#app");
