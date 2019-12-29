/* eslint-disable react/jsx-curly-brace-presence */
import Taro, { Component } from "@tarojs/taro"
import { View, Button, OpenData } from "@tarojs/components"
import { AtToast } from 'taro-ui'

import './index.scss'

export default class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      text: '授权失败',
      status: 'error',
      isOpened: false,
    }
  }

  getUserInfo(e) {
    const params = {
      isOpened: true
    }

    if (e.detail.hasOwnProperty('userInfo')) {
      const userInfo = e.detail.userInfo
      Taro.setStorageSync('userInfo', userInfo)

      Taro.cloud.callFunction({
        name: 'addUser',
        data: userInfo,
      }).then(res => {
        console.log('cloud function result:', res)
        if (res.result.hasOwnProperty('_id')) {
          Taro.setStorageSync('userId', res.result._id)

          Object.assign(params, {
            text: '授权成功',
            status: 'success',
          })

          setTimeout(() => {
            this.props.onLoginState(false)
          }, 1500)
        }

        this.setState(params)
      })
    } else {
      this.setState(params)
    }
  }

  render() {
    const { text, status, isOpened } = this.state

    return (
      <View className={'login'}>
        <Button className={'user'}
          openType='getUserInfo'
          onGetUserInfo={this.getUserInfo}
        >
          <OpenData className={'avatar'} type='userAvatarUrl' />
        </Button>
        <View className={'welcome'}>欢迎你! <OpenData type='userNickName' /></View>
        <View className={'tips'}>点击头像登录</View>
        <AtToast isOpened={isOpened}
          text={text}
          status={status}
          duration={2000}
          hasMask
        />
      </View >
    )
  }
}
