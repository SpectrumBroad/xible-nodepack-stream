'use strict';

module.exports = (NODE) => {
  const triggerOut = NODE.getOutputByName('trigger');
  const dataOut = NODE.getOutputByName('data');

  dataOut.on('trigger', (conn, state, callback) => {
    const thisState = state.get(NODE);
    callback((thisState && thisState.data) || null);
  });

  const readableIn = NODE.getInputByName('stream');

  NODE.on('trigger', (state) => {
    const trackData = dataOut.isConnected();
    readableIn.getValues(state)
    .then((readables) => {
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
            state.set(NODE, {
              data: dataTrack
            });
          }
          triggerOut.trigger(state);
        });
      });
    });
  });
};
