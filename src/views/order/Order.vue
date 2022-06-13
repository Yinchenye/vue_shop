<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col :span="10">
          <el-input
            placeholder="请输入内容"
            v-model.trim="queryInfo.query"
            clearable
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getOrderData"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="orderDataGoods" border stripe>
        <el-table-column type="index" label="序号" width="80px" align="center">
        </el-table-column>
        <el-table-column
          prop="order_number"
          label="订单编号"
          align="center"
          width="250px"
        >
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格" align="center">
        </el-table-column>
        <el-table-column label="是否付款" align="center">
          <template v-slot:default="scoped">
            <el-tag type="success" v-if="scoped.row.pay_status == 1"
              >已付款</el-tag
            >
            <el-tag type="danger" v-if="scoped.row.pay_status == 0"
              >未付款</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" align="center">
        </el-table-column>
        <el-table-column label="下单时间" align="center">
          <template v-slot:default="scoped">
            {{ formatTime(scoped.row.create_time) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="180px">
          <el-tooltip
            class="item"
            effect="dark"
            content="修改地址"
            placement="top-start"
          >
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="small"
              @click="editGoodsLocation"
              >地址</el-button
            >
          </el-tooltip>

          <el-tooltip
            class="item"
            effect="dark"
            content="显示物流信息"
            placement="top-start"
          >
            <el-button
              type="success"
              icon="el-icon-location"
              size="small"
              @click="showProgress"
              >物流</el-button
            >
          </el-tooltip>
        </el-table-column>
      </el-table>
      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
    <!-- 修改地址对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="editGoodsLocationDialogVisible"
      width="50%"
      @close="closeEditGoodsLocation"
    >
      <el-form
        :model="editGoodsLocationRuleForm"
        :rules="editGoodsLocationRules"
        ref="editGoodsLocationRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="province">
          <el-cascader
            v-model="editGoodsLocationRuleForm.province"
            :options="cityOptions"
            :props="editGoodsProps"
            @change="handleChange"
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="location">
          <el-input
            v-model.trim="editGoodsLocationRuleForm.location"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editGoodsLocationDialogVisible = false"
          >取 消</el-button
        >
        <el-button type="primary" @click="editGoodsLocationDialogTrue"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 显示物流信息对话框 -->
    <el-dialog
      title="物流进度"
      :visible.sync="showProgressDialogVisible"
      width="50%"
    >
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in processInfo"
          :key="index"
          :timestamp="activity.time"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showProgressDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { getOrderData, showProgress } from "@/api/order/Order";
  import cityOptions from "./city_data";
  import dayjs from "dayjs";
  export default {
    name: "MyOrder",
    data() {
      return {
        // 获取订单数据列表请求参数
        queryInfo: {
          query: "",
          pagenum: 1,
          pagesize: 5,
        },
        // 保存获取到的订单数据列表
        orderDataGoods: [],
        // 总数据条数
        total: 0,
        // 控制修改地址对话框显示与隐藏
        editGoodsLocationDialogVisible: false,
        // 修改地址对话框表单数据
        editGoodsLocationRuleForm: {
          province: [],
          location: "",
        },
        // 修改地址对话框表单数据验证
        editGoodsLocationRules: {
          province: [
            { required: true, message: "请输入省市区/县", trigger: "blur" },
          ],
          location: [
            {
              required: true,
              message: "请输入详细地址",
              trigger: "blur",
            },
          ],
        },
        // 保存省份数据
        cityOptions,
        // 省市区/县级联选择器配置项
        editGoodsProps: {
          value: "value",
          label: "label",
          children: "children",
          expandTrigger: "hover",
        },
        // 控制显示物流信息对话框显示与隐藏
        showProgressDialogVisible: false,
        // 保存获取到的物流信息
        processInfo: [],
      };
    },
    methods: {
      // 获取订单数据列表
      async getOrderData() {
        let { data: res } = await getOrderData(this.queryInfo);
        if (res.meta.status != 200) {
          this.$message.error("获取订单数据失败");
        } else {
          console.log(res);
          this.orderDataGoods = res.data.goods;
          this.total = res.data.total;
          this.pagenum = res.data.pagenum - 0;
        }
      },
      //   格式化时间
      formatTime(time) {
        return dayjs(time).format("YYYY-MM-DD HH:mm:ss");
      },
      //   侦听每页展示数量的变化
      handleSizeChange(value) {
        this.queryInfo.pagesize = value;
        this.getOrderData();
      },
      //   侦听页数的变化
      handleCurrentChange(value) {
        this.queryInfo.pagenum = value;
        this.getOrderData();
      },
      //   点击展示修改地址对话框
      editGoodsLocation() {
        this.editGoodsLocationDialogVisible = true;
      },
      handleChange(val) {
        console.log(val);
      },
      //   关闭对话框，重置表单内容
      closeEditGoodsLocation() {
        this.$refs.editGoodsLocationRef.resetFields();
      },
      //   点击确定，验证表单内容，验证通过，才能关闭对话框
      editGoodsLocationDialogTrue() {
        this.$refs.editGoodsLocationRef.validate((valid) => {
          if (!valid) {
            this.$message.error("请填写必要的表单项");
          } else {
            this.editGoodsLocationDialogVisible = false;
          }
        });
      },
      //   点击展示物流信息对话框
      async showProgress() {
        let { data: res } = await showProgress();
        if (res.meta.status != 200) {
          this.$message.error("获取物流信息失败");
        } else {
          this.processInfo = res.data;
        }
        this.showProgressDialogVisible = true;
      },
    },
    mounted() {
      this.getOrderData();
    },
  };
</script>

<style lang="less" scoped>
  .el-cascader {
    width: 100% !important;
  }
</style>
