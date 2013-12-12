'use strict';

/**
 * A demo server.
 * (C) 2013 Alex Fernández.
 */


// requires
var testing = require('testing');
var http = require('http');
var url = require('url');
var Log = require('log');

// globals
var log = new Log('info');
var server;

// constants
var PORT = 12322;

/**
 * Start the server.
 */
exports.start = function(port, callback)
{
	if (typeof port == 'function')
	{
		callback = port;
		port = null;
	}
	if (callback)
	{
		log = new Log('notice');
	}
	port = port || PORT;
	server = http.createServer(serve);
	server.on('error', function(error)
	{
		var message = 'Could not start server on port ' + port + ': ' + error;
		if (error.code == 'EADDRINUSE')
		{
			message = 'Port ' + PORT + ' in use, please free it and retry again';
		}
		if (callback)
		{
			return callback(message);
		}
		log.error(message);
	});
	server.listen(port, function()
	{
		log.info('Listening on port %s', port);
		if (callback)
		{
			callback();
		}
	});
	return server;
};

/**
 * Serve a request.
 */
function serve(request, response)
{
	log.info('URL is: %s', request.url);
	var path = url.parse(request.url).path;
	response.end(addPath(path).toString());
}

/**
 * Add all numbers in a path.
 */
function addPath(path)
{
	var pieces = path.split('/');
	var result = 0;
	pieces.forEach(function(piece)
	{
		if (parseInt(piece))
		{
			result += parseInt(piece);
		}
	});
	return result;
}

/**
 * Test for add path.
 */
function testAddPath(callback)
{
	testing.assertEquals(addPath('/5/4'), 11, 'Invalid sum', callback);
	testing.assertEquals(addPath('/me/4'), 4, 'Invalid sum with letters', callback);
	testing.success(callback);
}

/**
 * Stop the server.
 */
exports.stop = function(callback)
{
	server.close(callback);
};

/**
 * Run all tests.
 */
exports.test = function(callback)
{
	testing.run({
		addPath: testAddPath,
	}, callback);
};

// start tests if invoked directly
if (__filename == process.argv[1])
{
	exports.test(testing.show);
}

