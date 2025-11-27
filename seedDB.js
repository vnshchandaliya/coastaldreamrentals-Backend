import dotenv from "dotenv";
import mongoose from "mongoose";
import Property from "./models/Property.js";
dotenv.config();
const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB Connected to Atlas"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));


    console.log("✅ MongoDB Connected to rentalpro");

    await Property.deleteMany({});
    console.log("🧹 Old data cleared");

    const seedProperties = [
      {
        _id: new  mongoose.Types.ObjectId("691c872c76d17832c4ba628b"),
        title: "Sea Dunes Beach Front",
        guests: 2,
        floors: 1,
        bedroom: 3,
        bathroom: 3,
        sleep: 8,
        image: "https://www.coastaldreamrentals.com/img/property-img-1/img-7.jpg",
        link: "/sea-dunes-beach-front",
        latitude: 30.3968971,
        longitude: -86.6167099,
        basePricePerNight: 250,
        cleaningFee: 100,
        serviceFeePercent: 5,
        taxesPercent: 7,
      },
      {
        _id: new mongoose.Types.ObjectId("68f7edf6fa0cfc5e57cebea4"),
        title: "Jade East 210",
        guests: 6,
        floors: 1,
        bedroom: 3,
        bathroom: 3,
        sleep: 3,
        image: "https://www.coastaldreamrentals.com/img/property-img2/img-1.jpg",
        link: "/jade-east-210",
        latitude: 30.3846415,
        longitude: -86.4719508,
        basePricePerNight: 100,
        cleaningFee: 100,
        serviceFeePercent: 5,
        taxesPercent: 7,
      },
      {
        _id: new mongoose.Types.ObjectId("68f7edf6fa0cfc5e57cebeb0"),
        title: "Grand Caribbean West 213",
        guests: 6,
        floors: 1,
        bedroom: 1,
        bathroom: 1,
        sleep: 2,
        image: "https://www.coastaldreamrentals.com/img/property-img3/img-1.jpg",
        link: "/grand-caribbean-west-213",
        latitude: 30.382332,
        longitude: -86.418849,
        basePricePerNight: 150,
        cleaningFee: 100,
        serviceFeePercent: 5,
        taxesPercent: 7,
      },
      {
        _id: new mongoose.Types.ObjectId("68f7edf6fa0cfc5e57cebeb1"),
        title: "Crystal Sands",
        guests: 6,
        floors: 1,
        bedroom: 1,
        bathroom: 1.5,
        sleep: 6,
        image: "https://www.coastaldreamrentals.com/img/property-img4/img-1.jpg",
        link: "/crystal-sands",
        latitude: 30.3816755,
        longitude: -86.4209881,
        basePricePerNight: 200,
        cleaningFee: 100,
        serviceFeePercent: 5,
        taxesPercent: 7,
      },
      {
        _id: new mongoose.Types.ObjectId("68f7edf6fa0cfc5e57cebeb2"),
        title: "Beach Sanctuary, Destin",
        guests: 10,
        bedroom: 4,
        bathroom: 3.5,
        sleep: 10,
        image: "https://www.coastaldreamrentals.com/img/property-img5/img-1.jpg",
        link: "/beach-sanctuary-destin",
        latitude: 30.374828,
        longitude: -86.338449,
        basePricePerNight: 300,
        cleaningFee: 100,
        serviceFeePercent: 5,
        taxesPercent: 7,
      },
      {
        _id: new mongoose.Types.ObjectId("68f7edf6fa0cfc5e57cebeb3"),
        title: "Shoreline Towers 2051, Destin",
        guests: 5,
        floors: 1,
        bedroom: 3,
        bathroom: 3,
        sleep: 6,
        image: "https://www.coastaldreamrentals.com/img/property-img6/img-1.jpg",
        link: "/shoreline-towers-2051",
        latitude: 30.3841855,
        longitude: -86.4818538,
        basePricePerNight: 400,
        cleaningFee: 100,
        serviceFeePercent: 5,
        taxesPercent: 7,
      },
      {
        _id: new mongoose.Types.ObjectId("68f7edf6fa0cfc5e57cebeb4"),
        title: "Summer Breeze",
        guests: 5,
        bedroom: 1,
        bathroom: 1,
        sleep: 6,
        image: "https://www.coastaldreamrentals.com/img/property-img-7/Summer%20Breeze%20204_20250417_5%20(1).jpg",
        link: "/summer-breeze",
        latitude: 30.378859,
        longitude: -86.387664,
        basePricePerNight: 500,
        cleaningFee: 100,
        serviceFeePercent: 5,
        taxesPercent: 7,
      },
      {
        _id: new mongoose.Types.ObjectId("68f7edf6fa0cfc5e57cebeb5"),
        title: "Summer Spell",
        guests: 5,
        bedroom: 1,
        bathroom: 1,
        sleep: 6,
        image: "https://www.coastaldreamrentals.com/img/property-img-8/Summerspell%20106_20250304_19.jpg",
        link: "/summer-spell",
        latitude: 30.378858,
        longitude: -86.388078,
        basePricePerNight: 600,
        cleaningFee: 100,
        serviceFeePercent: 5,
        taxesPercent: 7,
      },
    ];

    const inserted = await Property.insertMany(seedProperties);
    console.log("✅ All properties seeded with stable IDs!");
  } catch (error) {
    console.error("❌ Error inserting data:", error);
  } finally {
    await mongoose.connection.close();
    console.log("🔒 Connection closed");
  }
};

seedDB();
