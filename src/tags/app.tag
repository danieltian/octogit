app
  .ui.container
    button.ui.button.blue(name="folderSelectButton" onclick="{showDialog}") Select Folder
    .ui.input
      input(name="selectedFolder" type="text")

    .ui.icon.input#search
      input(name="searchFolder" type="text" placeholder="Search..." onkeyup="{search}")
      i.link.icon(name="searchButton" class="{searchIcon}" onclick="{searchSetup}")

    .folders.ui.divided.items
      .item(each="{folders}")
        i.large.github.icon
        .content
          .header
            | {folderName}
            .ui.green.horizontal.label {branchName}

  script.
    var RiotControl = require('riotcontrol');
    var remote = require('remote');
    var dialog = remote.require('dialog');
    var fs = require('fs');
    var path = require('path');
    var Git = require('simple-git');

    this.searchIcon = 'search';

    showDialog() {
      dialog.showOpenDialog({ properties: ['openDirectory']}, updateFoldersList.bind(this));
    }

    searchSetup() {
      if (this.searchIcon == 'remove') {
        this.searchFolder.value = '';
      }

      search.call(this);
    }

    search() {
      var text = this.searchFolder.value;
      this.searchIcon = text ? 'remove' : 'search';

      this.folders = this.allFolders.filter(folder => {
        return folder.name.includes(this.searchFolder.value);
      });

      this.update();
    }

    RiotControl.on('foldersUpdated', folders => {
      this.allFolders = folders;
      this.folders = folders;
      this.update();
    });

    function updateFoldersList(selectedFolders) {
      var rootFolder = selectedFolders[0];
      this.rootFolder = rootFolder
      this.selectedFolder.value = rootFolder;

      RiotControl.trigger('rootFolderSelected', rootFolder);
    }

  style(scoped).
    .ui.container {
      margin-top: 50px;
    }
