import Twitter from "twitter";
import dotenv from 'dotenv';
import db from "./db";

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

  const twit = `💵 Dólar Banco Nación

    Vendedor: $${latestValue.values.vendedor} UVAs
    Comprador: $${latestValue.values.comprador} UVAs
    
    #dolar #uva`;

  console.log(twit);
}

export { sendLatestToTwitter };
