"use strict";

 //getting value of the parameter from the given URL

function getUrlParameterValue(url, parameterName) {
    let urlParameters  = url.substr(url.indexOf("#") + 1);
    let parameterValue = "";
    let tmp;

    urlParameters = urlParameters.split("&");

    for (let i = 0; i < urlParameters.length; i++) {
        tmp = urlParameters[i].split("=");
        if (tmp[0] === parameterName) {
            return tmp[1];
        }
    }
    return parameterValue;
}


  //tab update listener handler, returning  function which is used as a listener  by chrome.tabs.obUpdated
 
 // authtabid Id of the tab which is waiting for grant of permissions for the application
 //imageSourceUrl      URL of the image which is  going to be uploaded 

function listenerHandler(authTabId, imageSourceUrl) {
    return function tabUpdateListener(tabId, changeInfo) {
        let vkAccessToken;
        if (tabId === authTabId && changeInfo.url !== undefined && changeInfo.status === "loading") {
            if (changeInfo.url.indexOf('oauth.vk.com/blank.html') > -1) {
                authTabId = null;
                chrome.tabs.onUpdated.removeListener(tabUpdateListener);

                vkAccessToken = getUrlParameterValue(changeInfo.url, 'access_token');

                if (vkAccessToken.length === undefined) {
                    alert('problems with access token');
                    return;
                }

                chrome.storage.local.set({'vkaccess_token': vkAccessToken}, function () {
                    chrome.tabs.update(
                        tabId,
                        {
                            'url'   : 'loading.html#' + imageSourceUrl + '&' + vkAccessToken,
                            'active': true
                        },
                        function (tab) {}
                    );
                });
            }
        }
    };
}


//functionality 'onlick' chrome context menu item method
 
function MenuClickHandler() {
    //"use strict";
    //alert(location.href);

    return function (info, tab) {

        let imageSourceUrl = info.srcUrl;
        let imageUploadHelperUrl = 'loading.html#';
        let vkAppId = '5966318';
        let vkPermissions = 'offline,photos,docs';
        let vkOAuthUrl  = 'https://oauth.vk.com/authorize?client_id=' + vkAppId + '&scope=' + vkPermissions + '&redirect_uri=http%3A%2F%2Foauth.vk.com%2Fblank.html&display=page&response_type=token';

        chrome.storage.local.get({'vkaccess_token': {}}, function (items) {

            if (items.vkaccess_token.length === undefined) {
                chrome.tabs.create({url: vkOAuthUrl, selected: true}, function (tab) {
                    chrome.tabs.onUpdated.addListener(listenerHandler(tab.id, imageSourceUrl));
                });

                return;
            }

            imageUploadHelperUrl += imageSourceUrl + '&' + items.vkaccess_token;
           // alert("here");
            chrome.tabs.create({url: imageUploadHelperUrl, selected: true});
            //chrome.tabs.create({url: "https://api.vk.com/method/photos.get?owner_id=39622205&album_id=103756760&count=1", selected: true});



        });
    };
}

//this thing creates new field in chrome contest menu when  image is clicked
chrome.contextMenus.create({
    "title": "save to vk",
    "type": "normal",
    "contexts": ["image"],
    "onclick": MenuClickHandler()
});

