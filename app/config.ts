// use NODE_ENV to not have to change config based on where it's deployed
export const NEXT_PUBLIC_URL =
  process.env.NODE_ENV == 'development' ? 'https://18b6-175-115-245-58.ngrok-free.app' : 'https://jimin-cho22233.vercel.app';
