<template>
  <!--遮罩层-->
  <div class="window-overlay" style="display: block" v-if="card && list">
    <!--弹出式窗口-->
    <div class="popup">
      <div class="popup-header">
        <div class="popup-title">
          <div class="popup-title-icon">
            <span class="icon icon-card"></span>
          </div>
          <div class="popup-title-text">
            <textarea
              class="form-field-input"
              @change="editCardName"
              v-model.lazy="card.name"
            ></textarea>
          </div>
          <div class="popup-title-detail">在列表 {{ list.name }} 中</div>
        </div>
        <a class="popup-header-close">
          <i class="icon icon-close" @click="$router.back()"></i>
        </a>
      </div>

      <div class="popup-content">
        <!--描述-->
        <div class="window-module">
          <div class="title">
            <div class="title-icon">
              <span class="icon icon-description"></span>
            </div>
            <div class="title-text">
              <h3>描述</h3>
              <button class="btn btn-edit" @click="showDescriptionFrom">
                编辑
              </button>
            </div>
          </div>

          <p class="description">
            <textarea
              class="form-field-input"
              ref="descriptionForm"
              @change="editCardDescription"
              v-model="card.description"
            ></textarea>
          </p>
        </div>

        <!--附件-->
        <div class="window-module">
          <div class="title">
            <div class="title-icon">
              <i class="icon icon-attachment"></i>
            </div>
            <div class="title-text">
              <h3>附件</h3>
            </div>
          </div>

          <ul class="attachments" v-if="Array.isArray(card.attachments)">
            <li
              class="attachment"
              v-for="attachment of card.attachments"
              :key="attachment.id"
            >
              <div
                class="attachment-thumbnail"
                :style="
                  `background-image: url(${server.staticPath}${attachment.path})`
                "
              ></div>
              <p class="attachment-detail">
                <span class="attachment-thumbnail-name"
                  ><strong>{{ attachment.detail.name }}</strong></span
                >
                <span class="attachment-thumbnail-descriptions">
                  <span class="datetime">{{
                    attachment.createdAt | datetime
                  }}</span>
                  <span> - </span>
                  <u @click="deleteAttachment(attachment.id)">删除</u>
                </span>
                <span class="attachment-thumbnail-operation">
                  <i class="icon icon-card-cover"></i>
                  <u
                    v-if="attachment.isCover"
                    @click="removeCover(attachment.id)"
                    >移除封面</u
                  >
                  <u v-else @click="setCover(attachment.id)">设为封面</u>
                </span>
              </p>
            </li>
          </ul>

          <div>
            <button class="btn btn-edit" @click="$refs.attachment.click()">
              添加附件
            </button>
            <input
              type="file"
              ref="attachment"
              style="display: none"
              @change="uploadAttachment"
            />
          </div>
        </div>

        <!--活动-->
        <div class="window-module">
          <div class="title">
            <div class="title-icon">
              <i class="icon icon-activity"></i>
            </div>
            <div class="title-text">
              <h3>评论</h3>
            </div>
          </div>
          <VComment :card-id="card.id"></VComment>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VComment from '@/components/VComment';
import datetime from '@/filters/datetime';
export default {
  name: 'Card',
  components: {
    VComment,
  },
  filters: {
    datetime,
  },
  computed: {
    // card 数据
    card() {
      return this.$store.getters['card/getCard'](this.$route.params.cardId);
    },
    // 列表数据
    list() {
      return this.$store.getters['list/getList'](this.$route.params.listId);
    },
    server() {
      return this.$store.state.server;
    },
  },
  methods: {
    showDescriptionFrom() {
      this.$refs.descriptionForm.focus();
    },
    editCardName() {
      try {
        this.$store.dispatch('card/editCard', {
          id: this.card.id,
          name: this.card.name,
        });
        this.$message.success('卡片名称修改成功');
      } catch (error) {
        throw error;
      }
    },
    editCardDescription() {
      try {
        this.$store.dispatch('card/editCard', {
          id: this.card.id,
          description: this.card.description,
        });

        this.$message.success('卡片描述修改成功');
      } catch (error) {
        throw error;
      }
    },
    // 上传附件
    uploadAttachment() {
      let file = this.$refs.attachment.files[0];
      try {
        this.$store.dispatch('card/uploadAttachment', {
          boardListCardId: this.card.id,
          file,
        });

        this.$refs.attachment.value = '';
        this.$message.success('上传附件成功');
      } catch (error) {}
    },
    setCover(id) {
      try {
        this.$store.dispatch('card/setCover', {
          cardId: this.card.id,
          id,
        });

        this.$message.success('设置封面成功');
      } catch (error) {}
    },
    removeCover(id) {
      try {
        this.$store.dispatch('card/removeCover', {
          cardId: this.card.id,
          id,
        });

        this.$message.success('封面已移除');
      } catch (error) {}
    },
    deleteAttachment(id) {
      try {
        this.$store.dispatch('card/deleteAttachment', {
          cardId: this.card.id,
          id,
        });

        this.$message.success('附件已删除');
      } catch (error) {}
    },
  },
};
</script>

<style></style>
