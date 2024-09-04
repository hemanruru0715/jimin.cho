
import { getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { init, validateFramesMessage } from '@airstack/frames';
import { getFarcasterUserDetails, FarcasterUserDetailsInput, FarcasterUserDetailsOutput } from '@airstack/frames';
import { fetchQuery } from "@airstack/node";
import { NEXT_PUBLIC_URL } from '@/app/config';
import { config } from "dotenv";

export const dynamic = 'force-dynamic';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';


async function getResponse(req: NextRequest): Promise<NextResponse> {
  try {

    const body = await req.json();
    //console.log("body=" + JSON.stringify(body));
    //console.log("process.env.NEXT_PUBLIC_AIRSTACK_API_KEY=" + process.env.NEXT_PUBLIC_AIRSTACK_API_KEY);

    config();
    const apiKey = process.env.NEXT_PUBLIC_AIRSTACK_API_KEY ?? "default_api_key";
    init(apiKey ?? "");

    const { isValid, message } = await validateFramesMessage(body);
    if (!isValid) {
      return new NextResponse('Message not valid', { status: 500 });
    }

    const myFid = Number(message?.data?.fid) || 0;
    const input: FarcasterUserDetailsInput = { fid: myFid };
    const { data, error }: FarcasterUserDetailsOutput = await getFarcasterUserDetails(input);

    console.warn("data=" + JSON.stringify(data));

      if (error) throw new Error(error);


          const socialCapitalQuery = `
          query GetFarcasterUserSocialCapital {
            Socials(
              input: {filter: {dappName: {_eq: farcaster}, userId: {_eq: "` + myFid + `"}}, blockchain: ethereum}
            ) {
              Social {
                dappName
                profileName
                socialCapital {
                  socialCapitalScore
                  socialCapitalRank
                }
                farcasterScore {
                  farBoost
                }
              }
            }
          }
          `;

          const moxieEarningQuery = `
          query MyQuery {
            today: FarcasterMoxieEarningStats(
              input: {filter: {entityType: {_eq: USER}, entityId: {_eq: "`+ myFid +`"}}, timeframe: TODAY, blockchain: ALL}
            ) {
              FarcasterMoxieEarningStat {
                allEarningsAmount
              }
            }
            weekly: FarcasterMoxieEarningStats(
              input: {filter: {entityType: {_eq: USER}, entityId: {_eq: "`+ myFid +`"}}, timeframe: WEEKLY, blockchain: ALL}
            ) {
              FarcasterMoxieEarningStat {
                allEarningsAmount
              }
            }
            allTime: FarcasterMoxieEarningStats(
              input: {filter: {entityType: {_eq: USER}, entityId: {_eq: "`+ myFid +`"}}, timeframe: LIFETIME, blockchain: ALL}
            ) {
              FarcasterMoxieEarningStat {
                allEarningsAmount
              }
            }
          }
          `;


      const { data: socialCapitalQueryData, error: socialCapitalQueryError } = await fetchQuery(socialCapitalQuery);
      console.warn("socialCapitalQueryData=" + JSON.stringify(socialCapitalQueryData));
      console.warn("socialCapitalQueryError=" + JSON.stringify(socialCapitalQueryError));

      if (socialCapitalQueryError) {
        throw new Error(socialCapitalQueryError.message);
      }
    

      const { data: moxieEarningQueryData, error: moxieEarningQueryError } = await fetchQuery(moxieEarningQuery);
      console.warn("quemoxieEarningQueryDataryData=" + JSON.stringify(moxieEarningQueryData));
      console.warn("moxieEarningQueryError=" + JSON.stringify(moxieEarningQueryError));

      if (moxieEarningQueryError) {
        throw new Error(moxieEarningQueryError.message);
      }



      
    return new NextResponse(
      getFrameHtmlResponse({
        buttons: [
          { label: 'abcd' },
          { action: 'link', label: 'link/🔎', target: 'https://onchainkit.xyz' },
          { action: 'link', label: 'Dog pictures', target: 'https://www.naver.com' },
        ],
        image: { src: `${NEXT_PUBLIC_URL}/api/og?fid=${myFid}&profileImage=${data?.profileImage?.medium}&followerCount=${data?.followerCount}&followingCount=${data?.followingCount}` },
        //image: { src: `${NEXT_PUBLIC_URL}/park-3.png` },
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


