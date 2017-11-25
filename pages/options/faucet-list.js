/* global document:true */
import Faucets from '../../src/Faucets.js';
import Settings from '../../src/Settings.js';
import Storage from '../../src/Storage.js';

(() => {
  const humanizeCoin = (coin) => {
    const dictionary = {
      BTC: 'Bitcoin',
      DASH: 'Dash',
      DOGE: 'Dogecoin',
      LTC: 'Litecoin',
      '': '',
    };

    return dictionary[String(coin)];
  };

  const microwalletToLink = (microwallet) => {
    switch (String(microwallet)) {
      case 'coinpot':
        return '<a href="https://coinpot.co">CoinPot</a>';
      case 'faucethub':
        return '<a href="https://faucethub.io/r/27245107">FaucetHub</a>';
      default:
        return '';
    }
  };

  const booleanToYesNo = bool => (bool ? 'Yes' : 'No');

  const disabledStatusHtml = () => '<button type="button" class="btn btn-link btn-sm text-danger" name="status-toggle">Disabled</button>';

  const enabledStatusHtml = () => '<button type="button" class="btn btn-link btn-sm" name="status-toggle">Enabled</button>';

  const statusHtml = isEnabled => ((isEnabled) ? enabledStatusHtml() : disabledStatusHtml());

  const removeFromArray = (array, item) => array.filter(element => item !== element);

  const addToArray = (array, item) => [...array, item];

  const toggleStatus = ({
    path,
  }) => {
    const row = path.find(element => element.tagName === 'TR');
    const faucetId = row.dataset.id;

    Storage.get(async (storage) => {
      const {
        blacklist,
      } = await Settings.fromStoreage(storage);

      const isBlacklisted = blacklist.includes(faucetId);
      const newBlacklist = (isBlacklisted)
        ? removeFromArray(blacklist, faucetId)
        : addToArray(blacklist, faucetId);

      Storage.set({
        blacklist: newBlacklist,
      });
    });
  };

  const getLast = nodeListOrArray => nodeListOrArray[nodeListOrArray.length - 1];

  const addRowWithValues = ({
    id,
    name,
    coin,
    microwallet,
    url,
    intervalInMinutes,
    dailyBouns,
  }, isEnabled) => {
    const rowHtml = `
  <tr data-id="${id}">
  <th scope="row">
    <a href="${url}">${name}</a>
  </th>
  <td>
    ${humanizeCoin(coin)}
  </td>
  <td class="text-center">
    ${microwalletToLink(microwallet)}
  </td>
  <td class="text-center">
    ${intervalInMinutes} <small class="text-muted">minutes</small>
  </td>
  <td class="text-center">
    ${booleanToYesNo(dailyBouns)}
  </td>
  <td class="text-center">
    <div class="form-group">
    ${statusHtml(isEnabled)}
    </div>
  </td>
  </tr>
  `;

    const tbody = document.getElementById('faucet-list-tbody');
    tbody.insertAdjacentHTML('beforeend', rowHtml);

    const statusToggles = document.getElementsByName('status-toggle');
    const laststatusToggle = getLast(statusToggles);
    laststatusToggle.addEventListener('click', event => toggleStatus(event));
  };

  const updateTable = () => {
    Storage.get(async (storage) => {
      const {
        blacklist,
      } = await Settings.fromStoreage(storage);

      const faucets = await Faucets.sortByRating();

      // Reset tbody
      document.getElementById('faucet-list-tbody').innerHTML = '';

      faucets.forEach((faucet) => {
        const isEnabled = !blacklist.includes(faucet.id);

        addRowWithValues(faucet, isEnabled);
      });
    });
  };

  const updateNumOfFaucets = async () => {
    document.getElementById('num-of-faucets').innerHTML = await Faucets.length();
  };

  Storage.addonChangedListener(updateTable);
  document.addEventListener('DOMContentLoaded', updateTable);
  document.addEventListener('DOMContentLoaded', updateNumOfFaucets);
})();
