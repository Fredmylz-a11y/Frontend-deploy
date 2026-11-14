'use strict';
const app = require('./api/index');
const port = Number(process.env.PORT || 10000);
app.listen(port, '0.0.0.0', () => {
  console.log(`Rhinoverse backend listening on port ${port}`);
});
