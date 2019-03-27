const { handler } = require("../functions/5app-coding-challenge");
const tap = require("tap");
const requestJson = require("./fixtures/request.json");

tap.test(`Given 3 items
With 1 with a count of 0`, async t => {
  const response = await getResponse(requestJson);

  t.equal(
    response.length,
    2,
    "expect 2 items to be returned and 0 counts filtered out"
  );
  t.equal(response[0].name, "Molly", "expect Molly to be the first name");
  t.equal(response[0].count, 12, "expect 12 to be the first count");
  t.notEqual(
    response[0].thumbnail.indexOf("64"),
    "-1",
    "expect thumbnail to contain 64"
  );
});

tap.test("Given thumbnail too big", async t => {
  const response = await getResponse(singlePayload(63));

  t.equal(response[0].thumbnail, null, "expect no thumbnail to be returned");
});

tap.test("Given thumbnail too small", async t => {
  const response = await getResponse(singlePayload(63));

  t.equal(response[0].thumbnail, null, "expect no thumbnail to be returned");
});

tap.test("Given multiple correct thumbnails use the largest", async t => {
  const response = await getResponse({
      payload: [
          userBuilder().with({
              logos: [
                  logoBuilder(64),
                  logoBuilder(128)
              ]
          }).build()
      ]
  });

  t.notEqual(response[0].thumbnail.indexOf(128), -1, "expect largest thumbnail to be returned");
});

async function getResponse(request) {
  var result = await handler(
    {
      body: JSON.stringify(request)
    },
    {}
  );

  const { response } = JSON.parse(result.body);
  return response;
}

function singlePayload(size) {
  return {
    payload: [
      {
        name: "Molly",
        count: 12,
        logos: [logoBuilder(size)]
      }
    ]
  };
}

function dataBuilder(obj) {
  return {
    with: assign => dataBuilder({ ...obj, ...assign }),
    build: () => obj
  };
}

function userBuilder() {
  return dataBuilder({
    name: "Molly",
    count: 12,
    logos: [logoBuilder(64)]
  });
}

function logoBuilder(size) {
  return {
    size: `${size}x${size}`,
    url: `https://example.com/${size}x${size}.png`
  };
}
