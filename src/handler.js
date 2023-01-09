module.exports = class Handler {
  constructor({ rekoSvc, translatorSvc }) {
    this.rekoSvc = rekoSvc;
    this.translatorSvc = translatorSvc;
  }

  async main(event) {
    console.log("Event: ", event);

    return {
        statusCode: 200,
        body: 'Hello!'
    }
  }
};
