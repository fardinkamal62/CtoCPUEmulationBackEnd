const {exec} = require('child_process');
const path = require('path');
const fs = require('fs');

const api = module.exports;

/**
 * @description Calls the executable to run the emulation
 * @param req {Object} The request object
 * @param res {Object} The response object
 * @return {Array} Emulated output
 */
api.emulate = function (req, res) {
    const {code} = req.body;
    const inputFile = storeCode(code);

    const emulated = [];
    const rootPath = (path.resolve('.'))

    const assemblyFile = path.join(rootPath, 'temp/assembly.s'),
        binaryFile = path.join(rootPath, 'temp/binary.o'),
        main = rootPath + '/bin' + `/main ${inputFile} ${assemblyFile} ${binaryFile}`;

    exec(main, (err, stdout) => {
        if (err) {
            console.error(err);
            res.json({ code: 500, error: err});
            return;
        }

        stdout.split('##OUTPUT##').forEach((line, index) => {
            emulated.push({step: steps[index], output: line});
        });

        res.json({code: 200, data: emulated});
    });
};

const steps = {
    0: "pre-process",
    1: "assembly",
    2: "binary",
    3: "instructions",
}

/**
 * @function storeCode
 * @description Stores the code in a temporary file
 * @param code {String} The code to store
 * @return {String} The path to the file
 */
function storeCode(code) {
    const fileExists = checkFolderExistence('temp');
    if (!fileExists) {
        fs.mkdirSync('temp');
    }

    const rootPath = (path.resolve('.'));
    const filePath = path.join(rootPath, 'temp/input.c');
    fs.writeFileSync(filePath, code);
    return filePath;
}

/**
 * @function checkFolderExistence
 * @description Checks if a folder exists
 * @param {String} filePath
 * @return {boolean}
 */
function checkFolderExistence(filePath) {
    try {
        fs.accessSync(filePath, fs.constants.F_OK);
        return true;
    } catch (err) {
        return false;
    }
}
