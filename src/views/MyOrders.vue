<template>
  <div class="">
    <h1>Mis Pedidos</h1>
    <div style="margin-bottom: 1rem; text-align: left;">
      <router-link to="/create/order">Nuevo pedido</router-link>
    </div>
    <MyOrdersFilter />
    <p style="text-align:left; font-weight: bold">Resultados</p>

    <div class="orders">
      <div v-if="myOrders.length === 0" style="text-align: left">No hay resultados</div>
      <div v-else class="order" v-for="(order, index) of myOrders" :key="index">
        <div class="order-header">
          <div class="item">
            <div class="item-name">{{order.item.name}}<span class="item-level">+ {{order.itemLevel}}</span></div>
            <div class="item-details">
              <span class="item-type">{{order.itemType}}</span>
              <span v-if="order.itemType != null && order.itemOption != null" style="margin: 0 6px"> | </span>
              <span class="item-option">{{order.itemOption}}</span>
            </div>
          </div>
        </div>
        <div class="order-body">
          <div class="">Observación:</div>
          <div class="observation">{{order.observation}}</div>
        </div>
        <div class="order-footer">
          <div class="user">By {{order.nickname}}</div>
          <div class="timeago">{{order.createdAt}}</div>
        </div>
        <div class="order-actions">
          <router-link :to="{path: `/edit/order/${order.id}`}">editar</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MyOrdersFilter from '@/components/MyOrdersFilter.vue'
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
    }
  },
  computed: {
    ...mapState(["myOrders"]),
  },
  methods: {
    ...mapActions(['getMyOrders']),
  },
  components: {
    MyOrdersFilter
  },
  created() {
    this.getMyOrders();
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
    font-weight: bold;
    font-size: 14px;
  }
  .order-header {
    padding: .5rem 1rem;
    border-bottom: 1px solid  #42b983;
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
  }
  .order-actions {
    border-top: 1px solid  #42b983;
    padding: .5rem 1rem;
  }
</style>
