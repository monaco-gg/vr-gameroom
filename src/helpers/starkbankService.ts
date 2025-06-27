import starkbank from "starkbank";

// Stark Bank SDK configuration with project credentials.
const project = new starkbank.Project({
  environment: process.env.STARKBANK_ENVIRONMENT || "sandbox", // Use "sandbox" for testing, "production" for real environment.
  id: process.env.STARKBANK_PROJECT_ID || "", // Project ID provided by Stark Bank.
  privateKey: process.env.STARKBANK_PRIVATE_KEY || "", // Private key directly in the code for easier testing.
});

// Set the user for the SDK to use the configured project.
starkbank.user = project;

// Interface definition for the parameters of the dynamic PIX charge creation function.
interface PixChargeParams {
  amount: number | string; // Can be a number (in cents) or a string (e.g., "9.99").
  expiration: number; // Expiration time in seconds for the QR code.
  tags?: string[]; // Optional tags to categorize the transaction.
}

// Function to convert monetary values from reais to cents.
function convertToCents(amount: string | number): number {
  // If the value is a string like "9.99", it will be correctly converted to 999 cents.
  const value = parseFloat(amount.toString());
  return Math.round(value * 100);
}

// Function to create a PIX charge with a dynamic QR code.
export async function generatePixQRCode({
  amount,
  expiration,
  tags,
}: PixChargeParams) {
  try {
    // Convert the value to cents if needed.
    const amountInCents = convertToCents(amount);

    // Call Stark Bank to create the dynamic QR code.
    const brcodes = await starkbank.dynamicBrcode.create([
      {
        amount: amountInCents, // Value in cents.
        expiration, // QR code expiration time.
        tags, // Optional tags.
      },
    ]);

    // Return the essential data to display the QR code and track the transaction.
    return {
      encodedImage: brcodes[0].pictureUrl, // URL of the generated QR code image.
      payload: brcodes[0].id, // QR code payload (can be used to display the code).
      paymentProviderId: brcodes[0].uuid, // Unique ID generated for tracking the transaction.
    };
  } catch (error) {
    // In case of an error, log it to the console for easier analysis and throw the error for further handling.
    console.error("Error creating dynamic PIX charge:", error);
    throw error;
  }
}

export async function handleStarkbankWebhook(webhookData: any) {
  const { log } = webhookData.event;
  if (log.type === "credited") {
    const paymentProviderReferenceId = extractUuidFromTags(log.deposit.tags);
    if (paymentProviderReferenceId) {
      return {
        paymentProviderReferenceId,
        status: "paid",
      };
    }
  }
  return null;
}

function extractUuidFromTags(tags: string[]): string | null {
  const dynamicBrcodeTag = tags.find((tag) =>
    tag.startsWith("dynamic-brcode/")
  );
  return dynamicBrcodeTag ? dynamicBrcodeTag.split("dynamic-brcode/")[1] : null;
}
