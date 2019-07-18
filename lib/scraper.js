const axios = require('axios');
const cheerio = require('cheerio');
const moment = require('moment-timezone');
const dotenv = require('dotenv');
const { UvaModel, UsdModel, UsdUvaModel } = require('./models');
const { sendLatestToTwitter } = require('./twitter');

dotenv.config();

const getHTML = async url => {
  const { data: html } = await axios.get(url);
  const $ = await cheerio.load(html);
  return $;
};

const findUVAValue = async () => {
  const params = {
    headers: {
      Authorization: `BEARER ${process.env.BCRA_TOKEN}`,
    },
  };
  const now = moment().tz('America/Argentina/Buenos_Aires');
  const { data } = await axios.get(
    'https://api.estadisticasbcra.com/uva',
    params
  );
  const latestValue = data.filter(f => f.d === now.format('YYYY-MM-DD')).pop();
  if (!latestValue) return NaN;
  const uvaValue = parseFloat(latestValue.v);
  return uvaValue;
};

const findUSDValue = async () => {
  const $ = await getHTML('http://www.bna.com.ar/Personas');
  const values = $('tr:first-child', '#billetes > table.cotizacion')
    .find('td:not(:first-child)')
    .toArray()
    .map(el =>
      parseFloat(
        $(el)
          .text()
          .replace(',', '.')
      )
    );
  return {
    comprador: values[0],
    vendedor: values[1],
  };
};

const scrapeValues = async () => {
  const [uvaValue, usdValue] = await Promise.all([
    findUVAValue(),
    findUSDValue(),
  ]);

  const uva = new UvaModel({
    date: Date.now(),
    value: uvaValue,
  });
  await uva.save();

  const usd = new UsdModel({
    date: Date.now(),
    comprador: usdValue.comprador,
    vendedor: usdValue.vendedor,
  });
  await usd.save();

  const vendedor = usdValue.vendedor / uvaValue;
  const comprador = usdValue.comprador / uvaValue;

  const usdUva = new UsdUvaModel({
    date: Date.now(),
    comprador,
    vendedor,
  });
  await usdUva.save();

  return {
    uva,
    usd,
    usdUva,
  };
};

const runCron = async () => {
  await scrapeValues();
  try {
    await sendLatestToTwitter();
  } catch (error) {
    throw error;
  }
};

module.exports = { runCron, scrapeValues };
