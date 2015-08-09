var riot = require('riot');
var RiotControl = require('riotcontrol');

// require() all files in the tag folder, we need to include all tags or else they won't be available when mounted
var context = require.context('./tags');
context.keys().forEach(key => {
  context(key);
});

var folderStore = require('./stores/folder-store');
RiotControl.addStore(folderStore);

// mount the app tag, which is the root tag for the app, this will mount all child tags as well
riot.mount('app');
