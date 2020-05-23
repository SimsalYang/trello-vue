<template>
  <div class="pagination">
    <span v-if="firstPage > 1" @click="gotoPage(1)">首页</span>
    <span v-if="page > 1" @click="gotoPage(page - 1)">上一页</span>
    <span
      v-if="page > Math.ceil(showPagesNumber / 2)"
      @click="gotoPage(page - showPagesNumber < 1 ? 1 : page - showPagesNumber)"
      >...</span
    >
    <span
      v-for="(showPage, index) of showPages"
      :class="{ 'current-page': showPage === page }"
      :key="index"
      @click="gotoPage(showPage)"
      >{{ showPage }}</span
    >
    <span
      v-if="page < pages - Math.trunc(showPagesNumber / 2)"
      @click="
        gotoPage(
          page + showPagesNumber > pages ? pages : page + showPagesNumber
        )
      "
      >...</span
    >
    <span v-if="page < lastPage" @click="gotoPage(page + 1)">下一页</span>
    <span v-if="lastPage < pages" @click="gotoPage(lastPage)">尾页</span>
  </div>
</template>

<script>
export default {
  name: 'VPagination',
  props: {
    pages: {
      tepe: Number,
      default: 1,
    },
    page: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      showPagesNumber: 5,
    };
  },
  methods: {
    gotoPage(page) {
      page = Math.max(1, page);
      page = Math.min(this.pages, page);

      if (page !== this.page) {
        this.$emit('changePage', page);
      }
    },
  },
  computed: {
    showPages() {
      let prev = this.page;
      let next = this.page;
      let arr = [this.page];
      let pointer = this.showPagesNumber - 1;

      while (pointer > 0) {
        if (pointer > 0 && prev > 1) {
          arr.unshift(--prev);
          pointer--;
        }
        if (pointer > 0 && next < this.pages) {
          arr.push(++next);
          pointer--;
        }
        if (prev <= 1 && next >= this.pages) {
          break;
        }
      }
      return arr;
    },
    firstPage() {
      return this.showPages[0];
    },
    lastPage() {
      return this.showPages[this.showPages.length - 1];
    },
  },
};
</script>

<style></style>
