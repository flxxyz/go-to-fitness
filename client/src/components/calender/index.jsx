/* eslint-disable react/jsx-curly-brace-presence */
import Taro, { Component } from "@tarojs/taro"
import { View, Swiper, SwiperItem } from "@tarojs/components"

import { generateDate, generateCalendar } from '../../lib/date'

import './index.scss'

export default class Calender extends Component {
  constructor(props) {
    super(props)

    const dateGroup = this.dateGroup()

    console.log(dateGroup)

    this.state = {
      dateGroup
    }
  }

  componentDidMount() {
    // const date = generateDate()
    // console.log(date, date.format(), getFormatDate(date))
  }

  dateGroup() {
    const date = generateDate()
    const prevMonth = generateCalendar(date.subtract(1, 'month'))
    const nowMonth = generateCalendar(date)
    const nextMonth = generateCalendar(date.add(1, 'month'))

    return [prevMonth, nowMonth, nextMonth]
  }

  changeDate(e) {
    console.log(e)
  }

  render() {
    const { dateGroup } = this.state

    return (
      <View className={'calender'}>
        <View className={'controller'}></View>
        <View className={'body'}>
          <Swiper
            current={1}
            onChange={this.changeDate}
            onAnimationFinish={this.changeDate}
          >
            {
              dateGroup.map((item, key) => (
                <SwiperItem
                  key={key}
                >
                  {
                    item.map((date, key1) => (
                      <View key={key1}>{date.value}</View>
                    ))
                  }
                </SwiperItem>
              ))
            }
          </Swiper>
        </View>
      </View>
    )
  }
}