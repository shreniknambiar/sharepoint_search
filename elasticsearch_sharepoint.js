'use strict'

const {
    Client
} = require('@elastic/elasticsearch');
const client = new Client({
    node: 'http://es01:9200'
})

exports.indexExists = async () => {
    await client.indices.exists({
        index: 'documents',
    })
}

exports.createSharepointDosIndex = async () => {
    // Let's start by indexing some data
    await client.indices.create({
            index: 'documents',
            // type: '_doc', // uncomment this line if you are using {es} ≤ 6
            body: {
                settings: {
                    analysis: {
                        analyzer: {
                            my_analyzer: {
                                tokenizer: "my_tokenizer",
                                filter: [
                                    "lowercase"
                                ]
                            }
                        },
                        tokenizer: {
                            my_tokenizer: {
                                type: "ngram",
                                min_gram: 3,
                                max_gram: 4,
                                token_chars: [
                                    "letter",
                                    "digit"
                                ]
                            }
                        }
                    }
                },
                mappings: {
                    properties: {
                        name: {
                            type: "text",
                            analyzer: "my_analyzer",
                            search_analyzer: "my_analyzer"
                        },
                        id: {
                            type: 'text'
                        },
                        webUrl: {
                            type: 'text'
                        },
                        createdDateTime: {
                            type: "date"
                        },
                        createdBy: {
                            type: "object"
                        }
                    }
                }
            }

        })
        .then((result) => {
            console.log(result.body);
        })
        .catch((error) => {
            console.log(error);
        })
}

exports.addDocuments = async (events) => {
    for (let i = 0; i < events.value.length; i++) {
        await client.index({
                index: 'documents',
                id: events.value[i].id,
                // type: '_doc', // uncomment this line if you are using {es} ≤ 6
                body: {
                    name: events.value[i].name,
                    createdBy: events.value[i].createdBy,
                    webUrl: events.value[i].webUrl,
                    createdDateTime: events.value[i].createdDateTime
                }
            })
            .then((result) => {
                console.log(result.body);
            })
            .catch((error) => {
                console.log(error);
            })
    }
}