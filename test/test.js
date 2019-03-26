const { handler } = require('../functions/5app-coding-challenge');
const tap = require('tap');
const x = require('./fixtures/request.json');

tap.test(async (t) => {
    var result = await handler({
        body: JSON.stringify(x)
    }, {});

    const { response } = JSON.parse(result.body)

    t.equal(response.length, 2, 'expect 2 items to be returned');
    t.equal(response[0].name, "Molly", "expect Molly to be the first name");
    t.equal(response[0].count, 12, "expect 12 to be the first count");
    t.notEqual(response[0].thumbnail.indexOf('64'), "-1", "expect thumbnail to contain 64");
});
