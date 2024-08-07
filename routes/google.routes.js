
const { Router } = require('express')
const router = new Router()
const config = require('config')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const registration = `/registration`
const secretKey = config.get('secretKey')
const baseUrl = config.get('BASE_URL')

router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
    passport.authenticate('google', {
        successRedirect: baseUrl,
        failureRedirect: registration
    }),
    (req, res) => {

        res.json(req.user);
    });
router.get('/login/failed', (req, res) => {
    res.status(401).json({
        success: false,
        message: 'auth error'
    })
})

router.get('/login/success', (req, res) => {

    if (req.user) {
        const token = jwt.sign({ id: req.user.id }, secretKey, { expiresIn: '1h' })
        res.status(200).json({
            success: true,
            message: 'success well',
            user: req.user,
            token,
        })
    }
})
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect(registration)
})

module.exports = router