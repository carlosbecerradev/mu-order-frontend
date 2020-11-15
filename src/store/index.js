import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router/index.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: null,
    baseUrl: "http://localhost:8090/api/",
    data: [],
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
    setData(state, payload){
      state.data = payload;
    },
    setOrders(state, payload){
      state.orders = payload;
    },
    setMyOrders(state, payload){
      state.myOrders = payload;
    },
    setMyOrderHistory(state, payload){
      state.myOrderHistory = payload;
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
    async fetchData({commit, state}, resourcePath){
      try {
        const url = `${state.baseUrl}${resourcePath}`;
        console.log(url)
        const response = await fetch(url, {
          method: "GET",
          headers: {
            'Authorization': "Bearer " + state.token,
          },
        });
        console.log(response)

        if(response.status == 200){
          const responseBody = await response.json();
          commit('setData', responseBody);
          console.log(responseBody)
        }
      } catch (error) {
        console.error(error);
      }
    },
    async getOrders({commit, state}) {
      let resourcePath = "order";
      await this.dispatch('fetchData', resourcePath);
      commit('setOrders', state.data.content);
    },
    async getMyOrders({commit, state}) {
      let resourcePath = "my-order";
      await this.dispatch('fetchData', resourcePath);
      commit('setMyOrders', state.data.content);
    },
    async getMyOrderHistory({commit, state}) {
      let resourcePath = "order-history";
      await this.dispatch('fetchData', resourcePath);
      commit('setMyOrderHistory', state.data.content);
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
