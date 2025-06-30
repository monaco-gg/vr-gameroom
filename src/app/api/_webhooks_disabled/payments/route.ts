import { NextRequest, NextResponse } from "next/server";
import { handleAsaasWebhook } from "@helpers/asaasService";
import { handleStarkbankWebhook } from "@helpers/starkbankService";
import { updateOrderAndAddCoins } from "@helpers/orderService";

export async function POST(req: NextRequest) {
  try {
    const webhookData = await req.json();

    let result;

    if (isAsaasWebhook(webhookData)) {
      result = await handleAsaasWebhook(webhookData);
    } else if (isStarkbankWebhook(webhookData)) {
      result = await handleStarkbankWebhook(webhookData);
    }

    if (result) {
      await updateOrderAndAddCoins(
        result.paymentProviderReferenceId,
        result.status
      );
      return NextResponse.json(
        { message: "Order updated and coins added successfully" },
        { status: 200 }
      );
    }

    return NextResponse.json({ message: "Webhook received" }, { status: 200 });
  } catch (err) {
    console.error("Failed to process webhook:", err);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

function isAsaasWebhook(webhookData: any): boolean {
  return webhookData.payment && webhookData.event === "PAYMENT_RECEIVED";
}

function isStarkbankWebhook(webhookData: any): boolean {
  const { event } = webhookData;
  return event?.log?.deposit !== undefined && event.subscription === "deposit";
}
