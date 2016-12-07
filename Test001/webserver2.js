const http = require('http');
const hostname = '127.0.0.1';
const port = 1337;

// http;createServer((req, res) =>
// {
//   res.writeHead(200, {'Content-Type' : 'text/plain'});
//   res.end('<h2>Hello World</h2>\n');
// }).listen(port, hostname, () =>
// {
//   console.log(`Server runnig at http://${hostname}:${port}/`);
// });

var server = http.createServer(function(req, res)
{
  res.writeHead(200, {'Content-Type' : 'text/plain'});
  res.end('Hello World\n');
});
server.listen(port, hostname, function()
{
  console.log(`Server runnig at http://${hostname}:${port}/`);
});
