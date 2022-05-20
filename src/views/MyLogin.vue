<template>
  <div id="login">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="ava_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 登录表单区域 -->
      <el-form
        :model="form"
        :rules="formRules"
        label-width="0px"
        class="form_box"
        ref="LoginFormRef"
      >
        <!-- 登录 -->
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="请输入账号">
            <i slot="prefix" class="el-input__icon el-icon-user"></i>
          </el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            placeholder="请输入密码"
            show-password
          >
            <i slot="prefix" class="el-input__icon el-icon-lock"></i>
          </el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="form_btns">
          <el-button type="primary" @click="formLogin">登录</el-button>
          <el-button type="info" @click="formReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    name: "MyLogin",
    data() {
      return {
        form: {
          username: "admin",
          password: "123456",
        },
        // 表单验证规则对象
        // 这里的表单验证必须卸载data的return里面
        // 注：这里验证的字段名，必须和v-model绑定的名字要一致
        formRules: {
          // 验证用户名是否合法
          username: [
            { required: true, message: "请输入登录账号", trigger: "blur" },
            // 写入正则表达式（pattern），注：这里不能加引号
            {
              min: 3,
              max: 5,
              message: "密码长度在3到5个字符",
              trigger: "blur",
            },
          ],
          // 验证密码是否合法
          password: [
            { required: true, message: "请输入登录密码", trigger: "blur" },
            {
              min: 5,
              max: 10,
              message: "密码长度在5到10个字符",
              trigger: "blur",
            },
          ],
        },
      };
    },
    methods: {
      formReset() {
        this.$refs.LoginFormRef.resetFields();
      },
      formLogin() {
        this.$refs.LoginFormRef.validate(async (valida) => {
          if (!valida) {
            return false;
          } else {
            // 符合表单要求就通过axios发送ajax请求
            // 将返回的信息解析赋值
            let { data: res } = await this.$http.post("login", this.form);
            console.log(res);
            // 通过返回的状态码来判断登录是否成功
            if (res.meta.status != 200) {
              return this.$message.error("登录失败");
            } else {
              this.$message.success("登录成功");
              // 1.将登录成功之后的token，保存到客户端的sessionStorage中
              //   1.1 项目中出了登录之外的其他api接口，必须在登录之后才能访问
              //   1.2 token只应在当前网站打开期间生效，所以将token保存在sessionStorage中
              sessionStorage.setItem("token", res.data.token);
              // 2.通过编程式路由导航跳转到后台主页，路由地址是/home
              this.$router.push("/home");
            }
          }
        });
      },
    },
  };
</script>

<style lang="less" scoped>
  #login {
    background-color: #2b4b6b;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .login_box {
    width: 450px;
    height: 300px;
    background-color: white;
    border-radius: 3px;
    position: relative;
  }
  .ava_box {
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
  .form_box {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0px 20px;
    box-sizing: border-box;
    .form_btns {
      display: flex;
      justify-content: flex-end;
    }
  }
</style>
