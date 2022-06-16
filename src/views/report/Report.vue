<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 为 ECharts 准备一个定义了宽高的 DOM -->
      <div ref="main" style="width: 1000px; height: 540px"></div>
    </el-card>
  </div>
</template>

<script>
  import * as echarts from "echarts";
  import { getReportsData } from "@/api/report/Report";
  export default {
    name: "MyReport",
    data() {
      return {
        // 需要合并的选项
        options: {
          title: {
            text: "用户来源",
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "cross",
              label: {
                backgroundColor: "#E9EEF3",
              },
            },
          },
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true,
          },
          xAxis: [
            {
              boundaryGap: false,
            },
          ],
          yAxis: [
            {
              type: "value",
            },
          ],
        },
      };
    },
    async mounted() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(this.$refs.main);
      let { data: res } = await getReportsData();
      if (res.meta.status != 200) {
        return this.$message.error("获取报表数据失败");
      }
      const newoptions = JSON.parse(JSON.stringify(this.options));
      const newdata = JSON.parse(JSON.stringify(res.data));
      const reportList = { ...newoptions, ...newdata };
      // 使用刚指定的配置项和数据显示图表
      myChart.setOption(reportList);
    },
  };
</script>

<style></style>
