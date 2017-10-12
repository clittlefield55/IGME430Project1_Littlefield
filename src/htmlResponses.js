const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);
// for easier debugging purposes, I made the client's script page a separate file 
const pageScript = fs.readFileSync(`${__dirname}/../client/pageScript.js`);

// return the HTML index page
const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

// return the CSS style
const getCSS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(css);
  response.end();
};

// return the Javascript script file
const getJavascript = (request, response) => {
  response.writeHead(200, {'Content-Type': 'text/javascript'});
  response.write(pageScript);
  response.end();
};

module.exports = { getIndex, getCSS, getJavascript};
