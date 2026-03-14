const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, 'server/.env') });

const ServiceSchema = new mongoose.Schema({
  name: String,
  category: String,
  active: Boolean
});

const Service = mongoose.model('Service', ServiceSchema);

async function checkLocalTikTok() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const count = await Service.countDocuments({ active: true });
    const tiktokCount = await Service.countDocuments({ 
      active: true,
      $or: [
        { name: { $regex: /tiktok/i } },
        { category: { $regex: /tiktok/i } }
      ]
    });
    
    console.log(`Total Active Services in DB: ${count}`);
    console.log(`TikTok Services in DB: ${tiktokCount}`);
    
    if (tiktokCount > 0) {
        const samples = await Service.find({ 
            active: true,
            $or: [
                { name: { $regex: /tiktok/i } },
                { category: { $regex: /tiktok/i } }
            ]
        }).limit(5);
        samples.forEach(s => console.log(`- ${s.category} | ${s.name}`));
    }
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkLocalTikTok();
