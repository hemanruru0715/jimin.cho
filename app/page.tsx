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
      target: 'https://warpcast.com/~/compose?text=Check your Moxie stats. Frame by @hemanruru&embeds[]=https://hemanruru.vercel.app/' 
    },
  ],
  image: {
    src: `${NEXT_PUBLIC_URL}/mainImage.png`,
    //src: `${NEXT_PUBLIC_URL}/park-3.png`,
    //src: `${NEXT_PUBLIC_URL}/api/og/pageMain.tsx`,
    aspectRatio: '1:1',
  },
  postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
});


export const metadata: Metadata = {
  title: 'hemanruru.vercel.app',
  description: 'LFG',
  metadataBase: new URL('https://hemanruru.vercel.app'),  // 기본 URL 설정
  openGraph: {
    title: 'hemanruru.vercel.app',
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
      <h1>hemanruru.vercel.app</h1>
    </>
  );
}
