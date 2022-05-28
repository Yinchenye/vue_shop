<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <el-table :data="RightsList" style="width: 100%" border stripe>
        <el-table-column type="index" label="序号" align="center" width="100px">
        </el-table-column>
        <el-table-column label="权限名称" prop="authName" align="center">
        </el-table-column>
        <el-table-column label="路径" prop="path" align="center">
        </el-table-column>
        <el-table-column label="权限等级" prop="level" align="center">
          <template v-slot:default="scoped">
            <el-tag v-if="scoped.row.level == 0">一级</el-tag>
            <el-tag type="success" v-else-if="scoped.row.level == 1"
              >二级</el-tag
            >
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "MyRights",
    data() {
      return {
        //   保存权限列表数据
        RightsList: [],
      };
    },
    methods: {
      async getRightsList() {
        let { data: res } = await this.$http.get("rights/list");
        if (res.meta.status != 200) {
          return this.$message.error("获取权限列表失败");
        } else {
          this.RightsList = res.data;
        }
      },
    },
    mounted() {
      this.getRightsList();
    },
  };
</script>

<style lang="less" scoped></style>
