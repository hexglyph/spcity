import Document, { Head, Html, Main, NextScript } from 'next/document';

import { AppConfig } from '@/utils/AppConfig';
import Script from 'next/script';
import router from 'next/router';

// Need to create a custom _document because i18n support is not compatible with `next export`.
class MyDocument extends Document {
  // eslint-disable-next-line class-methods-use-this
  render() {
    return (
      <Html lang={AppConfig.locale}>
        
        <Head />
        <body>
          <Script
          strategy='beforeInteractive'
            src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_API_KEY_MAPS}`}
          />
          <Script strategy="beforeInteractive" src={`${router.basePath}/assets/js/googlemaps.js`} />
      <Script
        type="module"
        strategy='beforeInteractive'
        src="https://cdn.what3words.com/javascript-components@4-latest/dist/what3words/what3words.esm.js"
      ></Script>
      <Script
        strategy='beforeInteractive'
        noModule
        src={`https://cdn.what3words.com/javascript-components@4-latest/dist/what3words/what3words.js?key=${process.env.NEXT_PUBLIC_API_KEY_WORD}`}
      ></Script>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
