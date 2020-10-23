<template>
  <h1>Pedidos</h1>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["token"]),
  },
  methods: {
    async getOrders() {
      try {
        const response = await fetch("http://localhost:8090/api/order", {
          method: "GET",
          headers: {
            'Authorization': "Bearer " + this.token,
          },
        });

        const responseBody = await response.json();
        console.log(responseBody);
      } catch (error) {
        console.error(error);
      }
    },
  },
  created() {
    this.getOrders();
  },
};
</script>