import request from "@/api/request.js";
// 获取订单数据列表
export const getOrderData = (params) => {
  return request({ url: "orders", method: "GET", params });
};
// 查看物流信息
export const showProgress = () => {
  return request({
    url: "/kuaidi/1106975712662",
    method: "GET",
  });
};
