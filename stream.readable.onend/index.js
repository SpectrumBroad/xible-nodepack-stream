module.exports = function(NODE) {

	let triggerOut = NODE.getOutputByName('trigger');
	let dataOut = NODE.getOutputByName('data');

	dataOut.on('trigger', (conn, state, callback) => {

		let thisState = state.get(this);
		callback((thisState && thisState.data) || null);

	});

	let readableIn = NODE.getInputByName('stream');

	NODE.on('trigger', (state) => {

		let trackData = dataOut.isConnected();
		readableIn.getValues(state).then((readables) => {

			readables.forEach((readable) => {

				let dataTrack;

				if (trackData) {
					readable.on('data', (data) => {

						if (typeof dataTrack === 'undefined') {
							dataTrack = data;
							return;
						}

						if (typeof data === 'string') {
							dataTrack += data;
						} else {
							dataTrack = Buffer.concat([dataTrack, data]);
						}

					});
				}

				readable.on('end', () => {
					if (trackData) {
						state.set(this, {
							data: dataTrack
						});
					}
					triggerOut.trigger(state);
				});

			});

		});

	});


};
