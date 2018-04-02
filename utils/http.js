const request = require('request')
const base = require('./base')

module.exports = {
	get(url , headers){
		
    let opts = {
    	url , followRedirect : false
    }
    if(headers){
    	opts.headers = headers
    }

		return new Promise(function (resolve, reject) {
			request(opts, function(error, response, body){
          resolve(response)
		    })
		})
	}
}


