import request from "@/api/request.js";
// 获取商品列表数据
export const getGoodsListData = (params) => {
  return request({ url: "goods", method: "GET", params });
};
// 删除商品
export const deleteGood = (id) => {
  return request({ url: `goods/${id}`, method: "delete" });
};
