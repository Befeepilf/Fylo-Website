const fs = require('fs');

let html = fs.readFileSync('./src/index.html', 'utf-8');
html = html.replace(new RegExp(/<script id="__parcel__helper__">(\n((?!<\/script>).)+)+<\/script>\n*/), '');
fs.writeFileSync('./src/index.html', html, 'utf-8');
