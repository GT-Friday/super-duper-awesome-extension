let wiki = document.getElementById('wiki');
let pink = document.getElementById('pink');

const fetchScriptManifests = (callback) => {
    fetch('https://extensions-app-backend.herokuapp.com/')
    .then(res => res.json())
    .then(json => callback(json))
    .catch(error => { console.log('Errrrrrror! ', error); })
  };

const handleResponse = (arr) => {
    chrome.extension.getBackgroundPage().console.log(arr);

    let arr = response;
    let ul = document.createElement('ul');

    arr.map(item => {
        let li = document.createElement('li');
        let h2 = document.createElement('h2');
        let button = document.createElement('button');

        li.className = "extension__item";
        h2.className = "extension__title";
        button.className = "extension__btn extension__btn_" + item.name;
        h2.textContent = item.name;
        button.textContent = "Install " + item.name;

        li.appendChild(h2);
        li.appendChild(button);
        ul.appendChild(li);

        let container = document.getElementById('container');
        container.appendChild(ul);
    });


    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        chrome.tabs.executeScript(
            tabs[0].id, {
                code: 'document.body.style.backgroundColor = "red";'
            });
    })
}

pink.onclick = function() {
    fetchScriptManifests(handleResponse);
  };

  

  let arr = [
      {name: "Wiki", url: "https://en.wikipedia.org/wiki/List_of_HTTP_header_fields#Responses"},
      {name: "Pink", url: "https://developer.chrome.com/"}
  ];