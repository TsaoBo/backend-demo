const express = require('express')
const router = express.Router()
const { OAuth2Client } = require('google-auth-library')

// 流程
// 1 前端點登入時，發請求到後端，由後端取得前往 google 登入的網址，再把網址傳給前端
// 2 完成 google 登入後，導回後端 (google後台設定導回 url)
// 3 後端拿到 authorization code 再跟 google 要會員資料
// 4 產生後端自己的 token 給前端，再導回前端頁面 

router.get('/login/google', (req, res) => {
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code&scope=profile email`
  res.redirect(url)
})
// 
router.get('/google/callback', async (req, res) => {
  const { code } = req.query

  try {
    const { data } = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      redirect_uri: process.env.REDIRECT_URI,
      grant_type: 'authorization_code',
    })

    const { id_token } = data

    const client = new OAuth2Client(process.env.CLIENT_ID)
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.CLIENT_ID,
    })
    const payload = ticket.getPayload()
    console.log('google會員資料：', payload)
    // const userId = payload.sub
    // const email = payload.email

    // // 生成自己的 Token
    // const myToken = jwt.sign({ userId, email }, SECRET_KEY, { expiresIn: '1h' })

    // res.redirect(`http://your-frontend.com?token=${myToken}`)
  } catch (error) {
    res.status(401).send('google登入失敗')
  }
})

module.exports = router
