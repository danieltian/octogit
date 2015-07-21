var riot = require('riot');
var Git = require('../services/git-service');
var path = require('path');
var fs = require('fs');
var Q = require('q');

function FolderStore() {
  riot.observable(this);

  this.on('rootFolderSelected', (rootFolder) => {
    console.log('rootFolderSelected', rootFolder);

    var subfolders = fs.readdirSync(rootFolder).filter(file => {
      return fs.statSync(path.join(rootFolder, file)).isDirectory();
    });

    var folders = [];
    var promises = [];

    subfolders.forEach(folder => {
      var fullPath = path.join(rootFolder, folder);

      var folderObject = {
        folderName: folder,
        fullPath: fullPath
      };

      promises.push(Git.getBranchName(fullPath).then(branchName => {
        folderObject.branchName = branchName.stdout.replace(/\n/, '');
      }));

      folders.push(folderObject);
    });

    Q.all(promises).then(() => {
      console.log('folders after processing', folders);
      this.trigger('foldersUpdated', folders);
    });
  });
}

module.exports = new FolderStore();
