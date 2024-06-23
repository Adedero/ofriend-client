/* import { usePost } from "../utils/use-fetch";
 */
const signout = (router) => {
  sessionStorage.removeItem('user');
  sessionStorage.removeItem('token');
  router.push({ name: 'signin' });
  /* try {
    const payload = await usePost('auth/sign-out');
    if (payload.error) {
      return
    }
    console.log(payload);
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    router.push({ name: 'signin' });
  } catch (error) {
    console.error(error);
  } */
}

export default signout;