const MemberModel = require('../models/member')
const timeFormate = require('../utlis/formatTime')
const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
})

const registerInit = async (req, res, next) => {
  try {
    const { username, password, nickname } = req.body
    const verificationCode = (Math.floor(Math.random() * 9000) + 1000).toString()

    await MemberModel.createPending({ 
      username, 
      password,
      verification_code: verificationCode,
      verification_expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      verified: false, // 限制會員功能
      nickname, 
      created_at: timeFormate(new Date()) 
    })

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: username,
      subject: '註冊驗證碼',
      text: `您的驗證碼是：${verificationCode}，24小時內有效`
    })

    res.status(200).json({ message: '驗證碼已發送至郵箱' })
  } catch (error) {
    console.error('註冊錯誤：', error)
    next(error)
  }
}

const verifyEmail = async (req, res, next) => {
  try {
    const { userId, code } = req.body
    const result = await MemberModel.verifyCode(userId, code)
    if (!result) {
      return res.status(400).json({ message: '驗證碼無效或已過期' })
    }
    res.status(200).json({ message: '註冊成功' })
  } catch (error) {
    console.error('驗證錯誤：', error)
    next(error)
  }
}

module.exports = {
  registerInit,
  verifyEmail
}