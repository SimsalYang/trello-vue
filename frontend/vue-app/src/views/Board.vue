<template>
  <div id="board">
    <!--头部-->
    <VHeader></VHeader>

    <!--正文-->
    <main v-if="board">
      <h2>
        {{ board.name }}
        <span class="btn btn-icon">
          邀请
        </span>
      </h2>

      <!--面板容器-->
      <div class="board">
        <!--面板列表容器-->
        <VList
          v-for="list of lists"
          :key="list.id"
          :data="list"
          @dragStart="dragStart"
          @dragMove="dragMove"
          @dragEnd="dragEnd"
        ></VList>

        <!--无内容列表容器-->
        <div
          class="list-wrap no-content"
          :class="{ 'list-adding': listAdding }"
        >
          <div class="list-add" @click="showListAdding">
            <span class="icon icon-add"></span>
            <span>添加另一个列表</span>
          </div>

          <div class="list">
            <div class="list-cards">
              <div class="list-card-add-form">
                <input
                  class="form-field-input"
                  placeholder="为这张卡片添加标题……"
                  ref="newListName"
                />
              </div>
            </div>

            <div class="list-footer">
              <div class="list-add-confirm">
                <button class="btn btn-success" @click="addNewList">
                  添加列表
                </button>
                <span class="icon icon-close" @click="hideListAdding"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <router-view></router-view>
  </div>
</template>

<script>
import VHeader from '@/components/VHeader';
import VList from '@/components/VList';
export default {
  name: 'Board',
  components: {
    VHeader,
    VList,
  },
  data() {
    return {
      listAdding: false,
    };
  },
  methods: {
    // 显示添加列表结构
    showListAdding() {
      this.listAdding = true;
      this.$nextTick(() => {
        this.$refs.newListName.focus();
      });
    },
    // 隐藏添加列表结构
    hideListAdding() {
      this.listAdding = false;
    },
    // 添加新列表
    addNewList() {
      let name = this.$refs.newListName.value;
      if (name.trim() === '') {
        this.$refs.newListName.focus();
      } else {
        // 提交数据
        try {
          this.$store.dispatch('list/postList', {
            boardId: this.board.id,
            name,
          });
          this.$message.success('添加列表成功');
          this.$refs.newListName.value = '';
          this.listAdding = true;
        } catch (error) {}
      }
    },

    // 拖拽
    dragStart(e) {
      let el = e.component.$el;
      let board = el.parentNode;
      let lists = [...board.querySelectorAll('.list-wrap')];
      el._index = lists.findIndex((list) => list === el);
    },
    dragMove(e) {
      let el = e.component.$el;
      let board = el.parentNode;
      let lists = [...board.querySelectorAll('.list-wrap')];
      let currentIndex = lists.findIndex((list) => list === el);

      lists.forEach((list, index) => {
        if (index !== currentIndex) {
          let clientRect = list.getBoundingClientRect();
          // 判断鼠标是否在元素内部
          if (
            e.x >= clientRect.left &&
            e.x <= clientRect.right &&
            e.y >= clientRect.top &&
            e.y <= clientRect.bottom
          ) {
            // 交换元素
            if (currentIndex < index) {
              board.insertBefore(el, list.nextElementSibling);
            } else {
              board.insertBefore(el, list);
            }
          }
        }
      });
    },
    async dragEnd(e) {
      let el = e.component.$el;
      let board = el.parentNode;
      let lists = [...board.querySelectorAll('.list-wrap-content')];
      let currentIndex = lists.findIndex((list) => list === el);

      //判断当前元素是否移动
      if (el._index !== currentIndex) {
        let newOrder;
        // 获取当前所在位置上一个和下一个列表 order 值
        let prevOrder =
          lists[currentIndex - 1] &&
          parseFloat(lists[currentIndex - 1].dataset.order);
        let nextOrder =
          lists[currentIndex + 1] &&
          parseFloat(lists[currentIndex + 1].dataset.order);
        if (currentIndex === 0) {
          newOrder = nextOrder / 2;
        } else if (currentIndex === lists.length - 1) {
          newOrder = prevOrder + 65535;
        } else {
          newOrder = prevOrder + (nextOrder - prevOrder) / 2;
        }

        await this.$store.dispatch('list/editList', {
          boardId: this.board.id,
          id: e.component.data.id,
          order: newOrder,
        });
      }
    },
  },
  computed: {
    board() {
      // 从 store 中获取 面板信息
      return this.$store.getters['board/getBoard'](this.$route.params.id);
    },
    lists() {
      return this.$store.getters['list/getLists'](this.$route.params.id);
    },
  },
  created() {
    if (this.board === null) {
      // 如果首次进入面板时，没有 面板 数据
      // 则代表需要发送请求，获取面板数据
      this.$store.dispatch('board/getBoard', this.$route.params.id);
    }
    if (!this.lists.length) {
      this.$store.dispatch('list/getLists', this.$route.params.id);
    }
  },
};
</script>

<style></style>
