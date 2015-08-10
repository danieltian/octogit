var riot = require('riot');
var exec = require('child-process-promise').exec;

class GitService {
  // get the current branch name from the symbolic-ref
  getBranchName(folderPath) {
    return this
      ._runShellCommand('git symbolic-ref --short HEAD', folderPath)
      .then(branchName => {
        return this._removeLineEndings(branchName);
      })
      .fail(error => {
        console.log('GitService.getBranchName() error', error);
        return null;
      });
  }

  checkout(branchName, folderPath) {
    return this._runShellCommand(`git checkout ${branchName}`, folderPath);
  }

  pull(folderPath) {
    return this._runShellCommand('git pull', folderPath);
  }

  // get the URL of the repo that you would enter into a browser
  getHtmlUrl(folderPath) {
    return this._runShellCommand('git config --get remote.origin.url', folderPath)
      .then(result => {
        var originUrl = result.stdout;

        originUrl = originUrl.replace(':', '/')
        originUrl = originUrl.replace('git@', 'https://');
        originUrl = originUrl.replace('.git', '');

        return this._removeLineEndings(string);
      })
  }

  getUncommittedChanges(folderPath) {
    return this._runShellCommand('git status --porcelain', folderPath)
      .then(result => {
        if (result.stdout) {
          return result.stdout.split(/\n/g).filter(item => {
            return !!item;
          });
        }
        else {
          return [];
        }
      });
  }

  _runShellCommand(command, currentWorkingDirectory) {
    return exec(command, { cwd: currentWorkingDirectory });
  }

  _removeLineEndings(string) {
    return string.replace(/(\r?\n)/g, '');
  }
}

module.exports = new GitService();