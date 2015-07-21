var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.
var WebpackDevServer = require('webpack-dev-server');
var webpack = require('webpack');

// webpack settings
var compiler = webpack({
  target: 'atom',
  entry: __dirname + '/src/app',
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js'
  },
  externals: {
    riot: true
  },
  plugins: [
    new webpack.ProvidePlugin({
      riot: 'riot'
    })
  ],
  module: {
    preLoaders: [
      { test: /\.tag$/, exclude: /node_modules/, loader: 'riotjs-loader', query: { template: 'jade' } }
    ],
    loaders: [
      { test: /\.js|\.tag$/, exclude: /node_modules/, loader: 'babel-loader' }
    ]
  }
});

// webpack dev server
// NOTE: Need to create this programmatically instead of running it on the command line, since we're in an
// Electron app.
var server = new WebpackDevServer(compiler, {
  contentBase: __dirname + '/dist',
  hot: true
});

// put the webpack dev server on port 7777 so that it doesn't interfere with stuff that normally goes on 8080
server.listen(7777, 'localhost');

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OSX it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on('ready', function() {
  // Create the browser window.
  var mainWindow = new BrowserWindow({ width: 1024, height: 768 });

  // and load the index.html of the app.
  mainWindow.loadUrl('file://' + __dirname + '/dist/index.html');

  // Open the devtools.
  mainWindow.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});
