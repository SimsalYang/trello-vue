<template>
  <div>
    <div class="comment-post">
      <div class="avatar">
        <span>{{ user.name[0].toUpperCase() }}</span>
      </div>
      <div class="comment-content-box editing">
        <textarea
          class="comment-content-input"
          placeholder="添加评论……"
          ref="content"
        ></textarea>
        <button class="btn btn-edit" @click="postComment">保存</button>
      </div>
    </div>

    <ul class="comments" v-if="comments.rows">
      <li class="comment" v-for="comment of comments.rows" :key="comment.id">
        <div class="avatar">
          <span>{{ comment.user.name[0].toUpperCase() }}</span>
        </div>
        <div class="description">
          <div class="header">
            <strong>{{ comment.user.name }}</strong>
            <span> at </span>
            <i>{{ comment.createdAt | datetime }}</i>
          </div>
          <div class="content">
            {{ comment.content }}
          </div>
        </div>
      </li>
    </ul>

    <div class="comment-pagination">
      <VPagination
        :pages="comments.pages"
        :page="comments.page"
        @changePage="changePage"
      ></VPagination>
    </div>
  </div>
</template>

<script>
import VPagination from '@/components/VPagination';
import datetime from '@/filters/datetime';
export default {
  name: 'VComment',
  components: {
    VPagination,
  },
  props: {
    cardId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      comments: {},
    };
  },
  computed: {
    // 获取登录用户信息
    user() {
      return this.$store.state.user.info;
    },
  },
  filters: {
    datetime,
  },
  methods: {
    async getComments(page = 1) {
      try {
        let rs = await this.$store.dispatch('comment/getComments', {
          boardListCardId: this.cardId,
          page,
        });

        this.comments = rs.data;
      } catch (error) {}
    },
    async postComment() {
      let { value } = this.$refs.content;
      if (value.trim() !== '') {
        try {
          let rs = await this.$store.dispatch('comment/postComment', {
            boardListCardId: this.cardId,
            content: value,
          });

          this.$message.success('添加评论成功');
          // 评论成功重新拉取数据
          await this.getComments();

          this.$refs.content.value = '';
        } catch (error) {}
      }
      this.$refs.content.focus();
    },
    async changePage(page) {
      await this.getComments(page);
    },
  },
  async created() {
    await this.getComments();
  },
};
</script>
