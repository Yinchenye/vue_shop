import request from "@/api/request.js";
// 获取商品分类数据列表
export const getCateList = () => {
  return request({ url: "categories", method: "GET" });
};
// 获取分类参数管理参数列表
export const getParamsList = (id, params) => {
  return request({
    url: `categories/${id}/attributes`,
    method: "GET",
    params,
  });
};
// 点击确定添加动态参数或者静态属性
export const editParamsTrue = (id, data) => {
  return request({ url: `categories/${id}/attributes`, method: "post", data });
};
// 点击删除参数
export const deleteParams = (id, attrid) => {
  return request({
    url: `categories/${id}/attributes/${attrid}`,
    method: "delete",
  });
};
// 根据ID查询参数
export const selectParams = (id, attrId, data) => {
  return request({
    url: `categories/${id}/attributes/${attrId}`,
    method: "get",
    data,
  });
};
// 编辑提交参数
export const emitParams = (id, attrId, data) => {
  return request({
    url: `categories/${id}/attributes/${attrId}`,
    method: "put",
    data,
  });
};
