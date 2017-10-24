const crypto = require('crypto');
const fs = require('fs');

const custom = { kanjiSet: [] };
const customKeys = {};
let keyCount = 0;

let etag = crypto.createHash('sha1').update(JSON.stringify(custom));
let digest = etag.digest('hex');

const respondJSON = (request, response, status, object) => {
  const headers = {
    'Content-Type': 'application/json',
    etag: digest,
  };

  response.writeHead(status, headers);
  response.write(JSON.stringify(object));
  response.end();
};


const respondJSONMeta = (request, response, status) => {
  const headers = {
    'Content-Type': 'application/json',
    etag: digest,
  };

  response.writeHead(status, headers);
  response.end();
};

// gets a set of kanji from the directory
const getKanji = (request, response, params) => {
  if (params.set) {
    try {
      const kanjiObj = fs.readFileSync(`${__dirname}/kanjiJSON/${params.set}`);
      // if the set is available, create a response object
      const responseJSON = JSON.parse(kanjiObj);

      respondJSON(request, response, 200, responseJSON);
    } catch (filenotfound) {
      const object = {
        message: 'kanji set not available',
        id: 'filenotfound',
      };
      respondJSON(request, response, 404, object);
    }
  } else {
    const object = {
      message: 'kanji set not available',
      id: 'filenotfound',
    };
    respondJSON(request, response, 404, object);
  }
};

// returns only the header data
const getKanjiMeta = (request, response, params) => {
  if (params.set) {
    try {
      fs.readFileSync(`${__dirname}/kanjiJSON/${params.set}`);
      // if the set is available, report success
      respondJSONMeta(request, response, 200);
    } catch (filenotfound) {
      respondJSONMeta(request, response, 404);
    }
  } else {
    respondJSONMeta(request, response, 404);
  }
};

// gets the custom set
const getCustomKanji = (request, response) => {
  if (request.headers['if-none-match'] === digest) {
    return respondJSONMeta(request, response, 304);
  }

  if (request.method === 'GET') {
    return respondJSON(request, response, 200, custom);
  }
  return respondJSONMeta(request, response, 200);
};

// adds a user-created kanji entry to the custom set
const addKanji = (request, response, params) => {
  const responseJSON = {
    message: 'Created successfully',
    id: 'create',
  };

  if (!params.character || !params.meaning) {
    responseJSON.message = 'The character and meaning field is the minimum data required for an entry';
    responseJSON.id = 'badRequest';
    return respondJSON(request, response, 400, responseJSON);
  }

  if (customKeys[params.character] !== undefined) {
    const id = customKeys[params.character];
    const replace = custom.kanjiSet[id];

    if (params.meaning) {
      const mean = params.meaning.replace(' ', '');
      replace.meaning = mean.split(',');
    }

    if (params.onyomi) {
      const on = params.onyomi.replace(' ', '');
      replace.onyomi = on.split(',');
    }

    if (params.kunyomi) {
      const kun = params.kunyomi.replace(' ', '');
      replace.kunyomi = kun.split(',');
    }

    if (params.strokes) {
      replace.kunyomi = params.strokes;
    }

    responseJSON.message = ' ';
    responseJSON.id = 'updated';
    custom.kanjiSet[id] = replace;

    etag = crypto.createHash('sha1').update(JSON.stringify(custom));
    digest = etag.digest('hex');

    return respondJSON(request, response, 204, responseJSON);
  }

  // in case the user uses whitespace in the text fields, we need to take that out
  // https://stackoverflow.com/questions/10800355/remove-whitespaces-inside-a-string-in-javascript
  const newMean = params.meaning.replace(' ', '');
  const newOn = params.onyomi.replace(' ', '');
  const newKun = params.kunyomi.replace(' ', '');

  const kanji = {
    id: (keyCount + 1),
    character: params.character,
    meaning: newMean.split(','),
    onyomi: newOn.split(','),
    kunyomi: newKun.split(','),
    strokes: params.strokes,
  };

  custom.kanjiSet.push(kanji);
  customKeys[params.character] = keyCount;
  keyCount++;

  etag = crypto.createHash('sha1').update(JSON.stringify(custom));
  digest = etag.digest('hex');
  return respondJSON(request, response, 201, responseJSON);
};

const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  return respondJSON(request, response, 404, responseJSON);
};

const notFoundMeta = (request, response) => respondJSON(request, response, 404);

module.exports = { getKanji, getKanjiMeta, getCustomKanji, addKanji, notFound, notFoundMeta };
