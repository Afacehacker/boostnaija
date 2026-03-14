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
    let syncedCount = 0;

    for (const s of externalServices) {
      if (!s.service || !s.name) continue;

      const sellingRate = Math.ceil(parseFloat(s.rate) * profitMargin);
      
      await Service.findOneAndUpdate(
        { externalId: s.service.toString() },
        {
          externalId: s.service.toString(),
          name: s.name,
          category: s.category || 'General',
          rate: parseFloat(s.rate),
          sellingRate: sellingRate,
          min: parseInt(s.min) || 0,
          max: parseInt(s.max) || 0,
          active: true
        },
        { upsert: true, new: true }
      );
      syncedCount++;
    }

    console.log(`Synced ${syncedCount} services from provider.`);
    res.json({ 
      success: true, 
      message: `Strategic database rebuilt: ${syncedCount} services synchronized`,
      count: syncedCount 
    });
  } catch (error) {
    console.error('Sync Error:', error.message);
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
