<template>
  <div class="">
    <h1>Editar pedido</h1>
    {{ order }}
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data(){
    return {
      order: {}
    }
  },
  computed: {
    ...mapState(["token"]),
  },
  methods: {
    async getOrderById(id) {
      try {
        const response = await fetch(`http://localhost:8090/api/order/${id}`, {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + this.token,
          },
        });
        if(response.status == 200){
          const responseBody = await response.json();
          this.order = responseBody;
        }
      } catch (error) {
        console.error(error)
      }
    }
  },
  created(){
    const idParameter = this.$route.params.id;
    this.getOrderById(idParameter)
  }
}
</script>
