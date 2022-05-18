// @ts-nocheck
import { ConvertToCoordinatesClient, ConvertToCoordinatesOptions, ConvertToCoordinatesResponse } from '@what3words/api';

export default async function handle(req, res) {
  const API_KEY: string = process.env.WHAT3WORDS_API_KEY as string;
  const client: ConvertToCoordinatesClient = ConvertToCoordinatesClient.init(API_KEY)
  const options: ConvertToCoordinatesOptions = { words: 'filled.count.soap' };
  client.run(options)
  .then((res: ConvertToCoordinatesResponse) => console.log('Convert to coordinates', res));
}



