const {writeFile, readFile, stat} = require('fs/promises');
const mkdirp = require('mkdirp');
const {get, post} = require('superagent');

const git = require('isomorphic-git');
const http = require('isomorphic-git/http/node');
const semver = require('semver');
const toml = require('toml');
const Throttle    = require('superagent-throttle')
const Search = require("flexsearch");

let throttle = new Throttle({
  active: true,     // set false to pause queue
  rate: 10,          // how many requests can be sent every `ratePer`
  ratePer: 2000,   // number of ms in which `rate` requests may be sent
  concurrent: 10     // how many requests can be sent concurrently
})



const getVersions = async (nameWithOwner) => {

  const cachePath = `.cache/${nameWithOwner.replace(/[/]/g, '-')}-refs.json`;

  const cached = await readFile(cachePath, 'utf8').catch(()=>null);
 
  if (cached) {
    return JSON.parse(cached);
  }

  let refs = git.listServerRefs({
    http,
    url: `https://github.com/${nameWithOwner}.git`,
    symrefs: true
  });

  const result = await refs.then(
    remote => {
      const refs = 
        remote
        .map(x => [x.oid, x.ref
          .replace('refs/heads/','')
          .replace('refs/tags/','')]);

      const main = new Set(['master', 'main', 'develop'])

      const branches = refs.filter(x=>main.has(x[1]));
        
      return branches.concat(
        [...refs]
        .filter(x=>semver.valid(x[1]))
        .sort( (a, b) => semver.compare(b[1], a[1]))
      );
    });

  await writeFile(cachePath, JSON.stringify(result, null, 2));
  return result;
}

const getFile = (nameWithOwner, file) => async (ref) => {
  const cachePath = `.cache/${nameWithOwner.replace(/[/]/g, '-')}-${ref}-${file}`;

  const cached = await readFile(cachePath, 'utf8')
    .catch(() => null)
 
  if (cached) {
    return [file, ref, cached];
  }

  const result =
    await 
      get(`https://raw.githubusercontent.com/${nameWithOwner}/${ref}/${file}`)
      .use(throttle.plugin())
      .then(x=>x.text)
      .catch(() => '')
      

  await writeFile(cachePath, result);
  return [file, ref, result];
}

const findManifests = async (nameWithOwner) => {
  const cachePath = `.cache/${nameWithOwner.replace(/[/]/g, '-')}-manifests.json`;
  const cached = await readFile(cachePath, 'utf8').catch(()=>null);
 
  if (cached) {
    return JSON.parse(cached);
  }

  const versions = await getVersions(nameWithOwner);

  const manifests = await Promise
    .all(versions.map( ([oid, ref]) => getFile(nameWithOwner, 'buckaroo.toml')(ref)))
    .then(xs => xs.filter(x=> x[2] && x[2] != '' ));

  const lockFiles = await Promise.all(
    manifests.map(x => getFile(nameWithOwner, 'buckaroo.lock.toml')(x[1]))
  );

  const bucks = await Promise.all(
    manifests.map(x => getFile(nameWithOwner, 'BUCK')(x[1]))
  );

  const bazels = await Promise.all(
    manifests.map(x => getFile(nameWithOwner, 'BUILD')(x[1]))
  );

  const result = manifests.map(
    (x, i) => ({
      ref: x[1], 
      manifest: x[2],
      lockFile: lockFiles[i][2],
      buck: bucks[i][2],
      bazel: bazels[i][2],
    }) 
  );

  await writeFile(cachePath, JSON.stringify(result, null, 2));
  return result;
}

function tryParse(x) {
  try {
    return toml.parse(x);
  }catch(_){
    return {};
  }
}

function extractDeps (x) {
  const manifest = tryParse(x.manifest);
  const lockFile = tryParse(x.lockFile||'');

  const deps = (manifest.dependency||[]).map(x => ({
    uri: x.package,
    name: x.package.replace('github.com/', ''),
    version: x.version
  }));

  const lock = Object.entries((lockFile||{}).lock||{}).map( ([package, spec]) => ({
    uri: package,
    name: package.replace('github.com/', ''),
    spec
  }));

  return {
    ...x,
    deps,
    lock
  }

}


const query = `
# Type queries into this side of the screen, and you will 
# see intelligent typeaheads aware of the current GraphQL type schema, 
# live syntax, and validation errors highlighted within the text.

# We'll get you started with a simple query showing your username!
query GetRepos($count: Int = 1, $after: String) {
  organization(login: "buckaroo-pm") {
    repositories(first:$count, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      
      nodes {
        nameWithOwner
        description

        licenseInfo { name: spdxId }        
        homepageUrl
        
        updatedAt
        pushedAt

        openGraphImageUrl
        
        stargazerCount
        forkCount

        parent {
          nameWithOwner
          stargazerCount
          forkCount

          updatedAt
          pushedAt
		      mentionableUsers(first:25) {
            totalCount
            nodes {
              login
              avatarUrl
            }
          }          
          
          contactLinks {
            about
            name
            url
          }

          openGraphImageUrl
          
          fundingLinks {
            url
            platform
          }

          repositoryTopics(first:20) {
            nodes {
              topic { name }
            }
          }

        }
        
        repositoryTopics(first:20) {
          nodes {
            topic { name }
          }
        }
      }
    }
  }
}
`

const getReadme = async (nameWithOwner) => {

  const cachePath = `.cache/${nameWithOwner.replace(/[/]/g, '-')}.md`;
  const file = await readFile(cachePath, 'utf8')
    .catch(()=>null)
   
  if (file) {
    return file;
  }

  const result = await 
    get(`https://api.github.com/repos/${nameWithOwner}/readme`) 
    .use(throttle.plugin())
    .set({
      'User-Agent': 'superagent',
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
    })
    .then(x=>Buffer.from(x.body.content, 'base64').toString('utf8'))
    .catch(()=>'');
  
  await writeFile(cachePath, result);
  return result;
}


const getRepos = async ({count, after}) => {
  const cachePath = `.cache/repo-${count}${after||''}.json`;
  const file = await readFile(cachePath, 'utf8')
    .then(x=>JSON.parse(x))
    .catch(()=>null)
   
  if (file) {
    return file;
  }

  const result = 
    await post('https://api.github.com/graphql')
      .use(throttle.plugin())
      .set({
        'User-Agent': 'superagent',
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
      })
      .send({
        query, 
        variables: {count, after}, 
        operationName: 'GetRepos'
      })
      .then(x=>x.body.data);

  await writeFile(cachePath, JSON.stringify(result, null, 2));
  return result;
}


async function oneAtATime(xs) {
  return xs.reduce(async (a, b) => {
    const prev = await a;
    const next = await b();
    return [...prev, next];
  }, Promise.resolve([]));
}

function cleanupEntry(x) {
  return ({
    packageName: x.nameWithOwner,
    name: (x.parent||x).nameWithOwner,
    image: (x.parent||x).openGraphImageUrl,
    licence: (x.licenseInfo||{name:''}).name,
    description: x.description,
    readme: x.readme,
    versions: x.manifests,
    updated: x.updatedAt,
    updatedUpstream: (x.parent||x).updatedAt,
    contributors: (x.parent&&x.parent.mentionableUsers.nodes || []),
    fundingLinks: (x.parent&&x.parent.fundingLinks.map(x=>x.url)||[]),
    contactLinks: (x.parent&&x.parent.contactLinks.map(x=>x.url)||[]),
    stars: Math.max(x.stargazerCount, (x.parent||x).stargazerCount),
    forks: Math.max(x.forkCount, (x.parent||x).forkCount),
    topics: (x.parent||x).repositoryTopics.nodes.map(x=>x.topic.name)
  })
}

function summary(x) {
  return {
    packageName: x.packageName,
    name: x.name, 
    //image: x.image, 
    license: x.license,
    stars: x.stars,
    topics: x.topics,
    description: x.description,
    versions: x.versions
      .map(x=>({
        ref:x.ref, 
        bazel: !!x.bazel, 
        buck: !!x.buck, 
        deps: x.deps.length, 
        transitive: x.lock.length
      })),
    updated: x.updated,
    updatedUpstream: x.updatedUpstream
  }
}

function buildDatabase(xs) {
  const topicIndex  = 
    xs.flatMap(x => x.topics.map(t => [t, summary(x)]))
      .reduce( (a, [t, x]) => ({...a, [t]: [...a[t], ...x] }), {})

  return {
    all: dxs,
    topicIndex,
  }
}

async function main() {
  await mkdirp('.cache');

  let after;
  let all = [];
  while (1) {
    const repos = await getRepos({count:20, after});
    const data = await oneAtATime(
      repos
      .organization
      .repositories
      .nodes
      .map((x) => async() => {
        const [readme, manifests] = await Promise.all([
          getReadme(x.nameWithOwner),
          findManifests(x.nameWithOwner)
            .then(xs=>xs.map(extractDeps))
        ]);

        return {
          ...x,
          readme,
          manifests
        }
      })
    );

    const {hasNextPage, endCursor} =       
      repos
        .organization
        .repositories
        .pageInfo

    after = endCursor;

    console.log(data);
    all = [...all, ...data];

    if (!hasNextPage)
      break;
  }

  const entries = all.map(cleanupEntry);
  for (const entry of entries) {
    const dir = `public/packages/${entry.packageName}`;
    
    const img = 
      stat(`${dir}/logo.png`)
        .then(() => 
          get(entry.image)
            .responseType('blob')
            .buffer(true))
        .catch(()=>{})
        
          
    
    
    delete entry.image;
    await mkdirp(dir);
    await Promise.all([
      writeFile(`${dir}/full.json`, JSON.stringify(entry, null, 2)),
      writeFile(`${dir}/summary.json`, JSON.stringify(summary(entry), null, 2)),
      img.then(data => {
        if (data && data.body instanceof Buffer) {
          return writeFile(`${dir}/logo.png`, data.body)
        }
      })
    ]);
  }

  const db = entries.map(summary);

  await writeFile(`public/packages/summaries.json`, JSON.stringify(db, null, 2));

  const search = Search.create({
    doc: {
      id: "id",
      field: {
        name: "match",
        description: {
          tokenize: "forward",
          encode: "extra"
        }, 
      },
    }
  });

  const index = search.add(db.map( (x, i) =>({
    id: i, 
    name: x.packageName, 
    description: x.description, 
    stars: x.stars, 
    topics: x.topics, 
    ...(x.versions[0]||{})
  })));

  await writeFile(`public/packages/search.index`, index.export());

  const names = db.map(x=>{
    const [owner, name] = x.packageName.split('/');
    return {owner, name};
  });
  await writeFile(`public/packages/names.json`, JSON.stringify(names, null, 2));

}


main()




