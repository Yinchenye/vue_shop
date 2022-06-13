import request from "@/api/request.js";
// 添加商品
export const addGoods = (data) => {
  return request({ url: "goods", method: "post", data });
};
