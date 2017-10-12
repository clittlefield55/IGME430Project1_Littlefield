var sendButton;
var setSelector;

// format the requested kanji set into a readable format
const displayKanji = (kanji) => {
    var group = "";
    var set = kanji.kanjiSet;

    for(var i = 0; i<set.length; i++){
        group += "<div class='kanji'>";
        group += `<p>${set[i].id}</p>`;
        group += `<h2>${set[i].character}</h2>`;
        for(var j = 0; j < set[j].meaning.length; j++){
            if(j == 0){
                group += `${set[i].meaning[j]}`;
            }
            else{
                group += `,${set[i].meaning[j]}`;
            }
        }
        group += `</div>`
    }

    content.innerHTML = group;
};

const respond = (xhr) =>{
    const content = document.querySelector("#content");

    switch(xhr.status) {
        case 200:
          const obj = JSON.parse(xhr.response);
          console.dir(obj);
          displayKanji(obj);
          //content.innerHTML = `<b>Success</b><br />Message: This is a successful response`;
          break;
        case 404:
          content.innerHTML = `<b>Resource Not Found</b><br />Message: The page you are looking for was not found.`;
          break;
        default:
          content.innerHTML =  `Error code not implemented by client.`;
          break;
    }
};

// AJAX request for a kanji set
const sendKanjiRequest = (url) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/getKanji?set=' + url);
    xhr.setRequestHeader("ACCEPT", "application/json");
    
    xhr.onload = () => respond(xhr);
    xhr.send();
};

// initialize function
const init = () =>{
    sendButton = document.querySelector("#send");
    setSelector = document.querySelector("#set");

    sendButton.addEventListener('click', function(){
        sendKanjiRequest(setSelector.value);
    });
};

window.onload = init;