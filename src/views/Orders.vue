<template>
  <div class="">
    <h1>Pedidos</h1>
    <OrdersFilter />
    <p style="text-align:left; font-weight: bold">Resultados</p>
    
    <div class="orders">
      <div class="order" v-for="(order, index) of orders" :key="index">
        <div class="order-header">
          <div class="item">
            <div class="item-name">{{order.itemName}}<span class="item-level">+ {{order.itemLevel}}</span></div>
            <div class="item-details">
              <span class="item-type">{{order.itemType}}</span> | 
              <span class="item-option">{{order.itemOption}}</span>
            </div>
          </div>          
        </div>
        <div class="order-body">
          <strong class="">Observación:</strong>
          <div class="observation">{{order.observation}}</div>
        </div>
        <div class="order-footer">
          <div class="user">By {{order.nickname}}</div>
          <div class="timeago">hace 1 h</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import OrdersFilter from '@/components/OrdersFilter.vue'
import { mapState, mapMutations, mapActions } from "vuex";

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
    ...mapActions(['getOrders']),
  },
  components: {
    OrdersFilter
  },
  created() {
    this.getOrders();
  },
};
</script>

<style>
  .orders {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  .order {
    border: 1px solid  #42b983;
    text-align: left;
  }
  .order-header {    
    padding: .5rem 1rem;
    border-bottom: 1px solid  #42b983;
    font-weight: bold;
  }
  .order-body {
    padding: .5rem 1rem;
    display: grid;
    grid-template-columns: max-content auto;
    gap: 1rem;
  }
  .order-footer {
    display: flex;
    justify-content: space-between;
    border-top: 1px solid  #42b983;
    padding: .5rem 1rem;
    font-weight: bold;
  }
</style>