const path = require('path');
const express = require('express');
const app = express();

// From package.json (name)
const projectName = 'sw1-front';

app.use(express.static(`${__dirname}/dist/${projectName}`));
app.get('/*', function (req, res) {
  res.sendFile(path.join(`${__dirname}/dist/${projectName}/index.html`));
});
app.listen(process.env.PORT || 5000);
