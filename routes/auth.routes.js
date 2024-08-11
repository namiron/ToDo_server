
const { Router } = require('express')
const router = new Router()
const config = require('config')
const { check, validationResult } = require('express-validator')
const bcryptjs = require('bcryptjs')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const authMiddleware = require('./../middleware/auth.middleware')
const registration = `/registration`
const login = `/login`
const authorization = '/authorization'
const secretKey = config.get('secretKey')



router.post(registration, [
    check('email', 'email is not valid').isEmail(),
    check('password', 'password mast be longer 3 and shorter 12').isLength({ min: 3, max: 12 })
],
    async (req, res) => {
        try {
            const isError = validationResult(req)
            if (!isError.isEmpty()) {
                return res.status(400).json({ message: 'data is not correct' })
            }
            const { email, password, name, surname, avatar } = req.body

            const candidate = await User.findOne({ email })
            if (!candidate) {
                res.status(404).json({ message: 'user not found' })
            }
            const hashPassword = await bcryptjs.hash(password, 8)

            const user = new User({ email, name, surname, avatar, password: hashPassword })
            const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: '1h' })

            await user.save()
            return res.json({
                token,
                user: {
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar,
                    surname: user.surname,
                }
            })
        } catch (error) {
            return res.status(400).json({ message: 'error to registration', error })
        }
    }
)

router.post(login,
    async (req, res) => {
        try {
            const { email, password } = req.body
            const candidate = await User.findOne({ email })
            if (!candidate) {
                res.status(404).json({ message: 'user not found' })
            }

            const isPasswordValid = bcryptjs.compareSync(password, candidate.password)
            if (!isPasswordValid) {
                res.status(400).json({ message: 'password not valid' })
            }
            const token = jwt.sign({ id: candidate.id }, secretKey, { expiresIn: '1h' })
            return res.json({
                token,
                user: {
                    name: candidate.name,
                    email: candidate.email,
                    avatar: candidate.avatar,
                    surname: candidate.surname,
                }
            })
        } catch (error) {
            res.status(400).json({ message: 'error to login', error })
        }
    }
)


router.get(authorization, authMiddleware,
    async (req, res) => {
        try {
            const user = await User.findOne({ _id: req.user.id })
            const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: '1h' })
            return res.json({
                token,
                user: {
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar,
                    surname: user.surname,
                }
            })
        } catch (error) {
            res.status(400).json({ message: 'error to authorization', error })

        }
    }
)


module.exports = router