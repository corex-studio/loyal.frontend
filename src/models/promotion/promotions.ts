import { BaseModel } from 'src/corexModels/apiModels/baseModel';
import { ImageRaw, Image } from '../image/image';

export type PromotionsRaw = {
  uuid: string;
  name: string;
  external_id: string;
  image: ImageRaw | null;
  images: ImageRaw[];
  loyalty_program: string | null;
  description: string | null;
  service_from: string | null;
  service_to: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export class Promotions implements BaseModel {
  id: string;
  name: string;
  externalId: string;
  image: Image | null;
  images: Image[];
  loyaltyProgram: string | null;
  description: string | null;
  serviceFrom: string | null;
  serviceTo: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  constructor(raw: PromotionsRaw) {
    this.id = raw.uuid;
    this.name = raw.name;
    this.externalId = raw.external_id;
    this.image = raw.image ? new Image(raw.image) : null;
    this.images = raw.images.map((v) => new Image(v));
    this.loyaltyProgram = raw.loyalty_program;
    this.description = raw.description;
    this.serviceFrom = raw.service_from;
    this.serviceTo = raw.service_to;
    this.active = raw.active;
    this.createdAt = raw.created_at;
    this.updatedAt = raw.updated_at;
  }

  toJson(): Record<string, any> {
    return {
      id: this.id,
    };
  }
}
