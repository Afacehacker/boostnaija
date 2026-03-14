const axios = require('axios');

/**
 * Single-provider SMM API service.
 * Provider: ReallySimpleSocial (https://reallysimplesocial.com/api/v2)
 * All requests are POST with URLSearchParams body.
 */
class SmmApiService {
  async makeRequest(action, params = {}) {
    const apiKey = process.env.SMM_API_KEY;
    const apiUrl = process.env.SMM_API_URL || 'https://reallysimplesocial.com/api/v2';

    if (!apiKey) throw new Error('SMM_API_KEY is missing in environment variables');

    const payload = new URLSearchParams();
    payload.append('key', apiKey);
    payload.append('action', action);
    Object.keys(params).forEach((key) => payload.append(key, params[key]));

    try {
      const response = await axios.post(apiUrl, payload, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        timeout: 15000,
      });

      if (response.data && response.data.error) {
        throw new Error(response.data.error);
      }

      return response.data;
    } catch (error) {
      console.error(`[SMM API Error] action=${action}:`, error.message);
      throw error;
    }
  }

  /** Fetch all services from the provider */
  async getServices() {
    return await this.makeRequest('services');
  }

  /** Get provider account balance */
  async getBalance() {
    return await this.makeRequest('balance');
  }

  /**
   * Place an order with the provider.
   * @param {object} data - { service, link, quantity }
   */
  async addOrder(data) {
    return await this.makeRequest('add', data);
  }

  /** Get status of a single order by provider order ID */
  async getStatus(orderId) {
    return await this.makeRequest('status', { order: orderId });
  }

  /** Get status of multiple orders */
  async getMultiStatus(orderIds) {
    return await this.makeRequest('status', { orders: orderIds.join(',') });
  }
}

module.exports = new SmmApiService();
