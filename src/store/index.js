import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: null
  },
  mutations: {
    setToken(state, payload) {
      state.token = payload;
    }
  },
  actions: {
    async login({commit}, usuario){
      console.log(usuario);
      try {
        const request = await fetch('http://localhost:8090/api/auth/login', {
          method: 'POST',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify(usuario)
        });

        const response = await request.json()
        console.log(response.authenticationToken)

        commit('setToken', response.authenticationToken)

        localStorage.setItem('authenticationToken', response.authenticationToken)

      } catch (error) {
        
      }
    },
    readToken({commit}) {
      if(localStorage.getItem('authenticationToken')){
        commit('setToken', localStorage.getItem('authenticationToken'))
      } 
    }
  },
  modules: {
  }
})
