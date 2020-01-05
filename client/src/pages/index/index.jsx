/* eslint-disable react/jsx-key */
import Taro, { Component } from '@tarojs/taro'
import { View, Swiper, SwiperItem } from '@tarojs/components'

import Login from '../../components/login'
import Calendar from '../../components/calendar'
import Todo from '../../components/todo'

import { isLogin, U } from '../../lib/utils'
import { generateDate } from '../../lib/date'

import './index.scss'

export default class Index extends Component {
  constructor(props) {
    super(props)
    const showLogin = !isLogin() ? true : false
    this.onLoginState(showLogin)

    const date = generateDate().valueOf()

    this.state = {
      showLogin,
      date,
      heweather: {},
      isDropDown: false,
    }
  }

  componentWillMount() {
    console.time('heweather')
    this.getWeather()
      .then(data => {
        setTimeout(() => {
          this.setState({
            heweather: data
          }, () => {
            console.timeEnd('heweather')
          })
        }, 200)
      })
  }

  shouldComponentUpdate(newProps, newState) {
    console.log('index', 'shouldComponentUpdate', newState)
    if (Object.keys(newState.heweather).length !== 0) return true
    return false
  }

  getWeather() {
    return new Promise((resolve) => {
      Taro.request({
        url: U('weather'),
        success: res => {
          const data = {}
          if (res.data.HeWeather6[0].status === 'ok' && res.data.HeWeather6[0].update.loc) {
            const now = generateDate()
            const last = generateDate(res.data.HeWeather6[0].update.loc)
            if (now.valueOf() > last.valueOf()) {
              res.data.HeWeather6[0].daily_forecast.map(daily => {
                data[daily.date] = daily
              })
            }
          }

          Taro.setStorageSync('heweather', res.data.HeWeather6[0])
          resolve(data)
        }
      })
    })
  }

  onLoginState = (showLogin) => {
    this.setState({
      showLogin
    })
  }

  onDateClick = (date) => {
    this.setState({
      date: date.__value.valueOf()
    })
  }

  onPrevMonth = () => {
    console.log('onPrevMonth')
    const { date } = this.state

    const _date = generateDate(date).subtract(1, 'month')
    this.setState({
      date: _date.valueOf()
    })
  }

  onNextMonth = () => {
    console.log('onNextMonth')
    const { date } = this.state

    const _date = generateDate(date).add(1, 'month')
    this.setState({
      date: _date.valueOf()
    })
  }

  onPrevDay = () => {
    console.log('onPrevDay')
    const { date } = this.state

    const _date = generateDate(date).subtract(1, 'day')
    this.setState({
      date: _date.valueOf()
    })
  }

  onDropDown = (val) => {
    console.log('onDropDown', val)
    this.setState({
      isDropDown: val,
    })
  }

  onNextDay = () => {
    console.log('onNextDay')
    const { date } = this.state

    const _date = generateDate(date).add(1, 'day')
    this.setState({
      date: _date.valueOf()
    })
  }

  render() {
    const { showLogin, date, heweather, isDropDown } = this.state

    return (
      <View className='index'>
        {
          showLogin
            ? <Login onLoginState={this.onLoginState.bind(this)} />
            : <View>
              <Calendar
                date={date}
                heweather={heweather}
                onDateClick={this.onDateClick.bind(this)}
                onPrevMonth={this.onPrevMonth.bind(this)}
                onNextMonth={this.onNextMonth.bind(this)}
                onDropDown={this.onDropDown.bind(this)}
                isDropDown={isDropDown}
              />
              <Todo
                date={date}
                heweather={heweather}
                onPrevDay={this.onPrevDay.bind(this)}
                onNextDay={this.onNextDay.bind(this)}
                isDropDown={isDropDown}
              />
            </View>
        }
      </View>
    )
  }
}