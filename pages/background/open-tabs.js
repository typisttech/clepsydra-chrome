import Alarms from '../../src/Alarms.js';
import Faucets from '../../src/Faucets.js';
import Settings from '../../src/Settings.js';
import Storage from '../../src/Storage.js';
import Tabs from '../../src/Tabs.js';

(() => {
  const openFaucetAlarmName = 'clepsydraOpenFaucet';

  const createAlarm = () => {
    Storage.get(async (storage) => {
      const {
        openIntervalInMinutes,
      } = await Settings.fromStoreage(storage);

      Alarms.createIfDiff(openFaucetAlarmName, {
        periodInMinutes: Number(openIntervalInMinutes),
      });
    });
  };

  const onAlarm = ({ name }) => {
    if (name !== openFaucetAlarmName) {
      return;
    }

    Storage.get(async (storage) => {
      const {
        blacklist,
        lastOpenHistory,
        numFacuetsToOpen,
      } = await Settings.fromStoreage(storage);

      const faucets = await Faucets.pick(blacklist, lastOpenHistory, numFacuetsToOpen);

      faucets.forEach(({ id, url }) => {
        Tabs.open(url);
        lastOpenHistory[id] = Date.now();
      });

      Storage.set({ lastOpenHistory });
    });
  };

  Alarms.addOnAlarmListener(onAlarm);

  Storage.addonChangedListener(createAlarm);
  createAlarm();
})();
