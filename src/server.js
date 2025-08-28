const express = require('express')

const apiRoutes = require('./routes')
const { ServerConfig, Logger } = require('./config')

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRoutes);


app.listen(ServerConfig.PORT, () => {
    console.log("Server running at PORT:", ServerConfig.PORT);
})