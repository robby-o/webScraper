const { crawlPage } = require('./crawl')
const { printReport } = require('./report')

async function main() {
  const args = process.argv

  if (args.length < 3) throw Error('provide base url')
  if (args.length > 3) throw Error('only provide base url')
  const baseURL = args[2]

  console.log(`Starting crawl at ${baseURL}`)
  const pages = await crawlPage(baseURL, baseURL, {})
  printReport(pages)
}

main()
