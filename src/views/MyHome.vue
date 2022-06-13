<template>
  <el-container class="home_contain">
    <el-header height="70px">
      <div>
        <img src="../assets/imgs/logo.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>

    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- 侧边栏菜单区域 -->
        <!-- 这里的unique-opened是为了保证每次展开时，只有一个子菜单的展开 -->
        <el-menu
          background-color="#313743"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="$route.path"
        >
          <div class="toggle-button" @click="toggleMenu">| | |</div>
          <!-- 一级菜单 -->
          <el-submenu
            :index="menu.id.toString()"
            v-for="menu in menuList"
            :key="menu.id"
          >
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <!-- 根据id渲染对应的字体图标 -->
              <i :class="iconList[menu.id]"></i>
              <!-- 文本 -->
              <span>{{ menu.authName }}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item
              :index="`${submenu.path}`"
              v-for="submenu in menu.children"
              :key="submenu.id"
            >
              <!-- 二级菜单模板区域 -->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{ submenu.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import { home } from "@/api/MyHome.js";
  export default {
    name: "MyHome",
    data() {
      return {
        menuList: [],
        // 使用对象保存一级导航的图标，由于接口没有对应的图片，这里使用字体图标
        iconList: {
          125: "iconfont icon-users",
          103: "iconfont icon-tijikongjian",
          101: "iconfont icon-shangpin",
          102: "iconfont icon-danju",
          145: "iconfont icon-baobiao",
        },
        isCollapse: false,
      };
    },
    methods: {
      // 退出实现：先清空存储的token，重定向到login登录页面
      logout() {
        sessionStorage.clear();
        this.$router.replace("/login");
      },
      // 获取所有菜单
      async getMentList() {
        let { data: res } = await home();
        if (res.meta.status != 200) {
          return this.$message.error(res.meta.msg);
        } else {
          this.menuList = res.data;
        }
      },
      toggleMenu() {
        this.isCollapse = !this.isCollapse;
      },
    },
    mounted() {
      this.getMentList();
    },
  };
</script>

<style lang="less" scoped>
  .home_contain {
    height: 100%;
  }
  .el-header {
    background-color: rgb(54, 61, 64);
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: white;
    padding-left: 15px;
    div {
      display: flex;
      align-items: center;
      img {
        width: 60px;
        height: 56px;
      }
      span {
        padding-left: 10px;
        color: white;
        font-size: 20px;
      }
    }
  }
  .el-aside {
    background-color: rgb(49, 55, 67);
    .el-menu {
      border-right: none;
    }
  }
  .el-main {
    background-color: #e9edf1;
  }

  .iconfont {
    margin-right: 10px;
  }
  .toggle-button {
    color: white;
    background-color: #4a5064;
    line-height: 42px;
    font-size: 16px;
    text-align: center;
    cursor: pointer;
  }
</style>
