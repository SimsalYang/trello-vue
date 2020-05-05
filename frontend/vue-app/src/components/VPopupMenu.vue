<template>
  <ul class="popup-menu-list">
    <li
      v-for="item of items"
      :key="item.name"
      :class="{ separator: item.separator }"
      @click="command(item.command)"
    >
      <span>{{ item.name }}</span>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'VPopupMenu',
  props: {
    items: {
      type: Array,
      // 这里的 default 的默认值必须是函数
      default() {
        // 返回信息： {name: '', command: 'logout', separator: true}
        // name - 菜单名称，command - 执行的命令，separator - 分割线[可选]
        return [];
      },
    },
  },
  methods: {
    command(command) {
      this.$emit('command', command);
    },
  },
};
</script>

<style></style>
