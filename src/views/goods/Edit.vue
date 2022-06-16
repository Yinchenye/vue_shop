<template>
  <!-- 面包屑导航区 -->
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>编辑商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <el-alert
        title="编辑商品信息"
        type="info"
        show-icon
        :closable="false"
        center
      >
      </el-alert>
      <!-- 步骤条 -->
      <el-steps
        :space="200"
        :active="active - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 标签页 -->
      <el-form
        ref="form"
        :model="getGoodByIdData"
        label-width="80px"
        label-position="top"
        :rules="editFormRules"
      >
        <el-tabs :tab-position="`left`" v-model="active">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="getGoodByIdData.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input
                v-model="getGoodByIdData.goods_price"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input
                v-model="getGoodByIdData.goods_weight"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input
                v-model="getGoodByIdData.goods_number"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <!-- 商品分类级联选择器 -->
              <el-cascader
                v-model="getGoodByIdData.goods_cat"
                :options="goodsCatParamsData"
                :props="goodsCatParamsProps"
                @change="handleChange"
                disabled
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的item项 -->
            <el-form-item
              :label="item.attr_name"
              v-for="(item, index) in manyData"
              :key="index"
            >
              <!-- 多选框组 -->
              <el-checkbox-group v-model="item.attr_value">
                <el-checkbox
                  :label="item"
                  v-for="(item, index) in item.attr_value"
                  :key="index"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <!-- 渲染表单的item项 -->
            <el-form-item
              :label="item.attr_name"
              v-for="(item, index) in onlyData"
              :key="index"
            >
              <el-input v-model="item.attr_value"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              class="upload-demo"
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-success="handleSuccess"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="uploadHeader"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor
              ref="myQuillEditor"
              v-model="getGoodByIdData.goods_introduce"
            />
            <!-- 提交编辑按钮 -->
            <el-button type="primary" class="btn" @click="subemit"
              >提交编辑</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览对话框 -->
    <el-dialog title="图片预览" :visible.sync="imgDialogVisible" width="50%">
      <img :src="imgFullPath" width="100%" />
    </el-dialog>
  </div>
</template>

<script>
  import { getCateList } from "@/api/goods/Params";
  import { getGoodById, subemit } from "@/api/goods/Edit.js";
  // 引入富文本编辑器插件
  import { quillEditor } from "vue-quill-editor";
  import "quill/dist/quill.core.css";
  import "quill/dist/quill.snow.css";
  import "quill/dist/quill.bubble.css";
  export default {
    name: "MyEditGoods",
    data() {
      return {
        // 激活步骤条
        active: "0",
        // 编辑商品发送参数
        editForm: {
          goods_name: "",
          goods_price: 0,
          goods_weight: 0,
          goods_number: 0,
          goods_introduce: "",
          // 商品分类级联选择器，分类参数id
          goods_cat: "",
          pics: [],
          attrs: [],
        },
        // 保存上个页面传来的商品id
        goodId: this.$route.query.good_id,
        // 保存通过id获取到的商品信息
        getGoodByIdData: {},
        // 保存级联选择器商品分类数据列表
        goodsCatParamsData: [],
        // 级联选择器配置项
        goodsCatParamsProps: {
          children: "children",
          expandTrigger: "hover",
          label: "cat_name",
          value: "cat_id",
        },
        // 表单验证
        editFormRules: {
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
        },
        // 保存动态参数
        manyData: [],
        // 保存静态属性
        onlyData: [],
        // 上传图片时候的token
        uploadHeader: {
          Authorization: sessionStorage.getItem("token"),
        },
        // 保存图片网络路径
        imgFullPath: "",
        // 控制图片预览对话框显示与隐藏
        imgDialogVisible: false,
      };
    },
    methods: {
      // 根据id查询商品
      async getGoodById() {
        let { data: res } = await getGoodById(this.goodId);
        if (res.meta.status != 200) {
          this.$message.error("获取商品信息失败");
        } else {
          this.getGoodByIdData = res.data;
          this.getGoodByIdData.goods_cat =
            this.getGoodByIdData.goods_cat.split(",");
          this.getGoodByIdData.goods_cat.forEach((item, index) => {
            this.getGoodByIdData.goods_cat.splice(index, 1, item - 0);
          });
          this.getGoodByIdData.attrs.forEach((item) => {
            if (item.attr_sel == "only") {
              const onlyList = { ...item };
              this.onlyData.push(onlyList);
            } else {
              const manyList = { ...item };
              manyList.attr_value = manyList.attr_value.split(",");
              this.manyData.push(manyList);
            }
          });
        }
      },
      //   获取级联选择器商品分类数据列表
      async getGoodParams() {
        let { data: res } = await getCateList();
        if (res.meta.status != 200) {
          this.$message.error("获取商品分类数据失败");
        } else {
          this.goodsCatParamsData = res.data;
        }
      },
      handleChange() {
        if (this.getGoodByIdData.goods_cat.length != 3) {
          this.getGoodByIdData.goods_cat = [];
          return this.$message.info("只能选择三级分类");
        }
      },
      //   图片上传成功时的钩子
      //   图片上传成功，保存图片临时路径
      handleSuccess(response) {
        const imgTmpPath = { pic: response.data.tmp_path };
        this.editForm.pics.push(imgTmpPath);
      },
      handlePreview(file) {
        this.imgFullPath = file.response.data.url;
        this.imgDialogVisible = true;
      },
      handleRemove(file) {
        const picsIndex = this.editForm.pics.findIndex(
          (item) => item.pic == file.response.data.tmp_path
        );
        this.editForm.pics.splice(picsIndex, 1);
      },
      // 提交编辑
      async subemit() {
        this.manyData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_value.join(","),
          };
          this.editForm.attrs.push(newInfo);
        });
        this.onlyData.forEach((item, index) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_value,
          };
          this.editForm.attrs.push(newInfo);
        });
        this.editForm.goods_cat = this.getGoodByIdData.goods_cat.join(",");
        this.editForm.goods_name = this.getGoodByIdData.goods_name;
        this.editForm.goods_price = this.getGoodByIdData.goods_price;
        this.editForm.goods_weight = this.getGoodByIdData.goods_weight;
        this.editForm.goods_number = this.getGoodByIdData.goods_number;
        console.log(this.editForm);
        let { data: res } = await subemit(this.goodId, this.editForm);
        if (res.meta.status != 200) {
          this.$message.error(res.meta.msg);
        } else {
          this.$message.success("商品编辑成功");
          this.$router.push({
            path: "/goods",
          });
        }
      },
    },
    components: {
      quillEditor,
    },
    computed: {
      cateId() {
        if (this.getGoodByIdData.goods_cat.length == 3) {
          return this.getGoodByIdData.goods_cat[2];
        }
        return false;
      },
    },
    created() {
      this.getGoodById();
      this.getGoodParams();
    },
  };
</script>

<style lang="less" scoped>
  .btn {
    margin-top: 15px;
  }
</style>
