import { useRouter } from 'next/router';
import Script from 'next/script';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';

export default function Index() {
  const router = useRouter();

  return (
    <div>
      
      
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
              <label htmlFor="w3w">what3words address (optional):</label>
              <input name="w3w" type="text" />
            </what3words-autosuggest>
            <div id="map"></div>
          </div>
        </div>
        <div>
          
          
        </div>
      </Main>
    </div>
  );
}
