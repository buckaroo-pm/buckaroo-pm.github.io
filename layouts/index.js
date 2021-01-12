import Head from "next/head";
import Footer from "../components/Footer";
import Navigation from "../components/Navigation";

export default function DefaultLayout({ children, frontMatter }) {
  return (
    <>
      <Head>
        <link rel="stylesheet" type="text/css"
         href="/prism.css"/>
      </Head>
      <div className="site">
        <Navigation/>
        <div style={{width: '100%', maxHeight: '80vh', overflow:'hidden'}}>
          <img src={frontMatter.banner} style={{width:'100%'}}/>   
        </div>   
        <div className="banner white">
          <div className="view">
            <div>
              <h1>{frontMatter.title}</h1>
              <div className="post">
                {children}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}