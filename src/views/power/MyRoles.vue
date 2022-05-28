<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 添加角色按钮 -->
      <el-button type="primary" @click="addDialogVisible = true"
        >添加角色</el-button
      >

      <el-table :data="roulesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template v-slot:default="scoped">
            <el-row
              v-for="(item, index) in scoped.row.children"
              :key="item.id"
              :class="['bdbottom', index == 0 ? 'bdtop' : '']"
              type="flex"
              align="middle"
              justify="center"
            >
              <el-col :span="4">
                <!-- 渲染一级权限 -->
                <el-tag closable @close="deleteRole(scoped.row, item.id)">
                  {{ item.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <el-row
                  v-for="(item2, index) in item.children"
                  :key="item2.id"
                  :class="[index == 0 ? '' : 'bdtop']"
                  type="flex"
                  align="middle"
                >
                  <el-col :span="6">
                    <el-tag
                      closable
                      type="success"
                      @close="deleteRole(scoped.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="deleteRole(scoped.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="序号" align="center" width="100px">
        </el-table-column>
        <el-table-column
          prop="roleName"
          label="角色名称"
          align="center"
          width="300px"
        >
        </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center" width="300px">
          <template v-slot:default="scoped">
            <el-button
              type="primary"
              icon="el-icon-search"
              size="small"
              @click="searchRoles(scoped.row)"
              >搜索</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-search"
              size="small"
              @click="deleteRoles(scoped.row)"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-search"
              size="small"
              @click="setRolesDialog(scoped.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRolesDialogVisible"
      width="50%"
      @close="resetThirdRolesDialog"
    >
      <!-- 这里的node-key等同于:key，作用是：
      每个树节点用来作为唯一标识的属性，整棵树应该是唯一的 -->
      <el-tree
        :data="RolesTreeDialog"
        :props="defaultProps"
        default-expand-all
        show-checkbox
        :default-checked-keys="thirdRolesDialog"
        node-key="id"
        ref="rolesTreeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisible"
      width="40%"
      @close="closeAddRolesDialog"
    >
      <el-form
        :model="addRolesForm"
        label-width="80px"
        ref="addRolesRef"
        :rules="addRolesRules"
      >
        <el-form-item label="角色名" prop="roleName">
          <el-input v-model.trim="addRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model.trim="addRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRolesTrue">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色对话框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="searchRoleDialogVisible"
      width="50%"
      @close="closeSearchRoleDialog"
    >
      <el-form
        ref="searchRoleRef"
        :model="searchRoleForm"
        label-width="80px"
        :rules="searchRoleFormRules"
      >
        <el-form-item label="角色名" prop="roleName">
          <el-input v-model.trim="searchRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model.trim="searchRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="searchRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="searchRoleDialogTrue"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "MyRoles",
    data() {
      return {
        //   所有角色列表数据
        roulesList: [],
        // 用于控制分配权限对话框
        setRolesDialogVisible: false,
        // 用于保存获取到的权限列表（树形结构）
        RolesTreeDialog: [],
        // 用于展示获取到的权限树形结构
        defaultProps: {
          // 这是多级结构的分割标志（根据数据库结构来定）
          children: "children",
          // 指定节点标签为节点对象的某个属性值
          // 简单来说，就是要展示的节点数据名称
          label: "authName",
        },
        // 用来保存递归获取到的所有三级权限id
        thirdRolesDialog: [],
        // 当前即将分配权限的角色id
        roleId: "",
        // 控制添加角色对话框隐藏与展示
        addDialogVisible: false,
        // 添加角色对话框的表单数据
        addRolesForm: {
          roleName: "",
          roleDesc: "",
        },
        // 检验添加角色的表单数据
        addRolesRules: {
          roleName: [
            { required: true, message: "请输入角色名", trigger: "blur" },
          ],
          roleDesc: [
            { required: true, message: "请输入角色描述", trigger: "blur" },
          ],
        },
        // 控制编辑角色对话框关闭与显示
        searchRoleDialogVisible: false,
        // 编辑角色对话框的表单数据
        searchRoleForm: {},
        // 编辑角色表单验证规则
        searchRoleFormRules: {
          roleName: [
            { required: true, message: "请输入角色名称", trigger: "blur" },
          ],
          roleDesc: [
            { required: true, message: "请输入角色描述", trigger: "blur" },
          ],
        },
      };
    },
    methods: {
      async getroulesList() {
        let { data: res } = await this.$http.get("roles");
        if (res.meta.status != 200) {
          return this.$message.error("角色列表获取失败");
        } else {
          this.roulesList = res.data;
        }
      },
      // 弹窗是否要删除角色指定权限
      //      当前行用户数据，权限id
      async deleteRole(role, rightid) {
        let confirmresult = await this.$confirm(
          "此操作将永久删除该权限, 是否继续?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        ).catch((err) => err);
        // 当用户点击取消，不想删除时，输出的是cancel字符串
        // 当用户点击确定，删除时，输出的是confirm字符串
        if (confirmresult != "confirm") {
          return this.$message.info("已取消删除");
        } else {
          let { data: res } = await this.$http.delete(
            `roles/${role.id}/rights/${rightid}`
          );
          if (res.meta.status != 200) {
            return this.$message.error("取消权限失败");
          } else {
            this.$message.success("取消权限成功");
            // 这里直接将请求完成删除后返回的权限列表渲染到页面上
            // 防止页面的刷新
            // this.getroulesList();
            role.children = res.data;
          }
        }
      },
      // 分配权限对话框
      async setRolesDialog(msg) {
        // 保存id，为分配权限做准备
        this.roleId = msg.id;
        let { data: res } = await this.$http.get("rights/tree");
        if (res.meta.status != 200) {
          this.$message.error("获取权限列表失败");
        } else {
          this.RolesTreeDialog = res.data;
          // 递归获取三级权限的id
          this.getThirdId(msg);
          this.setRolesDialogVisible = true;
        }
      },
      // 通过递归获取所有三级权限id，并保存到数组中
      // 如何判断是否在三级权限，通过判断是否有children属性
      getThirdId(node) {
        if (!node.children) {
          return this.thirdRolesDialog.push(node.id);
        } else {
          // 如果当前的节点中有children属性
          // 先遍历children属性中的内容，递归调动方法，直到没有children为止
          node.children.forEach((item) => this.getThirdId(item));
        }
      },
      // 关闭分配权限对话框时，重置数组
      // 防止后续弹框递归继承上级权限id
      resetThirdRolesDialog() {
        this.thirdRolesDialog = [];
      },
      // 点击确定发送请求完成角色授权
      async allotRoles() {
        // 定义一个数组，通过展开运算符保存所有被选中的叶子节点的key和半选中节点的key
        let allCheckedRoles = [
          ...this.$refs.rolesTreeRef.getCheckedKeys(),
          ...this.$refs.rolesTreeRef.getHalfCheckedKeys(),
        ];
        // 将保存的数组转换为字符串
        allCheckedRoles = allCheckedRoles.join(",");
        let { data: res } = await this.$http.post(
          `roles/${this.roleId}/rights`,
          {
            rids: allCheckedRoles,
          }
        );
        if (res.meta.status != 200) {
          return this.$message.error("更新权限失败");
        } else {
          this.$message.success("更新权限成功");
          this.getroulesList();
        }
        this.setRolesDialogVisible = false;
      },
      // 点击确定添加角色
      // 在发送请求前，先检验表单信息是否符合要求
      addRolesTrue() {
        this.$refs.addRolesRef.validate(async (valid) => {
          if (!valid) {
            return false;
          } else {
            let { data: res } = await this.$http.post(
              "roles",
              this.addRolesForm
            );
            if (res.meta.status != 201) {
              return this.$message.error("创建失败");
            } else {
              this.$message.success("角色创建成功");
              this.getroulesList();
            }
          }
          this.addDialogVisible = false;
        });
      },
      // 关闭时，重置添加角色对话框
      closeAddRolesDialog() {
        this.$refs.addRolesRef.resetFields();
      },
      // 点击删除角色功能
      async deleteRoles(id) {
        let deletemsg = await this.$confirm(
          "此操作将永久删除该文件, 是否继续?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        ).catch((error) => error);
        // 如果用户点击了取消，返回的字符串是cancel
        // 如果用户点击了确定，返回的字符串是confirm
        if (deletemsg != "confirm") {
          return this.$message.info("已取消删除");
        } else {
          let { data: res } = await this.$http.delete(`roles/${id.id}`);
          if (res.meta.status != 200) {
            this.$message.error("角色删除失败");
          } else {
            this.$message.success("角色删除成功");
            this.getroulesList();
          }
        }
      },
      // 根据ID查询角色功能实现
      async searchRoles(roleId) {
        let { data: res } = await this.$http.get(`roles/${roleId.id}`);
        if (res.meta.status != 200) {
          return this.$message.error("获取角色失败");
        } else {
          this.searchRoleForm = res.data;
        }
        this.searchRoleDialogVisible = true;
      },
      // 关闭对话框时，重置表单内容
      closeSearchRoleDialog() {
        this.$refs.searchRoleRef.resetFields();
      },
      // 编辑功能实现
      // 在请求前，先对表单数据进行预检验
      searchRoleDialogTrue() {
        this.$refs.searchRoleRef.validate(async (valid) => {
          if (!valid) {
            return false;
          } else {
            let { data: res } = await this.$http.put(
              `roles/${this.searchRoleForm.roleId}`,
              {
                roleName: this.searchRoleForm.roleName,
                roleDesc: this.searchRoleForm.roleDesc,
              }
            );
            if (res.meta.status != 200) {
              return this.$message.error("修改角色信息失败");
            } else {
              this.$message.success("修改角色信息成功");
              this.getroulesList();
            }
          }
          this.searchRoleDialogVisible = false;
        });
      },
    },
    mounted() {
      this.getroulesList();
    },
  };
</script>

<style lang="less" scoped>
  .el-tag {
    margin: 7px;
  }
  .bdtop {
    border-top: 1px solid #eee;
  }
  .bdbottom {
    border-bottom: 1px solid #eee;
  }
</style>
