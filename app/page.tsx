// import { getFrameMetadata } from '@coinbase/onchainkit/frame';
// import type { Metadata } from 'next';
// import { NEXT_PUBLIC_URL } from './config';

// const frameMetadata = getFrameMetadata({
//   buttons: [
//     {
//       label: 'Story time',
//     },
//     // {
//     //   action: 'tx',
//     //   label: 'Send Base Sepolia',
//     //   target: `${NEXT_PUBLIC_URL}/api/tx`,
//     //   postUrl: `${NEXT_PUBLIC_URL}/api/tx-success`,
//     // },
//   ],
//   image: {
//     src: `${NEXT_PUBLIC_URL}/park-3.png`,
//     aspectRatio: '1:1',
//   },
//   input: {
//     text: 'Tell me a story',
//   },
//   postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
// });

// export const metadata: Metadata = {
//   title: 'zizzamia.xyz',
//   description: 'LFG',
//   metadataBase: new URL('https://lemon-frame.vercel.app'),  // 기본 URL 설정
//   openGraph: {
//     title: 'zizzamia.xyz',
//     description: 'LFG',
//     // images: [`${NEXT_PUBLIC_URL}/park-1.png`],
//   },
//   other: {
//     ...frameMetadata,
//   },
// };

// export default function Page() {
//   return (
//     <>
//       <h1>zizzamia.xyz</h1>
//     </>
//   );
// }



import { getFrameMetadata } from '@coinbase/onchainkit/frame';
import type { Metadata } from 'next';
import { NEXT_PUBLIC_URL } from './config';
import React from 'react';

let frameMetadata;

try {
  frameMetadata = getFrameMetadata({
    buttons: [
      {
        label: 'Story time',
      },
      // {
      //   action: 'tx',
      //   label: 'Send Base Sepolia',
      //   target: `${NEXT_PUBLIC_URL}/api/tx`,
      //   postUrl: `${NEXT_PUBLIC_URL}/api/tx-success`,
      // },
    ],
    image: {
      src: `${NEXT_PUBLIC_URL}/park-3.png`,
      aspectRatio: '1:1',
    },
    input: {
      text: 'Tell me a story',
    },
    postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
  });
} catch (error) {
  console.error('Error generating frame metadata:', error);
  frameMetadata = {}; // 기본값 또는 fallback 값을 설정할 수 있습니다.
}

export const metadata: Metadata = {
  title: 'zizzamia.xyz',
  description: 'LFG',
  metadataBase: new URL('https://lemon-frame.vercel.app'),  // 기본 URL 설정
  openGraph: {
    title: 'zizzamia.xyz',
    description: 'LFG',
    // images: [`${NEXT_PUBLIC_URL}/park-1.png`],
  },
  other: {
    ...frameMetadata,
  },
};

export default function Page() {
  return (
    <>
      <h1>zizzamia.xyz</h1>
    </>
  );
}


