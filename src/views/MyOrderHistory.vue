<template>
  <div class="">
    <h1>Historial de Pedidos</h1>
    <p style="text-align:left; font-weight: bold">Resultados</p>

    <div class="orders">
      <div v-if="myOrderHistory.length === 0" style="text-align: left">No hay resultados</div>
      <div v-else class="order" v-for="(orderHistoryItem, index) of myOrderHistory" :key="index">
        <div class="order-header">
          <div class="item">
            <div class="item-name">{{orderHistoryItem.order.item.name}}<span class="item-level"> + {{orderHistoryItem.order.itemLevel}}</span></div>
            <div class="item-details">
              <span class="item-type">{{orderHistoryItem.order.itemType}}</span>
              <span v-if="orderHistoryItem.order.itemType != null && orderHistoryItem.order.itemOption != null" style="margin: 0 6px"> | </span>
              <span class="item-option">{{orderHistoryItem.order.itemOption}}</span>
            </div>
          </div>
        </div>
        <div class="order-history-body">
          <div class="">Negociado con: {{ orderHistoryItem.mate.nickname }}</div>
          <div class="">Precio: {{ orderHistoryItem.price }}</div>
          <div class="">Observación: {{ orderHistoryItem.observation }}</div>
          <div class="">Conseguido {{ orderHistoryItem.createdAt }}</div>
        </div>
        <div class="order-body">
          <div class="">Observación del pedido:</div>
          <div class="observation">{{orderHistoryItem.order.observation}}</div>
        </div>
        <div class="order-footer">
          <div class="user">By {{orderHistoryItem.order.nickname}}</div>
          <div class="timeago">{{orderHistoryItem.order.createdAt}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  computed: {
    ...mapState(["myOrderHistory"]),
  },
  methods: {
    ...mapActions(["getMyOrderHistory"]),
  },
  created() {
    this.getMyOrderHistory();
  }
}
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
  .order-history-body {
    padding: .5rem 1rem;
    border-bottom: 1px solid  #42b983;
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
</style>
