const puppeteer = require('puppeteer')
const cheerio = require('cheerio')
const puppeteerConfig = { headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080','--user-agent="Mozilla/5.0 (Macintosh Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"'] }

const scrapeReview = async (asin) => {
  const browser = await puppeteer.launch(puppeteerConfig)
  const page = await browser.newPage()
  const URI = `https://www.amazon.com/product-reviews/${asin}`

  await page.goto(URI)
  await page.waitForSelector('body')

  const html = await page.evaluate(() => document.body.innerHTML)
  const $ = cheerio.load(html)

  await page.waitFor(1000)
  const reviewData = []

  const title = []
  const body_copy = []
  const score = []
  const date = []
  const author = []
  const number_of_comment = []
  const number_of_vote = []
  const is_has_media = []
  const is_verified = []
  const is_child = []

  $('.review-title-content > span').each(function(index, elm) {
    title.push($(elm).text())
  })

  $('.review-text-content > span').each(function(index, elm) {
    body_copy.push($(elm).text().trim())
  })

  $('.review-rating > span.a-icon-alt').each(function(index, elm) {
    score.push($(elm).text().split(' ')[0])
  })

  $('.review-date').each(function(index, elm) {
    date.push($(elm).text().split(' on ')[1])
  })

  $('.a-profile-name').each(function(index, elm) {
    author.push($(elm).text())
  })

  $('.review-comment-total').each(function(index, elm) {
    number_of_comment.push(Number($(elm).text()) || 0)
  })

  $('span.a-size-base.a-color-tertiary.cr-vote-text').each(function(index, elm) {
    number_of_vote.push(Number($(elm).text().split(' ')[0]) || 0)
  })

  $('.review-image-tile').each(function(index, elm) {
    is_has_media.push($(elm).length > 0)
  })

  $('span.a-size-mini.a-color-state.a-text-bold').each(function(index, elm) {
    is_verified.push($(elm).length > 0)
  })

  for (let index = 0; index < title.length; index++) {
    const review = {
      title: title[index],
      body_copy: body_copy[index],
      score: score[index],
      date: date[index],
      author: author[index],
      number_of_comment: number_of_comment[index],
      number_of_vote: number_of_vote[index],
      is_has_media: is_has_media[index] || false,
      is_verified: is_verified[index] || false,
      is_child: false,
      asin
    }

    reviewData.push(review)
  }

  browser.close()
  return reviewData
}

module.exports.scrapeReview = scrapeReview