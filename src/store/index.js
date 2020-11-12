import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router/index.js'

import useTimeAgo from '../hooks/useTimeAgo'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: null,
    orders: [],
    myOrders: [],
    myOrderHistory: [],
  },
  mutations: {
    setToken(state, payload) {
      state.token = payload;
    },
    setOrders(state, pageableOrders){
      for(let order of pageableOrders.content){
        order.createdAt = useTimeAgo(order.createdAt);
      }
      state.orders = pageableOrders.content;
    },
    setMyOrders(state, pageableMyOrders){
      for(let order of pageableMyOrders.content){
        order.createdAt = useTimeAgo(order.createdAt);
      }
      state.myOrders = pageableMyOrders.content;
    },
    setMyOrderHistory(state, pageableMyOrderHistory){
      for(let orderHistory of pageableMyOrderHistory.content){
        orderHistory.createdAt = useTimeAgo(orderHistory.createdAt);
        orderHistory.order.createdAt = useTimeAgo(orderHistory.order.createdAt);
      }
      state.myOrderHistory = pageableMyOrderHistory.content;
    },
  },
  actions: {
    async login({commit}, usuario){
      try {
        const response = await fetch('http://localhost:8090/api/auth/login', {
          method: 'POST',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify(usuario)
        });

        const responseBody = await response.json();

        commit('setToken', responseBody.authenticationToken);
        localStorage.setItem('authenticationToken', responseBody.authenticationToken);

        if(response.status == 200){
          router.push('orders')
        }
      } catch (error) {
        console.error(error);
      }
    },
    readToken({commit}) {
      if(localStorage.getItem('authenticationToken')){
        commit('setToken', localStorage.getItem('authenticationToken'))
      }
    },
    logout({commit}){
      localStorage.removeItem('authenticationToken');
      commit('setToken', null)
      router.push('/')
    },
    async getOrders({commit, state}) {
      try {
        const response = await fetch("http://localhost:8090/api/order", {
          method: "GET",
          headers: {
            'Authorization': "Bearer " + state.token,
          },
        });

        if(response.status == 200){
          const responseBody = await response.json();
          commit('setOrders', responseBody);
        }
      } catch (error) {
        console.error(error);
      }
    },
    async getMyOrders({commit, state}) {
      try {
        const response = await fetch("http://localhost:8090/api/my-order", {
          method: "GET",
          headers: {
            'Authorization': "Bearer " + state.token,
          },
        });

        if(response.status == 200){
          const responseBody = await response.json();
          commit('setMyOrders', responseBody);
        }
      } catch (error) {
        console.error(error);
      }
    },
    async getMyOrderHistory({commit, state}) {
      try {
        const response = await fetch("http://localhost:8090/api/order-history", {
          method: "GET",
          headers: {
            'Authorization': "Bearer " + state.token,
          },
        });

        if(response.status == 200){
          const responseBody = await response.json();
          commit('setMyOrderHistory', responseBody);
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
  modules: {
  }
})
