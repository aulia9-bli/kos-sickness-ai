import { Groq } from 'groq-sdk';

let groqClient = null;

const getGroqClient = () => {
  if (!groqClient) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error('GROQ_API_KEY tidak ditemukan di environment variables');
    }
    groqClient = new Groq({ apiKey });
  }
  return groqClient;
};

export { getGroqClient };
export default { getGroqClient };
