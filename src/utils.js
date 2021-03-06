const _ = require('lodash');
const fs = require('fs');
const http = require('http');
const logger = require('./logger');
const globToRegExp = require('glob-to-regexp');

function getConfigPath(CWD, configFromUserInput) {
    if (configFromUserInput) {
        const relativePath = `${CWD}/${configFromUserInput}`;
        const absolutePath = configFromUserInput;

        if (fs.existsSync(relativePath)) {
            return relativePath;
        } else if (fs.existsSync(absolutePath)) {
            return absolutePath;
        } else {
            return undefined;
        }
    }
    return `${CWD}/malaby-config.json`;
}

function getConfig(configPath) {
    const isConfigFileExists = fs.existsSync(configPath);
    return isConfigFileExists ? require(configPath) : undefined;
}

const isFlagOn = (argv, flagName) => !!_.find(argv, param => param === flagName);

const buildContext = (filePath, config) => {
    const context = {
        filePath,
        config: undefined,
        matchingGlobs: []
    };

    _.forEach(config, (currentConfig, glob) => {
        const regex = globToRegExp(glob);
        const foundConfig = regex.test(filePath);

        if (foundConfig) {
            context.matchingGlobs.push(glob);
            context.config = currentConfig;
        }
    });

    return context;
};

const buildCommandString = ({command, debugCommand = undefined}, filePath, fileName, isDebug, inspectPort) => {
    let cmd = debugCommand && isDebug ? debugCommand : command;

    if (inspectPort) {
        cmd = cmd.replace('node ', `node --inspect-brk=${Number(inspectPort) + 1} `);
    }

    return cmd
        .replace('${filePath}', filePath)
        .replace('${fileName}', fileName);
};

const fetchLatestVersion = () => new Promise((resolve, reject) => {
    http.get('http://registry.npmjs.org/malaby', response => {
        let body = '';
        response.on('data', d => body += d);
        response.on('error', err => reject(err));
        response.on('err', err => reject(err));
        response.on('end', () => {
            const parsed = JSON.parse(body);
            const latestVersion = parsed['dist-tags'].latest;
            resolve(latestVersion);
        });
    });
});

const createConfigFile = configPath => {
    if (fs.existsSync(configPath)) {
        logger(`File already exist ${configPath}`);
    } else {
        const configExample = require('./malaby-config-example');
        fs.writeFileSync(configPath, JSON.stringify(configExample, null, 4));
    }
};

module.exports = {
    getConfigPath,
    getConfig,
    isFlagOn,
    buildContext,
    buildCommandString,
    fetchLatestVersion,
    createConfigFile
};