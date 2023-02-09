const http = require("http");

const hostname = "127.0.0.1";
const port = 8000;

// create http-server
const server = http.createServer((req,res)=>{
    //set http-head responve with http status and content type
    res.writeHead(200, {'Contet-Type': 'text/plain'});
    // send respopnse body "Hello world"
    res.end('Hello World\n');
});

// output log wiht server start
server.listen(port,hostname,()=> console.log(`server was started at http://${hostname}:${port}`));