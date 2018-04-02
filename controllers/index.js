const service = require('./../models/gdlink')

module.exports = async ( ctx , next ) => {
  await ctx.render('index')
}