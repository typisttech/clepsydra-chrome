/* global chrome:true */
import ChromePromise from 'chrome-promise';

export default class BrowserStorage {
  static get = async () => {
    const chromePromise = new ChromePromise();

    return chromePromise.storage.local.get(null);
  }

  static set = async (item) => {
    const chromePromise = new ChromePromise();

    return chromePromise.storage.local.set(item);
  }

  static addOnChangedListener = (listener) => {
    chrome.storage.onChanged.addListener(listener);
  }
}
