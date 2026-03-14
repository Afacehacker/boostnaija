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

    console.log(`--- Fetching all services from ${process.env.SMM_API_URL} ---`);
    const externalServices = await smmApiService.getServices();

    if (!Array.isArray(externalServices) || externalServices.length === 0) {
      console.error('FAILED: Provider returned no services.');
      process.exit(1);
    }

    console.log(`--- Found ${externalServices.length} services ---`);

    const profitMargin = parseFloat(process.env.PROFIT_MARGIN) || 1.60;
    console.log(`--- Applying ${((profitMargin - 1) * 100).toFixed(0)}% profit margin ---`);

    let syncedCount = 0;

    for (const s of externalServices) {
      if (!s.service || !s.name) continue;

      const costRate    = parseFloat(s.rate) || 0;
      const sellingRate = parseFloat((costRate * profitMargin).toFixed(4));

      await Service.findOneAndUpdate(
        { externalId: s.service.toString() },
        {
          externalId:  s.service.toString(),
          name:        s.name,
          category:    s.category || 'Uncategorized',
          rate:        costRate,
          sellingRate: sellingRate,
          min:         parseInt(s.min)  || 0,
          max:         parseInt(s.max)  || 0,
          active:      true,
        },
        { upsert: true, new: true }
      );
      syncedCount++;
    }

    console.log(`✅ SYNC COMPLETE: ${syncedCount} services saved to DB.`);
    console.log(`   Cost price × ${profitMargin} = customer price (${((profitMargin - 1) * 100).toFixed(0)}% profit)`);
    process.exit(0);
  } catch (error) {
    console.error('CRITICAL ERROR:', error.message);
    process.exit(1);
  }
};

syncAllServices();
