import { ScheduleRaw, Schedule } from './schedule';
import { BaseModelApi } from 'src/corexModels/apiModels/baseModelApi';

export class ScheduleApi extends BaseModelApi<Schedule> {
  routeName = 'route_name'
  fromJson = (json: ScheduleRaw) => new Schedule(json)
}

export const scheduleApi = new ScheduleApi();
