import "../styles/globals.css";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import Head from "next/head";
const client = new QueryClient({});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={client}>
      <Head>
        <title>DripShop</title>
      </Head>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}
