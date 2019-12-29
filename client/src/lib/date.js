import dayjs, { Dayjs } from 'dayjs'
import {
  MAX_ROW,
  MAX_COL,
  DATE_FORMAT
} from '../constant'


const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
const weekdaysShort = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
const weekdaysMin = ['日', '一', '二', '三', '四', '五', '六']
const months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
const locale = {
  name: 'zh',
  weekdays,
  weekdaysShort,
  weekdaysMin,
  months,
}

/**
 * 
 * @param {Dayjs} initialValue 
 * @returns {Dayjs}
 */
const generateDate = (initialValue) => {
  dayjs.locale(locale, null, true)
  let date = dayjs()
  if (initialValue) {
    date = dayjs(initialValue)
  }
  return date.locale('zh')
}

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
      value: thisDate.format(DATE_FORMAT),
      text: thisDate.date(),
      isPlaceholder,
    }

    list.push(item)
  }

  return list
}

export {
  generateDate,
  getFormatDate,
  generateCalendar,
  weekdays,
  weekdaysShort,
  weekdaysMin,
  months,
}
