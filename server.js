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
                        *{
                          padding: 0;
                          margin: 0;
                          box-sizing: border-box;
                        }

                        body {
                          background: rgb(2, 0, 36);
                          background: linear-gradient(
                            90deg,
                            rgba(2, 0, 36, 1) 0%,
                            rgba(9, 9, 121, 1) 35%,
                            rgba(0, 212, 255, 1) 100%
                          );
                          padding: 0;
                          margin: 0;
                        }

                        header {
                          size: 30px;
                          font-size: 25px;
                          background-color: black;
                          color: white;
                          font-family: 'Poppins', sans-serif;
                          padding: 10px;
                        }
                  
                        #headerLink {
                          text-decoration: none;
                          color: white;
                          padding: 5;
                        }

                        a:hover {
                          font-size: 40px;
                        }

                        div {
                          color: white;
                          display: flex;
                          justify-content: center;
                          padding-top: 10vh;
                          font-size: 40px;
                        }
                      </style>
                    </head>
                    <body>
                    <header>
                    <a id="headerLink" class="home" href="http://localhost:3000">Home</a>
                    </header>
                    <div>
                        ${result.username} token is ${theToken} 
                    </div>
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
                <head>
                  <style>
                *{
                  padding: 0;
                  margin: 0;
                  box-sizing: border-box;
                }

                body {
                  background: rgb(2, 0, 36);
                  background: linear-gradient(
                    90deg,
                    rgba(2, 0, 36, 1) 0%,
                    rgba(9, 9, 121, 1) 35%,
                    rgba(0, 212, 255, 1) 100%
                  );
                  padding: 0;
                  margin: 0;
                }

                header {
                  size: 30px;
                  font-size: 25px;
                  background-color: black;
                  color: white;
                  font-family: 'Poppins', sans-serif;
                  padding: 10px;
                }
          
                #headerLink {
                  text-decoration: none;
                  color: white;
                  padding: 5;
                }

                a:hover {
                  font-size: 40px;
                }

                div {
                  color: white;
                  display: flex;
                  justify-content: center;
                  padding-top: 10vh;
                  font-size: 40px;
                }
                </style>
              </head>
                <body>
                <header>
                    <a id="headerLink" class="home" href="http://localhost:3000">Home</a>
                </header>
                <div>
                    Token count is ${theCount} <br />
                    <div>
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
console.log("Running on port 3000");

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
