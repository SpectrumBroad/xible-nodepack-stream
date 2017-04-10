module.exports = function(NODE) {

	let triggerOut = NODE.getOutputByName('trigger');
	let readableIn = NODE.getInputByName('stream');

	NODE.on('trigger', (state) => {

		readableIn.getValues(state).then((readables) => {

			const readableLength = readables.length;
			let endCount = 0;
			for (let i = 0; i < readableLength; ++i) {

				readables[i].on('end', () => {

					if (++endCount !== readableLength) {
						return;
					}

					triggerOut.trigger(state);

				});

			}

		});

	});


};
