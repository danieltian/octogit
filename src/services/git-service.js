var riot = require('riot');
var exec = require('child-process-promise').exec;

function GitService() {
  riot.observable(this);
}

GitService.prototype.getBranchName = function(folderPath) {
  return exec('git symbolic-ref --short HEAD', { cwd: folderPath });
};

module.exports = new GitService();
