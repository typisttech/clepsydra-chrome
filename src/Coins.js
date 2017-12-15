export default class Coins {
  static dictionary = {
    BTC: 'Bitcoin',
    DASH: 'Dash',
    DOGE: 'Dogecoin',
    ETH: 'Ethereum',
    LTC: 'Litecoin',
    '': '',
  };

  static humanize = coin => Coins.dictionary[String(coin)]
}
