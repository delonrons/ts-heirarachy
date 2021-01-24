const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3002;
const organizationRouter = require('./route/organization');
const publicPath = path.join(__dirname, '../../', 'build');

console.log(publicPath);
app.use(express.json());
app.use(cors());

app.use('/', express.static(publicPath));
app.use('/node', organizationRouter);

app.listen(PORT, () => {
 console.log(`Application is running on ${PORT}`);
});