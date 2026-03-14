const Service = require('../models/Service');
const smmApiService = require('../services/smmApiService');

// ── Get all active services (what the frontend calls) ────────────────────────
exports.getServices = async (req, res) => {
  try {
    const services = await Service.find({ active: true });
    res.json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Sync services from provider → DB (admin action) ──────────────────────────
exports.syncServices = async (req, res) => {
  try {
    const externalServices = await smmApiService.getServices();

    if (!Array.isArray(externalServices) || externalServices.length === 0) {
      return res.status(500).json({ success: false, message: 'No services returned from provider' });
    }

    // 60% profit margin: customer pays rate × 1.60
    const profitMargin = parseFloat(process.env.PROFIT_MARGIN) || 1.60;

    // Clear ALL old services so stale IDs from previous providers can't cause wrong API calls
    await Service.deleteMany({});

    const docs = [];
    for (const s of externalServices) {
      if (!s.service || !s.name) continue;
      const costRate    = parseFloat(s.rate) || 0;
      const sellingRate = parseFloat((costRate * profitMargin).toFixed(4));
      docs.push({
        externalId:  s.service.toString(),
        name:        s.name,
        category:    s.category || 'General',
        rate:        costRate,
        sellingRate: sellingRate,
        min:         parseInt(s.min)  || 0,
        max:         parseInt(s.max)  || 0,
        active:      true,
      });
    }

    await Service.insertMany(docs, { ordered: false });
    const syncedCount = docs.length;

    console.log(`[Sync] ✅ ${syncedCount} services synced. Margin: ${((profitMargin - 1) * 100).toFixed(0)}%`);
    res.json({
      success: true,
      message: `Synced ${syncedCount} services with ${((profitMargin - 1) * 100).toFixed(0)}% profit margin applied`,
      count: syncedCount,
    });
  } catch (error) {
    console.error('[Sync Error]', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Manual price override from admin panel ────────────────────────────────────
exports.updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    res.json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
