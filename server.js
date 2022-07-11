const express = require('express');
const app = express();
const {queryProblem,all} = require('./query/query')


const PORT = process.env.PORT || 3000;
app.use(express.json());

app.get("/", (req, res) => {
    res.json(all);
});

app.get("/search",(req,res)=>{
    const query = req.body.query;
    console.log(query)
    const ques = queryProblem(query);
    res.json(ques);
});

app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});