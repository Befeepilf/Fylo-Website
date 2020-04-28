const fs = require('fs');
const {spawn} = require('child_process');

// if in dev mode the parcel dev server is started, otherwise the website is built for production
const dev = process.env.NODE_ENV !== 'production';

let htmlOrig, htmlNew;
if(dev) {
  console.log("Development mode: starting dev server...");

  // we don't use JS for our website; but in order to make Parcel's HMR work we need some JS
  // inject JS snipped in head of index.html
  htmlOrig = fs.readFileSync('./src/index.html', 'utf-8');
  htmlNew = htmlOrig.replace('<head>', '<head>\n<script id="parcel-helper">console.log("Parcel helper injected.")</script>');
  fs.writeFileSync('./src/index.html', htmlNew, 'utf-8');
  console.log("Injected Parcel helper");
}
else {
  console.log("Production mode: building website...");
}

function exitHandler() {
  if(dev) {
    // if helper script was injected restore the original file to not have any unnecessary JS in the production build
    fs.writeFileSync('./src/index.html', htmlOrig, 'utf-8');
    console.log("Cleaned up");
  }
}

// run Parcel
const child = spawn('yarn', ['parcel', (dev ? 'serve' : 'build'), '--no-cache', './src/index.html']);

child.stdout.on('data', chunk => console.log(chunk.toString()));
child.stderr.on('data', chunk => console.error(chunk.toString()));

// Cleanup when this script terminates
child.on('close', code => {
  console.log("Child closed with code", code);
  exitHandler();
});
process.on('exit', exitHandler);
process.on('SIGINT', exitHandler);
process.on('SIGUSR1', exitHandler);
process.on('SIGUSR2', exitHandler);
process.on('uncaughtException', exitHandler);
