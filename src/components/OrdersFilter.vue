<template>
  <div class="filter">
    <p style="font-weight: bold; margin-top: 0;">Filtrar</p>
    <div class="filter-items">
      <div class="autocomplete-itemname">        
        <div>
          <label  style="display: block; width:100%; text-align: left;" for="">Por item</label>
          <div class="autocomplete-itemname-input-block">
            <input
              type="text"
              v-model="itemNameParam"
              autocomplete="off"
              class="autocomplete-itemname-input"
              @input="getItemsByName(itemNameParam)"
              @focus="autocompleteList = true"
              placeholder="Nombre"
            />
            <div
              class="autocomplete-itemname-input-search-icon"
              @click="getOrdersByItemName(itemNameParam)"
            >
              send
            </div>
          </div>
        </div>

        <div
          v-if="autocompleteItemsName && autocompleteList"
          class="autocomplete-itemname-list"
        >
          <ul>
            <li
              v-for="(item, index) of autocompleteItemsName"
              :key="index"
              @click="setItem(item)"
            >
              {{ index }} - {{ item.item_id }} - {{ item.name }}
            </li>
            <div class="autocompleteClose" @click="autocompleteList = false">
              cerrar
            </div>
          </ul>
        </div>
      </div>
      <!-- combobox -->
      <div class="select-itemcategorie">
        <label  style="display: block; width:100%; text-align: left;" for="">Por categoría</label>
        <select 
          v-model="itemCategorieSelected"
          @change="getOrdersByItemCategorie(itemCategorieSelected)"
          >
          <option @click="getOrders()" value="0">Todas</option>
          <option
            v-for="(itemCategorie, index) of itemCategories"
            :key="index"
            :value="itemCategorie.name"
          >
            {{ itemCategorie.name }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  data() {
    return {
      itemNameParam: "",
      autocompleteList: false,
      autocompleteItemsName: [],
      itemCategories: [],
      itemCategorieSelected: '',
    };
  },
  computed: {
    ...mapState(["token", "orders"]),
  },
  methods: {
    ...mapMutations(['setOrders']),
    async getOrders() {
      try {
        const response = await fetch("http://localhost:8090/api/order", {
          method: "GET",
          headers: {
            Authorization: "Bearer " + this.token,
          },
        });

        const responseBody = await response.json();
        this.setOrders(responseBody)
      } catch (error) {
        console.error(error);
      }
    },
    async getItemsByName(itemNameParam) {
      if (this.itemNameParam.trim() !== "") {
        try {
          const response = await fetch(
            `http://localhost:8090/api/item/${itemNameParam}`,
            {
              method: "GET",
              headers: {
                Authorization: "Bearer " + this.token,
              },
            }
          );
          if (response.status == 200) {
            console.log("response", response);
            const responseBody = await response.json();
            console.log("responseBody", responseBody);
            this.autocompleteItemsName = responseBody;
          }
        } catch (error) {
          console.error(error);
        }
      }
    },
    setItem(item) {
      this.itemNameParam = item.name;
      this.autocompleteItemsName = [];
      this.autocompleteList = false;
    },
    async getOrdersByItemName(itemNameParam) {
      try {
        const response = await fetch(
          `http://localhost:8090/api/order/by-item/${itemNameParam}`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + this.token,
            },
          }
        );

        const responseBody = await response.json();
        this.setOrders(responseBody)
      } catch (error) {
        console.error(error);
      }
    },
    async getItemCategories() {
      try {
        const response = await fetch(
          "http://localhost:8090/api/item-category",
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + this.token,
            },
          }
        );
        console.log("response", response);
        if (response.status == 200) {
          const responseBody = await response.json();
          console.log("responseBody", responseBody);
          this.itemCategories = responseBody;
        }
      } catch (error) {
        console.error(error);
      }
    },
    async getOrdersByItemCategorie(itemCategorieSelected) {
      try {
        const response = await fetch(
          `http://localhost:8090/api/order/by-item-category/${itemCategorieSelected}`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + this.token,
            },
          }
        );
        console.log("response", response);
        if (response.status == 200) {
          const responseBody = await response.json();
          console.log("responseBody", responseBody);
          this.setOrders(responseBody)
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
  created() {
    this.getItemCategories();
  },
};
</script>
<style>
.filter {
  padding: 1.5rem 1rem;
  border: 1px solid #42b983;
}
.filter-items {
    display: flex;
    justify-content: center;
}
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
}
.autocomplete-itemname-list li {
  border: 1px solid red;
  border-bottom: none;
  cursor: pointer;
}
.autocomplete-itemname-input-block {
  display: flex;
}
.autocomplete-itemname-input {
  width: 100%;
}
.autocomplete-itemname-input-search-icon {
  padding: 2px 4px;
    height: 24px;
  background-color: #42b983;
  color: #fff;
  cursor: pointer;
}
.autocompleteClose {
  border: 1px solid #42b983;
  cursor: pointer;
}
/*  */
.select-itemcategorie {
    min-width: 200px;
    margin-left: 1rem;
}
.select-itemcategorie select {
    width: 100%;
    height: 24px;
}
label {
  font-size: 14px;
}
</style>