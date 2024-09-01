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
//   //metadataBase: new URL('https://lemon-frame.vercel.app'),  // 기본 URL 설정
//   openGraph: {
//     title: 'zizzamia.xyz',
//     description: 'LFG',
//      images: [`${NEXT_PUBLIC_URL}/park-1.png`],
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

export async function getServerSideProps() {
  const res = await fetch(`${NEXT_PUBLIC_URL}/api/frame`, {
    method: 'POST',
  });
  const frameData = await res.json();

  return {
    props: {
      frameData,
    },
  };
}

export const metadata: Metadata = {
  title: 'zizzamia.xyz',
  description: 'LFG',
  openGraph: {
    title: 'zizzamia.xyz',
    description: 'LFG',
    images: [`${NEXT_PUBLIC_URL}/park-1.png`],
  },
  other: {
    // frameMetadata could be set here if it's needed
  },
};

export default function Page({ frameData }: { frameData: any }) {
  return (
    <>
      <h1>zizzamia.xyz</h1>
      {/* Render the buttons and image from the frameData */}
      <div>
        <img src={frameData.image.src} alt="Dynamic Image" />
        <ul>
          {frameData.buttons.map((button: any, index: number) => (
            <li key={index}>
              <a href={button.target || '#'}>{button.label}</a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
