<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <el-alert
        :closable="false"
        title="注意：只允许为三级分类设置相关参数"
        type="warning"
        show-icon
      >
      </el-alert>
      <!-- 选择商品分类区域 -->
      <el-row>
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品分类的级联选择器 -->
          <el-cascader
            v-model="selectCateKeys"
            :options="cateList"
            :props="cateCascaderProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            :disabled="btnSelect"
            @click="editParamsDialogVisible = true"
            >添加参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table :data="manyTabList" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template v-slot:default="scoped">
                <!-- 循环渲染tag标签 -->
                <el-tag
                  v-for="(item, index) in scoped.row.attr_vals"
                  :key="index"
                  closable
                  @close="closeTag(scoped.row, index)"
                  >{{ item }}</el-tag
                >
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scoped.row.inputVisible"
                  v-model.trim="scoped.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scoped.row)"
                  @blur="handleInputConfirm(scoped.row)"
                >
                </el-input>
                <!-- 添加按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scoped.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column
              type="index"
              label="序号"
              align="center"
              width="100px"
            >
            </el-table-column>
            <el-table-column prop="attr_name" label="参数名称" align="center">
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template v-slot:default="scoped">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="small"
                  @click="reParams(scoped.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="small"
                  @click="deleteParams(scoped.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            :disabled="btnSelect"
            @click="editParamsDialogVisible = true"
            >添加属性</el-button
          >
          <!-- 静态属性表格 -->
          <el-table :data="onlyTabList" border stripe>
            <!-- 展开行 -->
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template v-slot:default="scoped">
                <!-- 循环渲染tag标签 -->
                <el-tag
                  v-for="(item, index) in scoped.row.attr_vals"
                  :key="index"
                  closable
                  @close="closeTag(scoped.row, index)"
                  >{{ item }}</el-tag
                >
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scoped.row.inputVisible"
                  v-model.trim="scoped.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scoped.row)"
                  @blur="handleInputConfirm(scoped.row)"
                >
                </el-input>
                <!-- 添加按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scoped.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column
              type="index"
              label="序号"
              align="center"
              width="100px"
            >
            </el-table-column>
            <el-table-column prop="attr_name" label="参数名称" align="center">
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template v-slot:default="scoped">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="small"
                  @click="reParams(scoped.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="small"
                  @click="deleteParams(scoped.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加操作对话框 -->
    <el-dialog
      :title="`添加${titileText}`"
      :visible.sync="editParamsDialogVisible"
      width="50%"
      @close="closeEditParamsDialog"
    >
      <el-form
        ref="editParamsFormRef"
        :rules="editParamsRules"
        label-width="80px"
        :model="editParamsForm"
      >
        <el-form-item :label="`${titileText}`" prop="attr_name">
          <el-input v-model.trim="editParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParamsTrue">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑操作对话框 -->
    <el-dialog
      :title="`修改${titileText}`"
      :visible.sync="reParamsDialogVisible"
      width="50%"
    >
      <el-form
        ref="reParamsFormRef"
        :rules="reParamsRules"
        :model="reParamsForm"
        label-width="80px"
      >
        <el-form-item :label="`${titileText}`" prop="attr_name">
          <el-input v-model="reParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="reParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmeParamsRight">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getCateList,
    getParamsList,
    editParamsTrue,
    deleteParams,
    selectParams,
    emitParams,
  } from "@/api/goods/Params.js";
  export default {
    name: "MyParams",
    data() {
      return {
        //  保存获取到的商品分类数据列表
        cateList: [],
        // 商品分类级联选择器配置项
        cateCascaderProps: {
          value: "cat_id",
          label: "cat_name",
          children: "children",
          expandTrigger: "hover",
        },
        // 级联选择器双向绑定数据
        // 所有选取的分类id保存在这里
        selectCateKeys: [],
        // 被激活页签的名称
        activeName: "many",
        // 保存点击动态参数获取到的数据
        manyTabList: [],
        // 保存点击静态属性获取到的数据
        onlyTabList: [],
        // 控制添加参数对话框的弹出与关闭
        editParamsDialogVisible: false,
        // 保存添加参数对话框表单的内容
        editParamsForm: {
          attr_id: 0,
          attr_name: "",
        },
        // 添加参数对话框表单检验规则
        editParamsRules: {
          attr_name: [
            {
              required: true,
              message: "请输入参数名称",
              trigger: "blur",
            },
          ],
        },
        // 控制编辑参数对话框的弹出与关闭
        reParamsDialogVisible: false,
        // 保存修改参数、属性的表单内容
        reParamsForm: {
          attr_name: "",
        },
        // 修改参数、属性表单验证内容
        reParamsRules: {
          attr_name: [
            { required: true, message: "请输入参数名称", trigger: "blur" },
          ],
        },
      };
    },
    methods: {
      // 获取商品分类数据列表
      async getCateList() {
        let { data: res } = await getCateList();
        if (res.meta.status != 200) {
          return this.$message.error("获取商品分类数据失败");
        } else {
          this.cateList = res.data;
        }
      },
      //   获取分类参数管理参数列表
      async getParamsList() {
        let { data: res } = await getParamsList(
          this.selectCateKeys[this.selectCateKeys.length - 1],
          { sel: this.activeName }
        );
        if (res.meta.status != 200) {
          return this.$message.error("获取参数列表失败");
        } else {
          res.data.forEach((item) => {
            item.attr_vals = item.attr_vals ? item.attr_vals.split(",") : [];
            // 控制文本框中的显示与隐藏
            item.inputVisible = false;
            // 文本框中输入的值
            item.inputValue = "";
          });
          if (this.activeName == "many") {
            this.manyTabList = res.data;
          } else {
            this.onlyTabList = res.data;
          }
        }
      },
      //   控制选择的级联列表不能为三级
      handleChange() {
        if (this.selectCateKeys.length != 3) {
          this.selectCateKeys = [];
          this.manyTabList = [];
          this.onlyTabList = [];
          return false;
        } else {
          this.getParamsList();
        }
      },
      //  tab页签点击事件的处理函数
      handleTabClick() {
        this.getParamsList();
      },
      // 监听编辑操作对话框关闭，重置表单内容
      closeEditParamsDialog() {
        this.$refs.editParamsFormRef.resetFields();
      },
      // 点击确定，修改参数
      editParamsTrue() {
        this.$refs.editParamsFormRef.validate(async (valid) => {
          if (!valid) {
            return false;
          } else {
            let { data: res } = await editParamsTrue(
              this.selectCateKeys[this.selectCateKeys.length - 1],
              {
                attr_name: this.editParamsForm.attr_name,
                attr_sel: this.activeName,
              }
            );
            if (res.meta.status != 201) {
              return this.$message.error("添加参数失败");
            } else {
              this.$message.success("添加参数成功");
              this.getParamsList();
            }
          }
        });
        this.editParamsDialogVisible = false;
      },
      // 根据id删除对应的参数项
      async deleteParams(attr_id) {
        let confirmResult = await this.$confirm(
          "此操作将永久删除该文件, 是否继续?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        ).catch((err) => err);
        // 当用户点击的是确认按钮，打印出confirm字符串
        // 当用户点击的是取消按钮，打印出的cancel字符串
        if (confirmResult == "cancel") {
          return this.$message.info("已取消删除");
        } else {
          let { data: res } = await deleteParams(
            this.selectCateKeys[this.selectCateKeys.length - 1],
            attr_id
          );
          if (res.meta.status != 200) {
            return this.$message.error("删除参数失败");
          } else {
            this.getParamsList();
            this.$message.success("删除参数成功");
          }
        }
      },
      // 根据id查询对应参数
      async reParams(attrId) {
        let { data: res } = await selectParams(
          this.selectCateKeys[this.selectCateKeys.length - 1],
          attrId,
          { attr_sel: this.activeName }
        );
        if (res.meta.status != 200) {
          return this.$message.error("查询参数失败");
        } else {
          this.reParamsForm.attr_id = res.data.attr_id;
          this.reParamsForm.attr_name = res.data.attr_name;
        }
        this.reParamsDialogVisible = true;
      },
      // 点击确定验证表单信息，正确发送请求，修改属性
      confirmeParamsRight() {
        this.$refs.reParamsFormRef.validate(async (valid) => {
          if (!valid) {
            return false;
          } else {
            let { data: res } = await emitParams(
              this.selectCateKeys[this.selectCateKeys.length - 1],
              this.reParamsForm.attr_id,
              {
                attr_name: this.reParamsForm.attr_name,
                attr_sel: this.activeName,
              }
            );
            if (res.meta.status != 200) {
              return this.$message.error("参数更新失败");
            } else {
              this.getParamsList();
              this.$message.success("参数更新成功");
            }
            this.reParamsDialogVisible = false;
          }
        });
      },
      // 将对attr_vals的操作保存到数据库
      async saveAttrVals(row) {
        let { data: res } = await emitParams(
          this.selectCateKeys[this.selectCateKeys.length - 1],
          row.attr_id,
          {
            attr_name: row.attr_name,
            attr_sel: this.activeName,
            attr_vals: row.attr_vals.join(","),
          }
        );
        if (res.meta.status != 200) {
          return this.$message.error("修改参数项失败");
        } else {
          return false;
        }
      },
      // 文本框失去焦点，或按下了enter都会触发
      async handleInputConfirm(row) {
        // 如果输入的内容为空，则什么也不处理
        if (row.inputValue.trim().length == 0) {
          row.inputValue = "";
          row.inputVisible = false;
          return false;
        }
        // 处理新增的参数属性值，添加到attr_vals中
        row.attr_vals.push(row.inputValue);
        row.inputValue = "";
        row.inputVisible = false;
        // 发起请求，保存这次操作
        this.$message.success("添加参数项成功");
        this.saveAttrVals(row);
      },
      // 点击按钮，失去文本框
      showInput(row) {
        row.inputVisible = true;
        // 文本框自动聚焦
        this.$nextTick(() => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      // 删除对应的参数可选项
      async closeTag(row, index) {
        let confirmValue = await this.$confirm(
          "此操作将永久删除该参数项, 是否继续?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        ).catch((err) => err);
        if (confirmValue == "cancel") {
          return this.$message.info("已取消删除");
        } else {
          row.attr_vals.splice(index, 1);
          this.$message.success("删除参数项成功");
          this.saveAttrVals(row);
        }
      },
    },
    computed: {
      // 控制添加动态参数、添加静态属性按钮禁用
      btnSelect() {
        if (this.selectCateKeys.length != 3) {
          return true;
        } else {
          return false;
        }
      },
      // 通过计算属性，动态计算标题文本
      titileText() {
        if (this.activeName == "many") {
          return "动态参数";
        } else {
          return "静态属性";
        }
      },
    },
    mounted() {
      this.getCateList();
    },
  };
</script>

<style lang="less" scoped>
  .el-row {
    margin: 20px 0px;
  }
  .el-tag {
    margin: 10px;
  }
  .input-new-tag {
    width: 120px;
  }
</style>
