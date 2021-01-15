import Link from 'next/link';
import Footer from "../../components/Footer";
import Navigation from "../../components/Navigation";

function PostInfo({title, banner, link, created}) {
  return (
    <Link href={link}>
      <a href={link} className="post">
        <div style={{
          display:'flex', 
          flexDirection:'column', 
          maxWidth:'500px', 
          margin:'0.2em', 
          height: '500px', 
          background:'#eee', 
          color:'black',
          justifyContent:'space-between'
        }}>
          <div style={{maxHeight:'300px', overflow:'hidden'}}>
            <img src={banner} width={'100%'}/>
          </div>
          <div style={{
            fontSize:'2em', 
            padding:'1em', 
            minHeight:'200px', 
            alignSelf:'flex-end',
            justifySelf: 'flex-end',
            borderTop:'solid 1px black'
          }}>{title}</div>
        </div>
      </a>
    </Link>
  )
}

export default function Blog({posts}) {
  return (
    <>
      <Navigation/>
      <div style={{
          display:'flex', 
          flexDirection:'column',
          justifyContent:'center',
          padding:'1em'
        }}>
        <div 
          className="posts" 
          style={{
            display:'inline-flex', 
            flexWrap:'wrap',
            justifyContent:'center'}}>{
            posts.map( (x,i)=><PostInfo key={i} {...x} />)
          }
        </div>
      </div>
      <Footer/>  
    </>
  )
}


export const getServerSideProps = async () => {
  const fs = require('fs/promises');
  const glob = require('glob-promise');
  const fm = require('frontmatter');
  const paths = await glob('./pages/blog/*.md');
  const posts = await Promise.all(paths.map(file => (
    fs.readFile(file, 'utf8')
      .then(content => ({
        ...fm(content).data,
        link: `/blog/${file.replace('./pages/blog/', '').replace('.md', '')}`,
      }))
  )));

  return {
    props: {
      posts: posts.sort((a,b)=> +Date.parse(b.created) - Date.parse(a.created))
    }
  };
}