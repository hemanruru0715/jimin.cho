import { ImageResponse } from "@vercel/og";
import { NEXT_PUBLIC_URL } from '@/app/config';
import fs from 'fs';
import path from 'path';
import { fetchCoinData } from '@/app/utils/fetchCoinData'; // utils 폴더에서 함수 가져오기

//export const runtime = "edge";
export const dynamic = "force-dynamic";

//process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// font 파일 경로
const fontPath = path.join(process.cwd(), 'public/fonts/Poppins-Regular.ttf');
const fontData = fs.readFileSync(fontPath);


export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const profileName = searchParams.get('profileName');
  const fid = searchParams.get('fid');
  const profileImage = searchParams.get('profileImage') || `${NEXT_PUBLIC_URL}/default-image.png`;

  const farScore = searchParams.get('farScore') ?? "";
  const farBoost = searchParams.get('farBoost') ?? "";
  const farRank = searchParams.get('farRank') ?? "";
  const finalFarScore = parseFloat(farScore).toFixed(2).toLocaleString();
  const finalFarBoost = parseFloat(farBoost).toLocaleString();
  const finalFarRank = parseFloat(farRank).toLocaleString();

  const tvl = searchParams.get('tvl') ?? "";
  const tvlBoost = searchParams.get('tvlBoost') ?? "";
  const liquidityBoost = searchParams.get('liquidityBoost') ?? "";
  const powerBoost = searchParams.get('powerBoost') ?? "";
  //const finalTvl = parseFloat(tvl).toLocaleString();
  const finalTvlBoost = parseFloat(tvlBoost).toLocaleString();
  const finalLiquidityBoost = parseFloat(liquidityBoost).toLocaleString();
  const finalPowerBoost = parseFloat(powerBoost).toLocaleString();

  const todayAmount = searchParams.get('todayAmount') ?? "";
  const weeklyAmount = searchParams.get('weeklyAmount') ?? "";
  const lifeTimeAmount = searchParams.get('lifeTimeAmount') ?? "";
  const finalTodayAmount = parseFloat(todayAmount).toLocaleString();
  const finalWeeklyAmount = parseFloat(weeklyAmount).toLocaleString();
  const finalLifeTimeAmount = parseFloat(lifeTimeAmount).toLocaleString();

  const replyCount = searchParams.get('replyCount') ?? "";
  const likeCount = searchParams.get('likeCount') ?? "";
  const recastCount = searchParams.get('recastCount') ?? "";
  const quoteCount = searchParams.get('quoteCount') ?? "";


  // console.warn("profileName=" + profileName);
  // console.warn("fid=" + fid);
  // console.warn("farScore=" + farScore);
  // console.warn("farBoost=" + farBoost);
  // console.warn("farRank=" + farRank);
  // console.warn("finalTodayAmount=" + finalTodayAmount);
  // console.warn("finalWeeklyAmount=" + finalWeeklyAmount);
  // console.warn("finalLifeTimeAmount=" + finalLifeTimeAmount);
  console.warn("Count=" + replyCount +  " / " + recastCount + " / " + quoteCount);


  let like  = 0;
  let reply = 0;
  let rcQt  = 0;
  let finalLike = 'N/A';
  let finalReply = 'N/A';
  let finalRcQt = 'N/A';

  let likeUsd  = 0;
  let replyUsd = 0;
  let rcQtUsd  = 0;
  let finalLikeUsd  = 'N/A';
  let finalReplyUsd = 'N/A';
  let finalRcQtUsd  = 'N/A';

  let likeKrw  = 0;
  let replyKrw = 0;
  let rcQtKrw  = 0;
  let finalLikeKrw  = 'N/A';
  let finalReplyKrw = 'N/A';
  let finalRcQtKrw  = 'N/A';

  let tvlUsd = 0;
  let finalTvl = 'N/A';
  let finalTvlUsd = 'N/A';
  
  let tvlKrw = 0;
  let finalTvlKrw = 'N/A';

  let todayAmountUsd    = 0;
  let weeklyAmountUsd   = 0;
  let lifeTimeAmountUsd = 0;
  let finalTodayAmountUsd    = 'N/A';
  let finalWeeklyAmountUsd   = 'N/A';
  let finalLifeTimeAmountUsd = 'N/A';

  let todayAmountKrw    = 0;
  let weeklyAmountKrw   = 0;
  let lifeTimeAmountKrw = 0;
  let finalTodayAmountKrw    = 'N/A';
  let finalWeeklyAmountKrw   = 'N/A';
  let finalLifeTimeAmountKrw = 'N/A';

  let finalReplyCount = 0;
  let finalLikeCount = 0;
  let finalRcQtCount = 0;

  let moxieUsdPrice = 'N/A';
  let moxieKrwPrice = 'N/A';

  try {
    const { moxieUsdPrice: usdPrice, moxieKrwPrice: krwPrice } = await fetchCoinData();
    moxieUsdPrice = parseFloat(usdPrice).toLocaleString('en-US', { minimumFractionDigits: 5 });
    moxieKrwPrice = parseFloat(krwPrice).toLocaleString('ko-KR');

    //화면 구성값 계산
    like  = parseFloat(farScore) * 1;
    reply = parseFloat((parseFloat(farScore) * 3).toFixed(3));
    rcQt  = parseFloat((parseFloat(farScore) * 6).toFixed(3));
    finalLike  = like.toLocaleString();
    finalReply = reply.toLocaleString();
    finalRcQt  = rcQt.toLocaleString();

    likeUsd  = parseFloat((like * parseFloat(moxieUsdPrice)).toFixed(4)); //finalLikeUsd 시 0이 나와서 임시 likeUsd로 화면에 보여줌
    replyUsd = parseFloat((reply * parseFloat(moxieUsdPrice)).toFixed(4));
    rcQtUsd  = parseFloat((rcQt * parseFloat(moxieUsdPrice)).toFixed(4));
    finalLikeUsd  = likeUsd.toLocaleString();
    finalReplyUsd = replyUsd.toLocaleString();
    finalRcQtUsd  = rcQtUsd.toLocaleString();

    likeKrw  = parseFloat((like * parseFloat(moxieKrwPrice)).toFixed(2));
    replyKrw = parseFloat((reply * parseFloat(moxieKrwPrice)).toFixed(2));
    rcQtKrw  = parseFloat((rcQt * parseFloat(moxieKrwPrice)).toFixed(2));
    finalLikeKrw = likeKrw.toLocaleString();
    finalReplyKrw = replyKrw.toLocaleString();
    finalRcQtKrw = rcQtKrw.toLocaleString();
    
    /* tvl 관련 USD */
    tvlUsd    = parseFloat((parseFloat(tvl) * parseFloat(moxieUsdPrice)).toFixed(2).toLocaleString());
    finalTvlUsd = tvlUsd.toLocaleString();


    /* tvl 관련 KRW */
    tvlKrw    = parseFloat((parseFloat(tvl) * parseFloat(moxieKrwPrice)).toFixed(0).toLocaleString());
    finalTvlKrw = tvlKrw.toLocaleString();

    finalTvl = (Number(tvl) / 1e3).toFixed(1);

    todayAmountUsd    = parseFloat((parseFloat(todayAmount) * parseFloat(moxieUsdPrice)).toFixed(2).toLocaleString());
    weeklyAmountUsd   = parseFloat((parseFloat(weeklyAmount) * parseFloat(moxieUsdPrice)).toFixed(2).toLocaleString());
    lifeTimeAmountUsd = parseFloat((parseFloat(lifeTimeAmount) * parseFloat(moxieUsdPrice)).toFixed(2).toLocaleString());
    finalTodayAmountUsd = todayAmountUsd.toLocaleString();
    finalWeeklyAmountUsd = weeklyAmountUsd.toLocaleString();
    finalLifeTimeAmountUsd = lifeTimeAmountUsd.toLocaleString();

    todayAmountKrw    = parseFloat((parseFloat(todayAmount) * parseFloat(moxieKrwPrice)).toFixed(2).toLocaleString());
    weeklyAmountKrw   = parseFloat((parseFloat(weeklyAmount) * parseFloat(moxieKrwPrice)).toFixed(2).toLocaleString());
    lifeTimeAmountKrw = parseFloat((parseFloat(lifeTimeAmount) * parseFloat(moxieKrwPrice)).toFixed(2).toLocaleString());
    finalTodayAmountKrw = todayAmountKrw.toLocaleString();
    finalWeeklyAmountKrw = weeklyAmountKrw.toLocaleString();
    finalLifeTimeAmountKrw = lifeTimeAmountKrw.toLocaleString();

    finalReplyCount = parseFloat(replyCount);
    finalLikeCount = parseFloat(likeCount);
    finalRcQtCount = parseFloat(recastCount) + parseFloat(quoteCount);

  } catch (error) {
    console.error('Error fetching MOXIE price:', error);
  }

  if (searchParams != null) {
    return new ImageResponse(
      (
        <div
        style={{
          display: 'flex',
          height: '100%',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          backgroundImage: 'linear-gradient(to bottom, #dbf4ff, #fff1f1)',
          fontSize: 45,
          letterSpacing: -2,
          fontWeight: 700,
          textAlign: 'center',
          position: 'relative',
          border: '10px solid purple',
          fontFamily: '"Poppins-Regular"', // 폰트 이름
        }}
      >
          {/* 상단 정보 섹션 */}
          <div
            style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              display: 'flex',
              alignItems: 'center',
              zIndex: 2,
            }}
          >
            <img
              src={profileImage}
              height="150"
              width="150"
              style={{
                borderRadius: '50%',
                objectFit: 'cover',
                marginRight: '20px',
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '30px', color: 'black' }}>
              <div style={{ display: 'flex', marginRight: '20px' }}>@{profileName}</div>
              <div style={{ display: 'flex', marginRight: '40px' }}>FID:{fid}</div>
            </div>
          </div>

          <div style={{ position: 'absolute', top: '5px', right: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img
              src={`${NEXT_PUBLIC_URL}/moxieImage.png`} // SVG 파일 경로 확인
              height="150"
              width="200"  // 크기 조정
              style={{
                objectFit: 'contain',
              }}
            />
          </div>

          {/* 메인 텍스트 섹션 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              //backgroundImage: 'linear-gradient(90deg, rgb(0, 124, 240), rgb(0, 223, 216))',
              backgroundClip: 'text',
              color: 'transparent',
              marginTop: '100px', // Adjust as needed
              width: '100%', // Ensure it takes full width for proper layout
            }}
          >
  
           {/* Moxie Price */}
           <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ display: 'flex',textAlign: 'center', color: 'black' }}>
                    <span>
                      Moxie Price
                    </span>
                  </div>
                  <div style={{ display: 'flex',textAlign: 'center', color: 'black' }}>
                    <span>
                      {moxieUsdPrice} USD / {moxieKrwPrice} KRW
                    </span>
                  </div>
                </div>
              </span>
           </div>


          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'black' }}>
              <span>
              
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '120px', marginBottom: '10px' }}>
                  <div style={{ display: 'flex',textAlign: 'center' }}>
                    <span>
                      FarScore
                    </span>
                  </div>
                  <div style={{ display: 'flex',textAlign: 'center' }}>
                    <span>
                      {finalFarScore}
                    </span>
                  </div>

                  <div style={{ display: 'flex',textAlign: 'center', marginTop: '30px', marginBottom: '15px' }}>
                    <span>
                      ({finalLikeCount}/500)
                    </span>
                  </div>

                  <div style={{ display: 'flex',textAlign: 'center' }}>
                    <span>
                     Like 👍
                    </span>
                  </div>
                  <div style={{ display: 'flex',textAlign: 'center' }}>
                    <span>
                      {like.toFixed(2)} 
                    </span>
                  </div>
                  <div style={{ display: 'flex',textAlign: 'center', fontSize: '30px' }}>
                    <span>
                      ({likeUsd} USD)
                    </span>
                  </div>
                  <div style={{ display: 'flex',textAlign: 'center', fontSize: '30px' }}>
                    <span>
                      ({finalLikeKrw} KRW)
                    </span>
                  </div>

                  <div style={{ display: 'flex',textAlign: 'center', marginTop: '20px', marginBottom: '' }}>
                    <span>
                    </span>
                  </div>

                  <div style={{ display: 'flex',textAlign: 'center', marginTop: '87px' }}>
                    <span>
                      Today
                    </span>
                  </div>
                  <div style={{ display: 'flex',textAlign: 'center' }}>
                    <span>
                      {finalTodayAmount}
                    </span>
                  </div>
                  <div style={{ display: 'flex',textAlign: 'center', fontSize: '30px' }}>
                    <span>
                      ({finalTodayAmountUsd} USD)
                    </span>
                  </div>
                  <div style={{ display: 'flex',textAlign: 'center', fontSize: '30px' }}>
                    <span>
                      ({finalTodayAmountKrw} KRW)
                    </span>
                  </div>
                </div>


                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '120px', marginBottom: '10px' }}>
                  <div style={{ display: 'flex',textAlign: 'center' }}>
                    <span>
                      FT / MP / LP
                    </span>
                  </div>
                  <div style={{ display: 'flex',textAlign: 'center' }}>
                    <span>
                    {finalTvlBoost} / {finalPowerBoost} / {finalLiquidityBoost}
                    </span>
                  </div>

                  <div style={{ display: 'flex',textAlign: 'center', marginTop: '30px', marginBottom: '15px' }}>
                    <span>
                      ({finalReplyCount}/300)
                    </span>
                  </div>

                  <div style={{ display: 'flex',textAlign: 'center' }}>
                    <span>
                     Reply 💬
                    </span>
                  </div>
                  <div style={{ display: 'flex',textAlign: 'center' }}>
                    <span>
                      {reply.toFixed(2)} 
                    </span>
                  </div>
                  <div style={{ display: 'flex',textAlign: 'center', fontSize: '30px' }}>
                    <span>
                      ({finalReplyUsd} USD)
                    </span>
                  </div>
                  <div style={{ display: 'flex',textAlign: 'center', fontSize: '30px' }}>
                    <span>
                      ({finalReplyKrw} KRW)
                    </span>
                  </div>

                  <div style={{ display: 'flex',textAlign: 'center', marginTop: '30px', marginBottom: '15px' }}>
                    <span>
                      Moxie Earnings
                    </span>
                  </div>

                  <div style={{ display: 'flex',textAlign: 'center' }}>
                    <span>
                      Weekly
                    </span>
                  </div>
                  <div style={{ display: 'flex',textAlign: 'center' }}>
                    <span>
                      {finalWeeklyAmount}
                    </span>
                  </div>
                  <div style={{ display: 'flex',textAlign: 'center', fontSize: '30px' }}>
                    <span>
                      ({finalWeeklyAmountUsd} USD)
                    </span>
                  </div>
                  <div style={{ display: 'flex',textAlign: 'center', fontSize: '30px' }}>
                    <span>
                      ({finalWeeklyAmountKrw} KRW)
                    </span>
                  </div>
                </div>


                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ display: 'flex',textAlign: 'center' }}>
                    <span>
                      FarRank
                    </span>
                  </div>
                  <div style={{ display: 'flex',textAlign: 'center' }}>
                    <span>
                    {finalFarRank}
                    </span>
                  </div>

                  <div style={{ display: 'flex',textAlign: 'center', marginTop: '30px', marginBottom: '15px' }}>
                    <span>
                      ({finalRcQtCount}/150)
                    </span>
                  </div>

                  <div style={{ display: 'flex',textAlign: 'center' }}>
                    <span>
                      Rc/Qt 🔄
                    </span>
                  </div>
                  <div style={{ display: 'flex',textAlign: 'center' }}>
                    <span>
                      {rcQt.toFixed(2)}
                    </span>
                  </div>
                  <div style={{ display: 'flex',textAlign: 'center', fontSize: '30px' }}>
                    <span>
                    ({finalRcQtUsd} USD)
                    </span>
                  </div>
                  <div style={{ display: 'flex',textAlign: 'center', fontSize: '30px' }}>
                    <span>
                    ({finalRcQtKrw} KRW)
                    </span>
                  </div>

                  <div style={{ display: 'flex',textAlign: 'center', marginTop: '20px', marginBottom: '' }}>
                    <span>
                    </span>
                  </div>

                  <div style={{ display: 'flex',textAlign: 'center', marginTop: '87px' }}>
                    <span>
                      Lifetime
                    </span>
                  </div>
                  <div style={{ display: 'flex',textAlign: 'center' }}>
                    <span>
                      {finalLifeTimeAmount}
                    </span>
                  </div>
                  <div style={{ display: 'flex',textAlign: 'center', fontSize: '30px' }}>
                    <span>
                      ({finalLifeTimeAmountUsd} USD)
                    </span>
                  </div>
                  <div style={{ display: 'flex',textAlign: 'center', fontSize: '30px' }}>
                    <span>
                      ({finalLifeTimeAmountKrw} KRW)
                    </span>
                  </div>                                    
                </div>

              </span>
            </div>
          </div>

          {/* Footer section with time on the left and author on the right */}
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              padding: '0 20px', // Padding for left and right alignment
              fontSize: '24px', // Adjust font size as needed
              color: 'black',
              fontFamily: '"Poppins-Regular"', // 폰트 이름
            }}
          >
            {/* 시간 (ISO 8601 포맷) */}
            <span>{new Date().toISOString()}</span>

            {/* 작성자 */}
            <span>by @hemanruru</span>
          </div>

        </div>
      ),
      {
        width: 1200,
        height: 1200,
        fonts: [
          {
            name: 'Poppins-Regular',
            data: fontData,
            weight: 400,
            style: 'normal',
          },
        ],
      }
    );
    
  } else {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 40,
            color: "black",
            background: "white",
            width: "100%",
            height: "100%",
            padding: "50px 200px",
            textAlign: "center",
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
          }}
        >
          Error fetching data :(. Please try again later.
        </div>
      ),
      {
        width: 1200,
        height: 1200,
        fonts: [
          {
            name: 'Poppins-Regular',
            data: fontData,
            weight: 400,
            style: 'normal',
          },
        ],
      }
    );
  }
}
