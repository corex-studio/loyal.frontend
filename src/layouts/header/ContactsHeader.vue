<template>
  <div class="row gap-15">
    <div
      class="row no-wrap"
      v-for="(item, index) in guestContacts"
      :key="index"
    >
      <!--      <q-icon name="far fa-phone" color="primary" class="mr-5" />-->
      <q-img
        v-if="item.image"
        class="mr-5 mt-2"
        width="16px"
        height="16px"
        :src="item.image"
        fit="contain"
      />
      <div class="column">
        <div class="row body items-center">
          <a :href="item.link" class="body bold text-on-background-color">{{
            item.value
          }}</a>
        </div>
        <div class="row helper-text text-on-background-color">
          {{ item.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { companyGroupRepo } from 'src/models/companyGroup/companyGroupRepo'

const guestContacts = computed(() => {
  const company = (companyGroupRepo.item?.companies || [])[0]
  const results: typeof company.guestContacts.emails = []
  if (!company) return results
  for (const [key, values] of Object.entries(company.guestContacts)) {
    if (['socials'].includes(key)) continue
    if (!Array.isArray(values)) continue
    for (const item of values) {
      if (!item.foreground) continue
      else results.push(item)
    }
  }
  return results
})
</script>

<style scoped lang="scss">
a {
  text-decoration: unset;
  color: inherit;
}
</style>
