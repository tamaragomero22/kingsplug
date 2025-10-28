import { HttpsProxyAgent } from "https-proxy-agent";

const getDashboardData = async (req, res) => {
  // The `requireAuth` middleware has run and populated `req.user`
  const user = req.user;

  if (!user) {
    // This should ideally be handled by an auth middleware, but as a fallback:
    return res.status(401).json({ message: "Not authenticated" });
  }

  let priceData = null;
  // Use an HttpsProxyAgent if a proxy is configured in the environment variables
  const agent = process.env.HTTP_PROXY
    ? new HttpsProxyAgent(process.env.HTTP_PROXY)
    : undefined;

  try {
    // Fetch external data (like crypto prices)
    const priceResponse = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=ngn",
      {
        // The agent will be used for the fetch request if it's defined
        // @ts-ignore - The `agent` property is valid but might not be in all TS type definitions for fetch
        agent: agent,
      }
    );
    if (priceResponse.ok) {
      priceData = await priceResponse.json();
    }
  } catch (error) {
    // Log the error but don't block the main response.
    // The dashboard can still render without the price.
    console.error("Could not fetch price data from CoinGecko:", error.message);
  }

  // Send personalized message and whatever data we managed to get.
  res.status(200).json({
    priceData, // This will be null if the fetch failed
    user: {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isKycVerified: user.isKycVerified,
    }, // Send user object separately
  });
};

export { getDashboardData };
