/* global chrome:true */
export default class Alarms {
  static createIfDiff(name, alarmInfo) {
    this.get(name, (alarm) => {
      if (typeof alarm === 'undefined') {
        this.create(name, alarmInfo);
        return;
      }

      const isDifferent = Object.keys(alarmInfo).some(key => (alarm[key] !== alarmInfo[key]));

      if (isDifferent) {
        this.create(name, alarmInfo);
      }
    });
  }

  static create(name, alarmInfo) {
    chrome.alarms.create(name, alarmInfo);
  }

  static get(name, callback = () => {}) {
    chrome.alarms.get(name, callback);
  }

  static addOnAlarmListener(callback) {
    chrome.alarms.onAlarm.addListener(callback);
  }
}
