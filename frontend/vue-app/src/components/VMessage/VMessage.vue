<template>
  <transition name="message-fade">
    <div
      :class="['message', 'message-' + type, center ? 'is - center' : '']"
      :style="{ top: offset + 'px' }"
      v-if="!isShow"
    >
      <p class="message-content">提示信息：{{ message }}</p>
      <i class="icon icon-close"></i>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'VMessage',
  data() {
    return {
      message: '',
      type: 'info',
      center: true,
      offset: 20,
      isShow: false,
      duration: 3000,
      timer: null,
      // 当一个提示框消失时，调用事件，动态调节后面的提示框偏移量
      onClose: null,
    };
  },
  mounted() {
    this.timer = setTimeout(() => {
      if (!this.isShow) {
        this.close();
      }
    }, this.duration);
  },
  methods: {
    close() {
      this.isShow = true;
      if (typeof this.onClose === 'function') {
        this.onClose();
      }
    },
  },
};
</script>
