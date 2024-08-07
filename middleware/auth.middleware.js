const jwt = require('jsonwebtoken')
const config = require('config')
const secretKey = config.get('secretKey')


module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next()
    }
    try {
        const token = req.headers.authorization.split(' ')[1]

        if (!token) {
            return res.status(400).json({ message: 'authorization', error })
        }
        const decoded = jwt.verify(token, secretKey)
        req.user = decoded
        next()
    } catch (error) {
        res.status(400).json({ message: 'middleware error', error })
    }
}