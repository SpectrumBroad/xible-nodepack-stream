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
    readableIn.getValues(state)
    .then((readables) => {
      for (let i = 0; i < readables.length; i += 1) {
        readables[i].on('data', (data) => {
          state.set(NODE, {
            data
          });
          triggerOut.trigger(state);
        });
      }
    });
  });
};
