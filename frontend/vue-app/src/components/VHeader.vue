<template>
  <header>
    <div class="left">
      <router-link :to="{ path: '/' }" class="btn btn-icon">
        <i class="icon icon-home"></i>
      </router-link>
      <router-link :to="{ name: 'Home' }" class="btn btn-icon">
        <i class="icon icon-board"></i>
        <span class="txt">看板</span>
      </router-link>
    </div>
    <router-link :to="{ name: 'Home' }" class="logo"></router-link>
    <div class="right">
      <a href="" class="btn btn-icon">
        <i class="icon icon-add"></i>
      </a>
      <VPopup :title="username" ref="vPopup">
        <button class="avatar">
          <span>{{ username[0].toUpperCase() }}</span>
        </button>
        <VPopupMenu
          slot="content"
          :items="menuItems"
          @command="execute"
        ></VPopupMenu>
      </VPopup>
    </div>
  </header>
</template>

<script>
import VPopup from '@/components/VPopup';
import VPopupMenu from '@/components/VPopupMenu';
// 引入 vuex 的 mapState
import { mapState } from 'vuex';
export default {
  name: 'VHeader',
  components: {
    VPopup,
    VPopupMenu,
  },
  data() {
    return {
      menuItems: [
        {
          name: '退出',
          command: 'logout',
        },
      ],
    };
  },
  computed: {
    // 从 mapState 中获取用户数据
    ...mapState('user', {
      username: (state) => state.info.name,
    }),
  },
  methods: {
    execute(command) {
      switch (command) {
        case 'logout':
          this.logout();
          break;

        default:
          break;
      }
    },
    logout() {
      this.$store.dispatch('user/logout');
      this.$router.push({ name: 'Login' });
      // this.$refs.vPopup.close();
    },
  },
};
</script>

<style></style>
