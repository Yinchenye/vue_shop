<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <el-row :gutter="30">
        <el-col :span="10">
          <div class="grid-content bg-purple">
            <el-input
              placeholder="请输入内容"
              class="input-with-select"
              v-model="getUserInof.query"
              clearable
              @clear="getUserList(getUserInof.query)"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="getUserList(getUserInof.query)"
              ></el-button>
            </el-input>
          </div>
        </el-col>
        <el-col :span="10">
          <div class="grid-content bg-purple">
            <el-button type="primary" @click="addDialogVisble = true"
              >添加用户</el-button
            >
          </div>
        </el-col>
      </el-row>

      <!-- 表格展示区域 -->
      <el-table :data="UserList" style="width: 100%" border stripe>
        <!-- 自定义序列 -->
        <el-table-column align="center" type="index" label="序号" width="60px">
        </el-table-column>
        <el-table-column align="center" prop="username" label="姓名">
        </el-table-column>
        <el-table-column align="center" prop="email" label="邮箱">
        </el-table-column>
        <el-table-column align="center" prop="mobile" label="电话">
        </el-table-column>
        <el-table-column align="center" prop="role_name" label="角色">
        </el-table-column>
        <!-- 当使用了作用域插槽之后，就不需要使用prop属性了，会被默认覆盖掉 -->
        <el-table-column align="center" label="状态">
          <!-- 这里要实现自动按钮效果，必须使用作用域插槽，获取到行的数据 -->
          <!-- 插槽没有名字默认是default，可以简写为v-slot="scoped" -->
          <template v-slot:default="scoped">
            <!-- 这里的row，是指获取自定义表格单元行的数据，elemet-ui已经处理好 -->
            <!-- {{ scoped.row.mg_state }} -->
            <el-switch
              v-model="scoped.row.mg_state"
              @change="changeUserState(scoped.row)"
            ></el-switch>
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="180px">
          <template v-slot:default="scoped">
            <!-- 修改按钮 -->
            <el-tooltip
              effect="dark"
              content="修改角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="small"
                @click="editDialog(scoped.row.id)"
              ></el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip
              effect="dark"
              content="删除角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="danger"
                icon="el-icon-share"
                size="small"
                @click="deleteUser(scoped.row.id)"
              ></el-button>
            </el-tooltip>
            <!-- 分配角色按钮 -->
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-s-tools"
                size="small"
                @click="setRole(scoped.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页功能区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="getUserInof.pagenum"
        :page-sizes="[1, 2, 3, 5]"
        :page-size="getUserInof.pagesize"
        :total="getUserInof.TotalPage"
        layout="total, sizes, prev, pager, next, jumper"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisble"
      width="50%"
      @close="closeDialonForm"
    >
      <!-- 添加用户对话框内容主主体区 -->
      <el-form
        ref="addFormRef"
        :model="addForm"
        label-width="80px"
        :rules="addFormRules"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisble = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改角色对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogMsg"
      width="50%"
      @close="editClose"
    >
      <el-form
        ref="addFormUserRef"
        :rules="editUserRules"
        :model="editUserDialog"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editUserDialog.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserDialog.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editUserDialog.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogMsg = false">取 消</el-button>
        <el-button type="primary" @click="editDialogTrue">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRolesdialogVisible"
      width="50%"
      @close="closeRolesdialog"
    >
      <div>
        <p>当前用户名：{{ userInfo.username }}</p>
        <p>当前角色：{{ userInfo.role_name }}</p>
        <p>
          <el-select v-model="selectRolesId" placeholder="请选择">
            <el-option
              v-for="item in selectRolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRolesdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setUserRoles">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "MyUser",
    data() {
      // 邮箱验证规则
      //               验证规则，待验证对象，验证成功失败的回调函数
      var checkemail = (rule, value, callback) => {
        // 验证邮箱的正则
        let regEmail = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
        if (regEmail.test(value)) {
          // 合法的邮箱
          return callback();
        }
        callback(new Error("请输入合法的邮箱！"));
      };
      // 手机号验证规则
      //               验证规则，待验证对象，验证成功失败的回调函数
      var checkmobile = (rule, value, callback) => {
        // 验证手机号的正则
        let regEmail =
          /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/;
        if (regEmail.test(value)) {
          // 合法的手机号
          return callback();
        }
        callback(new Error("请输入合法的手机号！"));
      };
      return {
        getUserInof: {
          // 查询参数
          query: "",
          //   当前页数,当前位于第几页
          pagenum: 1,
          //   当前每页显示多少条数据
          pagesize: 2,
          // 这个参数用来保存返回的总数据记录数
          TotalPage: 0,
        },
        UserList: [],
        // 控制添加对话框的显示与隐藏
        addDialogVisble: false,
        // 添加用户的表单数据
        addForm: {
          // 用户名
          username: "",
          // 密码
          password: "",
          // 邮箱
          email: "",
          // 手机号
          mobile: "",
        },
        // 添加用户表单数据验证
        addFormRules: {
          username: [
            { required: true, message: "请输入用户名", trigger: "blur" },
            {
              min: 3,
              max: 10,
              message: "长度在3到10个字符之间",
              trigger: "blur",
            },
          ],
          password: [
            { required: true, message: "请输入密码", trigger: "blur" },
            {
              min: 6,
              max: 15,
              message: "长度在6到15个字符之间",
              trigger: "blur",
            },
          ],
          email: [
            {
              pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
              message: "邮箱格式不正确",
              trigger: "blur",
            },
          ],
          mobile: [
            {
              pattern:
                /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
              message: "手机号格式不正确",
              trigger: "blur",
            },
          ],
        },
        // 控制修改角色对话框的显示与隐藏
        editDialogMsg: false,
        // 这里用来保存通过id查询到的用户信息
        editUserDialog: {},
        // 修改用户表单数据验证
        editUserRules: {
          email: [
            { required: true, message: "请输入邮箱", trigger: "blur" },
            {
              validator: checkemail,
              message: "邮箱格式不正确",
              trigger: "blur",
            },
          ],
          mobile: [
            { required: true, message: "请输入手机号", trigger: "blur" },
            {
              validator: checkmobile,
              message: "手机号格式不正确",
              trigger: "blur",
            },
          ],
        },
        // 控制分配角色对话框的显示与隐藏
        setRolesdialogVisible: false,
        // 需要被分配角色的用户信息
        userInfo: {},
        // 需要被分配的下拉框的角色列表
        selectRolesList: [],
        // 已选中角色的id值
        selectRolesId: "",
      };
    },
    methods: {
      // 获取用户数据列表
      async getUserList() {
        let { data: res } = await this.$http.get("users", {
          params: this.getUserInof,
        });
        if (res.meta.status != 200) {
          return this.$message.error("获取用户列表失败");
        }
        this.UserList = res.data.users;
        this.getUserInof.TotalPage = res.data.total;
      },
      //   侦听pagesize改变事件
      handleSizeChange(newvalue) {
        this.getUserInof.pagesize = newvalue;
        this.getUserList();
      },
      //   侦听页码值改变事件
      handleCurrentChange(newvalue) {
        this.getUserInof.pagenum = newvalue;
        this.getUserList();
      },
      //   修改用户状态
      async changeUserState(value) {
        let { data: res } = await this.$http.put(
          `users/${value.id}/state/${value.mg_state}`
        );
        if (res.meta.status != 200) {
          value.mg_state = !value.mg_state;
          return this.$message.error("用户状态修改失败");
        } else {
          this.$message.success("用户状态修改成功");
        }
      },
      // 关闭对话框重置表单内容
      closeDialonForm() {
        this.$refs.addFormRef.resetFields();
      },
      // 添加新用户
      // 添加新用户前先发起表单预校验，成功了之后再发起添加请求
      addUser() {
        this.$refs.addFormRef.validate(async (valid) => {
          if (!valid) {
            return false;
          } else {
            // 发起添加用户的网络请求
            let { data: res } = await this.$http.post(
              "userssssss",
              this.addForm
            );
            if (res.meta.status != 201) {
              this.$message.error("用户创建失败");
            } else {
              console.log(res);
              this.$message.success("用户创建成功");
            }
          }
          // 隐藏添加用户的对话框
          this.addDialogVisble = false;
          this.getUserList();
        });
      },
      // 修改角色（通过id查询角色信息）
      async editDialog(userID) {
        this.editDialogMsg = true;
        let { data: res } = await this.$http.get(`users/${userID}`);
        if (res.meta.status != 200) {
          return this.$message.error("查询失败");
        } else {
          this.$message.success("查询成功");
          this.editUserDialog = res.data;
        }
      },
      // 用于侦听修改角色弹出框关闭事件
      editClose() {
        this.$refs.addFormUserRef.resetFields();
      },
      // 修改用户信息
      // 修改用户信息前先发起表单预校验，成功了之后再发起修改请求
      editDialogTrue() {
        this.$refs.addFormUserRef.validate(async (config) => {
          if (!config) {
            return false;
          } else {
            let { data: res } = await this.$http.put(
              `users/${this.editUserDialog.id}`,
              {
                email: this.editUserDialog.email,
                mobile: this.editUserDialog.mobile,
              }
            );
            if (res.meta.status != 200) {
              return this.$message.error("用户信息修改失败");
            } else {
              // 更新用户列表信息
              this.getUserList();
              this.$message.success("用户信息修改成功");
            }
          }
          // 关闭修改用户信息对话框
          this.editDialogMsg = false;
        });
      },
      // 根据id删除用户信息
      async deleteUser(userid) {
        // 弹框询问用户是否删除
        let confirmResult = await this.$confirm(
          "此操作将永久删除该用户, 是否继续?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
          // 这里是为了捕获异常，抛出错误
        ).catch((err) => err);
        // 如果用户确认了删除，输出的字符串是confirm
        // 如果用户取消了删除，输出的字符串是cancel
        // console.log(confirmResult);
        if (confirmResult != "confirm") {
          return this.$message.info("已取消删除");
        } else {
          let { data: res } = await this.$http.delete(`users/${userid}`);
          if (res.meta.status != 200) {
            return this.$message.error("删除失败");
          } else {
            this.$message.success("删除成功");
            this.getUserList();
          }
        }
      },
      // 展示分配角色的对话框
      async setRole(userInfo) {
        this.userInfo = userInfo;
        let { data: res } = await this.$http.get("roles");
        this.selectRolesList = res.data;
        this.setRolesdialogVisible = true;
      },
      // 点击确定分配用户角色
      async setUserRoles() {
        if (!this.selectRolesId) {
          return this.$message.error("请选择要分配的角色！");
        }
        let { data: res } = await this.$http.put(
          `users/${this.userInfo.id}/role`,
          {
            rid: this.selectRolesId,
          }
        );
        if (res.meta.status != 200) {
          return this.$message.error("更新角色失败");
        } else {
          this.$message.success("更新角色成功");
          this.getUserList();
        }
        this.setRolesdialogVisible = false;
      },
      // 侦听分配角色对话框关闭事件，重置对话框内容
      closeRolesdialog() {
        this.selectRolesId = "";
      },
    },
    mounted() {
      this.getUserList();
    },
  };
</script>

<style lang="less" scoped></style>
