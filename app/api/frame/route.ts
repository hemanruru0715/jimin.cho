
import { getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { init, validateFramesMessage } from '@airstack/frames';
import { getFarcasterUserDetails, FarcasterUserDetailsInput, FarcasterUserDetailsOutput } from '@airstack/frames';
import { fetchQuery } from "@airstack/node";
import { NEXT_PUBLIC_URL } from '@/app/config';
import { config } from "dotenv";

//process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
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
    //const { data, error }: FarcasterUserDetailsOutput = await getFarcasterUserDetails(input);
    //console.warn("getFarcasterUserDetails=" + JSON.stringify(data));

    //if (error) throw new Error(error);

   const socialCapitalQuery = `
          query MyQuery {
            Socials(
              input: {filter: {dappName: {_eq: farcaster}, userId: {_eq: "` + myFid + `"}}, blockchain: ethereum}
            ) {
              Social {
                farcasterScore {
                  farScore
                  farBoost
                  farRank
                }
                profileDisplayName
                profileName
                userId
                profileImage
                profileImageContentValue {
                  image {
                    medium
                  }
                }
              }
            }
            today: FarcasterMoxieEarningStats(
              input: {filter: {entityType: {_eq: USER}, entityId: {_eq: "` + myFid + `"}}, timeframe: TODAY, blockchain: ALL}
            ) {
              FarcasterMoxieEarningStat {
                allEarningsAmount
              }
            }
            weekly: FarcasterMoxieEarningStats(
              input: {filter: {entityType: {_eq: USER}, entityId: {_eq: "` + myFid + `"}}, timeframe: WEEKLY, blockchain: ALL}
            ) {
              FarcasterMoxieEarningStat {
                allEarningsAmount
              }
            }
            allTime: FarcasterMoxieEarningStats(
              input: {filter: {entityType: {_eq: USER}, entityId: {_eq: "` + myFid + `"}}, timeframe: LIFETIME, blockchain: ALL}
            ) {
              FarcasterMoxieEarningStat {
                allEarningsAmount
              }
            }
          }
       `;

    const { data: socialCapitalQueryData, error: socialCapitalQueryError } = await fetchQuery(socialCapitalQuery);
    console.warn("11socialCapitalQueryData=" + JSON.stringify(socialCapitalQueryData));
    console.warn("11socialCapitalQueryError=" + JSON.stringify(socialCapitalQueryError));

    if (socialCapitalQueryError) {
      throw new Error(socialCapitalQueryError.message);
    }

    //socialCapitalQueryData
    const farScore = socialCapitalQueryData.Socials.Social[0].farcasterScore.farScore.toFixed(3);
    const farBoost = socialCapitalQueryData.Socials.Social[0].farcasterScore.farBoost.toFixed(3);
    const farRank = socialCapitalQueryData.Socials.Social[0].farcasterScore.farRank.toFixed(0);
    const todayAmount = socialCapitalQueryData.today.FarcasterMoxieEarningStat[0].allEarningsAmount.toFixed(2);
    const weeklyAmount = socialCapitalQueryData.weekly.FarcasterMoxieEarningStat[0].allEarningsAmount.toFixed(2);
    const lifeTimeAmount = socialCapitalQueryData.allTime.FarcasterMoxieEarningStat[0].allEarningsAmount.toFixed(2);

    //이미지URL 인코딩처리
    const encodedProfileImage = encodeURIComponent(socialCapitalQueryData.Socials.Social[0].profileImage);

    return new NextResponse(
      getFrameHtmlResponse({
        buttons: [
          { 
            label: 'MyStats/🔎' 
          },
          { 
            action: 'link', 
            label: 'Share', 
            target: 'https://warpcast.com/~/compose?text=Check your Moxie stats. Frame by @hemanruru&embeds[]=https://hemanruru.vercel.app' 
          },
        ],
        image: { 
          src: `${NEXT_PUBLIC_URL}/api/og?profileName=${socialCapitalQueryData.Socials.Social[0].profileName}&fid=${myFid}&profileImage=${encodedProfileImage}
                                         &farScore=${farScore}&farBoost=${farBoost}&farRank=${farRank}
                                         &todayAmount=${todayAmount}&weeklyAmount=${weeklyAmount}&lifeTimeAmount=${lifeTimeAmount}`,
          aspectRatio: '1:1',
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


