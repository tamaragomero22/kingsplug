import axios from "axios";

const BLOCKONOMICS_API_URL = "https://www.blockonomics.co/api/new_address";

/**
 * Generate a new unique Bitcoin address via the Blockonomics API.
 * Blockonomics derives the next unused address from the xPub registered
 * in the merchant's Wallet Watcher.
 *
 * @returns {Promise<string>} A new bc1 Bitcoin address
 */
export async function generateNewAddress() {
    const apiKey = process.env.BLOCKONOMICS_API_KEY;

    if (!apiKey) {
        throw new Error("BLOCKONOMICS_API_KEY environment variable is not set.");
    }

    try {
        const response = await axios.post(
            BLOCKONOMICS_API_URL,
            {},
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                },
            }
        );

        const address = response.data.address;

        if (!address) {
            throw new Error("Blockonomics API returned no address.");
        }

        return address;
    } catch (error) {
        const data = error.response?.data;
        const message =
            data?.error?.message ||
            data?.message ||
            (typeof data === 'string' ? data : null) ||
            (typeof data === 'object' ? JSON.stringify(data) : null) ||
            error.message ||
            "Unknown error";
        console.error("Blockonomics address generation failed:", message);
        throw new Error(`Failed to generate Bitcoin address: ${message}`);
    }
}
