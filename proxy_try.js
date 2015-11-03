var http      = require('http');
var httpProxy = require('http-proxy');
var exec = require('child_process').exec;
var redis = require('redis');
//var request = require("request");

var TARGET;
//var servers;
var n = 3;

var child_processes = [];
var client = redis.createClient(6379, '127.0.0.1', {});

var 

for(var i=0; i<n ; i++) {
  var port_num = 3000+i;
  console.log(port_num);

   var child = exec('node main.js '+port_num, function(err, out, code) 
    {
      console.log("attempting to launch server "+port_num);
      if (err instanceof Error)
            throw err;
      if( err )
      {
        console.error( err );
      }
    });

   var addr = {
    host: 'localhost',
    port: port_num
   };

   console.log(addr);
   client.rpush(['nodes3', addr], function(err, value) {console.log(value);});

   child_processes.push(child);
}


//client.rpush(['servers', server_list], function(err, value) {console.log(value);});

// Accept input from user

// Setup child proesses using exec

// Push all the URLs to Redis

// Then when you accept a request on the LoadBalancer, pop a URL from redis queue and redirect the request to that URL

// Again push the URL to redis 



    // Proxy.
    var options = {};
    //var proxy   = httpProxy.createServer(options);


// var server  = httpProxy.createServer(function(req, res, proxy) {

//   // client.lpop('nodes3', function(err, port){

//   //     if (err) throw err;
//   //     TARGET = port;
//   //     console.log(port);
//   //     console.log(JSON.stringify(TARGET, null, 4));
//   //     proxy.proxyRequest(req, res, TARGET);

//   // });
//       proxy.proxyRequest(req, res, {
//         host:'localhost',
//         port:3000
//       });
// });
    
// 
// Create a proxy server with custom application logic 
// 
var proxies = [];
var x = httpProxy.createProxyServer({
  target: { host: 'localhost',
    port: 3000}
});
proxies.push(x);

  // 
  // Put your custom server logic here 
  // 
var server = http.createServer(function (req, res) {
  
  proxies[0].web(req, res);
}).listen(8080);

//server.listen(8080);

function tear()
  {
    //console.log(child_processes);

for(var r=0; r<n ; r++)
{
  child_processes[r].kill();
  
}
process.exit();
  }




// Make sure to clean up.
process.on('exit', function(){tear();} );
process.on('SIGINT', function(){tear();} );
process.on('uncaughtException', function(err){
  console.error(err);
  tear();} );



