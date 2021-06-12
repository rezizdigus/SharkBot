const mysql = require('mysql');
const Log = require('./logger.js');
const config = require('../../config.json');

function errorHandler(err) {
	new Log(`MariaDB :: Error occured while performing an action: ${err}`,'error');
	new Log(`MariaDB :: Error Stack: ${err.stack}`,'debug');
}

module.exports = class Database {
	constructor (client) {
		this.client = client;
		this.connection = mysql.createConnection(this.client.config.dbInfo);

		this.connection.connect(function(err) {
			if(err) {
				errorHandler(err);
			}
		});

		this.connection.on('error', (err) => {
			errorHandler(err);
		})
	}

	async CheckIfVerified(uid) {
		return new Promise((resolve, reject) => {
			
			let response = "n/a";

			this.connection.query(`SELECT * FROM userdata WHERE uid = ?`, [uid], (err, rows, meta) => {
				if (err) return errorHandler(err);
				if (!rows[0]) {
					response = { status: 'none' };
				} else {
					response = { status: 'found', data: rows[0] };
				}
			})

			setTimeout(() => {
				resolve(response);
			},2000)
		});
	}

	async InsertUser(uid, rid, username) {
		return new Promise((resolve, reject) => {
			
			let response = "n/a";

			this.connection.query(`SELECT * FROM userdata WHERE uid = ?`, [uid], (err, rows, meta) => {
				if (err) return errorHandler(err);
				if (!rows[0]) {
					response = { status: 'none' };
				} else {
					response = { status: 'found', data: rows[0] };
				}
			})

			setTimeout(() => {
				resolve(response);
			},2000)
		});
	}
}