// @ts-nocheck
import { AvailableLanguagesClient, GridSectionClient, GridSectionOptions, GridSectionResponse } from '@what3words/api';

export default async function handle(req, res) {
    const API_KEY: string = process.env.NEXT_PUBLIC_WORD_API_KEY as string;
    const client: AvailableLanguagesClient = AvailableLanguagesClient.init(API_KEY);
    const options: GridSectionOptions = {
        southwest: { lat: 52.208867, lng: 0.117540 },
        northeast: { lat: 52.207988, lng: 0.116126 }
    };
    client.run(options)
        .then((res: GridSectionResponse) => console.log('Grid Section', res));
}