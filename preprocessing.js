
const fs = require('fs')
const { readFile } = require('fs/promises')
const keyword_extractor = require('keyword-extractor')
const { last, lte } = require('lodash')
const e = require('express')
var porterStemmer = require('@stdlib/nlp-porter-stemmer')
// const SpellCheck = require('@caijs/spellcheck')
var spelling = require('spelling'),
dictionary = require('spelling/dictionaries/en_US.js')
var dict = new spelling(dictionary)

function cleaner(pss) {
  let punctuationless = pss.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
  pss = punctuationless.replace(/\s{2,}/g, ' ')
  pss = pss.replace(/\d+/g, '')
  pss = pss.replace(/\s+/g, ' ').trim()
  pss = pss.replace(',', ' ')
  pss = pss.replace(/[^\w\s]/g, '').toLowerCase()
  // console.log(pss)
  return pss
}


const sw = require('./stop-words');


const row_kw = []
const all_keywords = new Set()
for (let i = 1; i <= 1450; i++) {
  let ps = fs.readFileSync(
    __dirname + '/data/ps/ps_' + i.toString() + '.txt',
    {
      encoding: 'utf-8',
    }
  )
  ps = ps.toString()
  let finalps = cleaner(ps)
  let cur_keywords = []
  finalps = finalps.split('input')[0]
  finalps = finalps.split('\n')
  finalps = finalps.join(' ')
  finalps = finalps.split(' ')
  for (let i = 0; i < finalps.length; i++) {
    if (
      sw.indexOf(finalps[i]) == -1 &&
      finalps[i] != ' ' &&
      finalps[i] != '' &&
      finalps[i].substr(0, 4) != 'http'
    )
      cur_keywords.push(finalps[i])
  }
  for (let i = 0; i < cur_keywords.length; i++) {
    cur_keywords[i] = porterStemmer(cur_keywords[i])
    if (dict.search(cur_keywords[i])[0] != undefined)
      cur_keywords[i] = dict.search(cur_keywords[i])[0].word
  }
  row_kw.push(cur_keywords)
  for (let j = 0; j < cur_keywords.length; j++) {
    all_keywords.add(cur_keywords[j])
  }
}
const final_kw = [...all_keywords]

let tf = []
for (let i = 0; i < 1450; i++) {
  let curtf = []
  for (let j = 0; j < final_kw.length; j++) {
    curtf.push(0)
  }
  for (let j = 0; j < row_kw[i].length; j++) {
    curtf[final_kw.indexOf(row_kw[i][j])] += 1
  }
  tf.push(curtf)
}
idf = []
for (let j = 0; j < final_kw.length; j++) {
  idf.push(0)
}
for (let i = 0; i < 1450; i++) {
  for (let j = 0; j < final_kw.length; j++) {
    if (tf[i][j] > 0) idf[j] += 1
  }
}
for (let j = 0; j < final_kw.length; j++) {
  idf[j] = 1 + Math.log(1450 / idf[j])
}
tfidf = []
for (let i = 0; i < 1450; i++) {
  tfidf.push(tf[i])
  for (let j = 0; j < final_kw.length; j++) {
    tfidf[i][j] = tfidf[i][j] * idf[j]
    tfidf[i][j] = tfidf[i][j] / row_kw[i].length
  }
}

tfidf_string = ''
for (let i = 0; i < 1450; i++) {
  for (let j = 0; j < final_kw.length; j++) {
    tfidf_string += tfidf[i][j].toString() + '\n'
  }
}
idf_string = ''
for (let j = 0; j < final_kw.length; j++) {
  idf_string += idf[j].toString() + '\n'
}
keywords_string = ''
for (let j = 0; j < final_kw.length; j++) {
  keywords_string += final_kw[j] + '\n'
}

fs.writeFile('./constants/tfidf.txt', tfidf_string, (err) => {
  if (err) {
    console.error(err)
    return
  }
})
fs.writeFile('./constants/idf.txt', idf_string, (err) => {
  if (err) {
    console.error(err)
    return
  }
})
fs.writeFile('./constants/keywords.txt', keywords_string, (err) => {
  if (err) {
    console.error(err)
    return
  }
})
console.log(final_kw.length,1450)