const Service = require('../models/Service');
const smmApiService = require('../services/smmApiService');

exports.getServices = async (req, res) => {
  try {
    const services = await Service.find({ active: true });
    res.json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.syncServices = async (req, res) => {
  try {
    const externalServices = await smmApiService.getServices();
    
    if (!Array.isArray(externalServices)) {
      return res.status(500).json({ success: false, message: 'Invalid response from provider' });
    }

    const profitMargin = 1.25; // 25% profit margin for local market

    for (const s of externalServices) {
      const sellingRate = parseFloat(s.rate) * profitMargin;
      
      await Service.findOneAndUpdate(
        { externalId: s.service },
        {
          externalId: s.service,
          name: s.name,
          category: s.category,
          rate: parseFloat(s.rate),
          sellingRate: sellingRate,
          min: parseInt(s.min),
          max: parseInt(s.max)
        },
        { upsert: true, new: true }
      );
    }

    res.json({ success: true, message: 'Strategic database rebuilt successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!service) return res.status(404).json({ success: false, message: 'Service package not found' });
    res.json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
