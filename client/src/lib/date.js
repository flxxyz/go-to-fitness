import dayjs, {
  Dayjs
} from 'dayjs'
import {
  MAX_ROW,
  MAX_COL,
  DATE_FORMAT
} from '../constant'

/**
 * 
 * @param {Dayjs} initialValue 
 * @returns {Dayjs}
 */
const generateDate = (initialValue) => {
  let date = dayjs()
  if (initialValue) {
    date = dayjs(initialValue)
  }
  return date.startOf('month').locale('zh-cn')
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
  // const date = generateDate(initialValue || '')
  const firstDate = date.startOf('month') //这个月第一天

  const list = []

  for (let i = 0; i < MAX_ROW * MAX_COL; i++) {
    let pos = i

    // 判断第一天是不是星期天
    if (firstDate.day() !== 0) {
      pos = (firstDate.day() - i) * -1 // 将索引位置反转
    }

    const thisDate = firstDate.add(pos, 'day')

    // console.log(pos, getFormatDate(thisDate))

    const item = {
      __value: thisDate,
      value: getFormatDate(thisDate, DATE_FORMAT),
    }

    list.push(item)
  }

  return list
}

export {
  generateDate,
  getFormatDate,
  generateCalendar,
}
