const electron = require('electron');
const app = electron.app;
const fs = require('fs');

// console.log($);
// const jq = require('jQuery');
window.jQuery = window.$ = require('./bower_components/jquery/dist/jquery.min.js');

class AnsFile {
  constructor(dirPath, fileName, depth) {
    this._dirPath = dirPath;
    this._fileName = fileName
    this._children = [];
    this._depth = depth;
  }
  get filePath() {
    return this._dirPath + "/" + this._fileName;
  }
  get fileName() {
    return this._fileName;
  }
  get children() {
    return this._children;
  }
  get depth() {
    return this._depth;
  }
  add(child) {
    if (Array.isArray(child)) {
      // TODO add all
      this._children = child;
    } else {
      this._children.push(child);
    }
  }
  hasChild() {
    return this._children.length > 0;
  }
  isDir() {
    return fs.statSync(this.filePath).isDirectory();
  }
}

function load(dirPath, depth) {
  var pathList = fs.readdirSync(dirPath);
  var ansFileList = [];
  for (var i = 0; i < pathList.length; i++) {
    var fileName = pathList[i];
    var ansFile = new AnsFile(dirPath, fileName, depth);
    if (ansFile.isDir()) {
      ansFile.add(load(ansFile.filePath, depth + 1));
    }
    ansFileList.push(ansFile);
  }
  return ansFileList;
}

electron.ipcRenderer.on('ping', function(event, message) {

  var targetDir = 'benchmarks/wordpress-nginx';
  var fileList = load(targetDir, 0);

  // 表示を初期化
  $(".tbody tr:visible").remove();

  // templateを取得
  var template = $(".trTemplate");
  var tbody = $(".tbody");

  // function render(fileList) {
  //
  // }

  // 表示する
  for (var i = 0; i < fileList.length; i++) {
    var ansFile = fileList[i];
    var newTr = template.clone(true);
    $("td:first div", newTr).addClass("depth-" + ansFile.depth);
    if (ansFile.isDir()) {
      $("td:first i", newTr).addClass("fa-folder-o");
    } else {
      $("td:first i", newTr).addClass("fa-file-code-o");
    }
    newTr.appendTo(tbody);

    $(".fileName", newTr).append(ansFile.depth + ansFile.fileName)
    newTr.show();
    if (ansFile.hasChild()) {
      // TODO 再帰
      console.log(ansFile.children);
    }
  }
});
