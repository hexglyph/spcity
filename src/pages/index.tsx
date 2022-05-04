import { useRouter } from 'next/router';
import Script from 'next/script';

import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';

export default function Index() {
  const router = useRouter();

  return (
    <div>
      <Script
        type="module"
        src="https://cdn.what3words.com/javascript-components@4-latest/dist/what3words/what3words.esm.js"
      ></Script>
      <Script
        noModule
        src={`https://cdn.what3words.com/javascript-components@4-latest/dist/what3words/what3words.js?key=${process.env.NEXT_PUBLIC_API_KEY_WORD}`}
      ></Script>
      <Main
        meta={
          <Meta
            title="Next.js Boilerplate Presentation"
            description="Next js Boilerplate is the perfect starter code for your project. Build your React application with the Next.js framework."
          />
        }
      >
        <div>
          <div id="wrapper">
            <what3words-autosuggest
              id="autosuggest"
              api_key={process.env.NEXT_PUBLIC_API_KEY_WORD}
            >
              <input type="text" />
            </what3words-autosuggest>
            <div id="map"></div>
          </div>
        </div>
        <div>
          <Script
            src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_API_KEY_MAPS}`}
          />
          <Script strategy="afterInteractive" src={`${router.basePath}/assets/js/googlemaps.js`} />
        </div>
      </Main>
    </div>
  );
}
