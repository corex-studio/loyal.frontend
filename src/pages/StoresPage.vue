<template>
  <div class="row pa-0 full-width justify-between">
    <!-- <div class="cursor-pointer header2">
      Current platform is:
      <span style="font-weight: 400">
        {{
          $q.platform.is.mobile
            ? $q.platform.is.android
              ? 'android'
              : $q.platform.is.ios
              ? 'ios'
              : 'other mobile platform'
            : 'desktop'
        }}
      </span>
      <div class="mt-5">
        Link to store:

        <span @click="toLink()" class="text-blue" style="font-weight: 400">
          {{ currentLink }}
        </span>
      </div>
    </div> -->
    <!-- <CButton
      text-button
      height="25px"
      :text-color="'black'"
      :hover-text-color="'accent3'"
      @click="$router.replace({ name: 'home' })"
      >Back to home</CButton
    > -->
    <div style="width: 100vw; height: 100vh; position: relative" class="bcg">
      <div class="col-12 flex justify-center pt-7 mb-45">
        <q-img
          src="../assets/tg_image_1622935803.jpeg"
          style="max-height: 67px; max-width: 178px"
        />
      </div>
      <div class="row" style="max-width: 825px; color: white; margin: 0 auto">
        <div v-if="firstLoading" class="row justify-center col-12 mt-40">
          <q-spinner color="white" size="128px" :thickness="10" />
        </div>
        <template v-if="!firstLoading">
          <template v-if="tab === 'main'">
            <div class="col-12 mb-30">
              <div
                style="
                  font-family: 'Open Sans';
                  font-style: normal;
                  font-weight: 400;
                  font-size: 32.4286px;
                  line-height: 44px;
                  text-align: center;
                "
              >
                Будьте в числе первых! <br />
                Дарим
                <span class="bold" style="color: #ed772f">500</span> бонусов для
                первых
                <span class="bold" style="color: #ed772f">100 человек</span>
              </div>
            </div>
            <div
              class="col-12 pa-40 row mb-30"
              style="
                background-color: rgba(255, 255, 255, 0.1);
                border-radius: 15px;
              "
            >
              <div
                class="col-12 mb-16 text-center"
                style="
                  font-family: 'Open Sans';
                  font-style: normal;
                  font-weight: 600;
                  font-size: 18px;
                  line-height: 25px;
                "
              >
                Зарегистрируйтесь и получите карту лояльности уже сейчас
              </div>
              <div class="col-12 flex justify-center">
                <div
                  @click="toRegiser"
                  style="
                    width: 377px;
                    height: 50px;
                    background: #ed772f;
                    border-radius: 100px;
                  "
                  class="flex justify-center items-center cursor-pointer"
                >
                  Зарегистрироваться
                </div>
              </div>
            </div>
            <div
              class="col-12 text-ceter mb-7"
              style="
                font-family: 'Open Sans';
                font-style: normal;
                font-weight: 400;
                font-size: 32.4286px;
                line-height: 44px;
                text-align: center;
                color: #ffffff;
              "
            >
              Скоро будет доступно приложение!
            </div>
          </template>
          <template v-if="tab === 'register'">
            <div class="column col-12 items-center" style="margin-top: 130px">
              <q-input
                style="max-width: 377px; width: 100%"
                rounded
                outlined
                bg-color="white"
                mask="7 (###) ###-##-##"
                placeholder="7 (123) 456-78-90"
                class="mb-10"
                v-model="regPhone"
                @update:model-value="regError = false"
              />
              <div
                class="row items-center mb-19 cursor-pointer"
                :class="{ processDataAccepted: !processDataAccepted }"
                @click="
                  (processDataAccepted = !processDataAccepted),
                    (regError = false)
                "
              >
                <q-checkbox
                  :model-value="processDataAccepted"
                  @click="
                    (processDataAccepted = !processDataAccepted),
                      (regError = false)
                  "
                />
                <div>
                  Я согласен на обработку моих
                  <router-link
                    style="color: white"
                    :to="{
                      name: 'policyPage',
                      params: { externalId: 'HooDoo' },
                    }"
                    >персональных данных</router-link
                  >
                </div>
              </div>
              <div
                @click="sendRegister"
                style="
                  width: 377px;
                  height: 50px;
                  background: #ed772f;
                  border-radius: 100px;
                "
                class="flex justify-center items-center cursor-pointer"
              >
                Зарегистрироваться
              </div>
              <div class="text-danger body bold mt-10" v-if="regError">
                Вы должны ввести номер телефона и принять правила обработки
                персональных данных
              </div>
            </div>
          </template>
          <template v-if="tab === 'codeInput'">
            <div class="column col-12 items-center" style="margin-top: 130px">
              <div
                style="
                  font-family: 'Open Sans';
                  font-style: normal;
                  font-weight: 400;
                  font-size: 24px;
                  line-height: 33px;
                  text-align: center;
                  color: #ffffff;
                "
                class="mb-20"
              >
                Введите код из смс
              </div>
              <q-input
                style="max-width: 377px; width: 100%"
                rounded
                outlined
                bg-color="white"
                mask="####"
                placeholder="1234"
                v-model="regCodeForLogin"
                @update:model-value="regError = false"
              />

              <div
                class="mt-20"
                style="
                  font-family: 'Open Sans';
                  font-style: normal;
                  font-weight: 400;
                  font-size: 15px;
                  line-height: 20px;
                  text-align: center;
                  color: rgba(255, 255, 255, 0.6);
                "
              ></div>
              <div class="body bold text-danger mt-10" v-if="codeSentFail">
                Вы ввели неверный код
              </div>
            </div></template
          >

          <template v-if="tab === 'registerNewUser'">
            <div class="column col-12 items-center" style="margin-top: 130px">
              <div
                style="
                  font-family: 'Open Sans';
                  font-style: normal;
                  font-weight: 400;
                  font-size: 24px;
                  line-height: 33px;
                  color: #ffffff;
                "
                class="mb-10"
              >
                Заполните поля
              </div>
              <q-input
                style="max-width: 377px; width: 100%"
                rounded
                outlined
                bg-color="white"
                label="Имя"
                v-model="registerData.first_name"
                class="mb-10"
              />
              <q-input
                style="max-width: 377px; width: 100%"
                rounded
                outlined
                bg-color="white"
                label="Дата рождения"
                :model-value="
                  registerData.birthday
                    ? moment(registerData.birthday).format('DD.MM.YYYY')
                    : null
                "
                class="mb-10"
              >
                <q-menu>
                  <q-date v-model="registerData.birthday" mast="DD.MM.YYYY" />
                </q-menu>
              </q-input>
              <q-select
                style="max-width: 377px; width: 100%"
                rounded
                outlined
                bg-color="white"
                label="Пол"
                :options="sexOptions"
                option-label="label"
                option-value="value"
                emit-value
                map-options
                v-model="registerData.sex"
                class="mb-10"
              />
            </div>
            <div class="flex justify-center col-12">
              <div
                @click="register"
                style="
                  width: 377px;
                  height: 50px;
                  background: #ed772f;
                  border-radius: 100px;
                "
                class="flex justify-center items-center cursor-pointer"
              >
                <div v-if="!registerLoading">Получить карту лояльности</div>
                <q-spinner v-else color="primary" size="18px" />
              </div>
            </div>
            <div class="body bold text-danger" v-if="registerError">
              Произошла ошибка, попробуйте еще раз через минуту
            </div>
          </template>
          <template v-if="tab === 'qrBlock'">
            <div
              class="col-12 flex justify-center mb-12"
              style="
                font-family: 'Open Sans';
                font-style: normal;
                font-weight: 400;
                font-size: 32.4286px;
                line-height: 44px;
                text-align: center;
                color: #ed772f;
              "
            >
              <div>
                {{ qrBlockData.balance > -1 ? qrBlockData.balance : 0 }}
              </div>
               бонусов
            </div>
            <div class="col-12 flex justify-center mb-13">
              <div class="pa-5 bg-white" style="border-radius: 10px">
                <qrcode-vue
                  :value="qrBlockData.codeForQr"
                  :size="256"
                  level="H"
                />
              </div>
            </div>
            <div
              class="col-12 row"
              style="
                font-family: 'Open Sans';
                font-style: normal;
                font-weight: 400;
                font-size: 32.4286px;
                line-height: 44px;
                text-align: center;
              "
            >
              <div class="col-12 text-center mb-10">
                {{ qrBlockData.first_name }}
              </div>
              <div class="col-12 text-center">+{{ qrBlockData.phone }}</div>
            </div>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import moment from 'moment';
import { computed, onMounted, ref } from 'vue';
import { api } from 'src/boot/axios';
import { watch } from 'vue';
import { AxiosResponse } from 'axios';
import QrcodeVue from 'qrcode.vue';

// const q = useQuasar();

const sexOptions = ref([
  {
    label: 'Мужчина',
    value: 'male',
  },
  {
    label: 'Женщина',
    value: 'female',
  },
  {
    label: 'Не указано',
    value: 'not_stated',
  },
]);

// const endDate = moment.utc('2023-02-16 09:49:00').local();

const time = new Date();
time.setSeconds(time.getSeconds() + 600); // 10 minutes timer
console.log(time);

const firstLoading = ref(false);

const getMe = async () => {
  const access = localStorage.getItem('access');
  try {
    const res: AxiosResponse<{
      registered_at: string;
      loyalty_cards: { card_number: string; active: boolean }[];
      wallets: { active: boolean; balance: number; type: 'bonus' | string }[];
      first_name: string;
      phone: string;
    }> = await api.get('/users/me/', {
      headers: {
        Authorization: `Bearer ${access}`,
        'Company-Group': 'HooDoo',
      },
    });
    return res;
  } catch (e) {
    console.log(e);
  }
};

onMounted(async () => {
  // window.location.replace(currentLink.value);
  try {
    firstLoading.value = true;
    const res = await getMe();
    firstLoading.value = false;
    if (res) setQrBlock(res?.data);
    else throw Error('');
  } catch {
    tab.value = 'main';
    firstLoading.value = false;
  }
});

const qrBlockData = ref({
  balance: 0,
  codeForQr: '',
  first_name: '',
  phone: '',
});

const setQrBlock = async (data?: {
  registered_at: string;
  loyalty_cards: { card_number: string; active: boolean }[];
  wallets: { active: boolean; balance: number; type: 'bonus' | string }[];
  first_name: string;
  phone: string;
}) => {
  let res: typeof data;
  if (!data) {
    res = await getMe().then((r) => r?.data);
  } else {
    res = data;
  }
  if (res) {
    if (!res.registered_at) {
      tab.value = 'registerNewUser';
      return;
    }
    qrBlockData.value = {
      balance:
        res.wallets.find((el) => el.active && el.type === 'bonus')?.balance ||
        -1,
      codeForQr: res.loyalty_cards.find((el) => el.active)?.card_number || '',
      first_name: res.first_name,
      phone: res.phone,
    };
  }
  if (qrBlockData.value.codeForQr) {
    tab.value = 'qrBlock';
  }
};

const tab = ref('main');

const regCodeForLogin = ref<number | null>(null);

const processDataAccepted = ref(false);

const toRegiser = () => {
  tab.value = 'register';
};

const regError = ref(false);

const lastAuthTryTime = ref<number | null>(null);

const getPhone = (v: string) => {
  const data = [];
  for (const el of v) {
    if (!Number.isNaN(Number(el)) && el !== ' ') data.push(el);
  }
  return data.join('');
};

const sendRegister = async () => {
  if (regValidated.value) {
    try {
      await api.post(
        '/users/request_auth/',
        { phone: getPhone(regPhone.value) },
        {
          headers: {
            'Company-Group': 'HooDoo',
          },
        }
      );
      lastAuthTryTime.value = moment.now();
      tab.value = 'codeInput';
    } catch (e) {
      console.log(e);
    }
  } else {
    regError.value = true;
  }
};

const regPhone = ref('');

const regValidated = computed(() => {
  return regPhone.value && processDataAccepted.value;
});

const codeSent = ref(false);
const codeSentFail = ref(false);

watch(regCodeForLogin, async (val) => {
  if (val !== null && String(val).length === 4) {
    try {
      codeSent.value = true;
      const res: AxiosResponse<{ access: string }> = await api.post(
        '/users/auth/',
        {
          phone: getPhone(regPhone.value),
          code: String(val),
        },
        {
          headers: {
            'Company-Group': 'HooDoo',
          },
        }
      );
      codeSentFail.value = false;
      localStorage.setItem('access', res.data.access);
      const me = await getMe();
      if (!me?.data.registered_at) {
        tab.value = 'registerNewUser';
      } else {
        setQrBlock();
      }
    } catch (e) {
      console.log(e);
      codeSent.value = false;
      codeSentFail.value = true;
    }
  }
});

const registerData = ref({
  first_name: '',
  birthday: '',
  sex: '',
});

const registerLoading = ref(false);
const registerError = ref(false);

const register = async () => {
  const access = localStorage.getItem('access');
  try {
    registerError.value = false;
    registerLoading.value = true;
    await api.post(
      '/users/register/',
      {
        ...registerData.value,
        birthday: moment(registerData.value.birthday).format('YYYY-MM-DD'),
      },
      {
        headers: {
          'Company-Group': 'HooDoo',
          Authorization: `Bearer ${access}`,
        },
      }
    );
    setQrBlock();
    registerLoading.value = false;
  } catch (e) {
    registerError.value = true;
    registerLoading.value = false;
  }
};

// const currentLink = computed(() => {
//   return q.platform.is.android
//     ? 'https://play.google.com/store/apps/details?id=studio.corex.hoodoo'
//     : q.platform.is.ios || q.platform.is.iphone || q.platform.is.ipad
//     ? 'https://apps.apple.com/us/app/hoodoo/id1667328735'
//     : 'https://apps.apple.com/us/app/hoodoo/id1667328735';
// });

// const toLink = () => {
//   window.open(currentLink.value, '_blank');
// };
</script>

<style scoped lang="scss">
.bcg {
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url('src/assets/top-view-delicious-kebab-with-french-fries-ketchup.jpeg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
}
.processDataAccepted :deep(.q-checkbox__bg) {
  background-color: white;
}
</style>
