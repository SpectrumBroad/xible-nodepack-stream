'use strict';

module.exports = (NODE) => {
  const triggerIn = NODE.getInputByName('trigger');
  const readableIn = NODE.getInputByName('streams');

  const triggerOut = NODE.getOutputByName('trigger');
  const dataOut = NODE.getOutputByName('data');

  dataOut.on('trigger', async (conn, state) => {
    const thisState = state.get(NODE);
    if (!thisState || thisState.data === undefined) {
      return;
    }

    return thisState.data;
  });

  triggerIn.on('trigger', async (conn, state) => {
    const trackData = dataOut.isConnected();
    const readables = await readableIn.getValues(state);
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
};
