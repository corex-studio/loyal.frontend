import { BookingRequest, BookingRequestFilters } from './bookingRequest'
import BaseRepo from 'src/corexModels/apiModels/baseRepo'
import { bookingRequestApi } from './bookingRequestApi'
import { reactive } from 'vue'

export class BookingRequestRepo extends BaseRepo<BookingRequest> {
  filters: BookingRequestFilters = {
    search: null,
    status: null,
  }
  api = bookingRequestApi
}

export const bookingRequestRepo = reactive(new BookingRequestRepo())
