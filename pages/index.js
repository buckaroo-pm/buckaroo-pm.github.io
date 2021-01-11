import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import { useEffect, useState } from 'react'

const packages = [
  "facebook-yoga",
  "sfml-window",
  "ipkn-crow",
  "datasift-served",
  "github-cmark",
  "eggs-cpp-variant",
  "no1msd-mstch",
  "cavewhere-squish",
  "madler-zlib",
  "chaiscript-chaiscript",
  "dropbox-json11",
  "lua-lua",
  "bulletphysics-bullet3",
  "libuv-libuv",
  "openssl-openssl",
  "google-gtest",
  "boost-thread"
];

const commands = packages.map(x => 'buckaroo install buckaroo-pm/'+x);

function Terminal({className, commands, typeSpeed, pause}) {
  const [{cursor, i}, setState] = useState({cursor:0, i:0});

  const subString = commands[i].slice(0, cursor) + '_';

  useEffect(()=>{
    if (cursor >= commands[i].length) {
      const h = setTimeout(()=>{
        setState({i:(i+1)%commands.length, cursor:0});
      }, pause);
      return ()=>clearTimeout(h);
    } else {
      const h = setTimeout(()=> {
        setState({cursor:cursor+1, i});
      }, typeSpeed);
      return ()=>clearTimeout(h);
    }
  }, [subString, typeSpeed, pause, commands.join(' ')]);

  return <div className={className} style={{ width:'900px'}}>$ {subString}</div>
}

export default function Home() {
  return (
    <>
      <Navigation />
      <div className="banner green">
        <h1 className="title">Buckaroo is a Package Manager for C++ and Friends</h1>
        <Terminal className="install" typeSpeed={50} pause={1000} commands={commands} />
      </div>

      <div className="banner white">
        <div className="view column">
          <h1>Buckaroo makes it easy to add modules to your project<br/> in a controlled and cross-platform way.</h1>
          
          <div className="reasons">
            <div>
              <h1><span className="fa fa-bolt icon"/>Simple</h1>
              <p>Packages are installed in one command, with all dependencies defined in single JSON file per-project. All packages use Buck as a build system, yielding faster builds.</p>
            </div>
            
            
            <div>
              <h1><span className="fa fa-lock icon"/> Secure</h1>
              <p>The dependency graph is tracked through Git and external resources are hashed to ensure integrity. Your team can easily examine the exact versioning of all build inputs</p>
            </div>
              
            <div>
              <h1><span className="fa fa-users icon"/>Open-Source</h1>
              <p>Buckaroo is fully open-source and released under a permissive MIT license. You can rest assured that your project is not locked into proprietary technology.</p>
            </div>
          </div>
        </div>
      </div>


      <div className="banner green">
        <div className="view column">
          <h1>The most popular open-source C/C++ packages are ready to install.</h1>
          <div className="package-grid">
            {
              packages.map( name => (
                <div key={name} className="package">
                  <img src={name+".png"} />
                </div>
              ))
            }
          </div>          
        </div>
      </div>
      <Footer/>
    </>
    )
}
