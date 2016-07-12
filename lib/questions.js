const questions = require('../data/questions');

module.exports = {
categories: Object.keys(questions),
pickQuestion: (category) => {
	return new Promise((resolve, reject) => {
		var selectable = questions[category];
		if (!(selectable.length >= 1)) {
			reject('Category ' + category + ' is empty!');
		}
		index = Math.floor(Math.random() * selectable.length);
		resolve(selectable[index]);
	});
}

};
