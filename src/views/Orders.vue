<template>
  <div class="">
    <OrdersFilter />
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
import OrdersFilter from '@/components/OrdersFilter.vue'
import { mapState, mapMutations } from "vuex";

export default {
  data() {
    return {
    }
  },
  computed: {
    ...mapState(["token", "orders"]),
  },
  methods: {
    ...mapMutations(['setOrders']),
    async getOrders() {
      try {
        const response = await fetch("http://localhost:8090/api/order", {
          method: "GET",
          headers: {
            'Authorization': "Bearer " + this.token,
          },
        });

        const responseBody = await response.json();
        this.setOrders(responseBody)
      } catch (error) {
        console.error(error);
      }
    },
  },
  components: {
    OrdersFilter
  },
  created() {
    this.getOrders();
  },
};
</script>