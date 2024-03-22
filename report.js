function printReport(pages) {
  console.log('==========')
  console.log('REPORT')
  console.log('==========')

  const sortedPages = sortPages(pages)

  for (const url of sortedPages) {
    console.log(`Found ${url[1]} internal links to ${url[0]}`)
  }
}

function sortPages(pages) {
  return Object.entries(pages).sort((a, b) => b[1] - a[1])
}

module.exports = { printReport, sortPages }
