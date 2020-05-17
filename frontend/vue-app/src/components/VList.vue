<template>
  <div
    class="list-wrap list-wrap-content"
    :class="{ 'list-adding': listAdding }"
    :data-order="data.order"
  >
    <!-- 拖拽后的占位元素 -->
    <div class="list-placeholder" ref="listPlaceholder"></div>

    <div class="list" ref="list">
      <div class="list-header" ref="listHeader">
        <textarea
          class="form-field-input"
          @mousedown.prevent
          v-model="data.name"
          ref="newBoardListName"
          @blur="editListName"
        ></textarea>
        <div class="extras-menu" @mousedown.prevent>
          <span class="icon icon-more"></span>
        </div>
      </div>

      <div class="list-cards">
        <VCard v-for="card of cards" :key="card.id" :data="card"></VCard>
        <div class="list-card-add-form">
          <textarea
            class="form-field-input"
            placeholder="为这张卡片添加标题……"
            ref="newCardListName"
          ></textarea>
        </div>
      </div>

      <div class="list-footer">
        <div class="list-card-add" @click="showListCardAddForm">
          <span class="icon icon-add"></span>
          <span>添加另一张卡片</span>
        </div>
        <div class="list-add-confirm">
          <button class="btn btn-success" @click="addNewCard">添加卡片</button>
          <span class="icon icon-close" @click="hideListCardAddForm"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VCard from '@/components/VCard.vue';

export default {
  name: 'VList',
  components: {
    VCard,
  },
  props: {
    data: {
      type: Object,
    },
  },
  data() {
    return {
      drag: {
        isDown: false,
        isDrag: false,
        downClientX: 0,
        downClientY: 0,
        downElementX: 0,
        downElementY: 0,
      },
      listAdding: false,
      listName: '',
    };
  },
  methods: {
    dragDown(e) {
      this.drag.isDown = true;
      this.drag.downClientX = e.clientX;
      this.drag.downClientY = e.clientY;
      // 记录按下时要拖拽的元素的位置
      let pos = this.$refs.list.getBoundingClientRect();
      // console.log(pos.x, pos.y);
      this.drag.downElementX = pos.x;
      this.drag.downElementY = pos.y;
    },
    dragMove(e) {
      // 判断是否有按下
      if (this.drag.isDown) {
        let listElement = this.$refs.list;
        let x = e.clientX - this.drag.downClientX;
        let y = e.clientY - this.drag.downClientY;
        // console.log(x, y);
        // 触发拖拽条件
        if (x > 10 || y > 10) {
          // console.log('drag');
          // 判断是否时首次触发
          if (!this.drag.isDrag) {
            this.drag.isDrag = true;
            this.$refs.listPlaceholder.style.height =
              listElement.offsetHeight + 'px';
            // 在鼠标按下时，将元素定位改为绝对定位
            listElement.style.position = 'absolute';
            listElement.style.zIndex = 99999;
            listElement.style.transform = 'rotate(5deg)';
            // 将元素拽入 body 中，方便操作
            document.body.appendChild(listElement);
            // 给父级提供调用事件
            this.$emit('dragStart', {
              component: this,
            });
          }
          // 首次触发之后的行为都是在移动
          listElement.style.left = this.drag.downElementX + x + 'px';
          listElement.style.top = this.drag.downElementY + y + 'px';
          this.$emit('dragMove', {
            component: this,
            x: e.clientX,
            y: e.clientY,
          });
        }
      }
    },
    dragUp(e) {
      // 判断是否触发拖拽
      if (this.drag.isDown) {
        if (this.drag.isDrag) {
          // 还原
          this.$refs.listPlaceholder.style.height = 0;
          let listElement = this.$refs.list;
          listElement.style.position = 'relative';
          listElement.style.zIndex = 0;
          listElement.style.left = 0;
          listElement.style.top = 0;
          listElement.style.transform = 'rotate(0deg)';
          this.$el.appendChild(listElement);
          this.$emit('dragEnd', {
            component: this,
          });
        } else {
          // 没有触发拖拽
          if (e.path.includes(this.$refs.newBoardListName)) {
            this.$refs.newBoardListName.select();
            this.listName = this.$refs.newBoardListName.value;
            // console.log(this.listName);
          }
        }
        this.drag.isDown = this.drag.isDrag = false;
      }
    },
    async editListName() {
      let newListName = this.$refs.newBoardListName.value;
      // console.log(listName);
      if (newListName !== this.listName) {
        await this.$store.dispatch('list/editList', {
          boardId: this.data.boardId,
          id: this.data.id,
          name: newListName,
        });
      }
    },

    // 添加卡片列表
    showListCardAddForm() {
      this.listAdding = true;
      this.$nextTick(() => {
        this.$refs.newCardListName.focus();
      });
    },

    addNewCard() {
      let { value } = this.$refs.newCardListName;
      if (value.trim() !== '') {
        try {
          this.$store.dispatch('card/postCard', {
            boardListId: this.data.id,
            name: value,
          });
          this.$message.success('添加卡片成功');
          this.listAdding = false;
        } catch (error) {}
      } else {
        // 如果为空，继续获得焦点
        this.$refs.newCardListName.focus();
      }
    },

    hideListCardAddForm() {
      this.listAdding = false;
      this.$refs.newCardListName.value = '';
    },
  },
  computed: {
    cards() {
      return this.$store.getters['card/getCards'](this.data.id);
    },
  },
  async created() {
    // 判断所有的 cards 是否存在
    if (!this.cards.length) {
      await this.$store.dispatch('card/getCards', this.data.id);
    }
  },
  mounted() {
    // 获取 list 和 listHeader 元素
    this.$refs.listHeader.addEventListener('mousedown', this.dragDown);
    document.addEventListener('mousemove', this.dragMove);
    document.addEventListener('mouseup', this.dragUp);
  },
};
</script>

<style></style>
