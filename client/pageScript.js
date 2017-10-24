var sendButton;
var testButton;
var formButton;
var setSelector;
var content;
var statusField;

// format the requested kanji set into a readable format
const displayKanji = (kanji) => {
    var group = "";
    var set = kanji.kanjiSet;

    for(var i = 0; i<set.length; i++){
        group += "<div class='kanji'><div class='kanjiSymbol'>";
        group += `<p>${set[i].id}</p>`;
        group += `<b class='symbol'>${set[i].character}</b><br/><p>`;
        for(var j = 0; j < set[i].meaning.length; j++){
            if(j == 0){
                group += `${set[i].meaning[j]}`;
            }
            else{
                group += `, ${set[i].meaning[j]}`;
            }
        }
        group += `<br />Number of Strokes: ${set[i].strokes}`;
        group += `</p></div>`;
        // set up a section for the kanji readings
        group += `<div class='kanjiMeaning'>`;
        // there is one case where a kanji in a set has no reading,
        // so we need to account for that (it's in set 10)
        if(set[i].onyomi || set[i].kunyomi){
            group += `</p>Readings: `;
            if(set[i].onyomi){
                group += `<br /> On-Yomi: `
                for(var j = 0; j < set[i].onyomi.length; j++){
                    if(j == 0){
                        group += `${set[i].onyomi[j]}`;
                    }
                    else{
                        group += `, ${set[i].onyomi[j]}`;
                    }
                }
            }
            if(set[i].kunyomi){
                group += `<br /> Kun-Yomi: `
                for(var j = 0; j < set[i].kunyomi.length; j++){
                    if(j == 0){
                        group += `${set[i].kunyomi[j]}`;
                    }
                    else{
                        group += `, ${set[i].kunyomi[j]}`;
                    }
                }
            }
            group += `</p>`;
        }
        group += `</div></div>`;
    }

    content.innerHTML = group;
};

const respond = (xhr, meta) =>{
    switch(xhr.status) {
        case 200:
            statusField.innerHTML = "<b class='gotIt'>Success!</b>";
          if(meta){
            // nothing, the header information is already displayed
          } else {
            const jsonRes = JSON.parse(xhr.response);
            displayKanji(jsonRes);
          }
          break;
        case 201:
            jsonRes = JSON.parse(xhr.response);
            buildResponse(xhr.status, jsonRes);
            break;
        case 204:
            buildResponse(xhr.status);
            break;
        case 304:
            buildResponse(xhr.status);
            break;
        case 400:
            jsonRes = JSON.parse(xhr.response);
            buildResponse(xhr.status, jsonRes);
            break;
        case 404:
          if(meta){
            buildResponse(xhr.status)
          } else {
            jsonRes = JSON.parse(xhr.response);
            buildResponse(xhr.status, jsonRes);
          }
          break;
        default:
          statusField.innerHTML =  `Error code not implemented by client.`;
          break;
    }
};

// AJAX GET request for a kanji set
const sendKanjiRequest = (url) => {
    clear();
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.setRequestHeader("ACCEPT", "application/json");
    
    xhr.onload = () => respond(xhr, false);
    xhr.send();
};

// AJAX HEAD request for a kanji set
const testKanjiRequest = (url) => {
    clear();
    const xhr = new XMLHttpRequest();
    xhr.open('HEAD', url);
    xhr.setRequestHeader("ACCEPT", "application/json");
    
    xhr.onload = () => respond(xhr, true);
    xhr.send();
};

// writes an imput form to the content div
const writeForm = () => {
    var formString = '<form id="newKanjiForm">';
    formString += 'Kanji Character: <input id="char" type="text" name="character" maxlength="1"><br>';
    formString += 'Meaning: <input id="mean" type="text" name="meaning"><br>';
    formString += 'On-Yomi Reading: <input id="on" type="text" name="onyomi"><br>';
    formString += 'Kun-Yomi Reading: <input id="kun" type="text" name="kunyomi"><br>';
    formString += 'Number of Strokes: <input id="str" type="number" name="strokes" min="0" max="100" step="1"><br>';
    formString += '<input type="submit" value="Submit">';
    formString += '</form>';

    content.innerHTML = formString;

    const kForm = document.querySelector("#newKanjiForm");
    const sendKanji = (e) => sendNewKanji(e, kForm);
    
    kForm.addEventListener('submit', sendKanji);
};

// clears content field
const clear = () => {
    content.innerHTML = '';
}

// method to send a new Kanji character
const sendNewKanji = (e, kanjiForm) => {
    const xhr = new XMLHttpRequest();
    var url = `/sendKanji?character=${kanjiForm.querySelector('#char').value}`;
    url += `&meaning=${kanjiForm.querySelector('#mean').value}`;
    url += `&onyomi=${kanjiForm.querySelector('#on').value}`;
    url += `&kunyomi=${kanjiForm.querySelector('#kun').value}`;
    url += `&strokes=${kanjiForm.querySelector('#str').value}`;
    xhr.open('POST', url);
    xhr.setRequestHeader("ACCEPT", "application/json");
    
    xhr.onload = () => respond(xhr, false);
    xhr.send();

    e.preventDefault();
};

// generates an response code message
const buildResponse = (code, obj) => {
    var html = `<b>Code ${code} `;
    if(obj){
        if(obj.id){
            html += `: ${obj.id}`;
        }
        
        html += '</b><br />'
        if(obj.message){
            html += `Message: ${obj.message}.`;
        }
    }
    
    statusField.innerHTML =  html;
};

// initialize function
const init = () =>{
    sendButton = document.querySelector("#send");
    testButton = document.querySelector("#test");
    formButton = document.querySelector("#form");
    setSelector = document.querySelector("#set");
    content = document.querySelector("#content");
    statusField = document.querySelector("#status");

    sendButton.addEventListener('click', function(){
        sendKanjiRequest(setSelector.value);
    });
    testButton.addEventListener('click', function(){
        testKanjiRequest(setSelector.value);
    });
    formButton.addEventListener('click', function(){
        writeForm();
    });
};

window.onload = init;
