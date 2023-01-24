import { BaseModel } from 'src/corexModels/apiModels/baseModel';

export type MenuRaw = {
  uuid: string;
  name: string;
  company: string;
  external_id: string;
  image: string | null;
  created_at: string;
  updated_at: string;
  groups: Array<MenuGroup>;
};

export type MenuGroup = {
  uuid: string;
  menu: string;
  external_id: string;
  name: string;
  image: string | null;
  description: string | null;
  sorting: number | null;
  created_at: string;
  updated_at: string;
  parent: string | null;
  external_parent: string | null;
  items: Array<MenuItem>;
};

export type MenuItem = {
  uuid: string;
  menu: string;
  name: string;
  sku: string;
  image: string | null;
  external_id: string | null;
  sorting: number | null;
  description: string | null;
  group: string;
  active: boolean;
  created_at: string;
  updated_at: string | null;
  sizes: Array<Size>;
};

export type Size = {
  uuid: string;
  name: string | null;
  menu_item: string;
  sku: string;
  image: Image;
  sorting: number | null;
  code: number | string | null;
  external_id: string | number | null;
  created_at: string;
  updated_at: string | null;
  price: number;
};

export type Image = {
  uuid: string;
  image: string | null;
  thumbnail: string | null;
  background_color: string | null;
};

export class Menu implements BaseModel {
  id: string;
  name: string;
  company: string;
  externalId: string;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  groups: Array<MenuGroup>;

  constructor(raw: MenuRaw) {
    this.id = raw.uuid;
    this.name = raw.name;
    this.company = raw.company;
    this.externalId = raw.external_id;
    this.image = raw.image;
    this.createdAt = raw.created_at;
    this.updatedAt = raw.created_at;
    this.groups = raw.groups;
  }

  toJson() {
    return;
  }
}
