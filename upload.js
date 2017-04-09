"use strict";


//  Main function to upload an image
// imageUrl URL for the uploading image
// fileName name of image in vk docs
// accEsstoken Access token for vk(with permissions and stuff)
 
 function upload(imageUrl, fileName, accessToken) {
    let uploadRequest = new XMLHttpRequest();
    uploadRequest.onload = function () {
        let photoGetUploadServer = new XMLHttpRequest();
        let requestFormData;
        let photoUploadRequest;
        
        photoGetUploadServer.open('GET', 'https://api.vk.com/method/docs.getUploadServer?access_token=' + accessToken);

        photoGetUploadServer.onload = function () {
            let result = JSON.parse(photoGetUploadServer.response);

            if (result.response.upload_url === undefined) {
                alert('photoGetUploadServer response problem');
                return;
            }
            requestFormData = new FormData();
            photoUploadRequest = new XMLHttpRequest();

            requestFormData.append("file", uploadRequest.response, fileName);

            photoUploadRequest.open('POST', result.response.upload_url, true);

            photoUploadRequest.onload = function () {
                let result = JSON.parse(photoUploadRequest.response),
                    photoSaveRequest;

                if (result.file === undefined) {
                    alert('Upload blob problem response problem')
                    return;
                }

                photoSaveRequest = new XMLHttpRequest();

                photoSaveRequest.open('GET', 'https://api.vk.com/method/docs.save?file=' + result.file + '&access_token=' + accessToken);

                photoSaveRequest.onload = function () {

                    let result = JSON.parse(photoSaveRequest.response);

                    if (result.response[0].url === undefined) {
                        alert('photoSaveRequest - no file in response');
                        return;
                    }

                    document.getElementById('wrap').innerHTML = '<p></p><br/><br/><center><h1>Successfully uploaded</h1></center><br/>';
                    setTimeout(function () { window.close(); }, 2000);
                };

                photoSaveRequest.send();
            };

            photoUploadRequest.send(requestFormData);
        };

        photoGetUploadServer.send();
    };

    //get image from browser
    uploadRequest.responseType = 'blob';
    uploadRequest.open('GET', imageUrl);
    uploadRequest.send();
}

 //add eventlistener on opening new page in extension
 //i.e. //chrome-extension://jdmekkbcllonjbnhnecakfbleocpkceg/upload.html#http://letlamov.me/2017/rostov_ploh/03.jpg&2964498a272d9287b100872c87114cd69618d3e3a812a4763ee76e4d817f61799514e1621980eff2ed4ee
document.addEventListener("DOMContentLoaded", function () {
    let params   = window.location.hash.substring(1).split('&');
    let imageUrl = null;
    let filename;
    let imageName;

    filename = params[0].split('/');

    if (filename.length === undefined || filename.length === 0) {
        alert('filename length <= 0!');
        return;
    }

    imageUrl = params[0];

    imageName = filename[filename.length - 1];

    upload(imageUrl, imageName, params[1]);
});
