const axios = require('axios');

const SMM_API_URL = process.env.SMM_API_URL || 'https://smm.com.ng/api/v2';
const SMM_API_KEY = process.env.SMM_API_KEY;

const smmApi = axios.create({
  baseURL: SMM_API_URL,
  params: {
    key: SMM_API_KEY
  }
});

exports.getServices = async () => {
  try {
    const response = await smmApi.post('', null, {
      params: { action: 'services' }
    });
    return response.data;
  } catch (error) {
    console.error('SMM API Error (Services):', error.response?.data || error.message);
    throw error;
  }
};

exports.placeOrder = async (serviceId, link, quantity) => {
  try {
    const response = await smmApi.post('', null, {
      params: {
        action: 'add',
        service: serviceId,
        link: link,
        quantity: quantity
      }
    });
    return response.data;
  } catch (error) {
    console.error('SMM API Error (Add Order):', error.response?.data || error.message);
    throw error;
  }
};

exports.getOrderStatus = async (orderId) => {
  try {
    const response = await smmApi.post('', null, {
      params: {
        action: 'status',
        order: orderId
      }
    });
    return response.data;
  } catch (error) {
    console.error('SMM API Error (Status):', error.response?.data || error.message);
    throw error;
  }
};
