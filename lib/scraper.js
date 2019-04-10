const axios = require('axios');
const cheerio = require('cheerio');
const db = require('./db');
const { sendLatestToTwitter } = require('./twitter');

const getHTML = async url => {
  const { data: html } = await axios.get(url);
  const $ = await cheerio.load(html);
  return $;
};

const findUVAValue = async () => {
  const $ = await getHTML(
    'https://www.indicadoresargentina.com/uvi-unidad-de-valor-adquisitivo-hoy.html'
  );
  const p = $('p.valor').text();
  const uvaValue = parseFloat(
    p.replace(' pesos argentinos', '').replace(',', '.')
  );
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

  db.get('uvaValues')
    .push({
      date: Date.now(),
      value: uvaValue,
    })
    .write();
  db.get('usdValues')
    .push({
      date: Date.now(),
      value: usdValue,
    })
    .write();

  const vendedor = usdValue.vendedor / uvaValue;
  const comprador = usdValue.comprador / uvaValue;

  db.get('uvaUsdValues')
    .push({
      date: Date.now(),
      value: {
        vendedor,
        comprador,
      },
    })
    .write();
};

const runCron = async () => {
  await scrapeValues();
  try {
    sendLatestToTwitter();
  } catch (error) {
    throw error;
  }
};

module.exports = { runCron };
