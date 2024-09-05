
import { getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { init, validateFramesMessage } from '@airstack/frames';
import { getFarcasterUserDetails, FarcasterUserDetailsInput, FarcasterUserDetailsOutput } from '@airstack/frames';
import { fetchQuery } from "@airstack/node";
import { NEXT_PUBLIC_URL } from '@/app/config';
import { config } from "dotenv";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
export const dynamic = 'force-dynamic';

async function getResponse(req: NextRequest): Promise<NextResponse> {
  try {

    const body = await req.json();
    //console.log("body=" + JSON.stringify(body));
    //console.log("process.env.NEXT_PUBLIC_AIRSTACK_API_KEY=" + process.env.NEXT_PUBLIC_AIRSTACK_API_KEY);

    config();
    const apiKey = process.env.NEXT_PUBLIC_AIRSTACK_API_KEY ?? "default_api_key";
    init(apiKey ?? "");

    //프레임유효성검사
    const { isValid, message } = await validateFramesMessage(body);
    if (!isValid) {
      return new NextResponse('Message not valid', { status: 500 });
    }
    const myFid = Number(message?.data?.fid) || 0;
    const input: FarcasterUserDetailsInput = { fid: myFid };

    //파캐스터 유저정보
    const { data, error }: FarcasterUserDetailsOutput = await getFarcasterUserDetails(input);
    //console.warn("data=" + JSON.stringify(data));

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
    //console.warn("socialCapitalQueryData=" + JSON.stringify(socialCapitalQueryData));
    //console.warn("socialCapitalQueryError=" + JSON.stringify(socialCapitalQueryError));

    if (socialCapitalQueryError) {
      throw new Error(socialCapitalQueryError.message);
    }
  

    const { data: moxieEarningQueryData, error: moxieEarningQueryError } = await fetchQuery(moxieEarningQuery);
    //console.warn("quemoxieEarningQueryDataryData=" + JSON.stringify(moxieEarningQueryData));
    //console.warn("moxieEarningQueryError=" + JSON.stringify(moxieEarningQueryError));

    if (moxieEarningQueryError) {
      throw new Error(moxieEarningQueryError.message);
    }


    //이미지URL 인코딩처리
    const encodedProfileImage = encodeURIComponent(data?.profileImage?.medium ?? "");

    return new NextResponse(
      getFrameHtmlResponse({
        buttons: [
          { 
            label: 'abcd' 
          },
          { 
            action: 'link', 
            label: 'Share', 
            target: 'https://warpcast.com/~/compose?text=Check your Moxie stats. Frame by @hemanruru&embeds[]=https://jimin.cho.vercel.app/' 
          },
        ],
        image: { 
          src: `${NEXT_PUBLIC_URL}/api/og?profileName=${data?.profileName}&fid=${myFid}&profileImage=${encodedProfileImage}
                                         &followerCount=${data?.followerCount}&followingCount=${data?.followingCount}`,
          //aspectRatio: '1:1',
        },
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


