const { JSDOM } = require('jsdom')

function normalizeURL(url) {
  const urlObj = new URL(url)

  let path = urlObj.host + urlObj.pathname
  if (path.length > 0 && path.slice(-1) === '/') {
    path = path.slice(0, -1)
  }

  return path
}

function getURLsFromHTML(htmlBody, baseURL) {
  const { document } = new JSDOM(htmlBody).window
  const urls = Array.from(document.querySelectorAll('a')).map(
    (link) => new URL(link.href, baseURL).href
  )

  return urls
}

async function crawlPage(baseURL, currentURL, pages) {
  // if this is an offsite URL, bail immediately
  const currentUrlObj = new URL(currentURL)
  const baseUrlObj = new URL(baseURL)
  if (currentUrlObj.hostname !== baseUrlObj.hostname) {
    return pages
  }

  const normalizedURL = normalizeURL(currentURL)

  // if we've already visited this page
  // just increase the count and don't repeat
  // the http request
  if (pages[normalizedURL] > 0) {
    pages[normalizedURL]++
    return pages
  }

  // initialize this page in the map
  // since it doesn't exist yet
  pages[normalizedURL] = 1

  // fetch and parse the html of the currentURL
  console.log(`crawling ${currentURL}`)
  let htmlBody = ''
  try {
    const resp = await fetch(currentURL)
    if (resp.status > 399) {
      console.log(`Got HTTP error, status code: ${resp.status}`)
      return pages
    }
    const contentType = resp.headers.get('content-type')
    if (!contentType.includes('text/html')) {
      console.log(`Got non-html response: ${contentType}`)
      return pages
    }
    htmlBody = await resp.text()
  } catch (err) {
    console.log(err.message)
  }

  const nextURLs = getURLsFromHTML(htmlBody, baseURL)
  for (const nextURL of nextURLs) {
    pages = await crawlPage(baseURL, nextURL, pages)
  }

  return pages
}

module.exports = { crawlPage, getURLsFromHTML, normalizeURL }
