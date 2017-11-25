/* global fetch:true */

import flattenDeep from 'lodash/flattenDeep';
import partition from 'lodash/partition';
import sortBy from 'lodash/sortBy';

export default class Faucets {
  static async rawList() {
    const response = await fetch('../data/faucet-list.json');
    const json = await response.json();
    return json;
  }

  static async all() {
    const rawList = await this.rawList();

    const defaultFaucet = Object.freeze({
      id: '',
      name: '',
      coin: '',
      microwallet: '',
      intervalInMinutes: 0,
      dailyBouns: false,
      rating: 100,
    });

    return rawList.faucets.map((rawFaucet) => {
      const faucet = Object.assign({}, defaultFaucet, rawFaucet);
      return Object.freeze(faucet);
    });
  }

  static async length() {
    const all = await this.all();

    return all.length;
  }

  static async sortByRating() {
    const all = await this.all();

    const groupByDailyBouns = partition(all, 'dailyBouns');
    const sortedGroups = groupByDailyBouns.map(group => sortBy(group, ['rating', 'coin', 'intervalInMinutes', 'microwallet']));

    return flattenDeep(sortedGroups);
  }

  static async enabled(blacklist) {
    const all = await this.all();

    return all.filter(({
      id,
    }) => !blacklist.includes(id));
  }

  static async claimReady(blacklist, lastOpenHistory) {
    const enabled = await this.enabled(blacklist);

    return enabled.filter(({
      id,
      intervalInMinutes,
    }) => {
      const lastOpened = lastOpenHistory[id] || 1;
      const minutesInMilliseconds = 60 * 1000;

      return lastOpened + (intervalInMinutes * minutesInMilliseconds) < Date.now();
    });
  }

  static async claimReadySorted(blacklist, lastOpenHistory) {
    const claimReady = await this.claimReady(blacklist, lastOpenHistory);
    return claimReady.sort(({
      id: idA,
      dailyBouns: dailyBounsA,
    }, {
      id: idB,
      dailyBouns: dailyBounsB,
    }) => {
      const lastOpenedA = lastOpenHistory[idA] || 1;
      const lastOpenedB = lastOpenHistory[idB] || 1;

      // Those didn't visted come first.
      if (lastOpenedA < lastOpenedB) {
        return -1;
      } else if (lastOpenedA > lastOpenedB) {
        return 1;
      }

      // Those have daily bouns come first.
      if (dailyBounsA && !dailyBounsB) {
        return -1;
      } else if (!dailyBounsA && dailyBounsB) {
        return 1;
      }

      return 0;
    });
  }

  static async pick(blacklist, lastOpenHistory, numFacuetsToOpen) {
    const claimReadySorted = await this.claimReadySorted(blacklist, lastOpenHistory);

    return claimReadySorted.slice(0, Number(numFacuetsToOpen));
  }
}
