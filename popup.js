"use strict";
function runDownloader() {
  chrome.tabs.executeScript({
    file: 'downloader.js'
  }); 
};
document.getElementById('clickme').addEventListener('click', function (e) {
  chrome.storage.sync.set({'urlFromInput': document.getElementById('clickme').value}, function() {});
  runDownloader();
});
