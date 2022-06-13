<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model.trim="queryInfo.query"
            class="input-with-select"
            clearable
            @clear="getGoodsListData"
            @keyup.enter.native="getGoodsListData"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsListData"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="addGoods">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- table表格区域 -->
      <el-table :data="goodsListData" border stripe>
        <el-table-column
          type="index"
          label="序号"
          align="center"
          width="60px"
        ></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" align="center">
        </el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格"
          align="center"
          width="95px"
        >
        </el-table-column>
        <el-table-column
          prop="goods_weight"
          label="商品重量"
          align="center"
          width="75px"
        >
        </el-table-column>
        <el-table-column label="创建时间" align="center" width="140px">
          <template v-slot:default="scoped">
            {{ formatTime(scoped.row.add_time) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="130px">
          <template v-slot:default="scoped">
            <el-tooltip
              class="item"
              effect="dark"
              content="添加分类"
              placement="top-start"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="small"
                @click="addParams"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="删除商品"
              placement="top-start"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="small"
                @click="deleteGood(scoped.row.goods_id)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalGoods"
        background
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addParamsDialogVisible"
      width="50%"
      @close="closeParamsDialog"
    >
      <el-form
        ref="form"
        :model="addParamsForm"
        label-width="80px"
        :rules="addParamRules"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addParamsForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectKey"
            :options="this.goodsParamsData"
            :props="addParamsFormProp"
            @change="handleChange"
            clearable
            width="100%"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParamsTrue">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { getGoodsListData, deleteGood } from "@/api/goods/List.js";
  import { getCateLists, addCateListsTrue } from "@/api/goods/Cate.js";
  import dayjs from "dayjs";
  export default {
    name: "MyList",
    data() {
      return {
        // 表格查询参数
        queryInfo: {
          query: "",
          //  当前商品页数
          pagenum: 1,
          //  当前页展示多少条数据
          pagesize: 10,
        },
        // 保存商品列表数据
        goodsListData: [],
        // 总数据条数
        totalGoods: 0,
        // 控制添加分类对话框显示与隐藏
        addParamsDialogVisible: false,
        // 保存商品分类数据列表
        goodsParamsData: [],
        // 添加分类请求参数
        addParamsForm: {
          cat_pid: 0,
          cat_name: "",
          cat_level: 0,
        },
        // 添加分类表单验证规则
        addParamRules: {
          cat_name: [
            { required: true, message: "请输入分类名称", trigger: "blur" },
          ],
        },
        // 添加分类级联选择器配置项
        addParamsFormProp: {
          value: "cat_id",
          label: "cat_name",
          children: "children",
          expandTrigger: "hover",
          checkStrictly: true,
        },
        // 选中的父类分组id
        selectKey: [],
      };
    },
    methods: {
      // 获取所有商品列表数据
      async getGoodsListData() {
        let { data: res } = await getGoodsListData(this.queryInfo);
        this.goodsListData = res.data.goods;
        this.totalGoods = res.data.total;
      },
      // 格式化时间
      formatTime(time) {
        return dayjs(time).format("YYYY-MM-DD HH:mm:ss");
      },
      handleSizeChange(newsize) {
        this.queryInfo.pagesize = newsize;
        this.getGoodsListData();
      },
      handleCurrentChange(newnum) {
        this.queryInfo.pagenum = newnum;
        this.getGoodsListData();
      },
      // 获取所有商品分类数据列表
      async addParams() {
        let { data: res } = await getCateLists();
        if (res.meta.status != 200) {
          this.$message.error("获取商品分类数据列表失败");
        } else {
          this.goodsParamsData = res.data;
          this.addParamsDialogVisible = true;
        }
      },
      // 同步修改添加分类请求参数
      handleChange(val) {
        if (val.length > 0) {
          this.addParamsForm.cat_pid =
            this.selectKey[this.selectKey.length - 1];
          this.addParamsForm.cat_level = this.selectKey.length;
        } else {
          this.addParamsForm.cat_pid = 0;
          this.addParamsForm.cat_level = 0;
        }
      },
      // 关闭对话框，重置表单内容
      closeParamsDialog() {
        this.$refs.form.resetFields();
        this.selectKey = [];
        this.addParamsForm.cat_name = "";
        this.addParamsForm.cat_level = 0;
      },
      // 点击确定，发送添加分类请求
      addParamsTrue() {
        this.$refs.form.validate(async (valid) => {
          if (!valid) {
            return false;
          } else {
            let { data: res } = await addCateListsTrue(this.addParamsForm);
            if (res.meta.status != 201) {
              this.$message.error("添加分类失败");
            } else {
              this.$message.success("添加分类成功");
              this.getGoodsListData();
              this.addParamsDialogVisible = false;
            }
          }
        });
      },
      // 删除对应的商品数据
      async deleteGood(goodid) {
        let confirmvalue = await this.$confirm(
          "此操作将永久删除该文件, 是否继续?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        ).catch((err) => err);
        if (confirmvalue == "cancel") {
          return this.$message.info("已取消删除");
        } else {
          let { data: res } = await deleteGood(goodid);
          if (res.meta.status != 200) {
            return this.$message.error("删除商品失败");
          } else {
            this.getGoodsListData();
            this.$message.success("删除商品成功");
          }
        }
      },
      // 添加商品，通过编程式路由导航跳转到添加商品页面
      addGoods() {
        this.$router.push("/home/goods/add");
      },
    },
    mounted() {
      this.getGoodsListData();
    },
  };
</script>

<style lang="less" scoped>
  .el-cascader {
    width: 100%;
  }
</style>
