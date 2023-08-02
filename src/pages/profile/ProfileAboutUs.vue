<template>
  <div>
    <q-img
      width="200px"
      :src="authentication.user?.companyGroup.companies[0].image?.image"
    />
    <div style="width: 100%; height: 300px" class="bg-accent">123</div>
    {{ authentication.user?.companyGroup.companies[0].image?.image }}
  </div>
</template>
<script lang="ts" setup>
import { authentication } from 'src/models/authentication/authentication'
</script>
