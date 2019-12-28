import Taro from '@tarojs/taro'

const getUserId = () => {
  return Taro.getStorageSync('userId')
}

const getUserInfo = () => {
  return Taro.getStorageSync('userInfo')
}

const isLogin = () => {
  return !!getUserId() ? true : false
}

export {
  getUserId,
  getUserInfo,
  isLogin,
}
