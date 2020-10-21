<template>
    <div class="">
        <h1>Login</h1>
        <form @submit.prevent="login(usuario)" action="">
            <div class="">
                <label for="">Username:</label>
            <input v-model="usuario.username" type="text"> 
            </div>
            <div class="">
                <label for="">Password:</label>
                <input v-model="usuario.password" type="password"> 
            </div>
            <button>Confirmar</button>
        </form>
        <div class="">
          <h5>{{ usuario}}</h5>
        </div>
        <div class="">
            <router-link to="/signup">Sign up</router-link>
        </div>
    </div>
</template>

<script>
export default {
  name: 'Login',
  data(){
    return {
      usuario: {
        username: '',
        password: ''
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>