
const { Router } = require('express')
const router = new Router()
const config = require('config')
const { check, validationResult } = require('express-validator')
const bcryptjs = require('bcryptjs')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const authMiddleware = require('./../middleware/auth.middleware')
const passport = require('passport')
const registration = `/registration`
const login = `/login`
const authorization = '/authorization'
const secretKey = config.get('secretKey')



