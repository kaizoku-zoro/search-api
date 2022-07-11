const express = require('express');
const app = express();
const {queryProblem,sub,diff} = require('./query/query')
const cors = require('cors');

const PORT = process.env.PORT || 5000;
app.use(cors())
app.use(express.json());

app.post("/", (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    if(req.body.sort==='submissions')
        res.json(sub);
    else
        res.json(diff)
});

app.post("/search",(req,res)=>{
    res.set('Access-Control-Allow-Origin', '*');
    const query = req.body.query;
    const ques = queryProblem(query);
    res.json(ques);
});

app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});