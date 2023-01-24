import { reactive } from 'vue';
export class Store {
  salesPoint = 'd253cd53-044b-468d-8881-232f43715f5e';
  companyGroup = 'djovanni';

  externalID = 'HooDoo';
  images = {
    empty: 'https://mtraktor.ru/images/no-image.png',
  };
}

export const beautifyNumber = (x: number, toFixed = false) => {
  if (toFixed) x = Number(x.toFixed(2));
  const parts = x.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return parts.join('.');
};

export const store = reactive(new Store());
