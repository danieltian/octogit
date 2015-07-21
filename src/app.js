var riot = require('riot');
var RiotControl = require('riotcontrol');

//var RiotControl = require('riotcontrol');

// require() all files in the tag folder
// NOTE: need to do this, or else mounting the app tag will not mount the child tags
// TODO: is there a way to do this through ES6 imports?
var context = require.context('./tags');
context.keys().forEach(key => {
  context(key);
});

// services are simply stores that do not hold data; they only process data and fire events
var folderStore = require('./stores/folder-store');
RiotControl.addStore(folderStore);

// // mount the app tag, which is the root tag for the app
// // NOTE: this will mount all child tags as well
riot.mount('app');
