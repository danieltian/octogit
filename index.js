var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.
var WebpackDevServer = require('webpack-dev-server');
var webpack = require('webpack');

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

var server = new WebpackDevServer(compiler, {
  contentBase: __dirname + '/dist',
  hot: true
});

server.listen(8080, 'localhost');

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
  var mainWindow = new BrowserWindow({ width: 800, height: 600 });

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
