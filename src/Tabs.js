/* global chrome:true */
export default class Tabs {
  static open(url) {
    chrome.tabs.create({
      url,
      active: false,
    });
  }
}
