/**
 * Sprint One Full Stack Development
 *
 * Group: Cameron, Jordan, Nathan
 *
 * Semester: Winter 2023
 *
 */

global.DEBUG = false;
const http = require("http");
const fs = require("fs");
const { parse } = require("querystring");
const { newToken, tokenCount } = require("./token");

const server = http.createServer(async (req, res) => {
  let path = "./views/";
  switch (req.url) {
    case "/":
      path += "index.html";
      res.statusCode = 200;
      fetchFile(path);
      break;
    case "/new":
      if (req.method === "POST") {
        collectRequestData(req, (result) => {
          var theToken = newToken(result.username);
          res.write(`
                    <!doctype html>
                    <html>
                    <head>
                    <style>
                    a{
                      font-size: 32px;
                    }
                    </style>
                   
                    </head>
                    <body>
                        ${result.username} token is ${theToken} <br />
                        <a href="http://localhost:3000">[home]</a>
                    </body>
                    </html>
                `);
          res.end();
        });
      } else {
        path += "newtoken.html";
        res.statusCode = 200;
        fetchFile(path);
      }
      break;
    case "/count":
      var theCount = await tokenCount();
      res.end(`
                <!doctype html>
                <html>
                <body>
                    Token count is ${theCount} <br />
                    <a href="http://localhost:3000">[home]</a>
                </body>
                </html>
            `);
    default:
      break;
  }

  function fetchFile(path) {
    fs.readFile(path, function (err, data) {
      if (err) {
        console.log(err);
        res.end();
      } else {
        if (DEBUG) console.log("file was served.");
        res.writeHead(res.statusCode, { "Content-Type": "text/html" });
        res.write(data);
        res.end();
      }
    });
  }
});
server.listen(3000);
console.log("Running on port 3000")

function collectRequestData(request, callback) {
  const FORM_URLENCODED = "application/x-www-form-urlencoded";
  if (request.headers["content-type"] === FORM_URLENCODED) {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk.toString();
    });
    request.on("end", () => {
      callback(parse(body));
    });
  } else {
    callback(null);
  }
}
