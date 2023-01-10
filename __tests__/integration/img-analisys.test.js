const aws = require("aws-sdk");

aws.config.update({
  region: "us-east-1",
});

const { describe, test, expect } = require("@jest/globals");
const requestMock = require("./../mocks/request.json");
const { main } = require("../../src");

describe("Image analyser test suite", () => {
    
  test("it should analyse successfuly yhe image return the results", async () => {
    const expected = {
      statusCode: 200,
      body: "Pastor alemão; Canino; Animal de estimação",
    };

    const result = await main(requestMock);

    expect(result).toStrictEqual(expected);
  });
  test("given an empty queryString it should return status code 400", async () => {
    const expected = {
      statusCode: 400,
      body: "An image URL is required",
    };
    const result = await main({
      queryStringParameters: {},
    });
    expect(result).toStrictEqual(expected);
  });
  test("given an invalid url it should return status code 500", async () => {
    const expected = {
      statusCode: 500,
      body: "Internal server error!",
    };
    const result = await main({
      queryStringParameters: {
        imageUrl: 3422,
      },
    });
    expect(result).toStrictEqual(expected)
  });
});
