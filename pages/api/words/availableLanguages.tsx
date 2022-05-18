import { AvailableLanguagesClient, AvailableLanguagesResponse } from '@what3words/api';

export default async function handle(req, res) {
    const API_KEY: string = process.env.WHAT3WORDS_API_KEY as string;
    const client: AvailableLanguagesClient = AvailableLanguagesClient.init(API_KEY);
    client.run()
    .then((res: AvailableLanguagesResponse) => console.log('Available Languages', res));
}