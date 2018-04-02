const router = require('koa-router')()

const home = require('./home')

const api = require('./api')


router.use('', api.routes(), api.allowedMethods())

// router.use('/' , home.routes(), home.allowedMethods())

module.exports = router
