import BrowserTabs from './browser/BrowserTabs';

export default class Tabs {
  static open = async url => BrowserTabs.open(url)
}
