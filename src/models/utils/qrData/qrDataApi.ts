import { QrDataRaw, QrData } from './qrData';
import { BaseModelApi } from 'src/corexModels/apiModels/baseModelApi';

export class QrDataApi extends BaseModelApi<QrData> {
  routeName = 'utils/qr_data'
  fromJson = (json: QrDataRaw) => new QrData(json)
}

export const qrDataApi = new QrDataApi();
