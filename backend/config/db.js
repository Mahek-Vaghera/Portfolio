import mongoose from "mongoose";
import dns from "node:dns";

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/portfolio_backend";

  mongoose.set("strictQuery", true);

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected");
    return mongoose.connection;
  } catch (error) {
    const needsDnsFallback =
      typeof mongoUri === "string" &&
      mongoUri.startsWith("mongodb+srv://") &&
      /querySrv|ENOTFOUND|EAI_AGAIN|ECONNREFUSED/i.test(String(error?.code ?? "") + " " + String(error?.message ?? ""));

    if (!needsDnsFallback) {
      throw error;
    }

    const fallbackServers = ["1.1.1.1", "8.8.8.8"];
    dns.setServers(fallbackServers);

    await mongoose.connect(mongoUri);
    console.log(`MongoDB connected using DNS fallback (${fallbackServers.join(", ")})`);
    return mongoose.connection;
  }
};

export default connectDB;
