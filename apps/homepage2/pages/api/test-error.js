
import Sentry from '../../sentry';

console.log("SENTRY_DSN =", process.env.SENTRY_DSN);

export default async function handler(req, res) {
  try {
    throw new Error("🚨 Test Sentry error");
  } catch (err) {
    console.log("Sending error to Sentry:", err.message);
    Sentry.captureException(err);

    await Sentry.flush(2000);  // wait max 2s
    res.status(500).json({ message: "Error sent to Sentry" });
  }
}