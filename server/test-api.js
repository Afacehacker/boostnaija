const dotenv = require('dotenv');
const smmApiService = require('./services/smmApiService');

dotenv.config();

const testBalance = async () => {
  try {
    console.log('--- Testing API Connection ---');
    if (!process.env.SMM_API_KEY) {
        throw new Error('SMM_API_KEY is missing');
    }
    const balance = await smmApiService.getBalance();
    console.log('--- Connection Successful! ---');
    console.log('Panel Balance:', balance);
  } catch (error) {
    console.error('API TEST FAILED:', error.message);
  }
};

testBalance();
