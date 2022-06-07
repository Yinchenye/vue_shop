import request from "@/api/request.js";
export const getUserList = (params) => {
  return request({ url: "users", method: "get", params });
};
export const changeUserState = (id, type) => {
  return request({ url: `users/${id}/state/${type}`, method: "put" });
};
export const addUser = (data) => {
  return request({ url: "users", method: "post", data });
};
// 根据ID查询用户信息
export const editDialog = (id) => {
  return request({ url: `users/${id}`, method: "get" });
};
// 编辑用户提交
export const editDialogTrue = (id, data) => {
  return request({ url: `users/${id}`, method: "put", data });
};
// 删除单个用户
export const deleteUser = (id) => {
  return request({ url: `users/${id}`, method: "delete" });
};
// 分配用户角色
export const setUserRoles = (id, data) => {
  return request({ url: `users/${id}/role`, method: "put", data });
};
