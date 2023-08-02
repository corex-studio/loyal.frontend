import { NutritionType } from './../menu/menu';
import { Customer, CustomerRaw } from './../customer/customer';
import { SalesPoint, SalesPointRaw } from './../salesPoint/salesPoint';
import { BaseModel } from 'src/corexModels/apiModels/baseModel';
import moment from 'moment';
import { ImageRaw } from '../image/image';
import { MenuModifierGroupRaw } from '../menu/menuModifierGroup/menuModifierGroup';

export type ModifierRaw = {
  uuid: string;
  name: string;
  external_id: string;
  sku: string;
  prices: PriceRaw[];
  modifier_group: string;
  min_quantity: number;
  image: string | null;
  max_quantity: number;
  free_quantity: number;
  default_amount: number;
};

export class OrdersFilter {
  search?: string;
  created_from?: string;
  created_to?: string;
  delivery_time_from?: string;
  delivery_time_to?: string;
  sales_point?: SalesPoint;
  delivery_type?: { id: string; label: string };
  order_status?: { id: string; label: string };

  toJson() {
    return {
      search: this.search,
      created_from: this.created_from
        ? moment.utc(this.created_from).format('YYYY-MM-DD HH:mm:ss')
        : undefined,
      created_to: this.created_to
        ? moment.utc(this.created_to).format('YYYY-MM-DD HH:mm:ss')
        : undefined,
      delivery_time_from: this.delivery_time_from
        ? moment.utc(this.delivery_time_from).format('YYYY-MM-DD HH:mm:ss')
        : undefined,
      delivery_time_to: this.delivery_time_to
        ? moment.utc(this.delivery_time_to).format('YYYY-MM-DD HH:mm:ss')
        : undefined,
      sales_point: this.sales_point?.id,
      type: this.delivery_type?.id,
      status: this.order_status?.id,
    };
  }
}

export type ModifiersRaw = {
  uuid: string;
  active: boolean;
  quantity: number;
  price: number;
  sum: number;
  modifier: ModifierRaw;
};

export type PriceRaw = {
  uuid: string;
  item_size: string;
  sales_point: string;
  modifier?: string;
  price: number;
  created_at: string;
  updated_at: string;
};

export type NotritionRaw = {
  uuid: string;
  type: NutritionType;
  fats: number;
  carbohydrates: number;
  proteins: number;
  calories: number;
  size: string;
};

export type ItemSize = {
  uuid: string;
  name: string;
  menu_item: string;
  sku: string;
  image: ImageRaw | null;
  sorting: number;
  price?: number;
  prices?: PriceRaw[];
  code: string | number | null;
  external_id: string | number | null;
  characteristics: { weight: number };
  nutritions: NotritionRaw[];
  created_at: string;
  updated_at: string;
  modifier_groups?: MenuModifierGroupRaw[];
  restrictions?: {
    max_quantity: number;
    min_quantity: number;
    free_quantity: number;
    default_amount: number;
  };
};

export type OrderItemRaw = {
  uuid: string;
  active: boolean;
  quantity: number;
  price: number;
  sum: number;
  total_sum: number;
  size: ItemSize;
  modifiers: ModifiersRaw[];
  created_at: string;
  updated_at: string;
};

export type OrderRaw = {
  uuid: number | undefined;
  sales_point: SalesPointRaw;
  type: string;
  customer: CustomerRaw;
  status: string;
  external_status: string | null;
  external_id: string | null;
  payment_status: string;
  payment_type: string;
  active: boolean;
  total_sum: number;
  discounted_total_sum: number | null;
  review: string | null;
  number: string | number | null;
  delivery_time: string | null;
  delivery_price?: number;
  sum: number | null;
  created_at: string | null;
  updated_at: string | null;
  items?: OrderItemRaw[];
  applied_bonuses: number;
  received_bonuses: number;
};

export class Order implements BaseModel {
  id: number | undefined;
  salesPoint: SalesPoint;
  type: string;
  customer: Customer;
  status: string;
  externalStatus: string | null;
  externalId: string | null;
  paymentStatus: string;
  paymentType: string;
  active: boolean;
  totalSum: number;
  discountedTotalSum: number;
  review: string | null;
  number: string | number | null;
  deliveryTime: string | null;
  sum: number | null;
  createdAt: string | null;
  updatedAt: string | null;
  items?: OrderItemRaw[];
  deliveryPrice?: number;
  appliedBonuses: number;
  receivedBonuses: number;

  constructor(raw: OrderRaw) {
    this.id = raw.uuid;
    this.salesPoint = new SalesPoint(raw.sales_point);
    this.type = raw.type;
    this.customer = new Customer(raw.customer);
    this.status = raw.status;
    this.externalStatus = raw.external_status;
    this.externalId = raw.external_id;
    this.paymentStatus = raw.payment_status;
    this.paymentType = raw.payment_type;
    this.active = raw.active;
    this.totalSum = raw.total_sum;
    this.discountedTotalSum = raw.discounted_total_sum || raw.total_sum;
    this.review = raw.review;
    this.number = raw.number;
    this.deliveryTime = raw.delivery_time
      ? moment.utc(raw.delivery_time).local().format('DD.MM.YYYY HH:mm')
      : null;
    this.sum = raw.sum;
    this.createdAt = moment
      .utc(raw.created_at)
      .local()
      .format('DD.MM.YYYY HH:mm');
    this.updatedAt = raw.updated_at;
    this.items = raw.items;
    this.deliveryPrice = raw.delivery_price;
    this.appliedBonuses = raw.applied_bonuses;
    this.receivedBonuses = raw.received_bonuses;
  }

  get getPaymentType() {
    const type = this.paymentType;
    if (type === 'online') return 'Онлайн';
    else if (type === 'card') return 'Картой курьеру';
    else return 'Наличными';
  }

  get getPaymentStatus() {
    if (this.paymentStatus === 'not_paid') return 'Не оплачен';
    else if (this.paymentStatus === 'full_paid') return 'Полностью оплачен';
    else return 'Возвращен';
  }

  get orderStatus() {
    const status = this.status;
    if (status === 'created')
      return { name: 'Создан', color: 'gray', textColor: 'black' };
    else if (status === 'validated')
      return { name: 'Проверен', color: 'gray', textColor: 'green' };
    else if (status === 'accepted')
      return { name: 'Принят', color: 'gray', textColor: 'orange' };
    else if (status === 'declined')
      return { name: 'Отменен', color: 'red', textColor: 'white' };
    else if (status === 'closed')
      return { name: 'Завершен', color: 'green', textColor: 'white' };
    else if (status === 'on_way')
      return { name: 'В пути', color: 'orange', textColor: 'white' };
    else if (status === 'cooking')
      return { name: 'Готовится', color: 'yellow', textColor: 'black' };
    else return { name: 'Готово', color: 'primary', textColor: 'white' };
  }

  get deliveryType() {
    if (this.type === 'delivery') return 'Доставка';
    else return 'Самовывоз';
  }

  toJson(): Record<string, any> {
    return {
      id: this.id,
      // sales_point: this.sales_point,
      // type: this.type,
      // customer: this.customer,
      // status: this.status,
      // external_status: this.external_status,
      // external_id: this.external_id,
      // payment_status: this.payment_status,
      // payment_type: this.payment_type,
      // active: this.active,
      // total_sum: this.total_sum,
      // review: this.review,
      // number: this.number,
      // delivery_time: moment
      //   .utc(this.delivery_time)
      //   .format('YYYY-MM-DD HH:mm:ss'),
      // sum: this.sum,
      // created_at: this.created_at,
      // updated_at: this.updated_at,
    };
  }
}
