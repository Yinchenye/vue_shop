import request from "@/api/request.js";
// 基于时间统计的折线图
export const getReportsData = () => {
  return request({ url: "reports/type/1", method: "GET" });
};
