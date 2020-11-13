<template>
  <div class="">
    <div class="previous" @click="previous">(prev)</div>

    <div v-if="pagination.totalPages != null" class="pages">
      <div v-for="(page, index) of pagination.totalPages" :key="index" class="page"
        @click="toPage(index)">
        {{index + 1}}
        </div>
    </div>

    <div class="mext" @click="next">(next)</div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
export default {
  computed: {
    ...mapState(["pagination", "token"]),
  },
  methods: {
    ...mapMutations(['setOrders']),
    ...mapActions(['setPagination']),
    async previous(){
      const currentPage = this.pagination.currentPage;
      if(!this.pagination.first){
        try {
          const url = this.pagination.url;
          const response = await fetch(`${url}?page=${currentPage-1}`, {
            method: 'GET',
            headers: {
              Authorization: "Bearer " + this.token,
            },
          });

          if(response.status == 200){
            const responseBody = await response.json();
            this.setOrders(responseBody);
            this.setPagination({url, responseBody});
          }
        } catch (error) {
          console.error(error);
        }
      }
    },
    async next() {
      const currentPage = this.pagination.currentPage;
      if(!this.pagination.last){
        try {
          const url = this.pagination.url;
          const response = await fetch(`${url}?page=${currentPage+1}`, {
            method: 'GET',
            headers: {
              Authorization: "Bearer " + this.token,
            },
          });

          if(response.status == 200){
            const responseBody = await response.json();
            this.setOrders(responseBody);
            this.setPagination({url, responseBody});
          }
        } catch (error) {
          console.error(error);
        }
      }
    },
    async toPage(index) {
      const currentPage = this.pagination.currentPage;
      if(currentPage != index && index >= 0){
        try {
          const url = this.pagination.url;
          const response = await fetch(`${url}?page=${index}`, {
              method: 'GET',
              headers: {
                Authorization: "Bearer " + this.token,
              },
            });

            if(response.status == 200){
              const responseBody = await response.json();
              this.setOrders(responseBody);
              this.setPagination({url, responseBody});
            }
        } catch (error) {
            console.error(error);
        }
      }
    },
  },
}
</script>
