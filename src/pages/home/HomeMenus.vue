<template>
  <div>
    <!-- <div
      v-if="
        $companyGroup.item &&
        $companyGroup.item.companies.length > 1 &&
        !$store.tableMode
      "
      class="row border-radius gap-md-20 gap-sm-10 gap-xs-5 items-center mt-sm-20 mt-md-25 mt-xs-15"
    >
      <div class="row no-wrap items-center gap-8 pr-10">
        <q-img
          class="border-radius"
          fit="contain"
          style="width: 75px; height: 75px"
          :src="
            typeof $salesPoint.item?.company === 'string'
              ? $menu.item?.company.image?.thumbnail || $store.images.empty
              : $salesPoint.item?.company?.image?.thumbnail ||
                $store.images.empty
          "
        >
          <template v-slot:error>
            <span>
              <q-img
                class="user-image"
                fit="contain"
                :src="$store.images.empty"
              ></q-img>
            </span> </template
        ></q-img>
        <div class="header">
          <template v-if="!$salesPoint.menuLoading">
            {{
              typeof $salesPoint.item?.company === 'string'
                ? $menu.item?.company.name
                : $salesPoint.item?.company?.name
            }}
          </template>
          <q-skeleton v-else width="150px" height="30px" />
        </div>
      </div>

      <CButton @click="changeCompany()" label="Выбрать другое заведение" />
    </div> -->
    <!-- <div v-else class="header" :class="$store.tableMode ? 'mt-5' : 'mt-18'">
      {{ $menu.item?.name }}
    </div> -->
    <!-- <div class="row full-width mt-10 gap-10">
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
    </div> -->
    <template v-if="!$salesPoint.menuLoading && $menu.item?.groups">
      <div
        v-for="(el, index) in $menu.item.groups.filter((v) => v.items.length)"
        :key="index"
        class="full-width pt-sm-20 pt-xs-12"
        :id="el.id"
      >
        <div class="huge2 bold mb-12">
          {{ el.name }}
        </div>
        <div v-if="el.items.length" class="row full-width">
          <GridContainer
            :items="el.items"
            :lg="4"
            :xl="4"
            :md="3"
            :sm="3"
            :xs="2"
            :gap="$q.screen.gt.md ? '30px' : '16px'"
          >
            <template v-slot:item="{ item }">
              <MenuItemCard :item="(item as MenuItem)" />
            </template>
          </GridContainer>
        </div>
        <div v-else>Пусто</div>
      </div>
    </template>
    <div v-else class="full-width">
      <q-skeleton type="text" width="210px" height="45px" class="mb-10 mt-18" />
      <GridContainer
        :items="[1, 2, 3, 4, 5, 6, 7, 8]"
        :lg="6"
        :xl="6"
        :md="5"
        :sm="4"
      >
        <template v-slot:item="{ item }">
          <MenuItemSkeleton :id="item" />
        </template>
      </GridContainer>
    </div>
  </div>
</template>
<script lang="ts" setup>
import MenuItemCard from 'src/components/cards/MenuItemCard.vue'
import MenuItemSkeleton from 'src/components/cards/MenuItemSkeleton.vue'
import GridContainer from 'src/components/containers/GridContainer.vue'
import { MenuItem } from 'src/models/menu/menuItem/menuItem'
</script>

<style lang="scss" scoped>
.inactive-company {
  border: 1px var(--on-background-color) solid;
}

.active-company {
  width: fit-content;
  border: 2px var(--primary) solid;
}
</style>
