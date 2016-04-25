const electron = require('electron');
const app = electron.app;
const fs = require('fs');

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

  console.log(fileList);
});
