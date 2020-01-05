import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

import Login from '../../components/login'
import Calendar from '../../components/calendar'
import { isLogin, U } from '../../lib/utils'
import { generateDate } from '../../lib/date'

export default class Index extends Component {
  constructor(props) {
    super(props)
    const showLogin = !isLogin() ? true : false
    this.onLoginState(showLogin)

    const date = generateDate().valueOf()

    this.state = {
      showLogin,
      date,
    }
  }

  componentDidMount() {
    const weatherDate = Taro.getStorageSync('weatherDate')
    const now = generateDate()
    const last = generateDate(weatherDate)
    if ((weatherDate === '') || now.unix() > last.unix()) {
      Taro.request({
        url: U('weather'),
        success(res) {
          const data = {}
          if (res.data.HeWeather6[0].status === 'ok') {
            res.data.HeWeather6[0].daily_forecast.map(daily => {
              data[daily.date] = daily
            })
          }
          Taro.setStorageSync('weatherDate', now.endOf('day').valueOf())
          Taro.setStorageSync('heweather', data)
        }
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

  render() {
    const { showLogin, date } = this.state

    return (
      <View className='index'>
        {
          showLogin
            ? <Login onLoginState={this.onLoginState.bind(this)} />
            : <Calendar
              date={date}
              onDateClick={this.onDateClick.bind(this)}
              onPrevMonth={this.onPrevMonth.bind(this)}
              onNextMonth={this.onNextMonth.bind(this)}
            />
        }
      </View>
    )
  }
}