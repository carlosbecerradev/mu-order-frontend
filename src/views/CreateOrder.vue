<template>
  <div class="">
    <h1>Agregar pedido</h1>
    <form @submit.prevent="createOrder()" class="">
      <!-- Seleccionar item -->
      <div class="autocomplete-itemname">
        <div>
          <label style="display: block; width: 100%; text-align: left" for=""
            >Selecciona el item</label
          >
          <div class="autocomplete-itemname-input-block">
            <input
              type="text"
              v-model="filterByItem.itemNameParameter"
              autocomplete="off"
              class="autocomplete-itemname-input"
              @input="getItemsByName(filterByItem.itemNameParameter)"
              @focus="filterByItem.flagAutocompleteItemList = true"
              placeholder="Buscar por nombre"
              required
            />
          </div>
        </div>

        <div
          v-if="
            filterByItem.autocompleteItemList &&
            filterByItem.flagAutocompleteItemList
          "
          class="autocomplete-itemname-list"
        >
          <ul>
            <li
              v-for="(item, index) of filterByItem.autocompleteItemList"
              :key="index"
              @click="setItem(item)"
            >
              {{ item.name }}
            </li>
            <div
              class="autocompleteClose"
              @click="filterByItem.flagAutocompleteItemList = false"
            >
              cerrar
            </div>
          </ul>
        </div>
      </div>
      <!-- Item level -->
      <div class="">
        <label for="">Seleccionar level</label>
        <input
          v-model="orderRequest.itemLevel"
          type="number"
          min="0"
          max="13"
        />
      </div>
      <!-- Item Type -->
      <div class="">
        <label for="">Selecciona el tipo</label>
        <select v-model="orderRequest.itemType" name="itemType" id="">
          <option
            v-for="(itemType, index) of itemTypes"
            :key="index"
            :value="itemType.name"
          >
            {{ itemType.name }}
          </option>
        </select>
      </div>
      <!-- Item  Option -->
      <div class="">
        <label for="">Selecciona la opcion</label>
        <select v-model="orderRequest.itemOption" name="itemOption" id="">
          <option
            v-for="(itemOption, index) of itemOptions"
            :key="index"
            :value="itemOption.name"
          >
            {{ itemOption.name }}
          </option>
        </select>
      </div>
      <!-- Observation -->
      <div class="" style="width: 100%">
        <textarea
          v-model="orderRequest.observation"
          style="width: 100%"
          name=""
          id=""
          cols="30"
          rows="4"
        ></textarea>
      </div>
      <button>Confirmar</button>
    </form>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      filterByItem: {
        itemNameParameter: "",
        flagAutocompleteItemList: false,
        autocompleteItemList: [],
      },
      orderRequest: {
        id: null,
        itemOption: null,
        itemType: null,
        itemLevel: 0,
        observation: null,
        itemId: null,
      },
      itemTypes: [],
      itemOptions: [],
    };
  },
  computed: {
    ...mapState(["token", "myOrders"]),
  },
  methods: {
    async getItemsByName(itemNameParameter) {
      if (this.filterByItem.itemNameParameter.trim() !== "") {
        try {
          const response = await fetch(
            `http://localhost:8090/api/item/${itemNameParameter}`,
            {
              method: "GET",
              headers: {
                Authorization: "Bearer " + this.token,
              },
            }
          );
          if (response.status == 200) {
            const responseBody = await response.json();
            this.filterByItem.autocompleteItemList = responseBody;
          }
        } catch (error) {
          console.error(error);
        }
      }
    },
    setItem(item) {
      this.filterByItem.itemNameParameter = item.name;
      this.filterByItem.autocompleteItemList = [];
      this.filterByItem.flagAutocompleteItemList = false;
      this.orderRequest.itemId = item.id;
      this.getItemOptionsAndTypes(item.id);
    },
    async getItemOptionsAndTypes(itemId) {
      try {
        const response = await fetch(
          `http://localhost:8090/api/item/options-and-types/${itemId}`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + this.token,
            },
          }
        );
        if (response.status == 200) {
          const responseBody = await response.json();
          this.itemTypes = responseBody.itemOptions;
          this.itemOptions = responseBody.itemTypes;
        }
      } catch (error) {
        console.error(error);
      }
    },
    async createOrder() {
      try {
        const response = await fetch(`http://localhost:8090/api/order`, {
          method: "POST",
          headers: {
            Authorization: "Bearer " + this.token,
            "content-type": "application/json",
          },
          body: JSON.stringify(this.orderRequest),
        });
        if (response.status == 201) {
          console.log('Order was created.')
          this.$router.push('../my-orders');
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style>
.autocomplete-itemname {
  position: relative;
}
.autocomplete-itemname-list {
  position: absolute;
  top: calc(100% + 2px);
  width: 100%;
  background-color: white;
}
.autocomplete-itemname-list ul {
  width: 100%;
  padding-left: 0;
  margin: 0;
  list-style: none;
  border: 1px solid #42b983;
  text-align: left;
}
.autocomplete-itemname-list li {
  border-bottom: none;
  font-size: 14px;
  padding: 4px 6px;
  cursor: pointer;
}
.autocomplete-itemname-list li:hover {
  background-color: #42b983;
  color: #fff;
}
.autocomplete-itemname-input-block {
  display: flex;
}
.autocomplete-itemname-input {
  width: 100%;
}
.autocompleteClose {
  background-color: #42b983;
  color: #fff;
  cursor: pointer;
  text-align: center;
}
/*  */
label {
  font-size: 14px;
}
</style>
