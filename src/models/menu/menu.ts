import { Company } from './../company/company';
import { NotritionRaw, PriceRaw } from './../order/order';
import { BaseModel } from 'src/corexModels/apiModels/baseModel';
import { Image, ImageRaw } from '../image/image';
import { CompanyRaw } from '../company/company';
import { MenuGroupRaw } from './menuGroups/menuGroup';
import { MenuItemRaw } from './menuItem/menuItem';
import {
  MenuModifierGroup,
  MenuModifierGroupRaw,
} from './menuModifierGroup/menuModifierGroup';

export enum NutritionType {
  PORTION = 'portion',
  TOTAL = 'total',
  HUNDRED_GRAMS = 'hundred_grams',
}

export const nutritionsNames = {
  [NutritionType.PORTION]: 'Порция',
  [NutritionType.TOTAL]: 'Всего',
  [NutritionType.HUNDRED_GRAMS]: '100 грамм',
};

export const NutritionTypes = Object.keys(nutritionsNames).map((el) => {
  const key = el as NutritionType;
  return { label: nutritionsNames[key] as NutritionType, value: key };
});

export type MenuFilters = {
  search: string;
  company?: Company;
  menu?: Menu;
};

export type ItemSizeRaw = {
  uuid: string;
  name: string;
  menu_item: string;
  sku: string;
  image: ImageRaw | null;
  is_hidden: boolean;
  sorting: number;
  price?: number;
  prices?: PriceRaw[];
  code: string | number | null;
  external_id: string | number | null;
  characteristics: { weight: number } | null;
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

export type MenuRaw = {
  uuid?: string;
  name: string | null;
  company: CompanyRaw;
  external_id?: string;
  image?: string | null;
  items?: MenuItemRaw[];
  created_at?: string;
  groups?: MenuGroupRaw[];
  updated_at?: string;
  description?: string;
};

export class ItemSize implements BaseModel {
  id: string;
  name: string;
  menuItem: string;
  sku: string;
  image: Image | null;
  sorting: number;
  price?: number;
  prices?: PriceRaw[];
  code: string | number | null;
  isHidden: boolean;
  externalId: string | number | null;
  characteristics: { weight: number };
  nutritions: NotritionRaw[];
  createdAt: string;
  updatedAt: string;
  modifierGroups?: MenuModifierGroup[];
  restrictions?: {
    max_quantity: number;
    min_quantity: number;
    free_quantity: number;
    default_amount: number;
  };

  constructor(raw: ItemSizeRaw) {
    this.id = raw.uuid;
    this.name = raw.name;
    this.menuItem = raw.menu_item;
    this.sku = raw.sku;
    this.image = raw.image ? new Image(raw.image) : null;
    this.sorting = raw.sorting;
    this.price = raw.price;
    this.prices = raw.prices;
    this.code = raw.code;
    this.externalId = raw.external_id;
    this.characteristics = raw.characteristics || { weight: 0 };
    this.nutritions = raw.nutritions;
    this.createdAt = raw.created_at;
    this.updatedAt = raw.updated_at;
    this.modifierGroups = raw.modifier_groups?.map(
      (v) => new MenuModifierGroup(v)
    );
    this.restrictions = raw.restrictions;
    this.isHidden = raw.is_hidden;
  }

  toJson() {
    void 0;
  }
}

export class Menu implements BaseModel {
  id: string;
  name: string | null;
  company: Company;
  external_id?: string;
  image?: string | null;
  items?: MenuItemRaw[];
  created_at?: string;
  updated_at?: string;
  groups?: MenuGroupRaw[];
  description?: string;

  constructor(raw: MenuRaw) {
    this.id = raw.uuid || '';
    this.name = raw.name;
    this.company = new Company(raw.company);
    this.external_id = raw.external_id || '';
    this.image = raw.image || null;
    this.items = raw.items || [];
    this.created_at = raw.created_at || '';
    this.updated_at = raw.updated_at || '';
    this.groups = raw.groups || [];
    this.description = raw.description;
  }

  toJson(): Record<string, any> {
    return {
      // uuid: this.id,
      name: this.name,
      company: this.company.id,
      description: this.description || undefined,
      // external_id: this.external_id,
      // image: this.image,
      // items: this.items,
      // created_at: this.created_at,
      // updated_at: this.updated_at,
    };
  }
}
