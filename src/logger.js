const _ = require('lodash');
const {red, yellow, green, underline} = require('chalk');

const log = function (msg = '') {
    console.log(msg); // eslint-disable-line
};

const logger = log;

logger.encoded = data => {
    log(`${data}`);
};

logger.malabyIsHappy = () => {
    log(`   ${green('🍧 Malaby Is Happy')}\n\n`);
};

logger.help = () => {
    log(red(`\n   Please supply Malaby a file to test! something like this:`));
    log(`   ${yellow('<your-project>')}/${green('malaby')} path/to/testFile.unit.spec.it.ix.something.js\n`);
    log(`   ${underline('Additional options:')}`);
    log(`   --debug: run ndb (https://www.npmjs.com/package/ndb)`);
    log(`   --watch: re-run the test every file change in the project`);
    log(`   --config: specify different config file --config=different-malaby-config.json`);
};

logger.couldNotFileConfigurationFile = (configPath, configFromUserInput) => {
    const path = configFromUserInput || configPath;
    log(`${red('Could not find configuration file')} ${yellow(path)}`);
    if (!configFromUserInput) {
        log(`type ${green('malaby init')} to create it`);
    }
};

logger.moreThanOneConfigFound = (filePath, matchingGlobs) => {
    log(red(`More than one config found for ${filePath}\n`));
    _.forEach(matchingGlobs, (glob, index) => {
        log(red(`   ${index + 1} - ${glob}`));
    });
};

logger.noMatchingTestsFound = (filePath, configPath) => {
    log(red(`
    No matching tests found for ${filePath}
    Check your configuration in ${configPath}`));
};

logger.testFileDoesNotExist = fileAbsolutePath => {
    log(`Test file doesn't exist: ${red(fileAbsolutePath)}`);
};

logger.commandFound = (filePath, commandString) => {
    log(`File: ${green(filePath)}\nCommand: ${green(commandString)}`);
};

logger.testInProgress = () => {
    log(yellow(`Test in progress...\n`));
};

logger.restartTestInProgress = () => {
    log(yellow(`Running the test again...\n`));
};

logger.runningCommand = command => {
    log(`Running: ${green(command)}`);
};

logger.mustUpdateVersion = () => {
    log(`
    A new version of malaby is available
    please run ${green('npm update -g malaby')} to update
    `)
};

module.exports = logger;