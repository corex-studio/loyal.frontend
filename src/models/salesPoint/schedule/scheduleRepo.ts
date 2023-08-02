import { Schedule } from './schedule';
import BaseRepo from 'src/corexModels/apiModels/baseRepo'
import { scheduleApi } from './scheduleApi';
import { reactive } from 'vue';

export class ScheduleRepo extends BaseRepo<Schedule> {
  api = scheduleApi
}

export const scheduleRepo = reactive(new ScheduleRepo());
