import { BaseModel } from 'src/corexModels/apiModels/baseModel';

export type UiSettingsRaw = {
  uuid: string;
  primary_color: string;
  background_color: string;
  accent_color: string;
  input_type: string;
  border_radius: number;
  loader: string;
  favicon: string | null;
  logo: string | null;
  background_image: string | null;
  loyalty_card_image: string | null;
  loyalty_card_logo: string | null;
  on_primary_color: string | null;
  on_accent_color: string | null;
  on_background_color: string | null;
  box_shadow: BoxShadow;
  company: string | null;
  company_group: string;
  base_settings: UiSettingsRaw | null;
  menu_color: string | null;
  qr_code_description: string;
  created_at: string;
  updated_at: string | null;
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
  primaryColor: string;
  backgroundColor: string;
  accentColor: string;
  inputType: string;
  borderRadius: number;
  loader: string;
  favicon: string | null;
  logo: string | null;
  backgrounImage: string | null;
  loyaltyCardImage: string | null;
  loyaltyCardLogo: string | null;
  onPrimaryColor: string | null;
  onAccentColor: string | null;
  onBackgroundColor: string | null;
  boxShadow: BoxShadow;
  company: string | null;
  companyGroup: string;
  baseSettings: UiSettingsRaw | null;
  menuColor: string | null;
  qrCodeDescription: string;
  createdAt: string;
  updatedAt: string | null;

  constructor(raw: UiSettingsRaw) {
    this.id = raw.uuid;
    this.primaryColor = raw.primary_color;
    this.backgroundColor = raw.background_color;
    this.accentColor = raw.accent_color;
    this.inputType = raw.input_type;
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
  }

  toJson() {
    return;
  }
}
