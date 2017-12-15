import Alarms from '../../src/Alarms.js';
import Settings from '../../src/Settings.js';
import OpenTabs from '../../src/OpenTabs.js';

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
    if (name === openFaucetAlarmName) {
      OpenTabs.run();
    }
  };

  Alarms.addOnAlarmListener(onAlarm);
  Settings.addOnChangedListener(setAlarm);
  setAlarm();
})();
