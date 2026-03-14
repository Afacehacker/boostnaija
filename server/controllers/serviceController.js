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
    // Fetch from BOTH providers and pick cheapest per service
    const merged = await smmApiService.getServicesFromBoth();

    if (!merged || merged.length === 0) {
      return res.status(500).json({ success: false, message: 'No services returned from any provider' });
    }

    // Profit margin: 60% above cost price  →  multiply by 1.60
    const profitMargin = parseFloat(process.env.PROFIT_MARGIN) || 1.60;

    let syncedCount = 0;

    for (const s of merged) {
      // Use a URL/space-safe slug of the name as the stable externalId
      const stableId = s.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').slice(0, 80)
                       + '-' + s.providerServiceId;

      const sellingRate = parseFloat((s.rate * profitMargin).toFixed(4));

      await Service.findOneAndUpdate(
        { externalId: stableId },
        {
          externalId: stableId,
          name: s.name,
          category: s.category || 'General',
          rate: s.rate,
          sellingRate,
          min: s.min,
          max: s.max,
          provider: s.provider,
          providerServiceId: s.providerServiceId,
          active: true,
        },
        { upsert: true, new: true }
      );
      syncedCount++;
    }

    console.log(`[Sync] ${syncedCount} services synced (60% margin, cheapest provider per service).`);
    res.json({
      success: true,
      message: `Synced ${syncedCount} services (cheapest provider selected, 60% profit margin applied)`,
      count: syncedCount,
    });
  } catch (error) {
    console.error('[Sync Error]', error.message);
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
