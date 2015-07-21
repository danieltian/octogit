var riot = require('riot');
var exec = require('child-process-promise').exec;

function GitService() {
  riot.observable(this);
}

GitService.prototype.getBranchName = function(folderPath) {
  return exec('git symbolic-ref --short HEAD', { cwd: folderPath });
};

GitService.prototype.checkout = function(folderPath, branchName) {
  return exec('git checkout ' + branchName, { cwd: folderPath });
};

GitService.prototype.pull = function(folderPath) {
  return exec('git pull', { cwd: folderPath });
};

// get the URL of the repo that you would enter into a browser
GitService.prototype.getHumanRepoUrl = function(folderPath) {
  return exec('git config --get remote.origin.url', { cwd: folderPath })
    .then(result => {
      var originUrl = result.stdout;

      // convert a SSH URL to the human HTTPS URL: git@github.com:danieltian/octogit.git
      if (originUrl.includes('git@')) {
        originUrl = originUrl.replace(':', '/');
        originUrl = originUrl.replace('git@', 'https://');
      }

      // remove the '.git' at the end and any newline characters
      originUrl = originUrl.replace('.git', '');
      originUrl = originUrl.replace(/(\r?\n)/g, '');

      return originUrl;
    });
};

module.exports = new GitService();
