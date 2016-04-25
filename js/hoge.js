const electron = require('electron');
const app = electron.app;
const fs = require('fs');

// console.log($);
// const jq = require('jQuery');
window.jQuery = window.$ = require('./bower_components/jquery/dist/jquery.min.js');

class AnsFile {
  constructor(filePath) {
    this._filePath = filePath;
    this._children = [];
  }
  get filePath() {
    return this._filePath;
  }
  add(child) {
    if (Array.isArray(child)) {
      // TODO add all
      this._children = child;
    } else {
      this._children.push(child);
    }
  }
  isDir() {
    return fs.statSync(this.filePath).isDirectory();
  }
}

function load(dirPath) {
  var pathList = fs.readdirSync(dirPath);
  var ansFileList = [];
  for (var i = 0; i < pathList.length; i++) {
    var path = pathList[i];
    var ansFile = new AnsFile(dirPath + "/" + path);
    if (ansFile.isDir()) {
      ansFile.add(load(ansFile.filePath));
    }
    ansFileList.push(ansFile);
  }
  return ansFileList;
}

electron.ipcRenderer.on('ping', function(event, message) {

  var targetDir = 'benchmarks/wordpress-nginx';
  var fileList = load(targetDir);

  // 表示を初期化
  $(".tbody tr:visible").remove();

  // templateを取得
  var template = $(".trTemplate");
  var tbody = $(".tbody");

  // TODO 表示する
  for (var i = 0; i < fileList.length; i++) {
    var ansFile = fileList[i];
    var newTr = template.clone(true);
    newTr.appendTo(tbody);
    newTr.show();
  }
});
