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

      var promise = Git.getBranchName(fullPath)
        .then(branchName => {
          folderObject.branchName = branchName.stdout.replace(/\n/g, '');
          if (folderObject.branchName == 'master') {
            folderObject.isMaster = true;
          }
        })
        .fail(error => {
          console.log('error', fullPath, error);
          folderObject.branchName = 'detached';
          folderObject.isDetached = true;
        });

      var promise2 = Git.getHumanRepoUrl(fullPath)
        .then(result => {
          folderObject.repoUrl = result;
        });

      var promise3 = Git.getLocalChanges(fullPath)
        .then(result => {
          folderObject.localChanges = result;
        });

      fs.watch(path.join(fullPath, '.git/HEAD'), () => {
        console.log('HEAD changed', fullPath);
        Git.getBranchName(fullPath)
          .then(branchName => {
            folderObject.branchName = branchName.stdout.replace(/\n/g, '');
            if (folderObject.branchName == 'master') {
              folderObject.isMaster = true;
            }
          })
          .fail(error => {
            console.log('error', fullPath, error);
            folderObject.branchName = 'detached';
            folderObject.isDetached = true;
          });

        this.trigger('foldersUpdated', this.folders);
      });

      promises.push(promise);
      promises.push(promise2);
      promises.push(promise3);
      folders.push(folderObject);
    });

    Q.all(promises).then(() => {
      console.log('folders after processing', folders);
      this.folders = folders;
      this.trigger('foldersUpdated', folders);
    })
    .fail(error => {
      console.log('error', error);
    });
  });

  this.on('click:checkoutAll', () => {
    this.folders.forEach(folder => {
      Git.checkout(folder.fullPath, 'master').then(result => {
        if (result.stdout) {
          console.log('checkout result', result.stdout);
        }
        else if (result.stderr) {
          console.error('checkout result', result.stderr);
        }
      });
    });
  });

  this.on('click:pullAll', () => {
    this.folders.forEach(folder => {
      folder.isProcessing = true;

      Git.pull(folder.fullPath)
        .then(result => {
          // do nothing, we pulled successfully
        })
        .fail(error => {
          folder.isError = true;
          console.log('error', error);
          folder.error = error.stderr.replace(/(\r?\n)/g, '<br/>');
        })
        .finally(() => {
          folder.isProcessing = false;
          this.trigger('foldersUpdated', this.folders);
        });
    });
  });
}

module.exports = new FolderStore();
