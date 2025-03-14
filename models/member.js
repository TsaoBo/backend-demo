const db = require('../config/db')

class MemberModel {

	static async checkExisting(username) {
		const [rows] = await db.query('select * from users where username = ?', [username])
		return rows.length > 0
	}

	static async createPending(userData) {
		const {
			username,
			password,
			nickname,
			created_at,
			verification_code,
			verification_expires,
			verified
		} = userData
		const isExist = await this.checkExisting(username)
		if(isExist) throw new Error('帳號已存在')
		const [result] = await db.query(
			`INSERT INTO users (
				username, 
				password, 
				nickname, 
				created_at, 
				verification_code, 
				verification_expires, 
				verified
			) VALUES (?, ?, ?, ?, ?, ?, ?)`,
			[
				username, 
				password, 
				nickname, 
				created_at, 
				verification_code, 
				verification_expires, 
				verified
			]
		)
		return result
	}

	static async verifyCode(userId, code) {
		const [rows] = await db.query(
			'select * from users where id = ? and verification_code = ? and verification_expires > now() and verified = 0',
			[userId, code]
		)
		if (rows.length === 0) return false
		await db.query(
			'update users set verified = 1, verification_code = null where id = ?',
			[userId]
		)
		return true
	}
}

module.exports = MemberModel