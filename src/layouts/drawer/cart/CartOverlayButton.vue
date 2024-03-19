<template>
  <div
    v-if="
      $cart.item &&
      $cart.item.cartItems.length &&
      $q.screen.lt.lg &&
      !$store.tableMode
    "
    class="parent-block"
  >
    <div
      @click="$store.cartDrawer = !$store.cartDrawer"
      class="cart-button row justify-center items-center cursor-pointer"
    >
      <CIcon
        v-if="!$cart.loading"
        name="fa-regular fa-basket-shopping"
        color="on-primary"
        size="20px"
      />
      <q-spinner v-else color="on-primary" size="25px" />
      <q-chip
        v-if="$cart.item?.cartItemsQuantitySum"
        class="amount-chip text-primary"
      >
        <div class="body bold">
          {{ $cart.item?.cartItemsQuantitySum }}
        </div>
      </q-chip>
    </div>
  </div>
</template>
<script lang="ts" setup>
import CIcon from 'src/components/template/helpers/CIcon.vue'
</script>

<style lang="scss" scoped>
.cart-button {
  width: 56px;
  height: 56px;
  background-color: var(--primary);
  border-radius: 50%;
  position: relative;
}

.parent-block {
  position: fixed;
  right: 16px;
  z-index: 51;
  bottom: 30px;
}

.amount-chip {
  position: absolute;
  background-color: var(--on-primary);
  //   border-radius: 50%;
  top: -4px;
  right: -6px;
  width: fit-content;
  padding: 0 7px;
  height: 20px;
}
</style>
