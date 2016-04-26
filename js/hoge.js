const electron = require('electron');
const app = electron.app;
const fs = require('fs');

window.jQuery = window.$ = require('./bower_components/jquery/dist/jquery.min.js');

class AnsFile {
  constructor(dirPath, fileName, depth, parent) {
    this._dirPath = dirPath;
    this._fileName = fileName
    this._children = [];
    this._depth = depth;
    this._parent = parent;
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
  fileType() {
    var fileType = null;
    if (this._parent != null) {
      fileType = this._parent.fileType();
    }
    if (fileType == null) {
      if ( "roles" == this._fileName) {
        return "role";
      }
      "host", "yml"
    } else {
      return "other";
    }
    return fileType;
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

function load(dirPath, parent, depth) {
  var pathList = fs.readdirSync(dirPath);
  var ansFileList = [];
  for (var i = 0; i < pathList.length; i++) {
    var fileName = pathList[i];
    var ansFile = new AnsFile(dirPath, fileName, depth, parent);
    if (ansFile.isDir()) {
      ansFile.add(load(ansFile.filePath, ansFile, depth + 1));
    }
    ansFileList.push(ansFile);
  }
  return ansFileList;
}

electron.ipcRenderer.on('ping', function(event, message) {

  var targetDir = 'benchmarks/wordpress-nginx';
  var fileList = load(targetDir, null, 0);

  // TODO sort

  // サブフォルダの中ではmain.ymlが先頭
  // 表示を初期化
  $(".tbody tr:visible").remove();

  // templateを取得
  var template = $(".trTemplate");
  var tbody = $(".tbody");

    // 表示する
  function render(fileList) {
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

      $(".fileName", newTr).append(ansFile.fileName + ":" + ansFile.fileType());
      newTr.show();
      if (ansFile.hasChild()) {
        render(ansFile.children);
      }
    }
  }

  render(fileList);
});
