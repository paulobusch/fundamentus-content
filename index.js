const { App } = require('./src/app');
const config = require('./config.json');

new App(config).run();
