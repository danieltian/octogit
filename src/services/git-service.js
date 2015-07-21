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

module.exports = new GitService();
