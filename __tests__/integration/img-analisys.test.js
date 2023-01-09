const { describe, test, expect } = require("@jest/globals");

const requestMock = require("./../mocks/request.json");
const { main } = require("../../src");

describe("Image analyser test suite", () => {
  test(
    "it should analyse successfuly yhe image return the results",
    async () => {
      const expected = {
        statusCode: 200,
        body: "",
      };

      const result = await main(requestMock);

      expect(result).toStrictEqual(expected);
    }
  );
  test.todo("given an empty queryString it should return status code 400");
  test.todo("given an invalid url it should return status code 500");
});
