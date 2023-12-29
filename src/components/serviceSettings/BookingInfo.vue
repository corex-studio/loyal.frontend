<template>
  <div>
    <q-tab-panels
      style="height: 423px !important"
      animated
      :model-value="currentMode"
      class="bg-background-color full-height"
    >
      <q-tab-panel
        v-if="currentBooking"
        name="bookingInfo"
        class="column full-width justify-between no-wrap pa-0"
      >
        <div class="column gap-10 full-width">
          <div class="row gap-10 no-wrap">
            <CInput
              height="44px"
              placeholder="Время"
              :model-value="time"
              class="col"
            >
              <q-menu><q-time v-model="time" /></q-menu>
            </CInput>
            <CInput
              height="44px"
              placeholder="Дата"
              :model-value="date"
              class="col"
            >
              <q-menu><q-date v-model="date" mask="DD.MM.YYYY" /></q-menu>
            </CInput>
          </div>
          <div class="row full-width gap-10 items-end">
            <CSelect
              external-label="Количество гостей"
              :items="guestsCountVariables"
              height="44px"
              class="col"
              v-model="currentBooking.guestsCount"
            />
            <CButton
              v-if="$section.items.length"
              @click="$emit('changeBookingMode', 'tablePicker')"
              style="width: 48.7%"
              :disabled="!$section.items.length"
              height="44px"
              >{{
                selectedTables.length
                  ? selectedTables.length === 1
                    ? `Стол: ${selectedTables[0].number}`
                    : `Столы: ${selectedTables.map((v) => v.number).join(',')}`
                  : 'Выбрать стол'
              }}
            </CButton>
          </div>
          <CInput
            v-model="currentBooking.comment"
            auto-grow
            height="fit-content"
            placeholder="Оставьте пожелания к бронированию"
          />
        </div>

        <div class="row full-width justify-center gap-6 mt-10">
          <CButton
            @click="$emit('changeBookingMode', 'bookingList')"
            width="280px"
            height="48px"
            color="secondary-button-color"
            text-color="on-secondary-button-color"
            class="subtitle-text"
            label="Изменить адрес"
          ></CButton>
          <CButton
            @click="createBooking()"
            :disabled="!isContinueAvailable"
            width="280px"
            height="48px"
            class="subtitle-text"
            label="Выбрать"
          ></CButton>
        </div>
      </q-tab-panel>
      <q-tab-panel name="tablePicker" class="pa-0 column full-width no-wrap">
        <BookingTableSelector
          :selected-tables="selectedTables"
          @open-table-detail="tableDetailMode($event)"
          @delete-table="deleteTableFromSelected($event)"
        />
      </q-tab-panel>
      <q-tab-panel name="tableDetail" class="pa-0 column no-wrap">
        <TableDetail
          v-if="tableToOpen"
          @confirm-selection="confirmTableSelectionHandler()"
          :table="tableToOpen"
        />
      </q-tab-panel>
      <q-tab-panel name="successBooked" class="pa-0 column no-wrap">
        <SuccessfullyBooked @close="$emit('close')" />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>
<script lang="ts" setup>
import CInput from '../template/inputs/CInput.vue'
import { ref, onMounted, computed } from 'vue'
import CSelect from '../template/inputs/CSelect.vue'
import CButton from '../template/buttons/CButton.vue'
import { sectionRepo } from 'src/models/sections/sectionRepo'
import BookingTableSelector from './BookingTableSelector.vue'
import { Table, TableRaw } from 'src/models/sections/tables/table'
import SuccessfullyBooked from './SuccessfullyBooked.vue'
import {
  BookingRequest,
  BookingStatus,
} from 'src/models/bookingRequest/bookingRequest'
import { bookingRequestRepo } from 'src/models/bookingRequest/bookingRequestRepo'
import TableDetail from './TableDetail.vue'
import { authentication } from 'src/models/authentication/authentication'
import { Notify } from 'quasar'
import { SalesPoint } from 'src/models/salesPoint/salesPoint'

export type BookingModes =
  | 'bookingList'
  | 'bookingInfo'
  | 'tablePicker'
  | 'tableDetail'
  | 'successBooked'

const props = defineProps<{
  salesPoint: SalesPoint | null
  currentMode: BookingModes
}>()

const emit = defineEmits<{
  (evt: 'changeBookingMode', value: BookingModes): void
  (evt: 'close'): void
}>()

const currentBooking = ref<BookingRequest | null>(null)

// const bookingMode = ref<BookingModes>('bookingInfo')

const date = ref<string | null>(null)
const time = ref<string | null>(null)

const tableToOpen = ref<TableRaw | null>(null)

const selectedTables = ref<TableRaw[]>([])

const guestsCountVariables = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10 или больше',
]

const isContinueAvailable = computed(() => {
  return currentBooking.value?.guestsCount?.length && date.value && time.value
})

const tableDetailMode = (v: TableRaw) => {
  if (selectedTables.value.map((v) => v.uuid).includes(v.uuid)) return
  tableToOpen.value = v
  emit('changeBookingMode', 'tableDetail')
}

const deleteTableFromSelected = (index: number) => {
  selectedTables.value.splice(index, 1)
}

const confirmTableSelectionHandler = () => {
  if (!tableToOpen.value) return
  selectedTables.value.push(tableToOpen.value)
  tableToOpen.value = null
  emit('changeBookingMode', 'tablePicker')
}

onMounted(() => {
  currentBooking.value = new BookingRequest({
    active: true,
    status: BookingStatus.CREATED,
    customer: authentication.user?.id || null,
    customer_name: authentication.user?.fullName || null,
    customer_phone: String(authentication.user?.phone) || null,
    sales_point: props.salesPoint?.id || null,
    tables: [],
  })
  void sectionRepo.list({
    sales_point: props.salesPoint?.id,
  })
})

const createBooking = async () => {
  if (!currentBooking.value) return
  try {
    currentBooking.value.tables = selectedTables.value.map((v) => new Table(v))
    currentBooking.value.date = `${date.value} ${time.value}`
    bookingRequestRepo.item = await bookingRequestRepo.create(
      currentBooking.value
    )

    emit('changeBookingMode', 'successBooked')
  } catch {
    Notify.create({
      message: 'Ошибка при создании бронирования',
      color: 'danger',
    })
  }
}
</script>
