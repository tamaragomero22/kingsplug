const getDashboardData = async (req, res) => {
    // The `checkUser` middleware has already run and populated `res.locals.user`
    const user = res.locals.user;

    if (!user) {
        // This should ideally be handled by an auth middleware, but as a fallback:
        return res.status(401).json({ message: 'Not authenticated' });
    }

    let priceData = null;
    try {
        // Fetch external data (like crypto prices)
        const priceResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=ngn');
        if (priceResponse.ok) {
            priceData = await priceResponse.json();
        }
    } catch (error) {
        // Log the error but don't block the main response.
        // The dashboard can still render without the price.
        console.error('Could not fetch price data from CoinGecko:', error.message);
    }

    // Send personalized message and whatever data we managed to get.
    res.status(200).json({
        message: `Welcome, ${user.email}`, // Personalized message
        priceData // This will be null if the fetch failed
    });
};

export { getDashboardData };