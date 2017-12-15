import Faucets from './Faucets.js';
import Settings from './Settings.js';
import Tabs from './Tabs.js';

export default class OpenTabs {
  static run = async () => {
    const {
      blacklist,
      lastOpenHistory,
      numFacuetsToOpen,
    } = await Settings.get();

    const faucets = await Faucets.pick(blacklist, lastOpenHistory, numFacuetsToOpen);

    faucets.forEach(({
      id,
      url,
    }) => {
      Tabs.open(url);
      lastOpenHistory[id] = Date.now();
    });

    Settings.set({
      lastOpenHistory,
    });
  }
}
