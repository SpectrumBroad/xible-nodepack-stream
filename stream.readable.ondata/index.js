'use strict';

module.exports = (NODE) => {
  const triggerOut = NODE.getOutputByName('trigger');
  const dataOut = NODE.getOutputByName('data');

  dataOut.on('trigger', async (conn, state) => {
    const thisState = state.get(NODE);
    return (thisState && thisState.data) || null;
  });

  const readableIn = NODE.getInputByName('streams');

  NODE.on('trigger', async (state) => {
    const readables = await readableIn.getValues(state)
    for (let i = 0; i < readables.length; i += 1) {
      readables[i].on('data', (data) => {
        state.set(NODE, {
          data
        });
        triggerOut.trigger(state);
      });
    }
  });
};
