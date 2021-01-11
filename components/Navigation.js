import { useEffect, useState } from "react";
import Link from 'next/link'
import { get } from "superagent";
import FlexSearch from "flexsearch";

export default function Navigation() {
  const [input, setSearch] = useState('');
  const [index, setIndex] = useState(null);
  const [cursor, setCursor] = useState(true);

  const results = 
    (input.trim() == '' || !index ) 
      ? null 
      : index.search(input.trim(), {
          suggest: true, 
          limit:20, 
          page: cursor
        });

  useEffect(()=>{
    get('/packages/search.index').then(x => {
      const searchIndex = FlexSearch.create({
        tokenize: 'forward',
        encode: 'extra',
        threshold: 1,
        resolution: 3,
        depth: 2,
        profile:'score',
        doc: {
          id: "id",
          field: ["name", "description"],
        }
      });
    
      //database.map( (x,i) => index.add(i, x.description));
      //database.map( (x,i) => x.topics.map(t=>index.add(i, t)));
      searchIndex.import(x.text);
      setIndex(searchIndex);
    })
  }, []);

  const searchResults = results &&  results.result && (
    <div className="banner white" style={{display:'flex', flexFlow:'column'}}>
      <div> Results {results.result.length} </div>
      {
      (results && results.result||[]).map( (x) => (
        <Link key={x.name} href={`/packages/${x.name}`} prefetch >
          <div className="view" style={{display:'inline-flex'}} onClick={()=>{setSearch(''); setCursor(true); }} >
            <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
              <div className="package">
                <img src={`/packages/${x.name}/logo.png`} />
              </div>
              <div>
                <div>{x.name}</div>
                <div>{x.description}</div>
              </div>
            </div>
          </div>
        </Link>
      ))
    }</div>
  )

  return (
    <>
      <div className="navigation">
        <div className="view row space-between">
          <div className="links">
            <Link href={'/'}>
              <a className="buckaroo">Buckaroo</a>
            </Link>
            <a href="https://github.com/LoopPerfect/buckaroo/wiki" target="_blank">Docs</a>
            <Link href="/blog"><a href="/blog">Blog</a></Link>
          </div>
          <div className="search">
            <input placeholder="search for a module..." value={input} onChange={e=>setSearch(e.target.value)} />
            <button className="fa fa-search fa-large"/>
          </div>
          <iframe id="star-button" src="https://ghbtns.com/github-btn.html?user=LoopPerfect&amp;repo=buckaroo&amp;type=star&amp;count=true&amp;size=large" frameBorder="0" scrolling="0" width="160px" height="30px"></iframe>
        </div>
      </div>

      <div>
        {searchResults}
      </div>
    </>
  );
}