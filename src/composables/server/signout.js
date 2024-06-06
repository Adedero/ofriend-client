import { useRouter } from "vue-router";
import { useGet } from "../utils/use-fetch";

const signout = async () => {
  const router = useRouter();
  try {
    const payload = useGet('auth/sign-out');
    if (payload.error) {
      return
    }
    console.log(payload.message);
    sessionStorage.removeItem('user');
    router.push({ name: 'signin' });
  } catch (error) {
    console.error(error);
  }
}

export default signout;