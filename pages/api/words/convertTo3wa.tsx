// @ts-nocheck
import { ConvertTo3waClient, ConvertTo3waOptions, ConvertTo3waResponse } from '@what3words/api';

export default async function handle(req, res) {
  const API_KEY: string = process.env.WHAT3WORDS_API_KEY as string;
  const client: ConvertTo3waClient = ConvertTo3waClient.init(API_KEY)
  const options: ConvertTo3waOptions = { lat: 51.520847, lng: -0.195521 };
  client.run(options)
      .then((res: ConvertTo3waResponse) => console.log('Convert to 3wa', res));
}



