/* global chrome:true */
import ChromePromise from 'chrome-promise';

export default class Alarms {
  static create = (name, alarmInfo) => chrome.alarms.create(name, alarmInfo)

  static clear = async (name) => {
    const chromePromise = new ChromePromise();

    return chromePromise.alarms.clear(name);
  }

  static get = async (name) => {
    const chromePromise = new ChromePromise();

    return chromePromise.alarms.get(name);
  }

  static addOnAlarmListener(callback) {
    chrome.alarms.onAlarm.addListener(callback);
  }
}
