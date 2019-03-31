import axios from 'axios';
import cheerio from 'cheerio';
import db from './db';
import { sendLatestToTwitter } from './twitter';

async function getHTML(url) {
  const { data: html } = await axios.get(url);
  return html;
}

async function findUVAValue() {
  const uvaHtml = await getHTML(
    'https://www.indicadoresargentina.com/uvi-unidad-de-valor-adquisitivo-hoy.html'
  );
  const $ = await cheerio.load(uvaHtml);
  const p = await $('p.valor').text();
  const uvaValue = parseFloat(
    p.replace(' pesos argentinos', '').replace(',', '.')
  );
  return uvaValue;
}

async function findUSDValue() {
  const uvaHtml = await getHTML('http://www.bna.com.ar/Personas');
  const $ = await cheerio.load(uvaHtml);
  const values = await $('tr:first-child', '#billetes > table.cotizacion')
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
}

async function findMAEUSDValue() {
  const uvaHtml = await getHTML(
    'http://www.mae.com.ar/mercados/Forex/Default.aspx'
  );
  const $ = await cheerio.load(uvaHtml);
  const p = await $(
    '#ctl00_ContentPlaceHolder1_GVRFUltPreciosForex_ctl06_LBLUltPre'
  ).text();
  const uvaValue = parseFloat(p);
  return uvaValue;
}

async function runCron() {
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
      values: {
        vendedor,
        comprador,
      },
    })
    .write();

  sendLatestToTwitter();
}

export { findUSDValue, findUVAValue, runCron };
