import { getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { init, validateFramesMessage } from '@airstack/frames';
import { getFarcasterUserDetails, FarcasterUserDetailsInput, FarcasterUserDetailsOutput } from '@airstack/frames';
import { fetchQuery } from "@airstack/node";
import { NEXT_PUBLIC_URL } from '@/app/config';
import { config } from "dotenv";
import { fetchUserData, updateInsertUserData } from '@/app/utils/supabase';
import axios from "axios";
import { google } from 'googleapis';

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
    let myFid = Number(message?.data?.fid) || 0;
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
                  tvl
                  tvlBoost
                  liquidityBoost
                  powerBoost
                }
                profileDisplayName
                profileName
                userId
                profileImage
                totalSpendAllowance {
                  frameInteractions
                  likes
                  recasts
                  replies
                }
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

    //const { data: socialCapitalQueryData, error: socialCapitalQueryError } = await fetchQuery(socialCapitalQuery);
    // console.warn("11socialCapitalQueryData=" + JSON.stringify(socialCapitalQueryData));
    // console.warn("11socialCapitalQueryError=" + JSON.stringify(socialCapitalQueryError));
    // if (socialCapitalQueryError) {
    //   throw new Error(socialCapitalQueryError.message);
    // }

    const quoteRecastsQuery = `
        query MyQuery {
          quoteRecasts: FarcasterQuotedRecasts(
            input: {filter: {recastedBy: {_eq: "fc_fid:`+ myFid +`"}}, blockchain: ALL}
          ) {
            QuotedRecast {
              castedAtTimestamp
              url
            }
          }
        }
      `;

/* 구글 Sheet Api */  
    // 서비스 계정 키 파일 경로
//     const googleSheetApiKey = process.env.GOOGLE_SHEETS_API_KEY; // 환경 변수에서 API 키 가져오기

//     const sheets = google.sheets({ version: 'v4' });

//     const spreadsheetId = '1Iu01j6ilS9IuDnmz75IKlPaWH5J4-Gzh8OVQ7ql9sSQ';
//     const range = '25 Nov 2024!A2:H';

//     // Google Sheets API를 사용하여 데이터 가져오기
//     const response = await sheets.spreadsheets.values.get({
//       spreadsheetId,
//       range,
//       key: googleSheetApiKey, // API 키를 요청에 포함
//     });
    

//     const rows = response.data.values ?? "";

//     //console.warn("rows=" + JSON.stringify(rows));
//     //console.warn("rows1=" + rows[0]);
//     //console.warn("rows2=" + rows[0][2]);

//     // data가 배열인지 확인한 후 filter 적용
//     const result = Array.isArray(rows) ? rows.filter(item => item[0] == myFid) : [];
//     console.log("result=" + JSON.stringify(result));
//     let allowLike = 200;
//     let allowReply = 80;
//     let allowRcQt = 40;
//     if(result.length > 0){
//       allowLike = result[0][2];
//       allowReply = result[0][3];
//       allowRcQt = result[0][4];
//     }

// console.log("allowLike=" + allowLike);
// console.log("allowReply=" + allowReply);
// console.log("allowRcQt=" + allowRcQt);

    let profileName = '';
    let profileImage = '';
    let farScore = 0;
    let farBoost = 0;
    let farRank = 0;
    let tvl = 'N/A';
    let tvlBoost = 0;
    let liquidityBoost = 0;
    let powerBoost = 0;

    let todayAmount = 0;
    let weeklyAmount = 0;
    let lifeTimeAmount = 0;
    
    let likeCount = 0;
    let replyCount = 0;
    let recastCount = 0;
    let quoteCount = 0;

    let frameInteraction = 20;
    let allowLike = 200;
    let allowReply = 80;
    let allowRcQt = 40;

     // 데이터 처리 함수 호출 후 그 결과를 기다림
    await main(myFid, socialCapitalQuery, quoteRecastsQuery);

    //const main = async () => {
    async function main(myFid: number, socialCapitalQuery: string, quoteRecastsQuery: string) {
      const server = "https://hubs.airstack.xyz";
      try {
        // API 요청을 병렬로 실행
        const [socialCapitalQueryData, castsResponse, reactionsResponse, quoteRecastsQueryData] = await Promise.all([
          fetchQuery(socialCapitalQuery),

          axios.get(`${server}/v1/castsByFid?fid=`+ myFid +`&pageSize=400&reverse=true`, {
            headers: {
              "Content-Type": "application/json",
              "x-airstack-hubs": apiKey as string,
            },
          }),

          axios.get(`${server}/v1/reactionsByFid?fid=`+ myFid +`&reaction_type=REACTION_TYPE_RECAST&pageSize=200&reverse=true`, {
            headers: {
              "Content-Type": "application/json",
              "x-airstack-hubs": apiKey as string,
            },
          }),

          fetchQuery(quoteRecastsQuery)
        ]);
    
        //5개 병렬시 오류가 자주나서 4개,1개로 병렬처리 분리
        const [likesResponse] = await Promise.all([
          axios.get(`${server}/v1/reactionsByFid?fid=`+ myFid +`&reaction_type=REACTION_TYPE_LIKE&pageSize=999&reverse=true`, {
            headers: {
              "Content-Type": "application/json",
              "x-airstack-hubs": apiKey as string,
            },
          }),
        ]);


        //socialCapitalQueryData
        const data = socialCapitalQueryData.data;
        profileName = data.Socials.Social[0].profileName;
        profileImage = data.Socials.Social[0].profileImage;
        farScore = data.Socials.Social[0].farcasterScore.farScore.toFixed(3);
        farBoost = data.Socials.Social[0].farcasterScore.farBoost.toFixed(3);
        farRank = data.Socials.Social[0].farcasterScore.farRank.toFixed(0);
        tvl = (Number(data.Socials.Social[0].farcasterScore.tvl) / 1e18).toFixed(1); //실제 저장된 tvl목시개수는 10^18로 나눈다. 그다음 api/og로 전달. 넘겨서 다시 K표시위해 3으로 추가 나누기
        tvlBoost = data.Socials.Social[0].farcasterScore.tvlBoost.toFixed(2);
        liquidityBoost = data.Socials.Social[0].farcasterScore.liquidityBoost.toFixed(2);
        powerBoost = data.Socials.Social[0].farcasterScore.powerBoost.toFixed(2);

        todayAmount = data.today.FarcasterMoxieEarningStat[0].allEarningsAmount.toFixed(2);
        weeklyAmount = data.weekly.FarcasterMoxieEarningStat[0].allEarningsAmount.toFixed(2);
        lifeTimeAmount = data.allTime.FarcasterMoxieEarningStat[0].allEarningsAmount.toFixed(2);

        if(data.Socials.Social[0].totalSpendAllowance != null){
          frameInteraction = data.Socials.Social[0].totalSpendAllowance.frameInteractions;
          allowLike = data.Socials.Social[0].totalSpendAllowance.likes;
          allowReply = data.Socials.Social[0].totalSpendAllowance.recasts;
          allowRcQt = data.Socials.Social[0].totalSpendAllowance.replies;
        }
    
    console.log("frameInteraction=" + frameInteraction);
    console.log("allowLike=" + allowLike);
    console.log("allowReply=" + allowReply);
    console.log("allowRcQt=" + allowRcQt);

        // 날짜 계산 로직
        const referenceDate = new Date(Date.UTC(2021, 0, 1, 0, 0, 0));
        const todayDate = new Date();
        todayDate.setUTCHours(0, 0, 0, 0);
        const differenceInMillis = todayDate.getTime() - referenceDate.getTime();
        const differenceInSeconds = Math.floor(differenceInMillis / 1000);
        //console.warn("castsResponse=" + JSON.stringify(castsResponse.data));

        // castsResponse에서 reply 메시지 필터링
        const filteredReplyMessages = castsResponse.data.messages.filter(
          (message: { data: { castAddBody: {parentCastId: any }; 
                              timestamp: any } }
          ) => message.data.castAddBody !== undefined && message.data.castAddBody.parentCastId && message.data.timestamp > differenceInSeconds
        );
        //console.warn("filteredReplyMessages=" + JSON.stringify(filteredReplyMessages));
        replyCount = filteredReplyMessages.length;
        console.warn("replyCount=" + replyCount);
    

        // likesResponse에서 like 메시지 필터링
        const filteredLikeMessages = likesResponse.data.messages.filter(
          (message: { data: { timestamp: any } }) =>
            message.data.timestamp > differenceInSeconds
        );
        //console.warn("filteredRecastMessages=" + JSON.stringify(filteredRecastMessages));
        likeCount = filteredLikeMessages.length;
        console.warn("likeCount=" + likeCount);


        // reactionsResponse에서 recast 메시지 필터링
        const filteredRecastMessages = reactionsResponse.data.messages.filter(
          (message: { data: { timestamp: any } }) =>
            message.data.timestamp > differenceInSeconds
        );
        //console.warn("filteredRecastMessages=" + JSON.stringify(filteredRecastMessages));
        recastCount = filteredRecastMessages.length;
        console.warn("recastCount=" + recastCount);


        // quoteRecastsQueryData에서 quote 메시지 필터링
        const todayStart = new Date().setUTCHours(0, 0, 0, 0);
        console.warn("todayStart=" + todayStart);
        //console.warn("quoteRecastsQueryData=" + JSON.stringify(quoteRecastsQueryData));
        const filteredQuoteMessages = quoteRecastsQueryData.data.quoteRecasts.QuotedRecast.filter(
          (  item: { castedAtTimestamp: string | number | Date; }) => {
              const castedAt = new Date(item.castedAtTimestamp).getTime();
              return castedAt >= todayStart;
          });

        //console.warn("filteredQuoteMessages=" + JSON.stringify(filteredQuoteMessages));
        quoteCount = filteredQuoteMessages.length;
        console.warn("quoteCount=" + quoteCount);

      } catch (e) {
        console.error(e);
      }
    };
    
    //main();



    //socialCapitalQueryData
    // profileName = socialCapitalQueryData.Socials.Social[0].profileName;
    // profileImage = socialCapitalQueryData.Socials.Social[0].profileImage;
    // farScore = socialCapitalQueryData.Socials.Social[0].farcasterScore.farScore.toFixed(3);
    // farBoost = socialCapitalQueryData.Socials.Social[0].farcasterScore.farBoost.toFixed(3);
    // farRank = socialCapitalQueryData.Socials.Social[0].farcasterScore.farRank.toFixed(0);
    // todayAmount = socialCapitalQueryData.today.FarcasterMoxieEarningStat[0].allEarningsAmount.toFixed(2);
    // weeklyAmount = socialCapitalQueryData.weekly.FarcasterMoxieEarningStat[0].allEarningsAmount.toFixed(2);
    // lifeTimeAmount = socialCapitalQueryData.allTime.FarcasterMoxieEarningStat[0].allEarningsAmount.toFixed(2);

    //이미지URL 인코딩처리
    const encodedProfileImage = encodeURIComponent(profileImage);

    /**************** DB 작업 ****************/
    // DB에 업데이트 또는 삽입
    await updateInsertUserData({
      fid: myFid,
      profile_name: profileName,
      profile_image: profileImage,
      far_score: farScore,
      far_boost: farBoost,
      far_rank: farRank,
      today_amount: todayAmount,
      weekly_amount: weeklyAmount,
      lifetime_amount: lifeTimeAmount,
      reply_count: replyCount,
      like_count: likeCount,
      recast_count: recastCount,
      quote_count: quoteCount,
      tvl: tvl,
      tvl_boost: tvlBoost,
      liquidity_boost: liquidityBoost,
      power_boost: powerBoost,
      allow_like: allowLike,
      allow_reply: allowReply,
      allow_rcqt: allowRcQt,
    });
    /**************** DB 작업 끝 ****************/

    const frameUrl = `${NEXT_PUBLIC_URL}/api/frame?fid=${myFid}&cache_burst=${Math.floor(Date.now() / 1000)}`;

    return new NextResponse(
      getFrameHtmlResponse({
        buttons: [
          { 
            label: 'MyStats/🔎' 
          },
          { 
            action: 'link', 
            label: '🔄Share', 
            target: `https://warpcast.com/~/compose?text=Check your Moxie stats. Frame by @hemanruru&embeds%5B%5D=${encodeURIComponent(frameUrl)}`
          },
        ],
        image: { 
          src: `${NEXT_PUBLIC_URL}/api/og?profileName=${profileName}&fid=${myFid}&profileImage=${encodedProfileImage}
                                         &farScore=${farScore}&farBoost=${farBoost}&farRank=${farRank}
                                         &todayAmount=${todayAmount}&weeklyAmount=${weeklyAmount}&lifeTimeAmount=${lifeTimeAmount}
                                         &replyCount=${replyCount}&likeCount=${likeCount}&recastCount=${recastCount}&quoteCount=${quoteCount}
                                         &tvl=${tvl}&tvlBoost=${tvlBoost}&liquidityBoost=${liquidityBoost}&powerBoost=${powerBoost}
                                         &allowLike=${allowLike}&allowReply=${allowReply}&allowRcQt=${allowRcQt}
                                         &cache_burst=${Math.floor(Date.now() / 1000)}`,
          aspectRatio: '1:1',
        },
        postUrl: `${NEXT_PUBLIC_URL}/api/frame?cache_burst=${Math.floor(Date.now() / 1000)}`,
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


export async function GET(req: NextRequest) {
  // Next.js의 NextRequest 객체에서 URL과 쿼리 매개변수를 직접 가져옵니다.
  const url = req.nextUrl; // NextRequest의 nextUrl 속성 사용
  const fid = Number(url.searchParams.get('fid')); // 'fid' 매개변수 추출

  console.log("Extracted FID:", fid);

  // frameData의 타입 정의
  interface FrameData {
    fid: number;
    profile_name: string;
    profile_image: string;
    far_score: number;
    far_boost: number;
    far_rank: number;
    today_amount: number;
    weekly_amount: number;
    lifetime_amount: number;
    reply_count: number;
    like_count: number;
    recast_count: number;
    quote_count: number;
    tvl: number,
    tvl_boost: number,
    liquidity_boost: number,
    power_boost: number,
    allow_like: number,
    allow_reply: number,
    allow_rcqt: number,
  }

 /**************** DB 작업 ****************/
  const data = await fetchUserData(fid);
  if (!data) {
    return new NextResponse('No data found', { status: 404 });
  }
  console.log("api/frame/route.ts_data=" + JSON.stringify(data));
 /**************** DB 작업 끝 ****************/

  const frameData: FrameData = {
    fid: data.fid,
    profile_name: data.profile_name,
    profile_image: data.profile_image,
    far_score: data.far_score,
    far_boost: data.far_boost,
    far_rank: data.far_rank,
    today_amount: data.today_amount,
    weekly_amount: data.weekly_amount,
    lifetime_amount: data.lifetime_amount,
    reply_count: data.reply_count,
    like_count: data.like_count,
    recast_count: data.recast_count,
    quote_count:  data.quote_count,
    tvl:  data.tvl,
    tvl_boost:  data.tvl_boost,
    liquidity_boost:  data.liquidity_boost,
    power_boost: data.power_boost,
    allow_like: data.allow_like,
    allow_reply: data.allow_reply,
    allow_rcqt: data.allow_rcqt,
  };

  const profileImage = encodeURIComponent(frameData.profile_image);
  const frameUrl = `${NEXT_PUBLIC_URL}/api/frame?fid=${frameData.fid}&cache_burst=${Math.floor(Date.now() / 1000)}`;

  console.log("api/frame/route.frameData=" + JSON.stringify(frameData));

  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        { 
          label: 'MyStats/🔎' 
        },
        { 
          action: 'link', 
          label: '🔄Share', 
          target: `https://warpcast.com/~/compose?text=Check your Moxie stats. Frame by @hemanruru&embeds%5B%5D=${encodeURIComponent(frameUrl)}`
        },
      ],
      image: { 
        src: `${NEXT_PUBLIC_URL}/api/og?profileName=${frameData.profile_name}&fid=${frameData.fid}&profileImage=${profileImage}
                                       &farScore=${frameData.far_score}&farBoost=${frameData.far_boost}&farRank=${frameData.far_rank}
                                       &todayAmount=${frameData.today_amount}&weeklyAmount=${frameData.weekly_amount}&lifeTimeAmount=${frameData.lifetime_amount}
                                       &replyCount=${frameData.reply_count}&likeCount=${frameData.like_count}&recastCount=${frameData.recast_count}&quoteCount=${frameData.quote_count}
                                       &tvl=${frameData.tvl}&tvlBoost=${frameData.tvl_boost}&liquidityBoost=${frameData.liquidity_boost}&powerBoost=${frameData.power_boost}
                                       &allowLike=${frameData.allow_like}&allowReply=${frameData.allow_reply}&allowRcQt=${frameData.allow_rcqt}
                                       &cache_burst=${Math.floor(Date.now() / 1000)}`,
        aspectRatio: '1:1',
      },
      postUrl: `${NEXT_PUBLIC_URL}/api/frame?cache_burst=${Math.floor(Date.now() / 1000)}`,
      //state: { time: new Date().toISOString() },
    })
  );
}
