<template>
  <div class="row">
    <div class="row no-wrap items-center justify-between full-width mb-6">
      <div class="header3 bold col ellipsis-2-lines">{{ group.name }}</div>
      <div
        v-if="
          group.restrictions?.min_quantity &&
          !_.sum(group.items.map((el) => el.quantity))
        "
        class="body px-7 text-danger"
      >
        {{ 'Обязательно' }}
      </div>
    </div>

    <div class="column full-width no-wrap">
      <div
        v-if="group.restrictions && group.restrictions.max_quantity > 1"
        class="row justify-between mb-10"
      >
        <div class="bold">
          Добавлено: {{ _.sum(group.items.map((v) => v.quantity)) }} /{{
            group.restrictions?.max_quantity
          }}
        </div>

        <CIcon
          @click="clearSelection()"
          class="cursor-pointer"
          color="on-background-color"
          hover-color="primary"
          name="fa-light fa-trash"
        />
      </div>
      <div class="column">
        <template
          v-if="group.restrictions && group.restrictions?.max_quantity < 2"
        >
          <template v-for="(el, index) in group.items" :key="index">
            <div
              :class="[
                { 'pt-6': index },
                { 'pb-6': index !== group.items.length - 1 },
              ]"
              @click="selectModifier(el)"
              class="row full-width items-center justify-between cursor-pointer body"
            >
              <div class="row no-wrap items-center gap-3">
                <q-checkbox
                  @click="selectModifier(el)"
                  size="40px"
                  dense
                  :model-value="!!el.quantity"
                />
                <div :class="{ 'text-primary': el.quantity }" class="column">
                  <div
                    :class="{
                      bold:
                        group.restrictions &&
                        group.restrictions?.max_quantity > 1,
                    }"
                  >
                    {{ el.name }}
                  </div>
                </div>
              </div>
              <div>+{{ el.price }} ₽</div>
            </div>
          </template>
        </template>
        <div v-else-if="group.restrictions" class="row full-width">
          <GridContainer
            :items="group.items"
            :lg="3"
            :xl="3"
            :md="3"
            :sm="2"
            :xs="2"
            gap="12px"
          >
            <template v-slot:item="{ item }: { item: MenuModifierGroupItem }">
              <OptionalModifierCard :modifier="item" />
              <!-- <ChangeAmount
                small
                :model-value="item.quantity"
                @update:model-value="item.quantity = $event"
                :disable-adding="
                  _.sum(group.items.map((v) => v.quantity)) >=
                    item.restrictions.max_quantity ||
                  item.quantity >= item.restrictions.max_quantity
                "
              /> -->
              <!-- <MenuItemCard :item="(item as MenuItem)" /> -->
            </template>
          </GridContainer>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import CIcon from 'src/components/template/helpers/CIcon.vue'
import {
  MenuModifierGroup,
  MenuModifierGroupItem,
} from 'src/models/menu/menuModifierGroup//menuModifierGroup'
import _ from 'lodash'
import GridContainer from 'src/components/containers/GridContainer.vue'
import OptionalModifierCard from './OptionalModifierCard.vue'

const props = defineProps<{
  group: MenuModifierGroup
}>()

const selectModifier = (item: MenuModifierGroupItem) => {
  if (props.group.restrictions && props.group.restrictions.max_quantity < 2) {
    props.group.items.forEach((el) => (el.quantity = 0))
    item.quantity = 1
  }
}

const clearSelection = () => {
  props.group.items.forEach((el) => (el.quantity = 0))
}
</script>
