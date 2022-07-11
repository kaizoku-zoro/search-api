const fs = require('fs')
const path = require('path')
const constants = path.join(__dirname, '..', 'constants');
const dataset = path.join(__dirname, '..', 'data');
let final_kw = fs.readFileSync(path.join(constants, 'keywords.txt'), {
    encoding: 'utf-8',
})
final_kw = final_kw.split('\n')
let idf = fs.readFileSync(path.join(constants, 'idf.txt'), {
    encoding: 'utf-8',
})
idf = idf.split('\n')
for (let i = 0; i < idf.length; i++) {
    idf[i] = parseFloat(idf[i])
}
let tfidf = fs.readFileSync(path.join(constants, 'tfidf.txt'), {
    encoding: 'utf-8',
})
tfidf = tfidf.split('\n')
let tfidf2 = []
for (let i = 0; i < 1450; i++) {
    let row_tfidf = []
    for (let j = 0; j < final_kw.length; j++) {
        let cur = parseFloat(tfidf[i * final_kw.length + j])
        // tfidf.shift()
        row_tfidf.push(cur)
    }
    tfidf2.push(row_tfidf)
}
tfidf = tfidf2
let ps_titles = fs.readFileSync(path.join(dataset, 'problem_titles.txt'), {
    encoding: 'utf-8',
})
ps_titles = ps_titles.split('\n')
let ps_difficulties = fs.readFileSync(
    path.join(dataset, 'problem_difficulties.txt'),
    {
        encoding: 'utf-8',
    }
)
ps_difficulties = ps_difficulties.split('\n')
let ps_submissions = fs.readFileSync(
    path.join(dataset, 'problem_submissions.txt'),
    {
        encoding: 'utf-8',
    }
)
ps_submissions = ps_submissions.split('\n')
let ps_urls = fs.readFileSync(path.join(dataset, 'problem_urls.txt'), {
    encoding: 'utf-8',
})
ps_urls = ps_urls.split('\n')
let ps_codes = fs.readFileSync(path.join(dataset, 'problem_codes.txt'), {
    encoding: 'utf-8',
})
ps_codes = ps_codes.split('\n')


module.exports = { final_kw, idf, tfidf, ps_titles, ps_difficulties, ps_submissions, ps_codes, ps_urls };