import { BookingRequestRaw, BookingRequest } from './bookingRequest';
import { BaseModelApi } from 'src/corexModels/apiModels/baseModelApi';

export class BookingRequestApi extends BaseModelApi<BookingRequest> {
  routeName = 'booking_requests'
  fromJson = (json: BookingRequestRaw) => new BookingRequest(json)
}

export const bookingRequestApi = new BookingRequestApi();
