<template>
  <div id="home">
    <!--头部-->
    <VHeader></VHeader>
    <main>
      <h2>
        <span class="icon icon-board"></span>
        我的看板
      </h2>
      <ul class="board-items">
        <router-link
          tag="li"
          class="board-item"
          v-for="board of boards"
          :key="board.id"
          :to="{ name: 'Board', params: { id: board.id } }"
        >
          <span class="title">{{ board.name }}</span>
        </router-link>

        <li class="board-item create-new-board">
          <textarea
            class="title form-field-input"
            placeholder="创建新看板"
            ref="newBoardName"
            @blur="postBoard"
          ></textarea>
        </li>
      </ul>
    </main>
  </div>
</template>

<script>
import VHeader from '@/components/VHeader';
import { mapState } from 'vuex';
export default {
  name: 'Home',
  components: {
    VHeader,
  },
  computed: {
    ...mapState('board', {
      boards: (state) => state.boards,
      inited: (state) => state.inited,
    }),
  },
  methods: {
    postBoard() {
      let val = this.$refs.newBoardName.value;
      if (val.trim !== '') {
        try {
          this.$store.dispatch('board/postBoard', {
            name: val,
          });
          this.$message.success('面板创建成功');
          this.$refs.newBoardName.value = '';
        } catch (e) {}
      }
    },
  },
  created() {
    // 如果没有初始化过，进行初始化
    if (!this.inited) {
      this.$store.dispatch('board/getBoards');
    }
  },
};
</script>

<style></style>
