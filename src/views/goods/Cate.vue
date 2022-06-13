<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <el-button type="primary" @click="addCateDialogBtn">添加分类</el-button>
      <!-- 表格区域 -->
      <tree-table
        border
        :expand-type="false"
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        show-index
        index-text="序号"
        stripe
        :show-row-hover="false"
        class="treetable"
      >
        <!-- 是否有效模板 -->
        <template slot="isok" slot-scope="scoped">
          <i
            class="el-icon-success"
            v-if="scoped.row.cat_deleted == false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <!-- 排序模板 -->
        <template slot="sort" slot-scope="scoped">
          <el-tag v-if="scoped.row.cat_level == 0">标签一</el-tag>
          <el-tag type="success" v-else-if="scoped.row.cat_level == 1"
            >标签二</el-tag
          >
          <el-tag type="warning" v-else>标签三</el-tag>
        </template>
        <!-- 操作模板 -->
        <template slot="opt" slot-scope="scoped">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="small"
            @click="editCateDialog(scoped.row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="small"
            @click="deleteCateMessageBox(scoped.row)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="cateTotal"
        background
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="closeAddCateDialog"
    >
      <el-form
        ref="addCateFormRef"
        :model="addCateForm"
        label-width="100px"
        :rules="addCateFormRules"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model.trim="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!-- 父级分类级联选择器 -->
          <!-- props用来指定配置对象 -->
          <el-cascader
            v-model="selectKeys"
            :options="parentCateList"
            :props="parentCateListProps"
            @change="handleChange"
            clearable
            placeholder="非必选项，默认为一级层级"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCateFormTrue">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类对话框 -->
    <el-dialog
      title="修改分类"
      :visible.sync="editCateDialogVisible"
      width="50%"
      @close="editCateDialogClose"
    >
      <el-form
        ref="editCateFormRef"
        label-width="100px"
        :rules="editCateFormRules"
        :model="categoriesList"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="categoriesList.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="cateDialogTrue">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { getCateLists } from "@/api/goods/Cate.js";
  export default {
    name: "MyCate",
    data() {
      return {
        // 保存请求到的所有商品分类数据
        cateList: [],
        // 获取所有商品分类请求的参数
        queryInfo: {
          type: 3,
          pagenum: 1,
          pagesize: 5,
        },
        // 总数据条数
        cateTotal: 0,
        // 为table指定列的定义
        columns: [
          {
            label: "分类名称",
            prop: "cat_name",
            headerAlign: "center",
          },
          {
            label: "是否有效",
            // 表示，当前列定义为模板列
            type: "template",
            // 表示这一列使用的模板名称
            template: "isok",
            headerAlign: "center",
          },
          {
            label: "排序",
            // 表示，当前列定义为模板列
            type: "template",
            // 表示这一列使用的模板名称
            template: "sort",
            headerAlign: "center",
            align: "center",
          },
          {
            label: "操作",
            // 表示，当前列定义为模板列
            type: "template",
            // 表示这一列使用的模板名称
            template: "opt",
            headerAlign: "center",
            align: "center",
          },
        ],
        // 控制添加分类对话框的显示与隐藏
        addCateDialogVisible: false,
        // 添加分类的表单数据对象
        addCateForm: {
          // 分类父 ID
          cat_pid: 0,
          // 将要添加的分类名称
          cat_name: "",
          // 分类层级
          cat_level: 0,
        },
        // 添加分类表单验证规则
        addCateFormRules: {
          cat_name: [
            { required: true, message: "请输入分类名称", trigger: "blur" },
          ],
        },
        // 父级分类的列表
        parentCateList: [],
        // 父级分类列表的配置
        parentCateListProps: {
          value: "cat_id",
          label: "cat_name",
          children: "children",
          expandTrigger: "click",
          checkStrictly: "true",
        },
        // 选中的父级分类id数组
        selectKeys: [],
        // 控制编辑分类对话框
        editCateDialogVisible: false,
        // 编辑分类表单验证规则
        editCateFormRules: {
          cat_name: [
            {
              required: true,
              message: "请输入分类名称",
              trigger: "blur",
            },
          ],
        },
        // 保存通过id查询到的分类数据
        categoriesList: {},
      };
    },
    methods: {
      // 发送获取商品分类请求
      async getCateList() {
        let { data: res } = await getCateLists(this.queryInfo);
        if (res.meta.status != 200) {
          return this.$message.error("商品分类列表获取失败");
        } else {
          //   把数据列表，赋值给cateList
          this.cateList = res.data.result;
          //   把总数据量，赋值给cateTotal
          this.cateTotal = res.data.total;
        }
      },
      // 侦听pagesize改变
      // 页面上要展示的数据量的改变
      handleSizeChange(newVal) {
        this.queryInfo.pagesize = newVal;
        this.getCateList();
      },
      // 侦听pagenum改变
      // 页码改变
      handleCurrentChange(newVal) {
        this.queryInfo.pagenum = newVal;
        this.getCateList();
      },
      // 添加分类点击按钮
      addCateDialogBtn() {
        this.getParentCateList();
        this.addCateDialogVisible = true;
      },
      // 发送获取父级商品分类请求
      async getParentCateList() {
        let { data: res } = await getCateLists({ type: 2 });
        if (res.meta.status != 200) {
          return this.$message.error("请求失败");
        } else {
          this.parentCateList = res.data;
        }
      },
      // 根据父分类变化来处理表单中的数据
      handleChange() {
        if (this.selectKeys.length > 0) {
          // 父级分类的id
          this.addCateForm.cat_pid =
            this.selectKeys[this.selectKeys.length - 1];
          // 为当前分类的等级赋值
          this.addCateForm.cat_level = this.selectKeys.length;
          return false;
        } else {
          this.addCateForm.cat_pid = 0;
          this.addCateForm.cat_level = 0;
        }
      },
      // 点击按钮，添加新的分类
      addCateFormTrue() {
        this.$refs.addCateFormRef.validate(async (valid) => {
          if (!valid) {
            return false;
          } else {
            let { data: res } = await this.$http.post(
              "categories",
              this.addCateForm
            );
            if (res.meta.status != 201) {
              return this.$message.error("新的分类创建失败");
            } else {
              this.$message.success("新的分类创建成功");
              this.getCateList();
            }
          }
          this.addCateDialogVisible = false;
        });
      },
      // 侦听对话框的关闭事件，重置表单数据
      closeAddCateDialog() {
        this.$refs.addCateFormRef.resetFields();
        this.selectKeys = [];
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      },
      // 根据id查询分类，获取分类信息
      async editCateDialog(id) {
        this.editCateDialogVisible = true;
        let { data: res } = await this.$http.get(`categories/${id.cat_id}`);
        if (res.meta.status != 200) {
          return this.$message.error("分类信息获取失败");
        } else {
          this.categoriesList = res.data;
        }
      },
      // 编辑提交分类
      cateDialogTrue() {
        this.$refs.editCateFormRef.validate(async (valid) => {
          if (!valid) {
            return false;
          } else {
            let { data: res } = await this.$http.put(
              `categories/${this.categoriesList.cat_id}`,
              {
                cat_name: this.categoriesList.cat_name,
              }
            );
            if (res.meta.status != 200) {
              return this.$message.error("修改分类名称失败");
            } else {
              this.$message.success("修改分类名称成功");
              this.getCateList();
            }
            this.editCateDialogVisible = false;
          }
        });
      },
      // 编辑分类对话框关闭重置表单内容
      editCateDialogClose() {
        this.$refs.editCateFormRef.resetFields();
      },
      // 删除分类
      async deleteCateMessageBox(value) {
        let confirmMessage = await this.$confirm(
          "此操作将永久删除该文件, 是否继续?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        ).catch((error) => error);
        if (confirmMessage != "confirm") {
          return this.$message.info("已取消删除！");
        } else {
          let { data: res } = await this.$http.delete(
            `categories/${value.cat_id}`
          );
          if (res.meta.status != 200) {
            return this.$message.error("删除失败！");
          } else {
            this.$message.success("删除成功！");
            this.getCateList();
          }
        }
      },
    },
    mounted() {
      this.getCateList();
    },
  };
</script>

<style lang="less" scoped>
  .treetable {
    margin-top: 15px;
  }
  .el-cascader {
    width: 100%;
  }
</style>
