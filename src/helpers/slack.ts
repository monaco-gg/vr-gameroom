import axios, { AxiosResponse } from 'axios';

/**
 * Sends a message to a Slack channel using a webhook URL.
 * 
 * @param {string} webhookUrl - The Slack webhook URL.
 * @param {string} message - The message to send to the Slack channel.
 * @returns {Promise<AxiosResponse>} - The Axios response from the Slack API.
 */
export async function sendSlackMessage(message: string): Promise<AxiosResponse> {
  try {
    const payload = {
      text: message,
    };

    const response = await axios.post(process.env.SLACK_HOOK_ORDER_URL as string, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response;
  } catch (error) {
    console.error('Error sending message to Slack:', error);
    throw error;
  }
}

