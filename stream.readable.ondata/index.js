module.exports = function(NODE) {

	let triggerOut = NODE.getOutputByName('trigger');
	let dataOut = NODE.getOutputByName('data');

	dataOut.on('trigger', (conn, state, callback) => {

		let thisState = state.get(this);
		callback((thisState && thisState.data) || null);

	});

	let readableIn = NODE.getInputByName('stream');

	NODE.on('trigger', (state) => {

		readableIn.getValues(state).then((readables) => {

			for (let i = 0; i < readables.length; ++i) {

				readables[i].on('data', (data) => {
					state.set(this, {
						data: data
					});
					triggerOut.trigger(state);
				});

			}

		});

	});


};
