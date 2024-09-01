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

// 서버 컴포넌트에서 데이터를 페칭하는 함수
async function fetchFrameData() {
  const res = await fetch(`${NEXT_PUBLIC_URL}/api/frame`, {
    method: 'POST',
    // 필요한 경우 쿠키나 인증 헤더를 추가할 수 있습니다.
    // headers: { 'Authorization': `Bearer ${token}` }
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch frame data');
  }

  return res.json();
}

export const metadata: Metadata = {
  title: 'zizzamia.xyz',
  description: 'LFG',
  openGraph: {
    title: 'zizzamia.xyz',
    description: 'LFG',
    images: [`${NEXT_PUBLIC_URL}/park-1.png`],
  },
};

export default async function Page() {
  // 서버 컴포넌트에서 데이터를 직접 페칭
  const frameData = await fetchFrameData();

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
