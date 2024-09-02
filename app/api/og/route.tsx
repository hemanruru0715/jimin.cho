import { ImageResponse } from "@vercel/og";
//import { NEXT_PUBLIC_URL } from "../../config";
import { NEXT_PUBLIC_URL } from '@/app/config';

//export const runtime = "edge";
export const dynamic = "force-dynamic";

//const GRAPHQL_ENDPOINT = `https://gateway-arbitrum.network.thegraph.com/api/${process.env.THE_GRAPH_API_KEY}/subgraphs/id/2hTKKMwLsdfJm9N7gUeajkgg8sdJwky56Zpkvg8ZcyP8`;

// const noCacheFetch = async (url: string, options: RequestInit) =>
//   fetch(url, options);

export async function GET(req: Request) {
//   const document = gql`
//     {
//       sales(orderBy: timestamp, orderDirection: desc, first: 1) {
//         amount
//         timestamp
//         nft {
//           tokenId
//           ... on Punk {
//             id
//             metadata {
//               contractURI
//               id
//               tokenId
//               tokenURI
//               svg
//               traits {
//                 id
//                 type
//               }
//             }
//           }
//         }
//       }
//     }
//   `;

//   const graphQLClient = new GraphQLClient(GRAPHQL_ENDPOINT, {
//     fetch,
//     cache: "no-store",
//   });


//   const response: any = await graphQLClient.request(document);

//   console.warn("!!!!!!!!!!!!!!!!document=" + JSON.stringify(document));

  const { searchParams } = new URL(req.url);
  const fid = searchParams.get('fid');

  if (true) {
    return new ImageResponse(
        (
            <div
              style={{
                fontSize: 40,
                color: "white",
                background: "#638596",
                width: "100%",
                height: "100%",
                padding: "50px 200px",
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
              }}
            >
              <img
                src={`${NEXT_PUBLIC_URL}/park-3.png`}
                height="400"
                width="400"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  zIndex: 1,
                }}
              >
                <div style={{ marginBottom: "20px", display: "flex" }}>
                  Price: 150 ETH fid= {fid}
                </div>
                <div style={{ marginBottom: "20px", display: "flex" }}>
                  Time:
                </div>
                <div style={{ marginTop: "100px", display: "flex", fontSize: "15px" }}>
                  Last Update: {new Date().toISOString()}
                </div>
              </div>
            </div>
          ),
      {
        width: 1200,
        height: 630,
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
        height: 630,
      }
    );
  }
}