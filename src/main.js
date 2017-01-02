const utils = require('./utils');
const twitter = require('./twitter');
const recursive = require('./recursive');


function print(response) {
    if (response && response.length) {
        Array.prototype.forEach.call(response, function(item) {
            console.log(JSON.stringify(utils.normalize(item)));
            print.isFirstOutput = false;
        });
    } else {
        if (print.isFirstOutput) {
            console.log(response);
            print.isFirstOutput = false;
        } else if (response.length !== 0) {
            console.log(response);
            print.isFirstOutput = false;
        }
    }
}
print.isFirstOutput = true;

function run({ endpoint, method, payload, settings }) {
    return twitter[method](endpoint, payload).then(function(response) {
        const result = utils.serialize(response);
        print(result);

        if (settings.recursive) {
            return recursive.strategy({ endpoint, method, payload, settings }, result, run);
        }
    }, function(errors) {
        console.error('Error!');
        errors.forEach(e => console.error(e));
        process.exit(1);
    });
}

process.on('unhandledRejection', reason => {
    console.error('Unhandled promise rejection', reason);
});

module.exports = run;