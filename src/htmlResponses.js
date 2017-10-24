const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);
// for easier debugging purposes, I made the client's script page a separate file 
const pageScript = fs.readFileSync(`${__dirname}/../client/pageScript.js`);
const background = fs.readFileSync(`${__dirname}/../client/images/0060-white-rice-paper-texture-seamless.jpg`);
const kokoro = fs.readFileSync(`${__dirname}/../client/font/Kokoro.otf`);

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
  response.writeHead(200, { 'Content-Type': 'text/javascript' });
  response.write(pageScript);
  response.end();
};

const getImage = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'image/jpeg' });
  response.write(background);
  response.end();
};

const getKokoro = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'font/otf' });
  response.write(kokoro);
  response.end();
};

module.exports = { getIndex, getCSS, getJavascript, getImage, getKokoro };
