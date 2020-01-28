/* eslint-disable react/jsx-curly-brace-presence */
/* eslint-disable react/jsx-key */
import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtFab } from 'taro-ui'

import Login from '../../components/login'
import Calendar from '../../components/calendar'
import Todo from '../../components/todo'

import { isLogin, U } from '../../lib/utils'
import { generateDate } from '../../lib/date'
import { HEWEATHER_KEY } from '../../constant'

import './index.scss'

export default class Index extends Component {
  constructor(props) {
    super(props)
    const showLogin = !isLogin() ? true : false
    this.onLoginState(showLogin)

    this._date = generateDate()
    const date = this._date.valueOf()

    this.state = {
      showLogin,
      date,
      heweather: {},
      isDropDown: false,
    }
  }

  componentWillMount() {
    console.time('heweather')
    if (HEWEATHER_KEY) {
      this.getWeather().then(data => {
        setTimeout(() => {
          this.setState({
            heweather: data
          }, () => {
            console.timeEnd('heweather')
          })
        }, 200)
      })
    }
  }

  /**
   * 获取近期天气预报
   */
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
    console.log('onDateClick')
    this._date = generateDate(date.__value.valueOf())

    this.setState({
      date: this._date.valueOf()
    })
  }

  /**
   * 生成上个月第一天日期
   */
  onPrevMonth = () => {
    console.log('onPrevMonth')
    const { date } = this.state

    this._date = generateDate(date).subtract(1, 'month')
    this.setState({
      date: this._date.valueOf()
    })
  }

  /**
   * 生成下个月第一天日期
   */
  onNextMonth = () => {
    console.log('onNextMonth')
    const { date } = this.state

    this._date = generateDate(date).add(1, 'month')
    this.setState({
      date: this._date.valueOf()
    })
  }

  /**
   * 生成昨天日期
   */
  onPrevDay = () => {
    console.log('onPrevDay')
    const { date } = this.state

    this._date = generateDate(date).subtract(1, 'day')
    this.setState({
      date: this._date.valueOf()
    })
  }

  /**
   * 监听下拉状态
   */
  onDropDown = (val) => {
    console.log('onDropDown', val)
    this.setState({
      isDropDown: val,
    })
  }

  /**
   * 生成明天日期
   */
  onNextDay = () => {
    console.log('onNextDay')
    const { date } = this.state

    this._date = generateDate(date).add(1, 'day')
    this.setState({
      date: this._date.valueOf()
    })
  }

  render() {
    const { showLogin, date, heweather, isDropDown } = this.state
    const dayjsDate = generateDate(date)

    return (
      <View className='index'>
        {
          showLogin
            ? <Login onLoginState={this.onLoginState.bind(this)} />
            : <View>
              <Calendar
                dayjsDate={this._date}
                heweather={heweather}
                onDateClick={this.onDateClick.bind(this)}
                onPrevMonth={this.onPrevMonth.bind(this)}
                onNextMonth={this.onNextMonth.bind(this)}
                onDropDown={this.onDropDown.bind(this)}
                isDropDown={isDropDown}
              />
              <Todo
                dayjsDate={this._date}
                heweather={heweather}
                onPrevDay={this.onPrevDay.bind(this)}
                onNextDay={this.onNextDay.bind(this)}
                isDropDown={isDropDown}
              />
              <View
                style={{
                  position: 'fixed',
                  bottom: '120rpx',
                  right: '18rpx',
                }}
              >
                <AtFab><Text className={'at-fab__icon at-icon at-icon-menu'}></Text></AtFab>
              </View>
            </View>
        }
      </View>
    )
  }
}