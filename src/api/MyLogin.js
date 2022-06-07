import request from "@/api/request.js";
// 登录页面接口管理
export const login = (data) => {
  return request({ url: "login", method: "POST", data });
};
