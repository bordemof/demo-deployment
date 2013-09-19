'use strict';

/**
 * Load test the server.
 * (C) 2013 Alex Fernández.
 */


// requires
var loadtest = require('loadtest');
var testing = require('testing');
var Log = require('log');
var server = require('./server.js');

// globals
var log = new Log('info');

// constants
var TEST_PORT = 12321;


/**
 * Run a load test.
 */
function testLoad(callback)
{
	server.start(TEST_PORT, function(error)
	{
		var options = {
			url: 'http://localhost:' + TEST_PORT + '/8',
				maxRequests: 1000,
			concurrency: 100,
			method: 'POST',
			body: {
				hi: 'there',
			},
		};
		loadtest.loadTest(options, function(error, result)
		{
			if (error)
			{
				return callback(error);
			}
			log.info(JSON.stringify(result));
			server.stop(callback);
		});
	});
}

/**
 * Run all tests.
 */
exports.test = function(callback)
{
	testing.run({
		load: testLoad,
	}, 2000, callback);
}

// start load test if invoked directly
if (__filename == process.argv[1])
{
	exports.test(testing.show);
}
