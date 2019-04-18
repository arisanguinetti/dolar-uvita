const Twitter = require('twitter');
const dotenv = require('dotenv');
const moment = require('moment-timezone');
const { UsdUvaModel } = require('./models');

moment.locale('es');
dotenv.config();

function getClient() {
  return new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  });
}

const sendLatestToTwitter = async () => {
  const latestValue = await UsdUvaModel.getLatest();
  const yesterdayValue = await UsdUvaModel.getYesterday();

  if (latestValue.length === 0) {
    return;
  }

  if (yesterdayValue.length === 0) {
    return;
  }

  const latestVendedor = latestValue[0].vendedor.toFixed(2);
  const latestComprador = latestValue[0].comprador.toFixed(2);

  const yesterdayVendedor = yesterdayValue[0].vendedor.toFixed(2);
  const yesterdayComprador = yesterdayValue[0].comprador.toFixed(2);

  const diffVendedor = (latestVendedor - yesterdayVendedor).toFixed(2);
  const diffComprador = (latestComprador - yesterdayComprador).toFixed(2);

  let emojiVendedor = '';
  if (diffVendedor > 0) {
    emojiVendedor = '🔺';
  } else if (diffVendedor < 0) {
    emojiVendedor = '🔻';
  }

  let emojiComprador = '';
  if (diffComprador > 0) {
    emojiComprador = '🔺';
  } else if (diffComprador < 0) {
    emojiComprador = '🔻';
  }

  const now = moment()
    .tz('America/Argentina/Buenos_Aires')
    .format('LLLL');

  const status = `💵 Dólar Banco Nación en UVAs
📆 ${now}

Vendedor : ${latestVendedor} UVAs - Dif. ${diffVendedor} ${emojiVendedor}
Comprador: ${latestComprador} UVAs - Dif. ${diffComprador} ${emojiComprador}

#dolar #uva`;

  const client = getClient();

  client.post('statuses/update', { status }, error => {
    if (error) {
      throw error;
    }
  });
};

module.exports = { sendLatestToTwitter };
