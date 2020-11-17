<template>
  <div v-if="pagination != null" class="">
    <div class="previous" @click="previous">(prev)</div>

    <div v-if="pagination.totalPages != null" class="pages">
      <div
        v-for="(page, index) of pagination.totalPages"
        :key="index"
        class="page"
        @click="changePage(index)"
      >
        {{ index + 1 }}
      </div>
    </div>

    <div class="next" @click="next">(next)</div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      page: 0,
    };
  },
  props: ["setData"],
  computed: {
    ...mapState(["token", "pagination"]),
  },
  methods: {
    ...mapActions(["createPagination"]),
    async fetchData() {
      try {
        const response = await fetch(
          `${this.pagination.url}?page=${this.page}`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + this.token,
            },
          }
        );

        if (response.status == 200) {
          const responseBody = await response.json();
          this.setData(responseBody.content);
          this.createPagination({
            url: this.pagination.url,
            data: responseBody,
          });
        }
      } catch (error) {
        console.error(error);
      }
    },
    async previous() {
      if (!this.pagination.first) {
        this.page = this.pagination.currentPage - 1;
        this.fetchData();
      }
    },
    async next() {
      if (!this.pagination.last) {
        this.page = this.pagination.currentPage + 1;
        this.fetchData();
      }
    },
    async changePage(index) {
      if (
        this.pagination.currentPage != index &&
        index >= 0 &&
        index < this.pagination.totalPages
      ) {
        this.page = index;
        this.fetchData();
      }
    },
  },
};
</script>
