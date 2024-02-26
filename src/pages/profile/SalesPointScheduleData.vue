<template>
  <div class="px-5 pb-7 pt-10 relative-position" style="max-width: 333px">
    <CIconButton
      class="absolute pa-0"
      color="transparent"
      icon="fal fa-times"
      no-padding
      size="20px"
      style="top: 3px; right: 3px"
      @click="$emit('close')"
    />
    <div class="column full-width px-md-5">
      <div class="subtitle-text mb-10">
        {{ salesPointName }}
      </div>
      <div class="row gap-4">
        <CButton
          v-for="item in deliverySchedule.length
            ? deliverySchedule
            : pickupSchedule"
          :key="item.day"
          :color="currentDay?.day === item.day ? 'primary' : 'selector-color'"
          :label="shortDaysNames[item.day]"
          :text-color="
            currentDay?.day === item.day ? 'on-primary' : 'on-selector-color'
          "
          height="35px"
          no-padding
          width="35px"
          @click="selectDay(item.day)"
        />
      </div>
      <div class="body mt-5">
        {{ deliverySchedule.length ? 'График доставки' : 'График работы' }}
      </div>
      <div class="column no-wrap mt-5 overflow-auto" style="max-height: 298px">
        <div v-if="!currentDay?.timesData.length" class="body">
          Не заполнено
        </div>
        <template v-for="(item, index) in currentDay?.timesData" :key="index">
          <q-separator v-if="index" class="my-4" />
          <div class="body">Расписание: {{ item.time }}</div>
          <template v-if="deliverySchedule.length">
            <div class="body">
              Стоимость доставки: {{ item.deliveryPrice }} ₽
            </div>
            <div class="body">
              Время доставки: {{ item.deliveryDuration }} мин
            </div>
            <div class="body">
              Минимальная сумма заказа: {{ item.minimalOrderSum }} ₽
            </div>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { daysNames, shortDaysNames } from 'src/services/daysEnum'
import { computed, ref, watch } from 'vue'
import { DeliveryAreaSettings } from 'src/models/deliveryAreas/deliveryAreaSettings/deliveryAreaSettings'
import moment from 'moment/moment'
import CButton from 'components/template/buttons/CButton.vue'
import CIconButton from 'components/template/buttons/CIconButton.vue'
import {
  SalesPointDeliveryData,
  SalesPointPickupData,
} from 'pages/profile/types/types'

const props = defineProps<{
  deliveryData?: SalesPointDeliveryData
  pickupData?: SalesPointPickupData
}>()

const emit = defineEmits(['recomputePosition', 'close'])

type DefaultScheduleData = {
  day: number
  selected: boolean
}

type DeliveryScheduleData = DefaultScheduleData & {
  timesData: {
    time: string
    deliveryPrice: number
    deliveryDuration: number
    minimalOrderSum: number
  }[]
}

type PickupScheduleData = DefaultScheduleData & {
  timesData: {
    time: string
  }[]
}

const deliverySchedule = ref<DeliveryScheduleData[]>([])
const pickupSchedule = ref<PickupScheduleData[]>([])

const salesPointName = computed(() => {
  const salesPoint =
    props.deliveryData?.salesPoint || props.pickupData?.salesPoint
  return salesPoint?.customAddress || salesPoint?.address
})

watch(
  () => props.deliveryData,
  () => {
    let data: DeliveryScheduleData[] = []
    const settings = props.deliveryData
    if (
      settings?.deliveryAreaSettings.length ||
      settings?.defaultDeliveryAreaSettings.length
    )
      data = processDeliveryAreaSettings(
        settings?.deliveryAreaSettings.length
          ? settings?.deliveryAreaSettings
          : settings?.defaultDeliveryAreaSettings
      )
    deliverySchedule.value = data
  }
)

watch(
  () => props.pickupData,
  () => {
    pickupSchedule.value = processPickupAreaSettings()
  }
)

const currentDay = computed(() => {
  const settings = deliverySchedule.value.length
    ? deliverySchedule.value
    : pickupSchedule.value
  return settings.find((v) => v.selected)
})

const selectDay = (day: number) => {
  const settings = deliverySchedule.value.length
    ? deliverySchedule.value
    : pickupSchedule.value
  settings.forEach((v) => {
    v.selected = v.day === day
  })
  emit('recomputePosition')
}

const getIsDaySelected = (dayNumber: number) => {
  if (currentDay.value?.day === dayNumber) return true
  return moment().isoWeekday() === dayNumber
}

const processDeliveryAreaSettings = (items: DeliveryAreaSettings[]) => {
  const data: DeliveryScheduleData[] = []
  for (const dayNumber of Object.keys(daysNames).map((v) => Number(v))) {
    const currentItems = items.filter((v) =>
      v.weekdays.some((day) => day === dayNumber)
    )
    const scheduleData: DeliveryScheduleData = {
      day: dayNumber,
      selected: getIsDaySelected(dayNumber),
      timesData: [],
    }
    for (const settings of currentItems) {
      const _data = {
        time:
          settings.startTime === settings.endTime
            ? 'Круглосуточно'
            : `${settings.startTime} - ${settings.endTime}`,
        deliveryDuration: settings.deliveryDuration,
        deliveryPrice: settings.deliveryPrice,
        minimalOrderSum: settings.minimalOrderSum,
      }

      if (!scheduleData.timesData.find((v) => v.time === _data.time))
        scheduleData.timesData.push(_data)
    }
    data.push(scheduleData)
  }
  return data
}

const processPickupAreaSettings = () => {
  const data: PickupScheduleData[] = []
  const schedule = props.pickupData?.salesPoint?.schedule
  if (!schedule) return data
  for (const dayNumber of Object.keys(daysNames).map((v) => Number(v))) {
    const currentDay = schedule.days.find((v) => v.day === dayNumber)
    const scheduleData: PickupScheduleData = {
      day: dayNumber,
      selected: getIsDaySelected(dayNumber),
      timesData: [],
    }
    for (const times of currentDay?.times || []) {
      const _data = {
        time:
          times.start === times.end
            ? 'Круглосуточно'
            : `${times.start} - ${times.end}`,
      }

      if (!scheduleData.timesData.find((v) => v.time === _data.time))
        scheduleData.timesData.push(_data)
    }
    data.push(scheduleData)
  }
  return data
}
</script>
