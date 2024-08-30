// import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
// import { NextRequest, NextResponse } from 'next/server';
// import { NEXT_PUBLIC_URL } from '../../config';
// import {init, validateFramesMessage} from "@airstack/frames"
// import {getFarcasterUserDetails,FarcasterUserDetailsInput,FarcasterUserDetailsOutput} from "@airstack/frames";
// import { config } from "dotenv";

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// async function getResponse(req: NextRequest): Promise<NextResponse> {

//   config();
//   const apiKey = process.env.AIRSTACK_API_KEY;
//   if (!apiKey) {
//     throw new Error("AIRSTACK_API_KEY is not defined in .env file");
//   }

//   init(apiKey);

//   //const body: FrameRequest = await req.json();
//   const body = await req.json();
//  const { isValid, message } = await validateFramesMessage(body);

//  const myFid = Number(message?.data?.fid) || 0;
//  const input: FarcasterUserDetailsInput = {
//   fid: myFid,
// };
// const { data, error }: FarcasterUserDetailsOutput = await getFarcasterUserDetails(input);

// if (error) throw new Error(error);


//   // const { isValid, message } = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_ONCHAIN_KIT' });

//   // if (!isValid) {
//   //   return new NextResponse('Message not valid', { status: 500 });
//   // }

//   //const text = message.input || '';
//   let state = {
//     page: 0,
//   };

//   // try {
//   //   state = JSON.parse(decodeURIComponent(message.state?.serialized));
//   // } catch (e) {
//   //   console.error(e);
//   // }

//   // /**
//   //  * Use this code to redirect to a different page
//   //  */
//   // if (message?.button === 3) {
//   //   return NextResponse.redirect(
//   //     'https://www.google.com/search?q=cute+dog+pictures&tbm=isch&source=lnms',
//   //     { status: 302 },
//   //   );
//   // }

//   return new NextResponse(
//     getFrameHtmlResponse({
//       buttons: [
//         {
//           label: 'abcd',
//         },
//         {
//           action: 'link',
//           label: 'link/🔎',
//           target: 'https://onchainkit.xyz',
//         },
//         {
//           action: 'link',
//           label: 'Dog pictures',
//           target: 'https://www.naver.com',
//         },
//       ],
//       // image: {
//       //   src: `${NEXT_PUBLIC_URL}/park-1.png`,
//       // },
//       image: {
//         src: `${NEXT_PUBLIC_URL}/api/og?fid=${myFid}`,
//       },

//       postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
//       state: {
//         //page: state?.page + 1,
//         time: new Date().toISOString(),
//       },
//     }),
//   );
// }

// export async function POST(req: NextRequest): Promise<Response> {
//   return getResponse(req);
// }

// export const dynamic = 'force-dynamic';



import { getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { init, validateFramesMessage } from '@airstack/frames';
import { getFarcasterUserDetails, FarcasterUserDetailsInput, FarcasterUserDetailsOutput } from '@airstack/frames';
//import { NEXT_PUBLIC_URL } from '../../config';
import { NEXT_PUBLIC_URL } from '@/app/config';

// // process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// async function getResponse(req: NextRequest): Promise<NextResponse> {
//   try {

//     const apiKey = process.env.AIRSTACK_API_KEY;
//     if (!apiKey) {
//       throw new Error("AIRSTACK_API_KEY is not defined in environment variables");
//     }
//     init(apiKey);

//     const body = await req.json();
//     const { isValid, message } = await validateFramesMessage(body);

//     if (!isValid) {
//       return new NextResponse('Message not valid', { status: 500 });
//     }

//     const myFid = Number(message?.data?.fid) || 0;
//     const input: FarcasterUserDetailsInput = { fid: myFid };
//     const { data, error }: FarcasterUserDetailsOutput = await getFarcasterUserDetails(input);

//     if (error) throw new Error(error);

//     return new NextResponse(
//       getFrameHtmlResponse({
//         buttons: [
//           { label: 'abcd' },
//           { action: 'link', label: 'link/🔎', target: 'https://onchainkit.xyz' },
//           { action: 'link', label: 'Dog pictures', target: 'https://www.naver.com' },
//         ],
//         image: { src: `${NEXT_PUBLIC_URL}/api/og?fid=${myFid}` },
//         postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
//         state: { time: new Date().toISOString() },
//       })
//     );
//   } catch (error) {
//     console.error('Error processing request:', error);
//     return new NextResponse('Internal Server Error', { status: 500 });
//   }
// }

// export async function POST(req: NextRequest): Promise<Response> {
//   return getResponse(req);
// }

// export const dynamic = 'force-dynamic';




async function getResponse(req: NextRequest): Promise<NextResponse> {
  try {

    const apiKey = process.env.AIRSTACK_API_KEY;
    if (!apiKey) {
      throw new Error("AIRSTACK_API_KEY is not defined in environment variables");
    }
    init(apiKey);

    // const body = await req.json();
    // const { isValid, message } = await validateFramesMessage(body);

    // if (!isValid) {
    //   return new NextResponse('Message not valid', { status: 500 });
    // }

    // const myFid = Number(message?.data?.fid) || 0;
    // const input: FarcasterUserDetailsInput = { fid: myFid };
    // const { data, error }: FarcasterUserDetailsOutput = await getFarcasterUserDetails(input);

    // if (error) throw new Error(error);

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
        state: { time: new Date().toISOString() },
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
