/* eslint-disable react/jsx-key */
/* eslint-disable react/jsx-curly-brace-presence */
import Taro, { Component } from "@tarojs/taro"
import { View, Text, Swiper, SwiperItem, ScrollView } from "@tarojs/components"

import { generateCalendar, generateDate, weekdaysMin, getFormatDate } from '../../lib/date'
import { MAX_ROW, DATE_FORMAT } from '../../constant'

import './index.scss'

let currentIndex = 1
let swiperStartPoint = 0
let isPrevMonth = false
let isChanged = false

const touch = {
  stop: false,
  Y: 0,
  diff: 0,
}

export default class Calender extends Component {
  constructor(props) {
    super(props)

    const { date } = props
    const dayjsDate = generateDate(date)
    const dateGroup = this.dateGroup(dayjsDate)
    const systemInfo = Taro.getSystemInfoSync()

    const windowWidth = 750;
    const windowHeight = systemInfo.windowHeight * (750 / systemInfo.windowWidth)
    const swiperHeight = '480rpx'
    const dateItemHeight = '80rpx'
    const swiperDuration = 'all .6s'

    this.state = {
      windowHeight,
      dateGroup,
      dayjsDate,
      swiperHeight,
      dateItemHeight,
      swiperDuration,
    }
  }

  componentDidMount() {
    // const date = generateDate()
    // console.log(date, date.format(), getFormatDate(date))
  }

  componentWillReceiveProps(nextProps) {
    // console.log(nextProps)

    const { date } = nextProps
    const dayjsDate = generateDate(date)
    const dateGroup = this.dateGroup(dayjsDate)

    this.setState({
      dateGroup,
      dayjsDate,
    })
  }

  dateGroup(dayjsDate) {
    const arr = []
    const prevMonth = generateCalendar(dayjsDate.subtract(1, 'month'))  // 上个月日历
    const nowMonth = generateCalendar(dayjsDate)  // 这个月日历
    const nextMonth = generateCalendar(dayjsDate.add(1, 'month'))  // 下个月日历

    const prevMonthIndex = currentIndex === 0 ? 2 : currentIndex - 1
    const nextMonthIndex = currentIndex === 2 ? 0 : currentIndex + 1

    arr[prevMonthIndex] = prevMonth
    arr[nextMonthIndex] = nextMonth
    arr[currentIndex] = nowMonth
    return arr
  }

  headerClick() {
    console.log('headerClick')
  }

  bodySwiperChange(e) {
    const { current } = e.detail
    isChanged = true
    currentIndex = current
  }

  bodySwiperAnimationFinish() {
    if (isChanged) {
      isChanged = false
      isPrevMonth ? this.props.onPrevMonth() : this.props.onNextMonth()
    }
  }

  bodySwiperTouchStart(e) {
    const { clientX } = e.changedTouches[0]
    swiperStartPoint = clientX
  }

  bodySwiperTouchEnd(e) {
    const { clientX } = e.changedTouches[0]
    isPrevMonth = clientX - swiperStartPoint > 0
  }

  bodyScrollViewTouchStart(e) {
    touch.stop = false
    touch.Y = e.changedTouches[0].clientY
  }

  bodyScrollViewTouchMove(e) {
    if (!touch.stop) {
      touch.diff = e.changedTouches[0].clientY - touch.Y
    }
  }

  bodyScrollViewTouchEnd() {
    let newSwiperHeight, newDateItemHeight, newSwiperDuration
    const { windowHeight } = this.state

    //手指上滑的活动范围可能比50还大
    if (touch.diff >= 20 || touch.diff <= -50) {
      if (touch.diff >= 20) {
        //下拉
        newSwiperHeight = (windowHeight - 120 - (40 + 36))  // weekdays的40+36像素
        newDateItemHeight = Number(newSwiperHeight / MAX_ROW)
        newSwiperDuration = 0.3
      } else if (touch.diff <= -50) {
        //上拉
        newSwiperHeight = 480
        newDateItemHeight = 80
        newSwiperDuration = 0.6
      }

      this.setState({
        swiperDuration: `all ${newSwiperDuration}s`,
        swiperHeight: `${newSwiperHeight}rpx`,
        dateItemHeight: `${newDateItemHeight}rpx`,
      })
    }

    touch.stop = true
    touch.Y = 0
    touch.diff = 0
  }

  dateItemClick(date) {
    this.props.onDateClick(date)
  }

  render() {
    const { dateGroup, dayjsDate, swiperHeight, dateItemHeight, swiperDuration } = this.state

    return (
      <View className={'calendar'}>
        <View className={'header'} onClick={this.headerClick}>
          <Text className={'date'}>{dayjsDate.format('DD')}</Text>
          <Text className={'month'}>{dayjsDate.format('MMMM')}</Text>
          <Text className={'year'}>{dayjsDate.year()}</Text>
          <Text className={'week'}>{dayjsDate.format('dddd')}</Text>
        </View>
        <View className={'body'}>
          <View className={'weekdays'}>
            {
              weekdaysMin.map((value, index) => {
                let weekdayClass = 'weekday'
                switch (index) {
                  case 0:
                    weekdayClass = `${weekdayClass} sun`
                    break
                  case 6:
                    weekdayClass = `${weekdayClass} sat`
                    break
                }
                return (<View className={weekdayClass} key={value}>{value}</View>)
              })
            }
          </View>
          <Swiper
            className={'swiper'}
            style={{
              height: swiperHeight,
              transition: swiperDuration
            }}
            circular
            current={1}
            onChange={this.bodySwiperChange}
            onAnimationFinish={this.bodySwiperAnimationFinish}
            onTouchStart={this.bodySwiperTouchStart}
            onTouchEnd={this.bodySwiperTouchEnd}
          >
            {
              dateGroup.map((item) => (
                <SwiperItem>
                  <ScrollView
                    className={'scroll-view'}
                    scrollY
                    scrollTop={0}
                    onTouchStart={this.bodyScrollViewTouchStart}
                    onTouchMove={this.bodyScrollViewTouchMove}
                    onTouchEnd={this.bodyScrollViewTouchEnd}
                  >
                    <View className={'date-list'}>
                      {
                        item.map((date) => {
                          let dateClass = `date ${date.isPlaceholder ? 'fade' : ''}`
                          switch (date.__value.day()) {
                            case 0:
                              dateClass = `${dateClass} sun`
                              break
                            case 6:
                              dateClass = `${dateClass} sat`
                              break
                          }
                          if (dayjsDate.format(DATE_FORMAT) == date.value) {
                            dateClass = `${dateClass} now`
                          }

                          return (
                            <View
                              className={dateClass}
                              style={{
                                height: dateItemHeight,
                              }}
                              onClick={() => this.dateItemClick(date)}
                              key={date.__value.valueOf()}
                            >
                              {date.text}
                            </View>
                          )
                        })
                      }
                    </View>
                  </ScrollView>
                </SwiperItem>
              ))
            }
          </Swiper>
        </View>
      </View>
    )
  }
}

Calender.defaultProps = {
  date: Date.now()
}