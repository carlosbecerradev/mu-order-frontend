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

        const DATE_UNITS = [
          ["day", 86400],
          ["hour", 3600],
          ["minute", 60],
          ["second", 1],
        ];

        const getDateDiffs = (timestamp) => {
          const now = Math.floor(Date.now() / 1000);
          const elapsed = (timestamp - now);

          for(const [unit, secondsInUnit] of DATE_UNITS){
            if(Math.abs(elapsed) > secondsInUnit || unit === "second"){
              const value = Math.round(elapsed / secondsInUnit); 
              return {value, unit};
            }
          }
        };

        const useTimeAgo = (createdAt) => {
          if(createdAt == null){
            return ""
          }         

          const {value, unit} = getDateDiffs(createdAt);
          const rtf = new Intl.RelativeTimeFormat('es', {
            style: "short" });
          return rtf.format(value, unit);
        };

        if(response.status == 200){
          const responseBody = await response.json();
          for(let order of responseBody){            
            order.createdAt = useTimeAgo(order.createdAt); 
          }
          commit('setOrders', responseBody);
        }        
      } catch (error) {
        console.error(error);
      }
    },
  },
  modules: {
  }
})
