<template>
  <div>
    <q-tab-panels
      style="height: 505px !important"
      animated
      :model-value="bookingMode"
      @update:model-value="$emit('changeBookingMode', $event)"
      class="bg-backgroud-color full-height"
    >
      <q-tab-panel
        v-if="currentBooking"
        name="bookingInfo"
        class="pa-10 column no-wrap"
      >
        <div class="body text-on-background-color">
          После оформления заявки, с вами свяжется администратор для
          подтверждения брони.
        </div>
        <div
          class="mt-10 bg-backing-color border-radius row no-wrap gap-5 py-8 px-5"
        >
          <CIcon size="20px" name="fa-light fa-info-circle" color="primary" />
          <div class="body text-on-backing-color">
            Данная заявка, до подтверждения сотрудником, не является гарантией
            брони
          </div>
        </div>
        <div class="column gap-10 full-width mt-15">
          <div class="header3 text-on-background-color">
            Укажите время бронирования
          </div>
          <div class="row gap-5 no-wrap">
            <CInput :model-value="date" class="col" external-label="Дата">
              <q-menu><q-date v-model="date" mask="DD.MM.YYYY" /></q-menu>
            </CInput>
            <CInput :model-value="time" class="col" external-label="Время">
              <q-menu><q-time v-model="time" /></q-menu>
            </CInput>
          </div>
        </div>
        <div class="column full-width gap-10 mt-15">
          <div class="header3 text-on-background-color">Дополнительно</div>
          <div class="row items-end full-width gap-5 no-wrap">
            <CSelect
              external-label="Количество гостей"
              :items="guestsCountVariables"
              height="35px"
              v-model="currentBooking.guestsCount"
              style="width: 48.7%"
            />
            <CButton
              @click="changeBookingMode('tablePicker')"
              style="width: 48.7%"
              height="40px"
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
            text-area
            placeholder="Комментарий"
          />
        </div>
        <div class="row full-width justify-center mt-15 pb-10">
          <CButton
            @click="createBooking()"
            :disabled="!isContinueAvailable"
            width="280px"
            >Далее</CButton
          >
        </div>
      </q-tab-panel>
      <q-tab-panel name="tablePicker" class="pa-0 column no-wrap">
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
        <SuccessfullyBooked />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>
<script lang="ts" setup>
import CIcon from '../template/helpers/CIcon.vue';
import CInput from '../template/inputs/CInput.vue';
import { ref, onMounted, computed } from 'vue';
import CSelect from '../template/inputs/CSelect.vue';
import CButton from '../template/buttons/CButton.vue';
import { sectionRepo } from 'src/models/sections/sectionRepo';
import BookingTableSelector from './BookingTableSelector.vue';
import { Table, TableRaw } from 'src/models/sections/tables/table';
import SuccessfullyBooked from './SuccessfullyBooked.vue';
import {
  BookingRequest,
  BookingStatus,
} from 'src/models/bookingRequest/bookingRequest';
import { bookingRequestRepo } from 'src/models/bookingRequest/bookingRequestRepo';

import TableDetail from './TableDetail.vue';
import { authentication } from 'src/models/authentication/authentication';
import { Notify } from 'quasar';
import { cartRepo } from 'src/models/carts/cartRepo';

export type BookingModes =
  | 'bookingInfo'
  | 'tablePicker'
  | 'tableDetail'
  | 'successBooked';

const props = defineProps<{
  bookingMode: BookingModes;
  salesPoint: string;
}>();

const emit = defineEmits<{
  (evt: 'changeBookingMode', value: BookingModes): void;
}>();

const currentBooking = ref<BookingRequest | null>(null);

const date = ref<string | null>(null);
const time = ref<string | null>(null);

const tableToOpen = ref<TableRaw | null>(null);

const selectedTables = ref<TableRaw[]>([]);

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
];

const isContinueAvailable = computed(() => {
  return currentBooking.value?.guestsCount?.length && date.value && time.value;
});

const tableDetailMode = (v: TableRaw) => {
  if (selectedTables.value.map((v) => v.uuid).includes(v.uuid)) return;
  tableToOpen.value = v;
  emit('changeBookingMode', 'tableDetail');
};

const deleteTableFromSelected = (index: number) => {
  selectedTables.value.splice(index, 1);
};

const confirmTableSelectionHandler = () => {
  if (!tableToOpen.value) return;
  selectedTables.value.push(tableToOpen.value);
  tableToOpen.value = null;
  emit('changeBookingMode', 'tablePicker');
};

onMounted(() => {
  currentBooking.value = new BookingRequest({
    active: true,
    status: BookingStatus.CREATED,
    customer: authentication.user?.id || null,
    customer_name: authentication.user?.fullName || null,
    customer_phone: String(authentication.user?.phone) || null,
    sales_point: props.salesPoint,
    tables: [],
  });
  void sectionRepo.list({
    sales_point: props.salesPoint,
  });
});

const changeBookingMode = (mode: BookingModes) => {
  emit('changeBookingMode', mode);
};

const createBooking = async () => {
  if (!currentBooking.value) return;
  try {
    currentBooking.value.tables = selectedTables.value.map((v) => new Table(v));
    currentBooking.value.date = `${date.value} ${time.value}`;
    bookingRequestRepo.item = await bookingRequestRepo.create(
      currentBooking.value
    );
    await cartRepo.setParams({
      sales_point: props.salesPoint,
      type: 'booking',
    });
    emit('changeBookingMode', 'successBooked');
  } catch {
    Notify.create({
      message: 'Ошибка при создании бронирования',
      color: 'danger',
    });
  }
};
</script>
