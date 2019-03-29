import Twitter from "twitter";
import dotenv from "dotenv";
import moment from "moment-timezone";
import db from "./db";

moment.locale("es");
dotenv.config();

function getClient() {
  return new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  });
}

function sendLatestToTwitter() {
  const latestValue = db
    .get("uvaUsdValues")
    .reverse()
    .take(1)
    .value()
    .pop();

  if (!latestValue) {
    console.log("No hay valores disponibles");
    return;
  }

  const status = `💵 Dólar Banco Nación en UVAs
📆 ${moment().tz("America/Argentina/Buenos_Aires").format("LLLL")}

Vendedor: ${latestValue.values.vendedor.toFixed(2)} UVAs
Comprador: ${latestValue.values.comprador.toFixed(2)} UVAs

#dolar #uva`;

  const client = getClient();

  client.post("statuses/update", { status }, (error, tweet, response) => {
    if (error) {
      console.error(error)
      throw error
    };
  });
}

export { sendLatestToTwitter };
