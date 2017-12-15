import Alarms from '../../src/Alarms.js';
import Faucets from '../../src/Faucets.js';
import Settings from '../../src/Settings.js';
import Tabs from '../../src/Tabs.js';

(() => {
  const openFaucetAlarmName = 'clepsydraOpenFaucet';

  const setAlarm = async () => {
    const {
      openIntervalInMinutes,
    } = await Settings.get();

    Alarms.recreate(openFaucetAlarmName, {
      periodInMinutes: Number(openIntervalInMinutes),
    });
  };

  const onAlarm = async ({
    name,
  }) => {
    if (name !== openFaucetAlarmName) {
      return;
    }

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
  };

  Alarms.addOnAlarmListener(onAlarm);

  Settings.addOnChangedListener(setAlarm);

  setAlarm();
})();
