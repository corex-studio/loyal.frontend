<template>
  <div
    :class="{ 'box-shadow': modifiersMenu }"
    class="row bg-selector-color border-radius text-on-selector-color cursor-pointer py-6"
  >
    <div class="row no-wrap items-center justify-between full-width px-7">
      <div class="body">{{ item.name }}</div>
      <CIcon
        name="fa-light fa-angle-down"
        color="on-selector-color"
        size="24px"
        :style="`${modifiersMenu ? 'transform: rotateZ(180deg);' : ''}`"
        style="transition: 0.2s"
      />
    </div>
    <div
      v-if="item.restrictions?.min_quantity"
      class="secondary-text px-7"
      :class="
        _.sum(item.items.map((el) => el.quantity))
          ? 'text-primary'
          : 'text-danger'
      "
    >
      {{
        _.sum(item.items.map((el) => el.quantity))
          ? item.items.find((v) => v.quantity)?.name
          : 'Обязательно к выбору'
      }}
    </div>
    <div
      v-else-if="item.items.some((v) => v.quantity)"
      class="px-7 text-primary"
    >
      {{
        item.items
          .filter((v) => v.quantity)
          .map((el) => el.name)
          .join(', ')
      }}
    </div>
    <q-menu
      style="width: 456px"
      v-model="modifiersMenu"
      class="column no-wrap bg-background-color pa-10 border-radius box-shadow text-on-background-color"
    >
      <div class="row justify-between mb-10">
        <div class="bold">
          Добавлено: {{ _.sum(item.items.map((v) => v.quantity)) }} /{{
            item.restrictions?.max_quantity
          }}
        </div>

        <CIcon
          v-if="item.restrictions && item.restrictions.max_quantity > 1"
          @click="clearSelection()"
          class="cursor-pointer"
          color="on-background-color"
          hover-color="primary"
          name="fa-light fa-trash"
        />
      </div>
      <div class="column">
        <template v-for="(el, index) in item.items" :key="index">
          <q-separator v-if="index" color="divider-color" />
          <div
            :class="[
              { 'pt-6': index },
              { 'pb-6': index !== item.items.length - 1 },
              {
                'cursor-pointer':
                  item.restrictions && item.restrictions.max_quantity < 2,
              },
            ]"
            @click="selectModifier(el)"
            class="row full-width items-center justify-between"
          >
            <div :class="{ 'text-primary': el.quantity }" class="column">
              <div
                :class="{
                  bold:
                    item.restrictions && item.restrictions?.max_quantity > 1,
                }"
              >
                {{ el.name }}
              </div>
              <div
                v-if="item.restrictions && item.restrictions?.max_quantity > 1"
                class="bold"
              >
                {{ el.price ? el.price + ' ₽' : '-' }}
              </div>
            </div>
            <template
              v-if="item.restrictions && item.restrictions.max_quantity < 2"
            >
              <div
                v-if="el.quantity"
                class="bg-primary row justify-center items-center"
                style="border-radius: 50%; width: 25px; height: 25px"
              >
                <CIcon
                  name="fa-solid fa-check"
                  size="15px"
                  color="on-primary"
                />
              </div>
              <div
                v-else
                style="
                  border-radius: 50%;
                  width: 25px;
                  height: 25px;
                  border: 1px black solid;
                "
              ></div>
            </template>

            <ChangeAmount
              v-else-if="item.restrictions"
              small
              :model-value="el.quantity"
              @update:model-value="el.quantity = $event"
              :disable-adding="
                _.sum(item.items.map((v) => v.quantity)) >=
                  item.restrictions.max_quantity ||
                el.quantity >= el.restrictions.max_quantity
              "
            />
          </div>
        </template>
      </div>
    </q-menu>
  </div>
</template>
<script lang="ts" setup>
import CIcon from 'src/components/template/helpers/CIcon.vue'
import { MenuModifierGroup } from 'src/models/menu/menuModifierGroup//menuModifierGroup'
import { ref } from 'vue'
import _ from 'lodash'
import { MenuModifierGroupItem } from 'src/models/menu/menuModifierGroup//menuModifierGroup'
import ChangeAmount from 'src/components/inputs/ChangeAmount.vue'

const modifiersMenu = ref(false)
const props = defineProps<{
  item: MenuModifierGroup
}>()

const selectModifier = (item: MenuModifierGroupItem) => {
  if (props.item.restrictions && props.item.restrictions.max_quantity < 2) {
    props.item.items.forEach((el) => (el.quantity = 0))
    item.quantity = 1
  }
}

const clearSelection = () => {
  props.item.items.forEach((el) => (el.quantity = 0))
}
</script>
