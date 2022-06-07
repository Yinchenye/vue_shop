import request from "@/api/request.js";
// 主页面（Home）接口管理
export const home = () => {
  return request({ url: "menus", method: "GET" });
};
