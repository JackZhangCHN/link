const base = require('../utils/base')
const http = require('../utils/http')
const request = require('request')

const host = 'https://drive.google.com/'

const output = (url , ext)=>{
  if( ext == 'mp4' || ext == 'ogg' || ext == 'webm'){
    return `<video src="${url}" controls="controls" autoplay="autoplay"></video>`
  }else if(ext == 'mp3' || ext == 'm4a' ){
    return `<audio src="${url}" controls="controls" autoplay="autoplay"></audio>`
  }
}
module.exports = {

  async link(ctx) {
    let reallink = ''
    let id  = ctx.params.id

    let body_view = await http.get(host + 'file/d/'+id+'/view')

    let ext = (body_view.body.match(/\.([0-9a-z]+)\"><meta property=\"og/) || ['',''])[1]

    let { body , headers }= await http.get(host + 'uc?id='+id+'&export=download')

    if(headers.location){
      reallink = headers.location
    }else{
      let url = (body.match(/uc\?export=download[^"']+/i) || [''])[0]

      let ext = (body.match(/\.(mp4|mp3|wmv|rmvb|gif|png|jpg|jpeg|doc|docx|ppt|pptx)<\/a>/) || ['',''])[1]

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
      ctx.body = {url : reallink , ext ,  status : 0}
    }
    else if(act == 'preview'){
      ctx.body = output(reallink , ext)
    }
    else{
      ctx.redirect( reallink )
    }
  },

  
}