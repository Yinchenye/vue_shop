// 该文件管理项目中的所有路由配置
// import Vue from "vue";
import VueRouter from "vue-router";
// Vue.use(VueRouter);
import MyLogin from "../views/MyLogin.vue";
const router = new VueRouter({
  routes: [
    {
      path: "/",
      redirect: "/login",
    },
    {
      path: "/login",
      component: MyLogin,
    },
    {
      path: "/home",
      component: () => import("../views/MyHome.vue"),
      redirect: "/home/welcome",
      children: [
        {
          path: "welcome",
          component: () => import("../views/MyWelcome.vue"),
        },
        {
          path: "users",
          component: () => import("../views/user/MyUser.vue"),
        },
        {
          path: "rights",
          component: () => import("../views/power/MyRights.vue"),
        },
        {
          path: "roles",
          component: () => import("../views/power/MyRoles.vue"),
        },
      ],
    },
  ],
});
// 设置路由守卫，每次登录前，验证token
router.beforeEach((to, from, next) => {
  // 登录界面对任何人放行
  if (to.path == "/login") next();
  // 只有会话中存有token才能放行
  if (!sessionStorage.getItem("token")) return next("/login");
  next();
});
export default router;
