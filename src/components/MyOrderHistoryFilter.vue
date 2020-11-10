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
              v-model="filterByItem.itemNameParameter"
              autocomplete="off"
              class="autocomplete-itemname-input"
              @input="getItemsByName(filterByItem.itemNameParameter)"
              @focus="filterByItem.flagAutocompleteItemList = true"
              placeholder="Nombre"
            />
            <div
              class="autocomplete-itemname-input-search-icon"
              @click="getMyOrderHistoryByItemName(filterByItem.itemNameParameter)"
            >
              send
            </div>
          </div>
        </div>

        <div
          v-if="filterByItem.autocompleteItemList && filterByItem.flagAutocompleteItemList"
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
            <div class="autocompleteClose" @click="filterByItem.flagAutocompleteItemList = false">
              cerrar
            </div>
          </ul>
        </div>
      </div>
      <!-- combobox -->
      <div class="select-itemcategorie">
        <label  style="display: block; width:100%; text-align: left;" for="">Por categoría</label>
        <select
          v-model="filterByItemCategorie.itemCategorieSelected"
          @change="getMyOrderHistoryByItemCategorie()"
          >
          <option
            v-for="(itemCategorie, index) of filterByItemCategorie.itemCategories"
            :key="index"
            :value="itemCategorie.name"
          >
            {{ itemCategorie.name }}
          </option>
        </select>
      </div>
      <div class="clean-filters">
        <div @click="cleanFilters()" class="clean-filters-btn">Limpiar filtros</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";

import useTimeAgo from '../hooks/useTimeAgo'

export default {
  data() {
    return {
      filterByItem: {
        itemNameParameter: "",
        flagAutocompleteItemList: false,
        autocompleteItemList: [],
      },
      filterByItemCategorie: {
        itemCategories: [],
        itemCategorieSelected: '',
      },
    };
  },
  computed: {
    ...mapState(["token", "myOrderHistory"]),
  },
  methods: {
    ...mapMutations(['setMyOrderHistory']),
    ...mapActions(['getMyOrderHistory']),
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
    },
    async getMyOrderHistoryByItemName(itemNameParameter) {
      if (this.filterByItem.itemNameParameter.trim() !== "") {
        try {
          const response = await fetch(
            `http://localhost:8090/api/order-history/by-item/${itemNameParameter}`,
            {
              method: "GET",
              headers: {
                Authorization: "Bearer " + this.token,
              },
            }
          );

          const responseBody = await response.json();
          for(let orderHistory of responseBody){
            orderHistory.createdAt = useTimeAgo(orderHistory.createdAt);
            orderHistory.order.createdAt = useTimeAgo(orderHistory.order.createdAt);
          }
          this.setMyOrderHistory(responseBody)
        } catch (error) {
          console.error(error);
        }
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
        if (response.status == 200) {
          const responseBody = await response.json();
          this.filterByItemCategorie.itemCategories = responseBody;
        }
      } catch (error) {
        console.error(error);
      }
    },
    async getMyOrderHistoryByItemCategorie() {
      try {
        const response = await fetch(
          `http://localhost:8090/api/order-history/by-item-category/${this.filterByItemCategorie.itemCategorieSelected}`,
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
          for(let orderHistory of responseBody){
            orderHistory.createdAt = useTimeAgo(orderHistory.createdAt);
            orderHistory.order.createdAt = useTimeAgo(orderHistory.order.createdAt);
          }
          console.log("responseBody", responseBody);
          this.setMyOrderHistory(responseBody)
        }
      } catch (error) {
        console.error(error);
      }
    },
    cleanFilters() {
      this.filterByItem.itemNameParameter = "";
      this.filterByItemCategorie.itemCategorieSelected = "";
      this.getMyOrderHistory();
    }
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
.autocomplete-itemname-input-search-icon {
  padding: 2px 4px;
    height: 24px;
  background-color: #42b983;
  color: #fff;
  cursor: pointer;
}
.autocompleteClose {
  background-color: #42b983;
  color: #fff;
  cursor: pointer;
  text-align: center;
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
/*  */
.clean-filters {
  margin-left: 1rem;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}
.clean-filters-btn {
 border: 1px solid #42b983;
 color: #42b983;
 font-size: 14px;
 height: 24px;
 padding: 2px 6px;
 cursor: pointer;
}
/*  */
label {
  font-size: 14px;
}
</style>
