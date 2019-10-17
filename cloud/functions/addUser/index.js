const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

exports.main = async (event) => {
  const { nickName, gender, language, country, province, city, avatarUrl } = event
  const { OPENID, APPID, UNIONID } = cloud.getWXContext()

  const user = await cloud.callFunction({
    name: 'getUser'
  })

  if (user) {
    return user.result
  } else {
    try {
      return await db.collection('User').add({
        data: {
          nickName: nickName,
          gender: gender,
          language: language,
          country: country,
          province: province,
          city: city,
          avatarUrl: avatarUrl,
          _openid: OPENID,
        }
      })
    } catch (err) {
      console.error(err)
      return false
    }
  }
}