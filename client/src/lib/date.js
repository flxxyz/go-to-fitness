import dayjs, { Dayjs } from 'dayjs'
import locale from 'dayjs/locale/zh-cn'
import {
  MAX_ROW,
  MAX_COL,
  DATE_FORMAT,
  HEWEATHER_ICON,
} from '../constant'
import CalendarPlugin from './calendar'

const weekdays = locale.weekdays
const weekdaysShort = locale.weekdaysShort
const weekdaysMin = locale.weekdaysMin

/**
 * 生成dayjs实例
 * @param {Dayjs} initialValue 
 * @returns {Dayjs}
 */
const generateDate = (initialValue) => {
  dayjs.extend(CalendarPlugin)
  let date = dayjs()
  if (initialValue) {
    date = dayjs(initialValue)
  }
  return date.locale('zh-cn')
}

/**
 * 获取自定义格式化后的日期字符串
 * @param {Dayjs} date 
 * @param {String} format 
 */
const getFormatDate = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
  return date.format(format)
}

/**
 * 简化日历的生成规则
 * @param {Dayjs} date
 * @returns {Array}
 */
const generateCalendar = (date) => {
  const firstDate = date.startOf('month') //这个月第一天

  const list = []

  for (let i = 0; i < MAX_ROW * MAX_COL; i++) {
    let pos = i
    let isPlaceholder = false

    // 判断第一天是不是星期天
    if (firstDate.day() !== 0) {
      pos = (firstDate.day() - i) * -1 // 将索引位置反转
    }

    // 处理占位日期
    if (pos < 0 || pos >= date.daysInMonth()) {
      isPlaceholder = true
    }

    const thisDate = firstDate.add(pos, 'day')

    const item = {
      __value: thisDate,
      lunar: thisDate.$calendar,
      value: thisDate.format(DATE_FORMAT),
      text: thisDate.date(),
      isPlaceholder,
    }

    list.push(item)
  }

  return list
}

/**
 * 获取base64格式天气图标
 * @param {Dayjs} data 
 */
const getWeatherIcon = (data) => {
  const current = generateDate(`${data.date} ${data.ss}`)
  const now = generateDate()
  if (now.isAfter(current)) {
    //夜晚
    return HEWEATHER_ICON[data.cond_code_n]
  } else {
    //白天
    return HEWEATHER_ICON[data.cond_code_d]
  }
}

export {
  generateDate,
  getFormatDate,
  generateCalendar,
  weekdays,
  weekdaysShort,
  weekdaysMin,
  getWeatherIcon,
}
