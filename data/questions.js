var questions = {};
questions['Europe'] = require('./europe/france.json')
    .concat(require('./europe/spain.json'))
    .concat(require('./europe/italy.json'))
    .concat(require('./europe/portugal.json'));
questions['Great Scientists'] = require('./great-scientists.json');
questions['Real Scientist Jobs'] = require('./real-scientist-jobs.json');
questions['Periodic Elements'] = require('./periodic-elements.json');
questions['Physical and Chemical Quantities'] = require('./physical-and-chemical-quantities.json');
questions['Scientific Objects'] = require('./scientific-objects.json');

module.exports = questions;
