<template>
  <div>
    <q-skeleton
      width="350px"
      height="49px"
      class="border-radius pl-4 pr-10 py-3 row no-wrap"
    >
      <q-skeleton class="border-radius" width="36px" height="34px" />
      <div class="column col-grow no-wrap pl-5">
        <q-skeleton type="text" width="40%" />
        <q-skeleton type="text" class="full-width" />
      </div>
    </q-skeleton>
  </div>
</template>
<script lang="ts" setup></script>
