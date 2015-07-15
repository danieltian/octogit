app
  .ui.container
    button.ui.button.blue(name="folderSelectButton") Select Folder
    .ui.input
      input(name="selectedFolder" type="text")

    .ui.icon.input#search
      input(name="searchFolder" type="text" placeholder="Search...")
      i.link.icon(name="searchButton" class="{searchIcon}")

    .folders.ui.divided.items
      .item(each="{folders}")
        i.large.github.icon
        .content
          .header
            {name}
            .ui.green.horizontal.label {branch}

  script.
    var remote = require('remote');
    var dialog = remote.require('dialog');
    var fs = require('fs');
    var path = require('path');
    var Git = require('simple-git');

    this.searchIcon = 'search';

    this.folderSelectButton.addEventListener('click', () => {
      dialog.showOpenDialog({ properties: [ 'openDirectory' ]}, updateFoldersList.bind(this));
    });

    this.searchFolder.addEventListener('keyup', search.bind(this));

    this.searchButton.addEventListener('click', () => {
      if (this.searchIcon == 'remove') {
        this.searchFolder.value = '';
      }

      search.call(this);
    });

    function search() {
      var text = this.searchFolder.value;
      this.searchIcon = text ? 'remove' : 'search';

      this.folders = this.allFolders.filter(folder => {
        return folder.name.includes(this.searchFolder.value);
      });

      this.update();
    }

    function updateFoldersList(selectedFolders) {
      var rootFolder = selectedFolders[0];
      this.rootFolder = rootFolder
      this.selectedFolder.value = rootFolder;

      var subfolders = fs.readdirSync(rootFolder).filter(file => {
        return fs.statSync(path.join(rootFolder, file)).isDirectory();
      });

      var folders = [];

      subfolders.forEach(folder => {
        var folderObject = {
          name: folder
        }

        Git(path.join(rootFolder, folder)).getBranchName((error, data) => {
          folderObject.branch = data;
          console.log('branch name', data);
          this.update();
        });

        folders.push(folderObject);
      });

      this.folders = folders;
      this.allFolders = folders;
      this.update();
    }

  style(scoped).
    .ui.container {
      margin-top: 50px;
    }
