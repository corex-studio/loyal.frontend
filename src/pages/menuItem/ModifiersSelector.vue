<template>
  <div class="row">
    <div class="row no-wrap justify-between full-width mb-6">
      <div class="header3 bold ellipsis-2-lines">{{ group.name }}</div>
      <q-chip
        v-if="
          group.restrictions?.min_quantity &&
          !_.sum(group.items.map((el) => el.quantity))
        "
        class="text-on-secondary-button-color"
        color="secondary-button-color"
      >
        {{ 'Обязательно' }}
      </q-chip>
    </div>

    <div class="column full-width no-wrap">
      <div
        v-if="group.restrictions && group.restrictions.max_quantity > 1"
        class="row justify-between mb-10 pr-5"
      >
        <div style="opacity: 0.5" class="bold">
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
        <template v-if="modifierViewType === 'radio'">
          <ModifierRadioSelectorRow
            v-for="(el, index) in group.items"
            :key="index"
            @select="radioClickHandler($event)"
            :item="el"
          />
        </template>

        <template v-if="modifierViewType === 'check'">
          <ModifierCheckSelectorRow
            v-for="(el, index) in group.items"
            :key="index"
            @select="checkboxClickHandler($event)"
            :item="el"
          />
        </template>
        <template v-if="modifierViewType === 'row'">
          <ModifierSelectorRow
            v-for="(el, index) in group.items"
            :key="index"
            :item="el"
            :group="group"
          />
        </template>

        <div v-if="modifierViewType === 'card'" class="row full-width">
          <GridContainer
            :items="group.items"
            :lg="3"
            :xl="3"
            :md="3"
            :sm="2"
            :xs="2"
            gap="20px"
          >
            <template v-slot:item="{ item }: { item: MenuModifierGroupItem }">
              <OptionalModifierCard :group="group" :modifier="item" />
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
import { computed } from 'vue'
import ModifierRadioSelectorRow from './ModifierRadioSelectorRow.vue'
import ModifierCheckSelectorRow from './ModifierCheckSelectorRow.vue'
import ModifierSelectorRow from './ModifierSelectorRow.vue'

const props = defineProps<{
  group: MenuModifierGroup
}>()

const modifierViewType = computed(() => {
  if (props.group.restrictions) {
    if (props.group.restrictions?.max_quantity < 2) {
      return 'radio'
    } else {
      if (props.group.items.every((v) => v.restrictions.max_quantity === 1)) {
        return 'check'
      } else {
        if (props.group.items.some((v) => v.image)) return 'card'
        else return 'row'
      }
    }
  } else return undefined
})

const radioClickHandler = (item: MenuModifierGroupItem) => {
  props.group.items.forEach((el) => (el.quantity = 0))
  item.quantity = 1
}

const checkboxClickHandler = (item: MenuModifierGroupItem) => {
  item.quantity = !!item.quantity ? 0 : 1
}

const clearSelection = () => {
  props.group.items.forEach((el) => (el.quantity = 0))
}
</script>
