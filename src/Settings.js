import Faucets from './Faucets.js';

export default class Settings {
  static async fromStoreage(storage) {
    const defaultSettings = await Object.freeze({
      blacklist: [],
      lastOpenHistory: {},
      numFacuetsToOpen: await Faucets.length(),
      openIntervalInMinutes: 180,
    });

    const settings = Object.assign({}, defaultSettings, storage);
    return Object.freeze(settings);
  }
}
