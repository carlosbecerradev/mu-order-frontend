<template>
  <div class="">
    <h1>Order History</h1>
    {{ myOrderHistory }}
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
