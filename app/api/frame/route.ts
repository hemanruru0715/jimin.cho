
import { getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { init, validateFramesMessage } from '@airstack/frames';
import { getFarcasterUserDetails, FarcasterUserDetailsInput, FarcasterUserDetailsOutput } from '@airstack/frames';
import { NEXT_PUBLIC_URL } from '@/app/config';

async function getResponse(req: NextRequest): Promise<NextResponse> {
  try {

    const body = await req.json();

    // const apiKey = process.env.AIRSTACK_API_KEY;
    // if (!apiKey) {
    //   throw new Error("AIRSTACK_API_KEY is not defined in environment variables");
    // }
    
    //init(process.env.AIRSTACK_API_KEY ?? "");

    // const { isValid, message } = await validateFramesMessage(body);

    // if (!isValid) {
    //   return new NextResponse('Message not valid', { status: 500 });
    // }

    // const myFid = Number(message?.data?.fid) || 0;
    // const input: FarcasterUserDetailsInput = { fid: myFid };
    // const { data, error }: FarcasterUserDetailsOutput = await getFarcasterUserDetails(input);

    //  if (error) throw new Error(error);

    return new NextResponse(
      getFrameHtmlResponse({
        buttons: [
          { label: 'abcd' },
          { action: 'link', label: 'link/🔎', target: 'https://onchainkit.xyz' },
          { action: 'link', label: 'Dog pictures', target: 'https://www.naver.com' },
        ],
        //image: { src: `${NEXT_PUBLIC_URL}/api/og?fid=${myFid}` },
        image: { src: `${NEXT_PUBLIC_URL}/park-3.png` },
        postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
        //state: { time: new Date().toISOString() },
      })
    );
  } catch (error) {
    console.error('Error processing request:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
