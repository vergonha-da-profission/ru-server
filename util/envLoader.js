const dotenv = require('dotenv');
const path = require('path')
const commandLineArgs = require("command-line-args");

// Setup command line options
const options = commandLineArgs([
    {
        name: "env",
        alias: "e",
        defaultValue: "devlopment",
        type: String,
    },
]);

// Setting the env file
const dotenvConfig = dotenv.config({
    path: `env/${options.env}.env`,
});

if (dotenvConfig.error) {
    throw dotenvConfig.error;
}
