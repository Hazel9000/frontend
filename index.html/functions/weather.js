exports.handler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      departure: {
        code: "JFK",
        conditions: "Clear skies",
        temp: 22
      },
      destination: {
        code: "LAX",
        conditions: "Sunny",
        temp: 28
      }
    })
  };
};