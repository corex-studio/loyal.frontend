<template>
  <div v-if="$menuGroup.items.length">
    <div class="header mt-25">{{ $menu.item?.name || 'Меню' }}</div>
    <div v-if="showCompaniesSelector" class="row full-width mt-10 gap-10">
      <div
        @click="selectCompany(el)"
        v-for="(el, index) in $companyGroup.item?.companies"
        :key="index"
        :class="
          currentCompany?.id === el.id ? 'active-company' : 'inactive-company'
        "
        style="width: 130px"
        class="pa-5 border-radius column items-center gap-5 no-wrap cursor-pointer"
      >
        <q-avatar size="80px">
          <q-img style="height: 100%" :src="el.image?.thumbnail" fit="cover">
            <template v-slot:error>
              <span style="width: 100%; height: 100%">
                <q-img
                  class="user-image"
                  fit="contain"
                  :src="$store.images.empty"
                ></q-img>
              </span> </template
          ></q-img>
        </q-avatar>
        <div class="bold body">
          {{ el.name }}
        </div>
      </div>
    </div>
    <div
      v-for="(el, index) in $menuGroup.items"
      :key="index"
      class="full-width pt-18"
      :id="el.id"
    >
      <div class="header2 mb-10">
        {{ el.name }}
      </div>
      <div v-if="el.items.length" class="row full-width">
        <div v-for="(el2, index2) in el.items" :key="index2" class="col-2">
          <MenuItemCard
            :class="[
              { 'ml-10': !(!index2 || index2 % 6 === 0) },
              { 'mt-10': index2 > 5 },
            ]"
            :item="el2"
          />
        </div>
      </div>
      <div v-else>Пусто</div>
    </div>
    <SelectSalesPointModal
      :company="selectedCompany"
      :model-value="selectSalesPointModal"
      @update:model-value="selectSalesPointModal = false"
      @select="loadBySalesPoint($event)"
    />
  </div>
</template>
<script lang="ts" setup>
import MenuItemCard from 'src/components/cards/MenuItemCard.vue'
import { Company } from 'src/models/company/company'
import { companyGroupRepo } from 'src/models/companyGroup/companyGroupRepo'
import { menuGroupRepo } from 'src/models/menu/menuGroups/menuGroupRepo'
import SelectSalesPointModal from 'src/components/dialogs/SelectSalesPointModal.vue'
import { computed, ref } from 'vue'
import { SalesPoint } from 'src/models/salesPoint/salesPoint'
import { companyRepo } from 'src/models/company/companyRepo'

const selectSalesPointModal = ref(false)

const selectedCompany = ref<Company | null>(null)

const currentCompany = computed(() => {
  return companyGroupRepo.item?.companies.find((v) =>
    v.salesPoints?.some((el) => el.menu.id === currentMenu.value)
  )
})

const currentMenu = computed(() => {
  return menuGroupRepo.items[0].menu
})

const showCompaniesSelector = computed(() => {
  if (!companyGroupRepo.item) return
  return (
    companyGroupRepo.item?.companies.length > 1 ||
    (companyRepo.item && companyRepo.item.salesPoints
      ? companyRepo.item.salesPoints.filter((v) => v.active).length > 1
      : false)
  )
})

const loadBySalesPoint = async (v: SalesPoint) => {
  selectSalesPointModal.value = false

  await menuGroupRepo
    .list({
      menu: v.menu.id,
    })
    .then((res) => {
      menuGroupRepo.items = res.items
    })
}

const selectCompany = async (v: Company) => {
  if (!v.salesPoints) return
  if (v.salesPoints?.length > 1) {
    selectedCompany.value = v
    selectSalesPointModal.value = true
  } else {
    await menuGroupRepo
      .list({
        menu: v.salesPoints[0].menu.id,
      })
      .then((res) => {
        menuGroupRepo.items = res.items
      })
  }
}
</script>

<style lang="scss" scoped>
.inactive-company {
  border: 1px var(--on-background-color) solid;
}

.active-company {
  border: 2px var(--primary) solid;
}
</style>
