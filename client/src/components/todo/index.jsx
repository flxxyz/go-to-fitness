/* eslint-disable react/jsx-key */
import Taro, { Component } from "@tarojs/taro"
import { View, Text, Swiper, SwiperItem, ScrollView, Image } from "@tarojs/components"
import { generateDate } from '../../lib/date'
import { getUserId } from '../../lib/utils'
import { MAX_ROW } from '../../constant'

import './index.scss'


export default class Todo extends Component {
  constructor(props) {
    super(props)

    this.currentIndex = 1
    this.startPoint = 0
    this.isPrevDay = false
    this.isChanged = false

    const { date, heweather, isDropDown } = props
    this.heweather = heweather

    const dayjsDate = generateDate(date)
    const todoGroup = this.todoGroup(dayjsDate)

    this.state = {
      todoGroup,
      isDropDown,
    }
  }

  componentWillReceiveProps(nextProps) {
    const { date, heweather, isDropDown } = nextProps
    this.heweather = heweather

    const dayjsDate = generateDate(date)
    const todoGroup = this.todoGroup(dayjsDate)

    this.setState({
      todoGroup,
      isDropDown,
    })
  }

  todoGroup(dayjsDate) {
    const arr = []
    const prevDay = this.handleTodo(dayjsDate.subtract(1, 'day'))  // 昨天
    const nowDay = this.handleTodo(dayjsDate)  // 今天
    const nextDay = this.handleTodo(dayjsDate.add(1, 'day'))  // 明天

    const prevDayIndex = this.currentIndex === 0 ? 2 : this.currentIndex - 1
    const nextDayIndex = this.currentIndex === 2 ? 0 : this.currentIndex + 1

    arr[prevDayIndex] = prevDay
    arr[nextDayIndex] = nextDay
    arr[this.currentIndex] = nowDay
    return arr
  }

  handleTodo(dayjsDate) {
    const todos = []
    //查找当天待办任务
    // Taro.cloud.callFunction({
    //   name: 'getTodo',
    //   data: {
    //     userId: getUserId(),
    //   },
    // }).then(res => {
    //   console.log('cloud function result:', res)
    // })
    // console.log('getUserId()', getUserId())

    const format = dayjsDate.format('YYYY-MM-DD')
    let weatherTips = ''
    if (this.heweather.hasOwnProperty(format)) {
      const weather = this.heweather[format]
      const heweatherData = Taro.getStorageSync('heweather')
      const location = heweatherData.basic.location
      const text = weather.cond_txt_d
      const tmp_max = weather.tmp_max
      const tmp_min = weather.tmp_min
      const wind_dir = weather.wind_dir
      const wind_sc = weather.wind_sc
      weatherTips = `${location}  ${text}  ${tmp_min}/${tmp_max}°C  ${wind_dir}${wind_sc}级`
    }

    return {
      __value: dayjsDate,
      value: format,
      weatherTips,
      todos,
    }
  }

  swiperChange(e) {
    const { current } = e.detail
    this.isChanged = true
    this.currentIndex = current
  }

  swiperAnimationFinish() {
    if (this.isChanged) {
      this.isChanged = false
      this.isPrevDay ? this.props.onPrevDay() : this.props.onNextDay()
    }
  }

  swiperTouchStart(e) {
    const { clientX } = e.changedTouches[0]
    this.startPoint = clientX
  }

  swiperTouchEnd(e) {
    const { clientX } = e.changedTouches[0]
    this.isPrevDay = clientX - this.startPoint > 0
  }

  renderTodos(todos) {
    if (todos.length === 0) {
      return <View>点击右侧按钮添加备忘事件</View>
    } else {
      todos.map(todo => {
        return (
          <View>todo</View>
        )
      })
    }
  }

  render() {
    const { todoGroup, isDropDown } = this.state
    let todoClass = 'todo'
    if (isDropDown) {
      todoClass += ' hide'
    }

    // const systemInfo = Taro.getSystemInfoSync()
    // const windowHeight = systemInfo.windowHeight * (750 / systemInfo.windowWidth)
    // windowHeight - (120 + (40 * MAX_ROW))

    return (
      <Swiper
        className={todoClass}
        circular
        current={1}
        onChange={this.swiperChange}
        onAnimationFinish={this.swiperAnimationFinish}
        onTouchStart={this.swiperTouchStart}
        onTouchEnd={this.swiperTouchEnd}
      >
        {
          todoGroup.map(item => (
            <SwiperItem>
              <View className='weather-tips'>{item.weatherTips}</View>
              {this.renderTodos(item.todos)}
            </SwiperItem>
          ))
        }
      </Swiper>
    )
  }
}

Todo.defaultProps = {
  date: Date.now(),
  heweather: {},
  isDropDown: false,
}