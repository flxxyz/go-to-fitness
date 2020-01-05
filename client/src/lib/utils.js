import Taro from '@tarojs/taro'
import {
  HEWEATHER_KEY
} from '../constant'

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
 * 生成url的请求字符串
 * @param {Object} obj 
 */
const httpBuildQuery = (obj) => {
  const params = []
  Object.keys(obj).map(key => {
    params.push(`${key}=${obj[key]}`)
  })

  return params.join('&')
}

/**
 * 获取特定API的URI
 * @param {string} method 
 */
const U = (method) => {
  switch (method) {
    case 'weather':
      const params = {
        location: 'auto_ip',
        key: HEWEATHER_KEY,
      }
      return 'https://free-api.heweather.net/s6/weather/forecast?' + httpBuildQuery(params)
    default:
      return false
  }
}

const ENV = Taro.getEnv()

const delay = (delayTime = 500) => {
  return new Promise(resolve => {
    if (ENV === Taro.ENV_TYPE.WEB) {
      setTimeout(() => {
        resolve()
      }, delayTime)
      return
    }
    resolve()
  })
}

export {
  getUserId,
  getUserInfo,
  isLogin,
  U,
  delay,
}
