app
  .ui.container
    button.ui.button.blue(name="folderSelectButton" onclick="{showDialog}") Select Folder
    .ui.input
      input(name="selectedFolder" type="text")

    .ui.icon.input#search
      input(name="searchFolder" type="text" placeholder="Search..." onkeyup="{search}")
      i.link.icon(name="searchButton" class="{searchIcon}" onclick="{searchSetup}")

    .ui.button.green(onclick="{checkoutAll}") Checkout All Master
    .ui.button.green(onclick="{pullAll}") Pull All

    .ui.toggle.checkbox(name="hideMasterCheckbox")
      input(type="checkbox" name="public")
      label Hide repos on master branch

    .folders.ui.divided.items
      .item.ui.segment(each="{folders}")
        //- loading mask
        .ui.inverted.dimmer(class="{active: isProcessing}")
          .ui.loader
        //- item contents
        i.large.github.icon
        .content
          .header
            a(href="{repoUrl}" onclick="{openLink}") {folderName}
            .ui.horizontal.label(class="{red: isDetached, yellow: !isMaster && !isDetached, green: isMaster}") {branchName}
            a.ui.horizontal.red.label.has-popup(if="{isError}") error
            .ui.flowing.popup(if="{isError}"): raw(content="{error}" din="dindin")

  script.
    var RiotControl = require('riotcontrol');
    var remote = require('remote');
    var dialog = remote.require('dialog');
    var shell = require('shell');

    this.searchIcon = 'search';

    this.on('updated', () => {
      $('.has-popup').popup();
    });

    $(this.hideMasterCheckbox).checkbox({
      onChecked: () => {
        this.folders = this.allFolders.filter(folder => {
          return folder.branchName != 'master'
        });
        this.update();
      },

      onUnchecked: () => {
        this.folders = this.allFolders;
        this.update();
      }
    });

    openLink(event) {
      shell.openExternal(event.item.repoUrl);
    }

    showDialog() {
      dialog.showOpenDialog({ properties: ['openDirectory']}, updateFoldersList.bind(this));
    }

    searchSetup() {
      if (this.searchIcon == 'remove') {
        this.searchFolder.value = '';
      }

      this.search.call(this);
    }

    search() {
      var text = this.searchFolder.value;
      this.searchIcon = text ? 'remove' : 'search';

      this.folders = this.allFolders.filter(folder => {
        return folder.folderName.includes(this.searchFolder.value);
      });

      this.update();
    }

    checkoutAll() {
      RiotControl.trigger('click:checkoutAll');
    }

    pullAll() {
      RiotControl.trigger('click:pullAll');
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
      margin-bottom: 40px;
    }
