import BrowserStorage from './browser/BrowserStorage';

export default class Settings {
  static defaults = {
    blacklist: [],
    lastOpenHistory: {},
    numFacuetsToOpen: 5,
    openIntervalInMinutes: 60,
  };

  static get = async () => BrowserStorage.get()
    .then(storage => ({
      ...Settings.defaults,
      ...storage,
    }))

  static set = async item => BrowserStorage.set(item)

  static addOnChangedListener = (listener) => {
    BrowserStorage.addOnChangedListener(listener);
  }
}
