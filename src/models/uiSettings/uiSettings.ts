import { BaseModel } from 'src/corexModels/apiModels/baseModel';

export type Color = {
  color: string;
  on_color: string;
};

export type UiSettingsRaw = {
  uuid: string;
  primary_color: Color;
  background_color: Color;
  accent_color: Color;
  input_type: string;
  bottom_menu_color: Color;
  input_color: Color;
  button_color: Color;
  backing_color: Color;
  empty_bonuses_text: string | null;
  gift_color: Color;
  bonus_color: Color;
  sale_color: Color;
  qr_color: Color;
  secondary_button_color: Color;
  selection_color: Color;
  card_color: Color;
  loyalty_card_background_color: Color;
  border_radius: number;
  loader: string;
  favicon: string | null;
  logo: {
    uuid: string;
    image: string;
    thumbnail: string;
    background_color: string;
  } | null;
  background_image: string | null;
  loyalty_card_image: string | null;
  loyalty_card_logo: string | null;
  on_primary_color: string | null;
  on_accent_color: string | null;
  on_background_color: string | null;
  box_shadow: BoxShadow;
  company: string | null;
  company_group: {
    uuid: string;
    name: string;
  };
  base_settings: UiSettingsRaw | null;
  menu_color: string | null;
  qr_code_description: string;
  created_at: string;
  updated_at: string | null;
  divider_color: Color;
  product_tile_color: Color;
  selector_color: Color;
  selector_active_color: Color;
  delivery_button_color: Color;
  pickup_button_color: Color;
  booking_button_color: Color;
  modal_header_color: Color;
};

export type BoxShadow = {
  uuid: string;
  color: string;
  blur: number;
  spread: number;
  offset_x: number;
  offset_y: number;
};

export class UiSetting implements BaseModel {
  id: string;
  primaryColor: Color;
  backgroundColor: Color;
  accentColor: Color;
  inputType: string;
  bottomMenuColor: Color;
  inputColor: Color;
  buttonColor: Color;
  backingColor: Color;
  emptyBonusesText: string | null;
  giftColor: Color;
  bonusColor: Color;
  saleColor: Color;
  qrColor: Color;
  secondaryButtonColor: Color;
  selectionColor: Color;
  cardColor: Color;
  loyaltyCardBackgroundColor: Color;
  borderRadius: number;
  loader: string;
  favicon: string | null;
  logo: {
    uuid: string;
    image: string;
    thumbnail: string;
    background_color: string;
  } | null;
  backgrounImage: string | null;
  loyaltyCardImage: string | null;
  loyaltyCardLogo: string | null;
  onPrimaryColor: string | null;
  onAccentColor: string | null;
  onBackgroundColor: string | null;
  boxShadow: BoxShadow;
  company: string | null;
  companyGroup: {
    uuid: string;
    name: string;
  };
  baseSettings: UiSettingsRaw | null;
  menuColor: string | null;
  qrCodeDescription: string;
  createdAt: string;
  updatedAt: string | null;
  dividerColor: Color;
  productTileColor: Color;
  selectorColor: Color;
  selectorActiveColor: Color;
  deliveryButtonColor: Color;
  pickupButtonColor: Color;
  bookingButtonColor: Color;
  modalHeaderColor: Color;

  constructor(raw: UiSettingsRaw) {
    this.id = raw.uuid;
    this.primaryColor = raw.primary_color;
    this.backgroundColor = raw.background_color;
    this.accentColor = raw.accent_color;
    this.inputType = raw.input_type;
    this.bottomMenuColor = raw.bottom_menu_color;
    this.inputColor = raw.input_color;
    this.buttonColor = raw.button_color;
    this.backingColor = raw.backing_color;
    this.emptyBonusesText = raw.empty_bonuses_text;
    this.giftColor = raw.gift_color;
    this.bonusColor = raw.bonus_color;
    this.saleColor = raw.sale_color;
    this.qrColor = raw.qr_color;
    this.secondaryButtonColor = raw.secondary_button_color;
    this.selectionColor = raw.selection_color;
    this.cardColor = raw.card_color;
    this.loyaltyCardBackgroundColor = raw.loyalty_card_background_color;
    this.borderRadius = raw.border_radius;
    this.loader = raw.loader;
    this.favicon = raw.favicon;
    this.logo = raw.logo;
    this.backgrounImage = raw.background_image;
    this.loyaltyCardImage = raw.loyalty_card_image;
    this.loyaltyCardLogo = raw.loyalty_card_logo;
    this.onPrimaryColor = raw.on_primary_color;
    this.onAccentColor = raw.on_accent_color;
    this.onBackgroundColor = raw.on_background_color;
    this.boxShadow = raw.box_shadow;
    this.company = raw.company;
    this.companyGroup = raw.company_group;
    this.baseSettings = raw.base_settings;
    this.menuColor = raw.menu_color;
    this.qrCodeDescription = raw.qr_code_description;
    this.createdAt = raw.created_at;
    this.updatedAt = raw.updated_at;
    this.dividerColor = raw.divider_color;
    this.productTileColor = raw.product_tile_color;
    this.selectorColor = raw.selector_color;
    this.selectorActiveColor = raw.selector_active_color;
    this.deliveryButtonColor = raw.delivery_button_color;
    this.pickupButtonColor = raw.pickup_button_color;
    this.bookingButtonColor = raw.booking_button_color;
    this.modalHeaderColor = raw.modal_header_color;
  }

  toJson() {
    return;
  }
}
