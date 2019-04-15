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
  // TODO: Agregar emojis y diffs
  const latestValue = await UsdUvaModel.getLatest();

  const latestVendedor = latestValue[0].vendedor.toFixed(2);
  const latestComprador = latestValue[0].comprador.toFixed(2);

  const status = `💵 Dólar Banco Nación en UVAs
📆 ${moment()
    .tz('America/Argentina/Buenos_Aires')
    .format('LLLL')}

Vendedor : ${latestVendedor} UVAs
Comprador: ${latestComprador} UVAs

#dolar #uva`;

  const client = getClient();

  client.post('statuses/update', { status }, error => {
    if (error) {
      throw error;
    }
  });
};

module.exports = { sendLatestToTwitter };
