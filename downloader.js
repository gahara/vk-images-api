//Downloads photo from url provided
//example: 
//savePhoto("https://pp.userapi.com/c10535/u39622205/95373066/y_276dd173.jpg");

function savePhoto(url){
  // Get file name from url.
  let filename = url.substring(url.lastIndexOf("/") + 1).split("?")[0];
  let xhr = new XMLHttpRequest();
  xhr.responseType = 'blob';
  xhr.onload = function() {
    let a = document.createElement('a');
    a.href = window.URL.createObjectURL(xhr.response); // xhr.response is a blob
    a.download = filename; // Set the file name.
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    delete a;
  };
  xhr.open('GET', url);
  xhr.send();
};

//Getting all photos from album, url should be provided 
//Documentation:
//https://vk.com/dev/photos.getAlbums
function getPhotosFromAlbum(url){
  let xhr = new XMLHttpRequest();
  let tmp;
  xhr.open('GET', url, false);
  xhr.onreadystatechange = function () {
        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            tmp = xhr.responseText;
        };
    };

  xhr.send();

  let jsonified = JSON.parse(tmp);
  for (let i = 0; i < jsonified.response.length; i++)
  {
    savePhoto(jsonified.response[i].src_big);
  };
  //console.log(j.response[0].src_big);
  //let t = xhr.responseText;
 //alert(t + 'WTFFFFFF????');

//Promise version
//function getResponse(url) {
//  return new Promise(function(resolve, reject) {
//    var xhr = new XMLHttpRequest();
//    xhr.onload = function() {
//      resolve(this.responseText);
//    };
//     xhr.onerror = reject;
//     xhr.open('GET', url);
//     xhr.send();
//   });
// }
//
// getResponse("https://api.vk.com/method/photos.get?owner_id=39622205&album_id=103756760&count=1'").then(function(result) {
//   // Code depending on result
// }).catch(function() {
//   // An error occurred
// });

};


//
//creating url for api from inputed one
////'https://vk.com/album39622205_243075424'
function getParams(url){ 
  let a = url.split('_')
  return 'https://api.vk.com/method/photos.get?owner_id=' + a[0]. replace(/[^0-9]/g, '') + '&album_id=' + a[1] + '&count=2';
};

var urlFromStorage; //= chrome.storage.sync.get(['urlFromInput']) ;


chrome.storage.sync.get(['urlFromInput'], function(items) {
      urlFromStorage = items.urlFromInput;
      let formattedUrl = getParams(urlFromStorage);
      getPhotosFromAlbum(formattedUrl);
    });


