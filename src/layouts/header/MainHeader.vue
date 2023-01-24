<template>
  <q-header :style="`background: #${$uiSettings.item?.backgroundColor}`">
    <q-toolbar
      :style="$q.screen.xs ? 'margin-left: -12px' : ''"
      class="pl-sm-10"
    >
      <!-- <q-btn
        v-if="$q.screen.lt.md"
        flat
        dense
        round
        icon="menu"
        aria-label="Menu"
        @click="$store.leftDrawer = !$store.leftDrawer"
      /> -->

      <q-toolbar-title>
        <div
          :style="`color: #${$uiSettings.item?.onBackgroundColor}`"
          class="pl-xs-5 py-5"
        >
          {{ $menu.item?.name }}
        </div></q-toolbar-title
      >
      <!-- <CButton
        @click="
          $router.push({
            name: 'storesPage',
            params: { externalId: 'HooDoo' },
          })
        "
        label="stores"
        text-button
        class="pr-sm-15"
        :text-color="'black'"
        :hover-text-color="'black'"
      ></CButton> -->
      <CButton
        v-if="!$q.screen.xs"
        :to="'/'"
        label="На главную"
        text-button
        class="pr-sm-15"
        :text-color="'black'"
        :hover-text-color="'black'"
      ></CButton>
    </q-toolbar>
    <q-separator
      :style="`background-color: #${$uiSettings.item?.primaryColor}`"
    />
  </q-header>
</template>

<script setup lang="ts">
import CButton from 'src/components/template/buttons/CButton.vue';
</script>

<style scoped lang="scss"></style>
