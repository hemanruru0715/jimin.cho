// import { ImageResponse } from "@vercel/og";
// //import { NEXT_PUBLIC_URL } from "../../config";
// import { NEXT_PUBLIC_URL } from '@/app/config';

// //export const runtime = "edge";
// export const dynamic = "force-dynamic";

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// //const GRAPHQL_ENDPOINT = `https://gateway-arbitrum.network.thegraph.com/api/${process.env.THE_GRAPH_API_KEY}/subgraphs/id/2hTKKMwLsdfJm9N7gUeajkgg8sdJwky56Zpkvg8ZcyP8`;

// // const noCacheFetch = async (url: string, options: RequestInit) =>
// //   fetch(url, options);

// export async function GET(req: Request) {
// //   const document = gql`
// //     {
// //       sales(orderBy: timestamp, orderDirection: desc, first: 1) {
// //         amount
// //         timestamp
// //         nft {
// //           tokenId
// //           ... on Punk {
// //             id
// //             metadata {
// //               contractURI
// //               id
// //               tokenId
// //               tokenURI
// //               svg
// //               traits {
// //                 id
// //                 type
// //               }
// //             }
// //           }
// //         }
// //       }
// //     }
// //   `;

// //   const graphQLClient = new GraphQLClient(GRAPHQL_ENDPOINT, {
// //     fetch,
// //     cache: "no-store",
// //   });


// //   const response: any = await graphQLClient.request(document);

// //   console.warn("!!!!!!!!!!!!!!!!document=" + JSON.stringify(document));

//   const { searchParams } = new URL(req.url);
  
//   const fid = searchParams.get('fid');
//   const followerCount = searchParams.get('followerCount');
//   const followingCount = searchParams.get('followingCount');
//   const profileImage = searchParams.get('profileImage') || `${NEXT_PUBLIC_URL}/default-image.png`;

//   if (true) {
//     return new ImageResponse(
//         (
//             <div
//               style={{
//                 fontSize: 60,
//                 color: "white",
//                 background: "#638596",
//                 width: "100%",
//                 height: "100%",
//                 // padding: "0px 200px",
//                 textAlign: "center",
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 position: "relative",
//               }}
//             >
//               <img
//                 src={`${NEXT_PUBLIC_URL}/park-3.png`}
//                 //src={profileImage}
//                 height="400"
//                 width="400"
//                 style={{
//                   position: "absolute",
//                   top: 0,
//                   left: 0,
//                   width: "100%",
//                   height: "100%",
//                   objectFit: "cover",
//                 }}
//               />
//               <div
//                 style={{
//                   position: "absolute",
//                   top: 0,
//                   left: 0,
//                   width: "100%",
//                   height: "100%",
//                   display: "flex",
//                   flexDirection: "column",
//                   justifyContent: "center",
//                   alignItems: "center",
//                   textAlign: "center",
//                   zIndex: 1,
//                 }}
//               >
//                 <div style={{ marginBottom: "10px", display: "flex" }}>
//                   fid: {fid}
//                 </div>
//                 <div style={{ marginBottom: "10px", display: "flex" }}>
//                 followerCount: {followerCount} / followingCount: {followingCount}
//                 </div>
//                 <div style={{ marginTop: "100px", display: "flex", fontSize: "50px" }}>
//                   Last Update: {new Date().toISOString()}
//                 </div>
//               </div>
//             </div>
//           ),
//       {
//         width: 1200,
//         height: 630,
//       }
//     );
//   } else {
//     return new ImageResponse(
//       (
//         <div
//           style={{
//             fontSize: 40,
//             color: "black",
//             background: "white",
//             width: "100%",
//             height: "100%",
//             padding: "50px 200px",
//             textAlign: "center",
//             justifyContent: "center",
//             alignItems: "center",
//             display: "flex",
//           }}
//         >
//           Error fetching data :(. Please try again later.
//         </div>
//       ),
//       {
//         width: 1200,
//         height: 630,
//       }
//     );
//   }
// }


import { ImageResponse } from "@vercel/og";
import { NEXT_PUBLIC_URL } from '@/app/config';
import fs from 'fs';
import path from 'path';

//export const runtime = "edge";
export const dynamic = "force-dynamic";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// woff 파일 경로
const fontPath = path.join(process.cwd(), 'public/fonts/Roboto-Regular.ttf');
const fontData = fs.readFileSync(fontPath);


async function fetchCoinData() {
  const { COINMARKETCAP_API_KEY } = process.env;

  const responseMoxieUsd = await fetch(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=MOXIE&convert=USD`, {
    headers: {
      'X-CMC_PRO_API_KEY': COINMARKETCAP_API_KEY || '',
    },
  });

  if (!responseMoxieUsd.ok) {
    throw new Error('Failed to fetch coin data');
  }

  const dataMoxieUsd = await responseMoxieUsd.json();

  const responseMoxieKrw = await fetch(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=MOXIE&convert=KRW`, {
    headers: {
      'X-CMC_PRO_API_KEY': COINMARKETCAP_API_KEY || '',
    },
  });

  if (!responseMoxieKrw.ok) {
    throw new Error('Failed to fetch coin data');
  }

  const dataMoxieKrw = await responseMoxieKrw.json();

   console.warn("###dataMoxieUsd=" + JSON.stringify(dataMoxieUsd));
  // console.warn("###dataMoxieKrw=" + JSON.stringify(dataMoxieKrw));

  const moxieUsdPrice = dataMoxieUsd.data.MOXIE[0].quote.USD.price.toFixed(6);  // USD 가격
  const moxieKrwPrice = dataMoxieKrw.data.MOXIE[0].quote.KRW.price.toFixed(2);  // KRW 가격 (소수점 제거)

  return { moxieUsdPrice, moxieKrwPrice };
}


export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const profileName = searchParams.get('profileName');
  const fid = searchParams.get('fid');
  const followerCount = searchParams.get('followerCount');
  const followingCount = searchParams.get('followingCount');
  const profileImage = searchParams.get('profileImage') || `${NEXT_PUBLIC_URL}/default-image.png`;

  console.warn("profileName=" + profileName);
  console.warn("fid=" + fid);

  let moxieUsdPrice = 'N/A';
  let moxieKrwPrice = 'N/A';
  let todayMoxie = 'N/A';

  try {
    const { moxieUsdPrice: usdPrice, moxieKrwPrice: krwPrice } = await fetchCoinData();
    moxieUsdPrice = parseFloat(usdPrice).toLocaleString('en-US', { minimumFractionDigits: 5 });
    moxieKrwPrice = parseFloat(krwPrice).toLocaleString('ko-KR');

    todayMoxie = '112233';
    todayMoxie =  parseFloat(todayMoxie).toLocaleString()

    console.warn("moxieUsdPrice=" + moxieUsdPrice);
    console.warn("moxieKrwPrice=" + moxieKrwPrice);
    console.warn("todayMoxie=" + parseFloat(todayMoxie).toLocaleString());

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
          fontFamily: '"Roboto-Regular"', // 폰트 이름
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
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '40px', color: 'black' }}>
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
                  <div style={{ display: 'flex',textAlign: 'center', fontWeight: 'bold', color: 'black' }}>
                    <span>
                      Moxie Price
                    </span>
                  </div>
                  <div style={{ display: 'flex',textAlign: 'center', fontWeight: 'bold', color: 'black' }}>
                    <span>
                      {moxieUsdPrice} USD / {moxieKrwPrice} KRW
                    </span>
                  </div>
                </div>
              </span>
           </div>


          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'black' }}>
              <span>
              
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '170px', marginBottom: '10px' }}>
                  <div style={{ display: 'flex',textAlign: 'center' }}>
                    <span>
                      FarScore
                    </span>
                  </div>
                  <div style={{ display: 'flex',textAlign: 'center', fontWeight: 'bold' }}>
                    <span>
                      0.18
                    </span>
                  </div>
                  <div style={{ display: 'flex',textAlign: 'center', fontSize: '30px' }}>
                    <span>
                      0.18 USD
                    </span>
                  </div>
                  <div style={{ display: 'flex',textAlign: 'center', fontSize: '30px' }}>
                    <span>
                      0.18 KRW
                    </span>
                  </div>

                  <div style={{ display: 'flex',textAlign: 'center', marginTop: '20px', marginBottom: '' }}>
                    <span>
                    </span>
                  </div>

                  <div style={{ display: 'flex',textAlign: 'center', marginTop: '80px' }}>
                    <span>
                     Like 👍
                    </span>
                  </div>
                  <div style={{ display: 'flex',textAlign: 'center', fontWeight: 'bold' }}>
                    <span>
                      2.22
                    </span>
                  </div>
                  <div style={{ display: 'flex',textAlign: 'center', fontSize: '30px' }}>
                    <span>
                      2.22 USD
                    </span>
                  </div>
                  <div style={{ display: 'flex',textAlign: 'center', fontSize: '30px' }}>
                    <span>
                      2.22 KRW
                    </span>
                  </div>

                  <div style={{ display: 'flex',textAlign: 'center', marginTop: '20px', marginBottom: '' }}>
                    <span>
                    </span>
                  </div>

                  <div style={{ display: 'flex',textAlign: 'center', marginTop: '80px' }}>
                    <span>
                      Today
                    </span>
                  </div>
                  <div style={{ display: 'flex',textAlign: 'center', fontWeight: 'bold' }}>
                    <span>
                       {todayMoxie}
                    </span>
                  </div>
                  <div style={{ display: 'flex',textAlign: 'center', fontSize: '30px' }}>
                    <span>
                      53.22 USD
                    </span>
                  </div>
                  <div style={{ display: 'flex',textAlign: 'center', fontSize: '30px' }}>
                    <span>
                      53.22 KRW
                    </span>
                  </div>
                </div>


                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '120px', marginBottom: '10px' }}>
                  <div style={{ display: 'flex',textAlign: 'center' }}>
                    <span>
                      FarBoost
                    </span>
                  </div>
                  <div style={{ display: 'flex',textAlign: 'center', fontWeight: 'bold' }}>
                    <span>
                      0.11
                    </span>
                  </div>
                  <div style={{ display: 'flex',textAlign: 'center', fontSize: '30px' }}>
                    <span>
                      0.11 USD
                    </span>
                  </div>
                  <div style={{ display: 'flex',textAlign: 'center', fontSize: '30px' }}>
                    <span>
                      0.11 KRW
                    </span>
                  </div>

                  <div style={{ display: 'flex',textAlign: 'center', marginTop: '30px', marginBottom: '15px' }}>
                    <span>
                      Engagement Value
                    </span>
                  </div>

                  <div style={{ display: 'flex',textAlign: 'center' }}>
                    <span>
                     Reply 💬
                    </span>
                  </div>
                  <div style={{ display: 'flex',textAlign: 'center', fontWeight: 'bold' }}>
                    <span>
                      0.11
                    </span>
                  </div>
                  <div style={{ display: 'flex',textAlign: 'center', fontSize: '30px' }}>
                    <span>
                      0.11 USD
                    </span>
                  </div>
                  <div style={{ display: 'flex',textAlign: 'center', fontSize: '30px' }}>
                    <span>
                      0.11 KRW
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
                  <div style={{ display: 'flex',textAlign: 'center', fontWeight: 'bold' }}>
                    <span>
                      0.11
                    </span>
                  </div>
                  <div style={{ display: 'flex',textAlign: 'center', fontSize: '30px' }}>
                    <span>
                      0.11 USD
                    </span>
                  </div>
                  <div style={{ display: 'flex',textAlign: 'center', fontSize: '30px' }}>
                    <span>
                      0.11 KRW
                    </span>
                  </div>
                </div>


                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ display: 'flex',textAlign: 'center' }}>
                    <span>
                      FarRank
                    </span>
                  </div>
                  <div style={{ display: 'flex',textAlign: 'center', fontWeight: 'bold' }}>
                    <span>
                      4228
                    </span>
                  </div>
                  <div style={{ display: 'flex',textAlign: 'center', fontSize: '30px' }}>
                    <span>
                      4228 USD
                    </span>
                  </div>
                  <div style={{ display: 'flex',textAlign: 'center', fontSize: '30px' }}>
                    <span>
                      4228 KRW
                    </span>
                  </div>

                  <div style={{ display: 'flex',textAlign: 'center', marginTop: '20px', marginBottom: '' }}>
                    <span>
                    </span>
                  </div>

                  <div style={{ display: 'flex',textAlign: 'center', marginTop: '80px' }}>
                    <span>
                      Rcast/Quote 🔄
                    </span>
                  </div>
                  <div style={{ display: 'flex',textAlign: 'center', fontWeight: 'bold' }}>
                    <span>
                      4228
                    </span>
                  </div>
                  <div style={{ display: 'flex',textAlign: 'center', fontSize: '30px' }}>
                    <span>
                      4228 USD
                    </span>
                  </div>
                  <div style={{ display: 'flex',textAlign: 'center', fontSize: '30px' }}>
                    <span>
                      4228 KRW
                    </span>
                  </div>

                  <div style={{ display: 'flex',textAlign: 'center', marginTop: '20px', marginBottom: '' }}>
                    <span>
                    </span>
                  </div>

                  <div style={{ display: 'flex',textAlign: 'center', marginTop: '80px' }}>
                    <span>
                      Lifetime
                    </span>
                  </div>
                  <div style={{ display: 'flex',textAlign: 'center', fontWeight: 'bold' }}>
                    <span>
                      4228
                    </span>
                  </div>
                  <div style={{ display: 'flex',textAlign: 'center', fontSize: '30px' }}>
                    <span>
                      4228 USD
                    </span>
                  </div>
                  <div style={{ display: 'flex',textAlign: 'center', fontSize: '30px' }}>
                    <span>
                      4228 KRW
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
              fontFamily: '"Roboto-Regular"', // 폰트 이름
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
            name: 'Roboto-Regular',
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
            name: 'Roboto-Regular',
            data: fontData,
            weight: 400,
            style: 'normal',
          },
        ],
      }
    );
  }
}
