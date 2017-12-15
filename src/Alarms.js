import BrowserAlarms from './browser/BrowserAlarms';

export default class Alarms {
  static recreate(name, alarmInfo) {
    BrowserAlarms.clear(name)
      .then(() => BrowserAlarms.create(name, alarmInfo));
  }

  static addOnAlarmListener(callback) {
    BrowserAlarms.addOnAlarmListener(callback);
  }
}
