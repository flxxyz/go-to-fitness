const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()

  const result = await db.collection('User').where({
    _openid: OPENID,
  }).field({
    nickName: true,
    gender: true,
    language: true,
    country: true,
    province: true,
    city: true,
    avatarUrl: true,
    _id: true,
  }).get()

  if (result.data.length != 0) {
    return result.data[0]
  } else {
    return false
  }
}