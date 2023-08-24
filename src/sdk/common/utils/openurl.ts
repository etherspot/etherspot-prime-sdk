/* eslint-disable no-var */
const platformCommands = {
    darwin: 'open',
    win32: 'explorer.exe',
    linux: 'xdg-open'
};

export function openUrl(url, callback?) {
    if (typeof window === 'undefined') {
        var spawn = require('child_process').spawn;
    }

    const command = platformCommands[process.platform];
    if (!command) {
        throw new Error('Unsupported platform: ' + process.platform);
    }

    const child = spawn(command, [url]);
    let errorText = "";

    child.stderr.setEncoding('utf8');
    child.stderr.on('data', function (data) {
        errorText += data;
    });

    child.stderr.on('end', function () {
        if (errorText.length > 0) {
            var error = new Error(errorText);
            if (callback) {
                callback(error);
            } else {
                throw error;
            }
        } else if (callback) {
            callback(error);
        }
    });
}
