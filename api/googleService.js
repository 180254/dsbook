"use strict";
const fs = require("fs");
var gsjson = require('google-spreadsheet-to-json');
const auth = require("./auth");
var creds;
try {
    creds = require('../Dsbook-a7c5a83926c6.json');
} catch(err) {
    creds = null;
}

var google = require('googleapis');

let config = {};

const initConfig = function () {
    const gConfig = JSON.parse(fs.readFileSync(__dirname + "/../config.json", "utf8"));
    config = gConfig["googleService"];
};

exports.initConfig = initConfig;
exports.GetJsonWorkSheet = GetJsonWorkSheet;

 function GetJsonWorkSheet(req, res, next) {
	 auth.verifyReqTokenAsync(req, res, next, undefined).then((accInfo) => {
		if(!creds) {
			return [];
		}

		var jwtClient = new google.auth.JWT(
		  creds.client_email,
		  null,
		  creds.private_key,
		  [config.scope],
		  null
		);

		jwtClient.authorize(function (err, tokens) {
		  if (err) {
			console.log(err);
			return;
		  }

			gsjson({
				spreadsheetId: config.sheetID,
				token: tokens.access_token,
				user: creds.client_email
				})
			.then(function(result) {
				return res.send(result);
			})
			.catch(function(err) {
				console.log(err.message);
				console.log(err.stack);
			})
			});
		    }, (err) => {
        console.log("AssertionError(U0, " + err + ")");
    })
 }

  
