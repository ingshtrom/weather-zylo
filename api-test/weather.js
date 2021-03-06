require('dotenv').config();

const chakram = require('chakram');
const { expect } = require('chai');

const baseUrl = process.env.BASE_URL;
if (!baseUrl) {
  throw new Error('BASE_URL not defined.');
}

describe('Weather', function () {
  it('should throw error if no location set', function () {
    return chakram.get(`${baseUrl}/weather?d=1`)
      .then(res => {
        expect(res.response.statusCode).to.equal(400);
        expect(res.body.error).to.equal('Invalid location');
      });
  });
  it('should throw error if no date set', function () {
    return chakram.get(`${baseUrl}/weather?l=Noblesville,IN`)
      .then(res => {
        expect(res.response.statusCode).to.equal(400);
        expect(res.body.error).to.equal('Invalid date');
      });
  });

  it('should return data in the correct shape for Noblesville and now', function () {
    return chakram.get(`${baseUrl}/weather?l=Noblesville, IN&d=${Date.now()}`)
      .then(res => {
        expect(res.response.statusCode).to.equal(200);
        expect(res.body.error).to.be.undefined;
        expect(res.body.hourly.data).to.exist;
        expect(res.body.hourly.data.length).to.equal(24);
        expect(res.body.hourly.data[0]).to.have.all.keys([
          'time',
          'temperature',
          'uvIndex',
          'type',
          'precipProbability',
          'precipAccumulation',
          'visibility'
        ]);
      });
  });

  it('should set the header `x-cached: 0` for the first call', function () {
    return chakram.get(`${baseUrl}/weather?l=Noblesville, IN&d=${Date.now()}`)
      .then(res => {
        expect(res.response.statusCode).to.equal(200);
        expect(res.response.headers['x-cached']).to.equal('0');
      });
  });

  it('should set the header `x-cached: 1` for repeated calls', function () {
    const date = Date.now();
    return chakram.get(`${baseUrl}/weather?l=Noblesville, IN&d=${date}`)
      .then(res => {
        expect(res.response.statusCode).to.equal(200);
        expect(res.response.headers['x-cached']).to.equal('0');
        return chakram.get(`${baseUrl}/weather?l=Noblesville, IN&d=${date}`);
      })
      .then(res => {
        expect(res.response.statusCode).to.equal(200);
        expect(res.response.headers['x-cached']).to.equal('1');
      });
  });
});
