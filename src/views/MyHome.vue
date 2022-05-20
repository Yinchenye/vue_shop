<template>
  <div>
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
  export default {
    name: "MyHome",
    methods: {
      // 退出实现：先清空存储的token，重定向到login登录页面
      logout() {
        sessionStorage.clear();
        this.$router.replace("/login");
      },
    },
  };
</script>

<style lang="less" scoped></style>
