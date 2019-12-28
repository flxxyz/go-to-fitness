const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const log = cloud.logger()
  const { userId } = event
  const { OPENID } = cloud.getWXContext()
  const id = userId || OPENID

  log.info({
    userId: id
  })

  const result = await db.collection('User').doc(id).field({
    nickName: true,
    gender: true,
    language: true,
    country: true,
    province: true,
    city: true,
    avatarUrl: true,
    _id: true,
  }).get()

  log.info({
    user: result.data
  })

  return result.data
}