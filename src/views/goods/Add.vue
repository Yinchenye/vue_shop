<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/home/goods' }"
        >商品列表</el-breadcrumb-item
      >
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 提示区域 -->
      <el-alert
        title="添加商品信息"
        type="info"
        :closable="false"
        center
        show-icon
      >
      </el-alert>
      <!-- 步骤条区域 -->
      <el-steps
        :space="200"
        :active="activeInde - 0"
        align-center
        finish-status="success"
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 表格区域 -->
      <el-form
        ref="form"
        :model="addGoodsForm"
        :rules="addGoodsRules"
        label-width="80px"
        label-position="top"
      >
        <el-tabs
          v-model="activeInde"
          :tab-position="'left'"
          :before-leave="stopTabLeave"
          @tab-click="tabClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input
                v-model="addGoodsForm.goods_price"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input
                v-model="addGoodsForm.goods_weight"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input
                v-model="addGoodsForm.goods_number"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addGoodsForm.goods_cat"
                :options="goodsCateList"
                :props="cateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的item项 -->
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTableDate"
              :key="item.attr_id"
            >
              <!-- 多选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="item"
                  v-for="(item, index) in item.attr_vals"
                  :key="index"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTableDate"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              class="upload-demo"
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture"
              :headers="headersObj"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor
              ref="myQuillEditor"
              v-model="addGoodsForm.goods_introduce"
            ></quill-editor>
            <!-- 添加商品的按钮 -->
            <el-button type="primary" class="btn" @click="addGoods"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片对话框 -->
    <el-dialog title="图片预览" :visible.sync="imgDialogVisible" width="50%">
      <img :src="imgFullPath" width="100%" />
    </el-dialog>
  </div>
</template>

<script>
  import { getCateList, getParamsList } from "@/api/goods/Params.js";
  // 引入富文本编辑器插件
  import { quillEditor } from "vue-quill-editor";
  import "quill/dist/quill.core.css";
  import "quill/dist/quill.snow.css";
  import "quill/dist/quill.bubble.css";
  import { addGoods } from "@/api/goods/Add.js";
  export default {
    name: "MyAdd",
    data() {
      return {
        activeInde: 0,
        // 添加商品表单信息
        addGoodsForm: {
          goods_name: "",
          goods_price: 0,
          goods_weight: 0,
          goods_number: 0,
          // 选中商品所属分类数组
          goods_cat: [],
          // 上传的图片临时路径（对象）
          pics: [],
          // 商品内容介绍
          goods_introduce: "",
          // 商品的参数（数组），包含动态参数和静态属性
          attrs: [],
        },
        // 添加商品表单验证信息
        addGoodsRules: {
          goods_name: [
            { required: true, message: "请输入商品名称", trigger: "blur" },
          ],
          goods_price: [
            { required: true, message: "请输入商品价格", trigger: "blur" },
          ],
          goods_weight: [
            { required: true, message: "请输入商品重量", trigger: "blur" },
          ],
          goods_number: [
            { required: true, message: "请输入商品数量", trigger: "blur" },
          ],
          goods_cat: [
            { required: true, message: "请选择商品分类", trigger: "blur" },
          ],
        },
        // 级联选择器配置项
        cateProps: {
          expandTrigger: "hover",
          children: "children",
          value: "cat_id",
          label: "cat_name",
        },
        // 保存获取到的商品分类数据
        goodsCateList: [],
        // 动态参数数据列表
        manyTableDate: [],
        // 静态属性数据列表
        onlyTableDate: [],
        // 设置图片上传时的请求头，添加token
        headersObj: {
          Authorization: sessionStorage.getItem("token"),
        },
        // 保存上传图片的完整路径
        imgFullPath: "",
        // 控制图片对话框展示与隐藏
        imgDialogVisible: false,
      };
    },
    methods: {
      async getCateList() {
        let { data: res } = await getCateList();
        if (res.meta.status != 200) {
          return this.$message.error("获取商品分类失败");
        } else {
          this.goodsCateList = res.data;
        }
      },
      // 级联选择器发生变化，就会触发这个函数
      handleChange(newVal) {
        if (newVal.length != 3) {
          this.$message.info("只能选择三级商品分类列表");
          this.addGoodsForm.goods_cat = [];
        }
      },
      // 阻止级联选择器切换
      stopTabLeave(activeName, oldActiveName) {
        if (oldActiveName == "0") {
          if (this.addGoodsForm.goods_cat.length != 3) {
            this.$message.error("请先选择商品分类");
            return false;
          }
        }
      },
      // 切换标签页时，获取动态参数列表数据
      async tabClick() {
        if (this.activeInde == "1") {
          let { data: res } = await getParamsList(this.cateID, {
            sel: "many",
          });
          if (res.meta.status != 200) {
            return this.$message.error("商品参数获取失败");
          } else {
            res.data.forEach(
              (item) => (item.attr_vals = item.attr_vals.split(","))
            );
            this.manyTableDate = res.data;
          }
        }
        if (this.activeInde == "2") {
          let { data: res } = await getParamsList(this.cateID, {
            sel: "only",
          });
          if (res.meta.status != 200) {
            return this.$message.error("商品属性获取失败");
          } else {
            this.onlyTableDate = res.data;
          }
        }
      },
      // 点击文件列表中已上传的文件时的钩子
      // 处理图片预览效果
      handlePreview(file) {
        this.imgFullPath = file.response.data.url;
        this.imgDialogVisible = true;
        console.log(this.imgFullPath);
      },
      // 文件列表移除文件时的钩子
      // 处理移出图片的操作
      // 当点击删除时,删除图片,同时清除对应数组中的数据
      handleRemove(file) {
        const filePath = file.response.data.tmp_path;
        console.log(filePath);
        const i = this.addGoodsForm.pics.findIndex(
          (item) => item.pic == filePath
        );
        this.addGoodsForm.pics.splice(i, 1);
      },
      // 文件上传成功时的钩子
      // 图片上传成功，保存图片临时路径
      handleSuccess(response) {
        const filePath = { pic: response.data.tmp_path };
        this.addGoodsForm.pics.push(filePath);
      },
      // 添加商品
      // 添加之前先对表单内容，发起验证，验证通过，发起请求
      addGoods() {
        this.$refs.form.validate(async (valid) => {
          if (!valid) {
            this.$message.error("请填写必要参数");
          } else {
            // 执行添加的业务逻辑
            // 处理attrs数组
            // 动态属性
            this.manyTableDate.forEach((item) => {
              const newInfo = {
                attr_id: item.attr_id,
                attr_value: item.attr_vals.join(","),
              };
              this.addGoodsForm.attrs.push(newInfo);
            });
            // 静态参数
            this.onlyTableDate.forEach((item) => {
              const newInfo = {
                attr_id: item.attr_id,
                attr_value: item.attr_vals,
              };
              this.addGoodsForm.attrs.push(newInfo);
            });
            // 深拷贝ddGoodsForm
            const newAddGoods = JSON.parse(JSON.stringify(this.addGoodsForm));
            newAddGoods.goods_cat = newAddGoods.goods_cat.join(",");
            let { data: res } = await addGoods(newAddGoods);
            if (res.meta.status != 201) {
              return this.$message.error("添加商品失败");
            } else {
              this.$router.push("/home/goods");
            }
          }
        });
      },
    },
    components: {
      quillEditor,
    },
    computed: {
      // 三级分类ID
      cateID() {
        if (this.addGoodsForm.goods_cat.length == 3) {
          return this.addGoodsForm.goods_cat[2];
        }
        return false;
      },
    },
    mounted() {
      // 获取商品分类数据列表
      this.getCateList();
    },
  };
</script>

<style lang="less" scoped>
  .el-checkbox {
    margin: 0 10px 0 0 !important;
  }
  .btn {
    margin-top: 15px;
  }
</style>
