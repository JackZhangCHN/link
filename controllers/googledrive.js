const base = require('../utils/base')
const http = require('../utils/http')
const request = require('request')

const host = 'https://drive.google.com/'

module.exports = {

  async link(ctx) {
    let reallink = ''
    let id  = ctx.params.id
    let { body , headers }= await http.get(host + 'uc?id='+id+'&export=download')
    if(headers.location){
      reallink = headers.location
    }else{
      let url = (body.match(/uc\?export=download[^"']+/i) || [''])[0]

      url = url.replace(/&amp;/g,'&')

      let cookie = headers['set-cookie'].join('; ')

      ///uc?export=download&confirm=uIJj&id=0B0vQvfdCBUFjOXM1UXV0MHhkeGM
      let resp = await http.get(host + url , {'Cookie':cookie})

      if(resp.headers && resp.headers.location){
        reallink = resp.headers.location
      }
    }
    
    let act = ctx.query.output

    if( act == 'proxy' ){
      ctx.body = ctx.req.pipe(request(reallink))
    }
    else if(act == 'raw'){
      ctx.body = reallink
    }
    else if(act == 'json'){
      ctx.body = {url : reallink , status : 0}
    }
    else{
      ctx.redirect( reallink )
    }
  },

  
}