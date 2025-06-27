// services/asaasService.ts
import { cleanString } from "@utils/index";
import axios from "axios";

const ASAAS_API_URL = process.env.ASAAS_API_URL;
const ASAAS_API_KEY = process.env.ASAAS_API_KEY;

interface PixQRCodeParams {
  customerId: string;
  amount: number;
  dueDate: string;
  description: string;
}

interface PixQRCodeResponse {
  encodedImage: string;
  payload: string;
  paymentProviderId: string;
}

interface CustomerParams {
  name: string;
  cpfCnpj: string;
  email?: string;
  mobilePhone?: string;
}

interface CustomerResponse {
  id: string;
}

export async function generateCustomer(
  customerData: CustomerParams
): Promise<CustomerResponse> {
  try {
    const response = await axios.post(
      `${ASAAS_API_URL}/customers`,
      {
        name: cleanString(customerData.name, true),
        cpfCnpj: customerData.cpfCnpj,
        email: customerData.email || null,
        mobilePhone: cleanString(customerData.mobilePhone || null, true),
      },
      {
        headers: {
          "Content-Type": "application/json",
          access_token: ASAAS_API_KEY,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error generating customer:", error);
    throw new Error("Failed to create customer");
  }
}

export async function generatePixQRCode({
  customerId,
  amount,
  dueDate,
  description,
}: PixQRCodeParams): Promise<PixQRCodeResponse> {
  try {
    const paymentResponse = await axios.post(
      `${ASAAS_API_URL}/payments`,
      {
        billingType: "PIX",
        customer: customerId,
        value: amount,
        dueDate: dueDate,
        description: description,
      },
      {
        headers: {
          "Content-Type": "application/json",
          access_token: ASAAS_API_KEY,
        },
      }
    );

    const paymentId = paymentResponse.data.id; // ID da cobrança gerada

    // 2. Obter o QR Code via endpoint GET /payments/{paymentId}/pixQrCode
    const qrCodeResponse = await axios.get(
      `${ASAAS_API_URL}/payments/${paymentId}/pixQrCode`,
      {
        headers: {
          accept: "application/json",
          access_token: ASAAS_API_KEY,
        },
      }
    );

    return {
      encodedImage: qrCodeResponse.data.encodedImage,
      payload: qrCodeResponse.data.payload,
      paymentProviderId: paymentId,
    };
  } catch (error) {
    console.error("Error generating PIX QR Code:", error);
    throw new Error("Failed to generate PIX QR Code");
  }
}

export async function handleAsaasWebhook(webhookData: any) {
  if (webhookData.event === "PAYMENT_RECEIVED") {
    return {
      paymentProviderReferenceId: webhookData.payment.id,
      status: "paid",
    };
  }
  return null;
}
