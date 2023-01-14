import "../styles/globals.css";
import type { AppProps } from "next/app";
import UserApp from "../userApp";
export default function myApp({ Component, pageProps }: AppProps) {
  return (
    <UserApp>
      <Component {...pageProps} />
    </UserApp>
  );
}
