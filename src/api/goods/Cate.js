import request from "@/api/request.js";
// 获取商品分类数据列表
export const getCateLists = (params) => {
  if (!params) {
    return request({ url: "categories", method: "GET" });
  } else {
    return request({ url: "categories", method: "GET", params });
  }
};
// 添加分类
export const addCateListsTrue = (data) => {
  return request({ url: "categories", method: "post", data });
};
