/* eslint-disable react/jsx-curly-brace-presence */
/* eslint-disable react/jsx-key */
import Taro, { Component } from "@tarojs/taro"
import { View, Text, Swiper, SwiperItem } from "@tarojs/components"
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
    this.userId = getUserId()

    this.state = {
      todoGroup: [],
      isHide: false,
    }
  }

  componentWillMount() {
    // this.setState({
    //   isHide: false
    // })
    // setTimeout(() => {  
    // }, this.props.wait)
  }

  componentWillReceiveProps(nextProps) {
    const { dayjsDate } = nextProps
    console.log('todo', 'componentWillReceiveProps()', dayjsDate)

    const todoGroup = this.todoGroup(dayjsDate)

    this.setState({
      todoGroup,
    })
  }

  shouldComponentUpdate(newProps, newState) {
    // console.log('todo', 'shouldComponentUpdate()', this.props.date, newProps, newState)

    // for(let key in newState) {
    //   if (this.state[key] !== newState[key]) return true
    // }
    // if (this.props.date === newProps.date) return false
    // return true
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

    // const dates = arr.map(item => {
    //   return item.value
    // })
    // console.log(dates)

    //查找当天待办任务
    // Taro.cloud.callFunction({
    //   name: 'getTodo',
    //   data: {
    //     userId: this.userId,
    //     dates: dates,
    //   },
    // }).then(res => {
    //   console.log('getTodo', res)
    // })

    return arr
  }

  handleTodo(dayjsDate) {
    const format = dayjsDate.format('YYYY-MM-DD')
    const solarStr = dayjsDate.$calendar.IMonthCn + dayjsDate.$calendar.IDayCn
    let weatherTips = `农历 ${solarStr}`
    if (this.props.heweather.hasOwnProperty(format)) {
      const weather = this.props.heweather[format]
      const heweatherData = Taro.getStorageSync('heweather')
      const location = heweatherData.basic.location
      const text = weather.cond_txt_d
      const tmp_max = weather.tmp_max
      const tmp_min = weather.tmp_min
      const wind_dir = weather.wind_dir
      const wind_sc = weather.wind_sc
      weatherTips = `${location}  ${text}  ${tmp_min}/${tmp_max}°C  ${wind_dir}${wind_sc}级  (${solarStr})`
    }

    const params = {}
    params[format] = []
    this.setState(params)

    return {
      __value: dayjsDate,
      value: format,
      weatherTips,
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

  render() {
    return (
      <View>
        {
          !this.state.isHide
            ? <Swiper
              className={'todo ' + (this.props.isDropDown ? 'switch' : '')}
              circular
              current={1}
              onChange={this.swiperChange}
              onAnimationFinish={this.swiperAnimationFinish}
              onTouchStart={this.swiperTouchStart}
              onTouchEnd={this.swiperTouchEnd}
            >
              {
                this.state.todoGroup.map(item => {
                  return (
                    <SwiperItem>
                      <View className='weather-tips'>{item.weatherTips}</View>
                      {
                        item.todos.length === 0
                          ? <View className={'no-todo-item'}>点击右侧按钮添加</View>
                          : item.todos.map(todo => {
                            return (
                              <View className={'todo-item'}></View>
                            )
                          })
                      }
                    </SwiperItem>
                  )
                })
              }
            </Swiper>
            : null
        }
      </View>
    )
  }
}

Todo.defaultProps = {
  dayjsDate: generateDate(),
  heweather: {},
  isDropDown: false,
  wait: 500,
}