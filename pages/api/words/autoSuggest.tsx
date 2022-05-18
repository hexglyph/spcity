// @ts-nocheck
import { ApiVersion, AutosuggestClient, AutosuggestOptions, AutosuggestResponse } from '@what3words/api';

export default async function handle(req, res) {
    const API_KEY: string = process.env.WHAT3WORDS_API_KEY as string;
    const client: AutosuggestClient = AutosuggestClient.init(API_KEY);
    const options: AutosuggestOptions = {
    input: 'filled.count.s',
    };
    client.run(options)
    .then((res: AutosuggestResponse) =>
        console.log(`suggestions for "${AutosuggestOptions.input}"`, res)
    );
}