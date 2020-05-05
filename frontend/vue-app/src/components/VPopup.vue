<template>
  <div class="popup-container">
    <!-- 弹出式菜单出发元素 -->
    <div @click="open">
      <slot></slot>
    </div>
    <!-- 弹出内容 -->
    <div>
      <!--弹窗，可用于对话框、弹出式菜单等-->
      <!--弹出式菜单-->
      <div class="popup" v-show="isShow" ref="popup">
        <div class="popup-header">
          <span class="popup-title">{{ title }}</span>
          <a class="popup-header-close" @click="close" ref="close">
            <i class="icon icon-close"></i>
          </a>
        </div>

        <div class="popup-content">
          <slot name="content"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VPopup',
  props: {
    title: {
      type: String,
      default: '菜单',
    },
  },
  data() {
    return {
      isShow: false,
    };
  },
  methods: {
    open() {
      this.isShow = true;
      // 计算弹出框的位置
      let $popup = this.$refs.popup;
      // 将回调延迟到下次 DOM 更新循环之后执行。
      // 在修改数据之后立即使用回调，然后等待 DOM 更新

      // 在打开弹窗时，添加一个事件，用于在点击页面其他位置时关闭窗口
      window.addEventListener('click', this.close);

      this.$nextTick(() => {
        // 每次打开时，先将弹窗的 left 置零
        $popup.style.left = '0px';
        // 获取元素所在页面位置的值
        let $popupRect = $popup.getBoundingClientRect();
        // console.log($popupRect);
        let left = 0;
        // 超出页面
        if ($popupRect.right > window.innerWidth) {
          left = -$popupRect.width + this.$el.offsetWidth;
        }
        $popup.style.left = left + 'px';
      });
      this.$emit('open');
    },
    close(e) {
      // 事件冒泡的路径
      // 如果事件不存在（直接通过 js 调用）
      // 或路径中包含关闭按钮，
      // 或者不包含元素本身
      // 则关闭窗口
      if (
        !e ||
        e.path.includes(this.$refs.close) ||
        !e.path.includes(this.$el)
      ) {
        this.isShow = false;
        this.$emit('close');
        window.removeEventListener('click', this.close);
      }
    },
  },
};
</script>

<style></style>
