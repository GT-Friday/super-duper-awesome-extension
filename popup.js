// chrome.runtime.onInstalled.addListener(function() {
//     chrome.storage.sync.set({color: '#3aa757'}, function() {
//       console.log("The color is green.");
//     });
//     fetchScriptManifests(handleResponse);
//     chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
//         chrome.declarativeContent.onPageChanged.addRules([{
//           conditions: [new chrome.declarativeContent.PageStateMatcher({
//             pageUrl: {hostEquals: 'developer.chrome.com'},
//           })
//           ],
//               actions: [new chrome.declarativeContent.ShowPageAction()]
//         }]);
//       });
//   });

const fetchScriptManifests = (callback) => {
    fetch('https://extensions-app-backend.herokuapp.com/')
        .then(res => res.json())
        .then(json => callback(json))
        .catch(error => {
            console.log('Errrrrrror! ', error);
        })
};

const createHeadScript = (text) => {
    let script = document.createElement('script');
    script.innerHTML = text;
    document.head.appendChild(script);
};

const fetchScript = (scriptName) => {

    const scriptsHost = 'https://extensions-app-backend.herokuapp.com';

    chrome.extension.getBackgroundPage().console.log(scriptsHost + scriptName);
    console.log('hey ' + scriptsHost + scriptName);

    return fetch(scriptsHost + scriptName)
        .then(res => res.text())
        // .then(createHeadScript)
        .catch(error => {
            console.log('Errrrrrror! ', error);
        })
};


const handleResponse = (response) => {

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

        let url = item.url;
        button.addEventListener('click', () => {
            // fetchScript(item.url).then((code) => {
            import(`https://extensions-app-backend.herokuapp.com${item.url}`)
                .then((module) => {
                    let main = module.default.main.toString();
                    console.log(main);
                    main = main.replace(/\n/g,'');
                    main = main.replace(/"/g,'\\"');
                    chrome.extension.getBackgroundPage().console.log(main);


                    const script = document.createElement('script');
                    script.innerHTML = main;

                    chrome.extension.getBackgroundPage().console.log(module);
                    // chrome.tabs.executeScript({
                    //     code: main
                    // });

                    chrome.windows.getCurrent(function (currentWindow) {
                        chrome.tabs.query({active: true, windowId: currentWindow.id},
                            function(activeTabs) {
                                chrome.extension.getBackgroundPage().console.log(chrome.tabs);
                                chrome.tabs.executeScript(
                                    activeTabs[0].id, {
                                        code: `
                                        var div=document.createElement("script");
                                        div.appendChild(document.createTextNode("(function() { const main = ${main}; main(document.head); }())"));
                                        document.head.appendChild(div);`
                                    });
                            });
                    });
                }).catch(console.log);
        });

        li.appendChild(h2);
        li.appendChild(button);
        ul.appendChild(li);

        let container = document.getElementById('container');
        container.appendChild(ul);
    });


    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs) {
        chrome.tabs.executeScript(
            tabs[0].id, {
                code: 'document.body.style.backgroundColor = "red";'
            });
    })
};

window.onload = () => fetchScriptManifests(handleResponse);
