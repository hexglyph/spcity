/* eslint-disable linebreak-style */
/* eslint-disable arrow-body-style */
/* eslint-disable max-len */
// The easiest solution to mock `next/router`: https://github.com/vercel/next.js/issues/7479
export const useRouter = () => {
  return {
    basePath: '.',
  };
};
