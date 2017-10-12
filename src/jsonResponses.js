const crypto = require('crypto');
const fs = require('fs');
// load the entire kanji directory from a single JSON file
const kanjiDir = JSON.parse(fs.readFileSync(`${__dirname}/kanjiJSON/sets.json`));
// this array is the minimum index and maximum index for each set in the directory
const index = [{ min: 0, max: 15 }, // set 1
  {}, // set 2
  {}, // set 3
  {}, // set 4
  {}, // set 5
  {}, // set 6
  {}, // set 7
  {}, // set 8
  {}, // set 9
  { min: 131, max: 145 }, // set 10
];
const users = {};

const etag = crypto.createHash('sha1').update(JSON.stringify(users));
const digest = etag.digest('hex');

const respondJSON = (request, response, status, object) => {
  const headers = {
    'Content-Type': 'application/json',
    etag: digest,
  };

  response.writeHead(status, headers);
  response.write(JSON.stringify(object));
  response.end();
};

/*
const respondJSONMeta = (request, response, status) => {
  const headers = {
    'Content-Type': 'application/json',
    etag: digest,
  };

  response.writeHead(status, headers);
  response.end();
};
*/

// gets a set of kanji from the directory
const getKanji = (request, response, params) => {
  if (params.set) {
    const kanjiObj = { kanjiSet: [] };

    // if the set is available, create a response object
    if (index[params.set]) {
      for (let i = index[params.set].min; i < index[params.set].max; i++) {
        kanjiObj.kanjiSet.push(kanjiDir.kanjiSet[i]);
      }

      respondJSON(request, response, 200, kanjiObj);
    } else {
      const object = {
        message: 'kanji set not available',
        id: 'filenotfound',
      };
      respondJSON(request, response, 404, object);
    }
  }
};

// future feature using an ajax 'POST' request
/*
const favorite = (request, response, params) => {

};
*/

module.exports = { getKanji };
