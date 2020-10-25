import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router/index.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: null,
    orders: [],
  },
  mutations: {
    setToken(state, payload) {
      state.token = payload;
    },
    setOrders(state, orders){
      state.orders = orders;
    }
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
    }
  },
  modules: {
  }
})
