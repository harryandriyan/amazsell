const puppeteer = require('puppeteer')
const cheerio = require('cheerio')
const puppeteerConfig = { headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080','--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"'] }

const scrapeProduct = async (productURI) => {
  const browser = await puppeteer.launch(puppeteerConfig)
  const page = await browser.newPage()
  await page.goto(productURI)
  await page.waitForSelector('body');

  const html = await page.evaluate(() => document.body.innerHTML);
  const $ = cheerio.load(html);

  /* Get product title */
  const name = $('#productTitle').text().trim()

  // ASIN
  const splittedProductURI = productURI.split('/')
  const asin = splittedProductURI[5].substring(0,10)

  /* Get and format rating */
  const rating = Number($('.a-icon-star > span.a-icon-alt').text().split(' ')[0])

  /* Get price */
  const price = $('#priceblock_ourprice').text() || 0

  /* Get product description */
  const description = $('#productDescription').text().trim()
  
  const product = { 
    name,
    asin,
    description,
    price,
    rating,
    link: productURI
  }

  await browser.close()
  return product
}

module.exports.scrapeProduct = scrapeProduct