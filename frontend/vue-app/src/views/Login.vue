<template>
  <div id="register-login">
    <router-link class="logo" :to="{ name: 'Home' }"></router-link>

    <div class="section-wrapper">
      <div class="account-form">
        <h1>登录到 Trello</h1>
        <form id="register-form" method="POST" @submit.prevent="loginSubmit">
          <div>
            <label>
              <input
                v-model="user.name"
                class="form-field"
                autofocus="autofocus"
                placeholder="输入用户名"
              />
            </label>
          </div>
          <div>
            <label>
              <input
                v-model="user.password"
                type="password"
                class="form-field"
                placeholder="输入密码"
              />
            </label>
          </div>
          <div>
            <input type="submit" class="btn btn-success" value="登录" />
            <span class="signin-signup-separator">或者</span>
            <router-link :to="{ name: 'Register' }" tag="button" class="btn"
              >注册</router-link
            >
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      user: {
        name: '',
        password: '',
      },
    };
  },
  methods: {
    async loginSubmit() {
      // 必要的验证
      if (this.user.name.trim() === '' || this.user.password.trim() === '') {
        return this.$message.error('用户名和密码不能为空');
      }

      try {
        await this.$store.dispatch('user/login', {
          ...this.user,
        });

        this.$router.push({ name: 'Home' });
      } catch (e) {}
    },
  },
};
</script>

<style></style>
