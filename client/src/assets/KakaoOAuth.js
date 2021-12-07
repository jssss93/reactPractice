

const CLIENT_ID = "78443c734e669a70abfbeacdb46da2d0";
const REDIRECT_URI =  "http://localhost:3000/login/doKakaoLogin_callback";
export const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;