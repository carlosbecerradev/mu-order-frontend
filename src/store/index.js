import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router/index.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: null,
    orders: [],
    myOrders: [],
    myOrderHistory: [],
    pagination: {
      url: null,
      elementsPerPage: 0,
      currentPage: 0,
      totalPages: 0,
      currentElements: 0,
      totalElements: 0,
      first: false,
      last: false,
      empty: false,
    },
  },
  mutations: {
    setToken(state, payload) {
      state.token = payload;
    },
    setOrders(state, pageableOrders){
      state.orders = pageableOrders.content;
    },
    setMyOrders(state, pageableMyOrders){
      state.myOrders = pageableMyOrders.content;
    },
    setMyOrderHistory(state, pageableMyOrderHistory){
      state.myOrderHistory = pageableMyOrderHistory.content;
    },
    setPagination(state, payload) {
      state.pagination = payload;
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
      const url = 'http://localhost:8090/api/order';
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            'Authorization': "Bearer " + state.token,
          },
        });

        if(response.status == 200){
          const responseBody = await response.json();
          commit('setOrders', responseBody);
          this.dispatch('setPagination', {url, responseBody});
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
        let url = "http://localhost:8090/api/order-history";
        const response = await fetch(url, {
          method: "GET",
          headers: {
            'Authorization': "Bearer " + state.token,
          },
        });

        if(response.status == 200){
          const responseBody = await response.json();
          commit('setMyOrderHistory', responseBody);
          this.dispatch('setPagination', url, responseBody);
        }
      } catch (error) {
        console.error(error);
      }
    },
    setPagination({commit}, {url, responseBody}) {
      let pagination = {
        url: url,
        elementsPerPage: responseBody.size,
        currentPage: responseBody.number,
        totalPages: responseBody.totalPages,
        currentElements: responseBody.numberOfElements,
        totalElements: responseBody.totalElements,
        first: responseBody.first,
        last: responseBody.last,
        empty: responseBody.empty,
      };
      commit('setPagination', pagination);
    },
  },
  modules: {
  }
})
