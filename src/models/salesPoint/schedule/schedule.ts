import moment from 'moment'
import { BaseModel } from 'src/corexModels/apiModels/baseModel'

export type ScheduleTimeRaw = {
  uuid: string
  start: string
  end: string
}

export type ScheduleDayRaw = {
  uuid?: string
  day: number
  active: boolean
  times: ScheduleTimeRaw[]
}

export type ScheduleRaw = {
  uuid?: string
  days: ScheduleDayRaw[]
}

export class Schedule implements BaseModel {
  id: string
  days: ScheduleDay[]

  constructor(raw: ScheduleRaw) {
    this.id = raw.uuid || ''
    this.days = raw.days.map((v) => new ScheduleDay(v))
  }

  toJson(): Record<string, any> {
    return {}
  }
}

export class ScheduleDay implements BaseModel {
  id: string | undefined
  day: number
  active?: boolean
  times: ScheduleTimeRaw[]

  constructor(raw: ScheduleDayRaw) {
    this.id = raw.uuid || ''
    this.day = raw.day
    this.active = raw.active
    this.times = raw.times.map((v) => {
      return {
        uuid: v.uuid,
        start: moment.utc(v.start, 'HH:mm').local().format('HH:mm'),
        end: moment.utc(v.end, 'HH:mm').local().format('HH:mm'),
      }
    })
  }

  toJson(): Record<string, any> {
    return {
      day: this.day,
      active: this.active,
      times: this.times.map((v) => {
        return {
          start: moment(v.start, 'HH:mm').utc().format('HH:mm'),
          end: moment(v.end, 'HH:mm').utc().format('HH:mm'),
        }
      }),
    }
  }
}
