const { getTravelData } = require('../src/server/getTravelData');

// Mocked function for API fetch data. Runs before the function is actually imported
jest.mock('../src/server/API', () => ({
  getGeonamesData: jest.fn(() => Promise.resolve({ data: { postalCodes: [{ lng: 1, lat: 2 }] } })),
  getPixabayData: jest.fn(() => Promise.resolve({ data: { hits: [{ webformatURL: 'www.example.com' }] } })),
  getWeatherbitData:
    jest.fn(() => Promise.resolve({ data: { data: [{ temp: 31, clouds: 100 }] } })),
}));

describe('getTravelData', () => {
  test('Object data gets returned with all data from the 3 different APIs', async () => {
    const req = { query: { placename: 'Test Place' } };
    const res = { send: jest.fn() };

    await getTravelData(req, res);

    expect(res.send).toHaveBeenCalledWith({
      lat: 2, lng: 1, temp: 31, clouds: 100, finalPicture: 'www.example.com',
    });
  });
});
