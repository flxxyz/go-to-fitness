const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

exports.main = async (event) => {
  const log = cloud.logger()
  const { nickName, gender, language, country, province, city, avatarUrl } = event
  const { OPENID, APPID, UNIONID } = cloud.getWXContext()

  const data = {
    nickName,
    gender,
    language,
    country,
    province,
    city,
    avatarUrl,
    _id: OPENID,
  }

  const user = await cloud.callFunction({
    name: 'getUser',
    data: {
      userId: OPENID,
    }
  })

  log.info({ user })

  if (user.result) {
    return user.result
  } else {
    try {
      return await db.collection('User').add({ data })
    } catch (err) {
      log.error({ err })
      return false
    }
  }
}