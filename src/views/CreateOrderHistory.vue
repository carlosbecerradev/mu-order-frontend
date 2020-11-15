<template>
  <div class="">
    <h1>Create order history</h1>


    <div class="container">
      <span>Pedido</span>
      <div class="">
        <div v-if="order != null" class="order">
        <div class="order-header">
          <div class="item">
            <div class="item-name">
              {{ order.item.name }}<span class="item-level"> +{{ order.itemLevel }}</span>
            </div>
            <div class="item-details">
              <span class="item-type">{{ order.itemType }}</span>
              <span
                v-if="order.itemType != null && order.itemOption != null"
                style="margin: 0 6px"
              >
                |
              </span>
              <span class="item-option">{{ order.itemOption }}</span>
            </div>
          </div>
          </div>
          <div class="order-body">
            <div class="">Observación:</div>
            <div class="observation">{{ order.observation }}</div>
          </div>
          <div class="order-footer">
            <div class="user">By {{ order.nickname }}</div>
            <div class="timeago">{{ useTimeAgo(order.createdAt) }}</div>
          </div>
        </div>
        <div v-else class="">Loading</div>
      </div>
      <!-- Form -->
      <div class="" style="border: 1px solid black; margin: 1rem 0; padding: 1rem">
        <span>Formulario</span>
        <hr>
        <form @submit.prevent="createOrderHistory()">
          <!-- mateId -->
          <div class="">
            <label for="">Negociado con:</label>
            <select v-model="orderHistoryRequest.mateId" required>
              <option v-for="(mate, index) of mates" :key="index" :value="mate.id">{{mate.nickname}}</option>
            </select>
          </div>
          <!-- price -->
          <div class="">
            <label for="">Precio</label>
            <input type="text" v-model="orderHistoryRequest.price">
          </div>
          <!-- observation -->
          <div class="">
            <label for="">Observación</label>
            <textarea
            v-model="orderHistoryRequest.observation"
            style="width: 100%"
            cols="30"
            rows="4"
          ></textarea>
          </div>
          <button>Confirmar</button>
          <router-link to="../../my-orders">Cancelar</router-link>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import useTimeAgo from '../helpers/useTimeAgo';

export default {
  data() {
    return {
      order: null,
      orderHistoryRequest: {
        mateId: null,
        price: null,
	      observation: null,
	      orderId: null,
      },
      mates: null,
    };
  },
  computed: {
    ...mapState(["token"]),
  },
  methods: {
    async getOrder(id) {
      try {
        const response = await fetch(`http://localhost:8090/api/order/${id}`, {
          method: "GET",
          headers: {
            Authorization: "Bearer " + this.token,
          },
        });
        if(response.status == 200){
          const responseBody = await response.json();
          this.order = responseBody;
        }
      } catch (error) {
        console.error(error);
      }
    },
    async getMates() {
      try {
        const response = await fetch("http://localhost:8090/api/user/nicknames", {
          method: 'GET',
          headers: {
            Authorization : "Bearer " + this.token,
          },
        });
        if(response.status == 200){
          const responseBody = await response.json();
          console.log(responseBody);
          this.mates = responseBody;
        }
      } catch (error) {
        console.error(error);
      }
    },
    async createOrderHistory() {
      try {
        const response = await fetch("http://localhost:8090/api/order-history", {
          method: 'POST',
          headers: {
            Authorization: "Bearer " + this.token,
            "content-type": "application/json",
          },
          body: JSON.stringify(this.orderHistoryRequest),
        });
        if(response.status == 201){
          console.log("Order History was created.");
          this.$router.push("../../my-orders");
        }
      } catch (error) {
        console.error(error);
      }
    },
    useTimeAgo,
  },
  created() {
    const idParameter = this.$route.params.id;
    this.orderHistoryRequest.orderId = idParameter;
    this.getOrder(idParameter);
    this.getMates();
  },
};
</script>
