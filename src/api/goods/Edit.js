import request from "@/api/request.js";
// 根据ID查询商品
export const getGoodById = (id) => {
  return request({ url: `goods/${id}`, method: "GET" });
};
// 编辑提交商品
export const subemit = (id, data) => {
  return request({ url: `goods/${id}`, method: "put", data });
};
