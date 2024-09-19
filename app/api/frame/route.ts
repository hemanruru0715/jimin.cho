
import { getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { init, validateFramesMessage } from '@airstack/frames';
import { getFarcasterUserDetails, FarcasterUserDetailsInput, FarcasterUserDetailsOutput } from '@airstack/frames';
import { fetchQuery } from "@airstack/node";
import { NEXT_PUBLIC_URL } from '@/app/config';
import { config } from "dotenv";
import { createClient } from '@supabase/supabase-js';
import axios from "axios";

//process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
export const dynamic = 'force-dynamic';

// Supabase 클라이언트 초기화
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

//개발db, 운영db 분리하기
const supabaseDb = process.env.NODE_ENV == 'development' ? 'user_stats_dev' : 'user_stats';
const supabase = createClient(supabaseUrl, supabaseKey);

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


    let profileName = '';
    let profileImage = '';
    let farScore = 0;
    let farBoost = 0;
    let farRank = 0;
    let todayAmount = 0;
    let weeklyAmount = 0;
    let lifeTimeAmount = 0;
    
    let replyCount = 0;
    let recastCount = 0;
    let quoteCount = 0;

     // 데이터 처리 함수 호출 후 그 결과를 기다림
    await main(myFid, socialCapitalQuery, quoteRecastsQuery);

    //const main = async () => {
    async function main(myFid: number, socialCapitalQuery: string, quoteRecastsQuery: string) {
      const server = "https://hubs.airstack.xyz";
      try {
        // API 요청을 병렬로 실행
        const [socialCapitalQueryData, castsResponse, reactionsResponse, quoteRecastsQueryData] = await Promise.all([
          fetchQuery(socialCapitalQuery),

          axios.get(`${server}/v1/castsByFid?fid=`+ myFid +`&pageSize=300&reverse=true`, {
            headers: {
              "Content-Type": "application/json",
              "x-airstack-hubs": apiKey as string,
            },
          }),

          axios.get(`${server}/v1/reactionsByFid?fid=`+ myFid +`&reaction_type=REACTION_TYPE_RECAST&pageSize=150&reverse=true`, {
            headers: {
              "Content-Type": "application/json",
              "x-airstack-hubs": apiKey as string,
            },
          }),

          fetchQuery(quoteRecastsQuery)
        ]);
    


        //socialCapitalQueryData
        const data = socialCapitalQueryData.data;
        profileName = data.Socials.Social[0].profileName;
        profileImage = data.Socials.Social[0].profileImage;
        farScore = data.Socials.Social[0].farcasterScore.farScore.toFixed(3);
        farBoost = data.Socials.Social[0].farcasterScore.farBoost.toFixed(3);
        farRank = data.Socials.Social[0].farcasterScore.farRank.toFixed(0);
        todayAmount = data.today.FarcasterMoxieEarningStat[0].allEarningsAmount.toFixed(2);
        weeklyAmount = data.weekly.FarcasterMoxieEarningStat[0].allEarningsAmount.toFixed(2);
        lifeTimeAmount = data.allTime.FarcasterMoxieEarningStat[0].allEarningsAmount.toFixed(2);


        // 날짜 계산 로직
        const referenceDate = new Date(Date.UTC(2021, 0, 1, 0, 0, 0));
        const todayDate = new Date();
        todayDate.setUTCHours(0, 0, 0, 0);
        const differenceInMillis = todayDate.getTime() - referenceDate.getTime();
        const differenceInSeconds = Math.floor(differenceInMillis / 1000);
        //console.log(`The difference in seconds is: ${differenceInSeconds}`);
    
        // castsResponse에서 reply 메시지 필터링
        const filteredReplyMessages = castsResponse.data.messages.filter(
          (message: { data: { castAddBody: { parentCastId: any }; timestamp: any } }) =>
            message.data.castAddBody.parentCastId && message.data.timestamp > differenceInSeconds
        );
        //console.warn("filteredReplyMessages=" + JSON.stringify(filteredReplyMessages));
        replyCount = filteredReplyMessages.length;
        console.warn("replyCount=" + replyCount);
    

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
    // Supabase에서 fid가 있는지 확인
    const { data: existingEntry, error: fetchError } = await supabase
      .from(supabaseDb)  // 테이블 이름
      .select('*')
      .eq('fid', myFid)
      .single(); // 단일 row만 가져오기

    if (fetchError && fetchError.code !== 'PGRST116') {
      // 'PGRST116' 코드는 row가 없는 경우의 에러 코드입니다.
      console.error("Supabase 데이터 검색 오류:", fetchError);
      throw new Error('Error fetching data from Supabase');
    }

    let error;
    if (existingEntry) {
      // fid가 이미 존재하는 경우, 업데이트 수행
      const { error: updateError } = await supabase
        .from(supabaseDb)
        .update({
          profile_name: profileName,
          profile_image: profileImage,
          far_score: farScore,
          far_boost: farBoost,
          far_rank: farRank,
          today_amount: todayAmount,
          weekly_amount: weeklyAmount,
          lifetime_amount: lifeTimeAmount,
          reply_count: replyCount,
          recast_count: recastCount,
          quote_count:  quoteCount,
          mod_dtm: getKoreanISOString()
        })
        .eq('fid', myFid);

      if (updateError) {
        console.error("Supabase 데이터 업데이트 오류:", updateError);
        throw new Error('Error updating data in Supabase');
      }
    } else {
      // fid가 존재하지 않으면 삽입 수행
      const { error: insertError } = await supabase
        .from(supabaseDb)
        .insert([
          {
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
            recast_count: recastCount,
            quote_count:  quoteCount,
            reg_dtm: getKoreanISOString()
          }
        ]);

      if (insertError) {
        console.error("Supabase 데이터 삽입 오류:", insertError);
        throw new Error('Error inserting data into Supabase');
      }
    }
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
            label: 'Share', 
            target: `https://warpcast.com/~/compose?text=Check your Moxie stats. Frame by @hemanruru&embeds%5B%5D=${encodeURIComponent(frameUrl)}`
          },
        ],
        image: { 
          src: `${NEXT_PUBLIC_URL}/api/og?profileName=${profileName}&fid=${myFid}&profileImage=${encodedProfileImage}
                                         &farScore=${farScore}&farBoost=${farBoost}&farRank=${farRank}
                                         &todayAmount=${todayAmount}&weeklyAmount=${weeklyAmount}&lifeTimeAmount=${lifeTimeAmount}
                                         &replyCount=${replyCount}&recastCount=${recastCount}&quoteCount=${quoteCount}
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


function getKoreanISOString() {
  const now = new Date();
  const koreanTime = new Date(now.getTime() + 9 * 60 * 60 * 1000); // UTC+9 시간대 반영
  return koreanTime.toISOString().slice(0, 19).replace('T', ' ');
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}


export async function GET(req: NextRequest) {
  // Next.js의 NextRequest 객체에서 URL과 쿼리 매개변수를 직접 가져옵니다.
  const url = req.nextUrl; // NextRequest의 nextUrl 속성 사용
  const fid = url.searchParams.get('fid'); // 'fid' 매개변수 추출

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
    recast_count: number;
    quote_count: number;
  }

  // Supabase에서 데이터 가져오기
  const { data, error } = await supabase
    .from(supabaseDb)  // 테이블 이름
    .select('*')
    .eq('fid', fid)
    .single(); // 단일 row 가져오기

  if (error) {
    return NextResponse.json({ error: 'Error fetching data from Supabase' }, { status: 500 });
  }

  console.log("api/frame/route.ts_data=" + JSON.stringify(data));

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
    reply_count: data.replyCount,
    recast_count: data.recastCount,
    quote_count:  data.quoteCount,
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
          label: 'Share', 
          target: `https://warpcast.com/~/compose?text=Check your Moxie stats. Frame by @hemanruru&embeds%5B%5D=${encodeURIComponent(frameUrl)}`
        },
      ],
      image: { 
        src: `${NEXT_PUBLIC_URL}/api/og?profileName=${frameData.profile_name}&fid=${frameData.fid}&profileImage=${profileImage}
                                       &farScore=${frameData.far_score}&farBoost=${frameData.far_boost}&farRank=${frameData.far_rank}
                                       &todayAmount=${frameData.today_amount}&weeklyAmount=${frameData.weekly_amount}&lifeTimeAmount=${frameData.lifetime_amount}
                                       &replyCount=${frameData.reply_count}&recastCount=${frameData.recast_count}&quoteCount=${frameData.quote_count}
                                       &cache_burst=${Math.floor(Date.now() / 1000)}`,
        aspectRatio: '1:1',
      },
      postUrl: `${NEXT_PUBLIC_URL}/api/frame?cache_burst=${Math.floor(Date.now() / 1000)}`,
      //state: { time: new Date().toISOString() },
    })
  );
}
