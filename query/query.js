const { final_kw, idf, tfidf, ps_titles, ps_difficulties, ps_submissions, ps_codes, ps_urls } = require('./data');
var porterStemmer = require('@stdlib/nlp-porter-stemmer')
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
    return pss
}

function return_query_tfidf(q) {
    q = cleaner(q)
    let query_keywords = []
    q = q.split(' ')
    query_keywords = q
    for (let j = 0; j < query_keywords.length; j++) {
        query_keywords[j] = porterStemmer(query_keywords[j])
        if (dict.search(query_keywords[j])[0] != undefined)
            query_keywords[j] = dict.search(query_keywords[j])[0].word
    }
    query_tf = []
    for (let j = 0; j < final_kw.length; j++) {
        query_tf.push(0)
    }

    for (let j = 0; j < query_keywords.length; j++) {
        if (final_kw.indexOf(query_keywords[j]) != -1)
            query_tf[final_kw.indexOf(query_keywords[j])] += 1
    }
    query_tfidf = []
    for (let j = 0; j < final_kw.length; j++) {
        query_tfidf.push(query_tf[j])
        query_tfidf[j] = (query_tfidf[j] * idf[j]) / query_keywords.length
    }
    return query_tfidf
}


function calc_similarity(a, b) {
    sum = 0
    sum1 = 0
    sum2 = 0
    for (let i = 0; i < final_kw.length; i++) {
        sum += parseFloat(a[i] * b[i])
        sum1 += parseFloat(a[i] * a[i])
        sum2 += parseFloat(b[i] * b[i])
    }
    sum1 = Math.sqrt(sum1)
    sum2 = Math.sqrt(sum2)
    sum3 = sum1 * sum2
    if (sum3 == 0) return 0
    return sum / sum3
}
const getProblem = (i) => {
    return { title: ps_titles[i - 1], code: ps_codes[i - 1], url: ps_urls[i - 1], difficulty: parseInt(ps_difficulties[i - 1]), submissions: parseInt([i - 1]) };
}

const queryProblem = (q, param = 'submissions') => {
    query_tfidf = return_query_tfidf(q)
    all_questions = []
    for (let i = 0; i < 1450; i++) {
        let cur_tfidf = tfidf[i]
        similarity_value = calc_similarity(query_tfidf, cur_tfidf)
        all_questions.push([similarity_value, i])
    }
    all_questions.sort((a, b) => (a[0] > b[0] ? -1 : 1))
    top5_questions = []
    for (let i = 0; i < 10; i++) {
        top5_questions.push(all_questions[i][1] + 1)
    }
    questions = [];
    for (let i in top5_questions) {
        questions.push(getProblem(top5_questions[i]));
    }
    questions = questions.sort((a, b) => {
            return (a[param] > b[param] ? -1 : 1);
    })
    return questions;
}
let sub = [];
for (let i = 1; i < 1450; i++) {
    sub.push(getProblem(i));
}
sub = sub.sort((a,b)=>{
    return (a['submissions'] > b['submissions'] ? -1 : 1);
})
const diff = sub.sort((a,b)=>{
    return (a['difficulty'] > b['difficulty'] ? -1 : 1);
})

// const top10 = (param='submissions') => {
//     all_questions = all_questions.sort((a, b) => {
//         if (incr)
//             return (a[param] > b[param] ? -1 : 1);
//         else
//             return (a[param] < b[param] ? -1 : 1);
//     })
//     console.log(all_questions)
//     return all_questions.slice(0,10+1);
// }

module.exports = { queryProblem,diff,sub };


