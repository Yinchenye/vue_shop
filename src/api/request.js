// 这个文件用来配置axios
import axios from "axios";
import nprogress from "nprogress";
import "nprogress/nprogress.css";
const instance = axios.create({
  // baseURL: "http://127.0.0.1:8888/api/private/v1/",
  baseURL: "https://lianghj.top:8888/api/private/v1/",
});
// 请求拦截
instance.interceptors.request.use((config) => {
  nprogress.start();
  // 为请求头对象，添加token验证的Authorization 字段
  config.headers.Authorization = sessionStorage.getItem("token");
  // 这里必须return
  return config;
});
// 响应拦截
instance.interceptors.response.use(
  (resolve) => {
    nprogress.done();
    return resolve;
  },
  (error) => {
    nprogress.done();
    return Promise.reject(error);
  }
);
export default instance;
