const createDate = (year, month, day) => {
  if (year || month || day) {
    return new Date(`${year}-${month + 1}-${day} 00:00:00`)
  }
  return new Date()
}

const getDateParams = (t) => {
  let thisYear = t.getFullYear()
  let thisMonth = t.getMonth()
  let thisWeek = t.getDay()
  let thisDay = t.getDate()
  console.log(thisMonth, thisDay)
  // if (thisMonth + 1 > 11) {
  //     thisDay++
  // }
  let lastTime = new Date(thisYear, thisMonth, 1) //这个月第一天
  let lastDate = lastTime.getDate() //这个月第一天是几号
  let lastDay = lastTime.getDay() //这个月第一天星期几
  // console.log('上个月', formatDate(lastTime), '那一天', lastDate, '星期几', lastDay)

  let firstTime = new Date(thisYear, thisMonth + 1, 0) //这个月最后一天
  let firstDate = firstTime.getDate()
  let firstDay = firstTime.getDay() //这个月最后一天星期几
  // console.log('下个月', formatDate(firstTime), '星期几', firstDay)

  let realDays = firstDate //这个月的实际天数
  let days = lastDay + realDays + (6 - firstDay)

  console.log('真正的天数', realDays, '这个月第一天星期几', lastDay, '包括占位符的天数', days, '最后一天星期几', firstDay)

  return {
    thisYear,
    thisMonth,
    thisWeek,
    thisDay,
    firstTime,
    firstDay,
    lastTime,
    lastDate,
    lastDay,
    realDays,
    days,
  }
}

const getDays = (days, lastDay, realDays, thisYear, thisMonth) => {
  let data = []

  //处理本月日子
  for (var i = 1; i <= days; i++) {
    let day = i;
    let isPlaceholder = false;

    //判断需要的占位符
    if ((i <= lastDay) || (i > (realDays + lastDay))) {
      day = null;
      isPlaceholder = true
    } else {
      day -= lastDay
    }

    data.push({
      year: thisYear,
      month: thisMonth + 1,
      day: day,
      isPlaceholder: isPlaceholder,
    })
  }

  return data
}

const formatDate = (t) => {
  return t.toLocaleString("zh-CN", {
      hour12: false
    })
    .replace(/\//g, "-")
    .replace(/\b\d\b/g, "0$&")
}

export {
  createDate,
  getDateParams,
  getDays,
  formatDate
}
