const electron = require('electron');
const app = electron.app;
const fs = require('fs');

class Fuck {
  constructor(filePath) {
    this._filePath = filePath;
    this._children = [];
  }
  get filePath() {
    return this._filePath;
  }
  add(child) {
    this._children.push(child);
  }
  isDir() {
    return fs.statSync(this.filePath).isDirectory();
  }
}

electron.ipcRenderer.on('ping', function(event, message) {

  var fileList = [];
  var targetDir = 'benchmarks/wordpress-nginx';
  var files = fs.readdirSync(targetDir);

  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    var fuck = new Fuck(targetDir + "/" + file);
    fileList.push(fuck);

    if (fuck.isDir()) {
        var files2 = fs.readdirSync(fuck.filePath);
        for (var j = 0; j < files2.length; j++) {
          var file2 = files2[j];
          var fuck2 = new Fuck(fuck.filePath + "/" + file2);
          fuck.add(fuck2);
        }
      }
      // console.log(fs.statSync(targetDir + "/" + file).isDirectory());
    }
  console.log(fileList);
});
