import axios from 'axios'
import cheerio from 'cheerio'

async function getHTML(url) {
    const { data: html } = await axios.get(url);
    return html
}

async function findUVAValue() {
    const uvaHtml = await getHTML('https://www.indicadoresargentina.com/uvi-unidad-de-valor-adquisitivo-hoy.html');
    const $ = await cheerio.load(uvaHtml)
    const p = await $('p.valor').text();
    const uvaValue = parseFloat(
        p
            .replace(' pesos argentinos', '')
            .replace(',', '.')
    );
    return uvaValue;
}

async function findUSDValue() {
    const uvaHtml = await getHTML('http://www.mae.com.ar/mercados/Forex/Default.aspx');
    const $ = await cheerio.load(uvaHtml)
    const p = await $('#ctl00_ContentPlaceHolder1_GVRFUltPreciosForex_ctl06_LBLUltPre').text();
    const uvaValue = parseFloat(p);
    return uvaValue;
}

export { findUSDValue, findUVAValue }