import { getFrameMetadata } from '@coinbase/onchainkit/frame';
import type { Metadata } from 'next';
import { NEXT_PUBLIC_URL } from './config';
import { ImageResponse } from "@vercel/og";

const frameMetadata = getFrameMetadata({
  buttons: [
    {
      label: 'MyStats/🔎',
    },
    {
      action: 'link', 
      label: '🔄Share', 
      target: 'https://warpcast.com/~/compose?text=Check your Moxie stats. Frame by @hemanruru&embeds[]=https://jimin-cho.vercel.app/' 
    },
  ],
  image: {
    //src: `${NEXT_PUBLIC_URL}/mainImage.svg`,
    src: `${NEXT_PUBLIC_URL}/park-3.png`,
    //src: `${NEXT_PUBLIC_URL}/api/og/pageMain.tsx`,
    aspectRatio: '1:1',
  },
  postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
});


export const metadata: Metadata = {
  title: 'jimin-cho.vercel.app',
  description: 'LFG',
  metadataBase: new URL('https://jimin-cho.vercel.app'),  // 기본 URL 설정
  openGraph: {
    title: 'jimin-cho.vercel.app',
    description: 'Check the MOXIE stats',
     images: [`${NEXT_PUBLIC_URL}/park-3.png`],
  },
  other: {
    ...frameMetadata,
  },
};

export default function Page() {
  return (
    <>
      <h1>jimin-cho.vercel.app</h1>
    </>
  );
}
