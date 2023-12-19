<template>
  <div
    class="column no-wrap bg-backing-color border-radius px-7 pb-5 items-center body"
  >
    <q-img
      style="height: 80px; width: 80px"
      :src="modifier.image?.thumbnail || $store.images.empty"
    >
      <template v-slot:error>
        <span>
          <q-img
            class="border-radius"
            style="height: 80px; width: 80px"
            :src="$store.images.empty"
          ></q-img>
        </span>
      </template>
    </q-img>
    <!-- {{ modifier.image?.thumbnail }} -->
    <div class="mt-4" style="text-align: center">
      {{ modifier.name }}
    </div>
    <div style="text-align: center" class="bold">{{ modifier.price }} ₽</div>
  </div>
</template>
<script lang="ts" setup>
import { MenuModifierGroupItem } from 'src/models/menu/menuModifierGroup/menuModifierGroup'

defineProps<{
  modifier: MenuModifierGroupItem
}>()
</script>
