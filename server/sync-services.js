const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const Service = require('./models/Service');
const smmApiService = require('./services/smmApiService');

const syncAllServices = async () => {
  try {
    console.log('--- Connecting to DB ---');
    if (!process.env.MONGO_URI) throw new Error('MONGO_URI is missing');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('--- DB Connected ---');

    console.log('--- Fetching services from BOTH providers ---');
    const merged = await smmApiService.getServicesFromBoth();

    if (!merged || merged.length === 0) {
      console.error('FAILED: No services returned from any provider.');
      process.exit(1);
    }

    console.log(`--- Discovered ${merged.length} unique services (cheapest provider per service) ---`);

    // Profit margin: 60% above cost  →  multiply rate by 1.60
    const profitMargin = parseFloat(process.env.PROFIT_MARGIN) || 1.60;
    console.log(`--- Applying ${((profitMargin - 1) * 100).toFixed(0)}% profit margin ---`);

    let syncedCount = 0;

    for (const s of merged) {
      const stableId = s.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').slice(0, 80)
                       + '-' + s.providerServiceId;

      const sellingRate = parseFloat((s.rate * profitMargin).toFixed(4));

      await Service.findOneAndUpdate(
        { externalId: stableId },
        {
          externalId: stableId,
          name: s.name,
          category: s.category || 'Uncategorized',
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

    console.log(`✅ SYNC COMPLETE: ${syncedCount} services synced.`);
    console.log(`   Provider 1 (smm.com.ng):              ${merged.filter(s => s.provider === 'smm1').length} cheapest`);
    console.log(`   Provider 2 (reallysimplesocial.com):  ${merged.filter(s => s.provider === 'smm2').length} cheapest`);
    process.exit(0);
  } catch (error) {
    console.error('CRITICAL ERROR:', error.message);
    process.exit(1);
  }
};

syncAllServices();
