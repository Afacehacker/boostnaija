const axios = require('axios');

class SmmApiService {
  async makeRequest(action, params = {}) {
    try {
      const apiKey = process.env.SMM_API_KEY;
      const apiUrl = process.env.SMM_API_URL || 'https://smm.com.ng/api/v2';

      if (!apiKey) {
        throw new Error('SMM_API_KEY is missing in environment variables');
      }

      const payload = new URLSearchParams();
      payload.append('key', apiKey);
      payload.append('action', action);
      Object.keys(params).forEach(key => payload.append(key, params[key]));

      const response = await axios.post(apiUrl, payload);

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      return response.data;
    } catch (error) {
      console.error(`SMM API Error (${action}):`, error.message);
      throw error;
    }
  }

  async getServices() {
    return await this.makeRequest('services');
  }

  async getBalance() {
    return await this.makeRequest('balance');
  }

  async addOrder(data) {
    // data: { service, link, quantity, ... }
    return await this.makeRequest('add', data);
  }

  async getStatus(orderId) {
    return await this.makeRequest('status', { order: orderId });
  }

  async getMultiStatus(orderIds) {
    return await this.makeRequest('status', { orders: orderIds.join(',') });
  }
}

module.exports = new SmmApiService();
