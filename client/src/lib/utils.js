import Taro from '@tarojs/taro'
import {URI} from '../constant'

const getUserId = () => {
  return Taro.getStorageSync('userId')
}

const getUserInfo = () => {
  return Taro.getStorageSync('userInfo')
}

const isLogin = () => {
  return !!getUserId() ? true : false
}

/**
 * 获取特定API的URI
 * @param {string} method 
 */
const U = (method) => {
  switch(method) {
    case 'home':
      return `${URI}/home`
      break
    default:
      return URI
  }
}

export {
  getUserId,
  getUserInfo,
  isLogin,
  U,
}
