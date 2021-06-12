const config = require('../../config.json');
const http = require('http');
const https = require('https');
const Log = require('./logger.js');

function getRequest(path) {
	const options = {
		hostname: config.apiLink,
		port: config.apiPort,
		path: path,
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': 'r8YsacsQaSSuwM1MlPMWjRYR4W3cc06TLo2mJmK2OFLG7ctRbDZjFRidX'
		}
	}

	if (config.apiSSL === true) {
		const req = https.request(options, res => {
			res.on('data', d => {
				process.stdout.write(d)
				console.log(d);
				return d;
			})
		})

		req.on('error', error => {
			new Log('API ERROR: ' + error, "api");
			return JSON.stringify({error: true});
		})
		  
		req.end()
	} else {
		const req = http.request(options, res => {
			res.on('data', d => {
				res.on('data', d => {
					return d;
				})
			})
		})

		req.on('error', error => {
			new Log('API ERROR: ' + error, "api");
			return JSON.stringify({error: true});
		})
		  
		req.end()
	}
	
	
	
}

function postRequest(path, data) {
	const options = {
		hostname: config.apiLink,
		port: config.apiPort,
		path: path,
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': data.length,
			'Authorization': 'r8YsacsQaSSuwM1MlPMWjRYR4W3cc06TLo2mJmK2OFLG7ctRbDZjFRidX'
		}
	}

	if (config.apiSSL === true) {
		const req = https.request(options, res => {
			res.on('data', d => {
				return d;
			})
		})

		req.on('error', error => {
			new Log('API ERROR: ' + error, "api");
			return JSON.stringify({error: true});
		})
		  
		req.write(data)
		req.end()
	} else {
		const req = http.request(options, res => {
			res.on('data', d => {
				console.log(d)
				return d;
			})
		})

		req.on('error', error => {
			new Log('API ERROR: ' + error, "api");
			return JSON.stringify({error: true});
		})
		  
		req.write(data)
		req.end()
	}
}

//getRequest('/api/');

module.exports = class apiRequest {
	constructor(type, data = 'aaa0000', token = 'aaa0000') {
		this.type = type;
		if (data === 'aaa0000') {
			this.data = data;
		}
		if (token === 'aaa0000') {
			this.token = token;
		}
		
		if (this.type === "checkAPI") {
			let response = getRequest('/api/');
			console.log(response)
			response = JSON.parse(response);

			if((response.error) && (response.error === true)) return new Log("API check failed.", "api");

		}
	}
}