import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

import Login from '../../components/login'
import Calendar from '../../components/calendar'
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
      heweather: {}
    }
  }

  componentWillMount() {
    const weatherDate = Taro.getStorageSync('weatherDate')
    const now = generateDate()
    const last = generateDate(weatherDate)
    if ((weatherDate === '') || now.unix() > last.unix()) {
      Taro.request({
        url: U('weather'),
        success: res => {
          const data = {}
          if (res.data.HeWeather6[0].status === 'ok') {
            res.data.HeWeather6[0].daily_forecast.map(daily => {
              data[daily.date] = daily
            })
          }
          Taro.setStorageSync('weatherDate', now.endOf('day').valueOf())
          Taro.setStorageSync('heweather', res.data.HeWeather6[0])
          console.log('请求，存储完成')
          this.setState({
            heweather: data
          })
        }
      })
    } else {
      const heweatherData = Taro.getStorageSync('heweather')
      const heweather = {}
      if (heweatherData.hasOwnProperty('daily_forecast')) {
        heweatherData.daily_forecast.map(daily => {
          heweather[daily.date] = daily
        })
      }
      this.setState({
        heweather
      })
    }
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

  getWeatherTips() {
    const { date, heweather } = this.state
    const now = generateDate(date)
    const format = now.format('YYYY-MM-DD')
    if (heweather.hasOwnProperty(format)) {
      const weather = heweather[format]
      const heweatherData = Taro.getStorageSync('heweather')
      const location = heweatherData.basic.location
      const text = weather.cond_txt_d
      const tmp_max = weather.tmp_max
      const tmp_min = weather.tmp_min
      const wind_dir = weather.wind_dir
      const wind_sc = weather.wind_sc
      return `${location}  ${text}  ${tmp_min}/${tmp_max}°C  ${wind_dir}${wind_sc}级`
    }

    return ''
  }

  render() {
    const { showLogin, date, heweather } = this.state

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
              />
              <View className='tips'>{this.getWeatherTips()}</View>
            </View>
        }
      </View>
    )
  }
}