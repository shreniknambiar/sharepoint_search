
var express = require('express');
var router = express.Router();
const {
    Client
} = require('@elastic/elasticsearch');
const client = new Client({
    node: 'http://es01:9200'
})

router.get('/',
    async function (req, res) {
        const search_query = req.query.search_term;
        await client.search({
                index: 'documents',
                // type: '_doc', // uncomment this line if you are using {es} ≤ 6
                body: {
                    query: {
                        match: {
                            name: {
                                query: search_query
                            }
                        }
                    }
                }
            })
            .then((result) => {
                console.log(result.body);
                return res.send(result.body);
            })
            .catch((error) => {
                return res.send(error);
            })
    }
);

module.exports = router;