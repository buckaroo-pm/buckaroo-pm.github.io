import '../styles/globals.css';
import Head from 'next/head';


function MyApp({ Component, pageProps }) {
  return (
    <div className="site">
      <Head>
        <link 
          rel="stylesheet" 
          type="text/css" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css" />
      </Head>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
