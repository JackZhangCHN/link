/*
 * api 路由
 */
const router = require('koa-router')()

const gd = require('./../controllers/googledrive')


const routers = router
    .get('/gd/:id' , gd.link)
    
module.exports = routers
