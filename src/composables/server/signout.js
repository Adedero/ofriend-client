import { useGet } from "../utils/use-fetch";

const signout = async (router) => {
  try {
    const payload = useGet('auth/sign-out');
    if (payload.error) {
      return
    }
    console.log(payload.message);
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    router.push({ name: 'signin' });
  } catch (error) {
    console.error(error);
  }
}

export default signout;