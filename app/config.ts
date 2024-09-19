// use NODE_ENV to not have to change config based on where it's deployed
// ngrok 서버 킬때는 http://localhost:3000자리에 ngrok에서 얻은 주소로 바꿔줄것(예: https://99fe-175-115-245-58.ngrok-free.app)
//그래야 프레임 벨리데이터에서 동작함 https://b2da-175-115-245-58.ngrok-free.app
export const NEXT_PUBLIC_URL =
  process.env.NODE_ENV == 'development' ? 'https://05ee-175-115-245-58.ngrok-free.app' : 'https://hemanruru.vercel.app';

