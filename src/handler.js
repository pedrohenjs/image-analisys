const { get } = require("axios");

module.exports = class Handler {
  constructor({ rekoSvc, translatorSvc }) {
    this.rekoSvc = rekoSvc;
    this.translatorSvc = translatorSvc;
  }

  async getImageBuffer(imageUrl) {
    const response = await get(imageUrl, {
      responseType: "arraybuffer",
    });

    const buffer = Buffer.from(response.data, "base64");

    return buffer;
  }
  async detectImageLabels(buffer) {
    const result = await this.rekoSvc
      .detectLabels({
        Image: {
          Bytes: buffer,
        },
      })
      .promise();

    const workingItems = result.Labels.filter(
      ({ Confidence }) => Confidence > 80
    );

    const names = workingItems
      .map(({ Name }) => Name)
      .slice(0, 3)
      .join("; ");
    console.log(JSON.stringify({ names }, null, 2));

    return names;
  }
  async translateText(text) {
    const params = {
      SourceLanguageCode: "en",
      TargetLanguageCode: "pt",
      Text: text,
    };

    const { TranslatedText } = await this.translatorSvc
      .translateText(params)
      .promise();

    return TranslatedText;
  }
  async main(event) {
    try {
      const imageUrl = event.queryStringParameters?.imageUrl;
      if (!imageUrl) {
        return {
          statusCode: 400,
          body: "An image URL is required",
        };
      }
      console.log("Downloading image...");
      const buffer = await this.getImageBuffer(imageUrl);

      console.log("Detecting labels...");
      const response = await this.detectImageLabels(buffer);

      console.log("Translating text...");
      const texts = await this.translateText(response);

      return {
        statusCode: 200,
        body: texts,
      };
    } catch (error) {
      console.log("deu ruim aq", error);
      return {
        statusCode: 500,
        body: "Internal server error!",
      };
    }
  }
};
