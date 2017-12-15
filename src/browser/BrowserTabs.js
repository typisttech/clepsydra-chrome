import ChromePromise from 'chrome-promise';

export default class BrowserTabs {
  static open = async (url) => {
    const chromePromise = new ChromePromise();

    return chromePromise.tabs.create({
      url,
      active: false,
    });
  }
}
