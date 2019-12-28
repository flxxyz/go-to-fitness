
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

import Login from '../../components/login'
import Calender from '../../components/calender'
import { isLogin } from '../../lib/utils'

export default class Index extends Component {
  constructor(props) {
    super(props)
    const showLogin = !isLogin() ? true : false
    this.onLoginState(showLogin)
    this.state = {
      showLogin,
    }
  }

  onLoginState = (showLogin) => {
    this.setState({
      showLogin
    })
  }

  render() {
    const { showLogin } = this.state

    return (
      <View className='index'>
        {
          showLogin
            ? <Login onLoginState={this.onLoginState.bind(this)} />
            : <Calender />
        }
      </View>
    )
  }
}