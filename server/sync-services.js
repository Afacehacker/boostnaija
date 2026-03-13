const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Path is handled relative to execution directory
dotenv.config();

const Service = require('./models/Service');
const smmApiService = require('./services/smmApiService');

const syncAllServices = async () => {
  try {
    console.log('--- Connecting to Command Center DB ---');
    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI is missing');
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('--- DB Connected Successfully ---');

    console.log('--- Fetching Strategic Intelligence from SMM.com.ng ---');
    const externalServices = await smmApiService.getServices();

    if (!Array.isArray(externalServices)) {
      console.error('FAILED: API response is not a valid service array.');
      process.exit(1);
    }

    console.log(`--- Discovered ${externalServices.length} Service Packages ---`);
    console.log('--- Rebuilding Local Armory Database ---');

    const profitMargin = 1.25; // 25% profit margin

    // Clear existing to avoid stale services
    // await Service.deleteMany({}); 

    for (const s of externalServices) {
      if (!s.service || !s.name) continue;
      
      const sellingRate = parseFloat(s.rate) * profitMargin;
      
      await Service.findOneAndUpdate(
        { externalId: s.service.toString() },
        {
          externalId: s.service.toString(),
          name: s.name,
          category: s.category || 'Uncategorized',
          rate: parseFloat(s.rate),
          sellingRate: sellingRate,
          min: parseInt(s.min) || 0,
          max: parseInt(s.max) || 0,
          active: true
        },
        { upsert: true, new: true }
      );
    }

    console.log('--- SYNC COMPLETE: Strategic Armory is Live! ---');
    process.exit(0);
  } catch (error) {
    console.error('CRITICAL ERROR:', error.message);
    process.exit(1);
  }
};

syncAllServices();
