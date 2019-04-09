import Twitter from 'twitter';
import dotenv from 'dotenv';
import moment from 'moment-timezone';
import db from './db';

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

const sendLatestToTwitter = () => {
  const latestValue = db
    .get('uvaUsdValues')
    .reverse()
    .take(1)
    .value()
    .pop();

  const previousValue = db
    .get('uvaUsdValues')
    .reverse()
    .take(1)
    .value()
    .pop();

  const previousVendedor = previousValue.value.vendedor.toFixed(2);
  const previousComprador = previousValue.value.comprador.toFixed(2);

  const latestVendedor = latestValue.value.vendedor.toFixed(2);
  const latestComprador = latestValue.value.comprador.toFixed(2);

  const diffVendedor = (
    parseFloat(latestVendedor) - parseFloat(previousVendedor)
  ).toFixed(2);
  const diffComprador = (
    parseFloat(latestComprador) - parseFloat(previousComprador)
  ).toFixed(2);

  let diffEmojiVendedor = '️↔️';
  if (diffVendedor > 0) {
    diffEmojiVendedor = '⬆️';
  } else if (diffVendedor < 0) {
    diffEmojiVendedor = '⬇️';
  }

  let diffEmojiComprador = '️️️↔️';
  if (diffComprador > 0) {
    diffEmojiComprador = '⬆️';
  } else if (diffComprador < 0) {
    diffEmojiComprador = '⬇️';
  }
  const status = `💵 Dólar Banco Nación en UVAs
📆 ${moment()
    .tz('America/Argentina/Buenos_Aires')
    .format('LLLL')}

Vendedor : ${latestVendedor} UVAs ${diffEmojiVendedor} (${diffVendedor})
Comprador: ${latestComprador} UVAs ${diffEmojiComprador} (${diffComprador})

#dolar #uva`;

  const client = getClient();

  client.post('statuses/update', { status }, error => {
    if (error) {
      console.error(error);
      throw error;
    }
  });
};

export { sendLatestToTwitter };
