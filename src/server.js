const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);
  const params = query.parse(parsedUrl.query);

  switch (request.method) {
    case 'GET':
      if (parsedUrl.pathname === '/') {
        // if homepage, send index
        htmlHandler.getIndex(request, response);
      } else if (parsedUrl.pathname === '/style.css') {
        // if stylesheet, send stylesheet
        htmlHandler.getCSS(request, response);
      } else if (parsedUrl.pathname === '/pageScript.js') {
        // if javascript, send javascript
        htmlHandler.getJavascript(request, response);
      } else if (parsedUrl.pathname === '/getKanji') {
        // get the kanji JSON file the client asked for.
        jsonHandler.getKanji(request, response, params);
      } else if (parsedUrl.pathname === '/favorite') {
        // add user information to the kanji's favorite list
        jsonHandler.favorite(request, response, params);
      }
      break;
    default:
      // send 404 in any other case
      jsonHandler.notFound(request, response);
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
