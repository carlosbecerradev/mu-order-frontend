<template>
  <div class="">
    <h1>Pedidos</h1>
    <ul>
      <li v-for="(order, index) of orders" :key="index">
        {{index}} - {{order.id}} - {{order.itemName}} -
        {{order.itemLevel}} - {{order.itemOption}} - {{order.itemType}}
        {{order.nickname}} - {{order.observation}}
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      orders: {},
    }
  },
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
        this.orders = responseBody;
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