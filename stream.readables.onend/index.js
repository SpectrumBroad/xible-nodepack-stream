'use strict';

module.exports = (NODE) => {
  const triggerOut = NODE.getOutputByName('trigger');
  const readableIn = NODE.getInputByName('streams');

  NODE.on('trigger', async (state) => {
    const readables = await readableIn.getValues(state);
    const readableLength = readables.length;
    let endCount = 0;
    for (let i = 0; i < readableLength; i += 1) {
      readables[i].on('end', () => {  // eslint-disable-line
        if (++endCount !== readableLength) {
          return;
        }

        triggerOut.trigger(state);
      });
    }
  });
};
