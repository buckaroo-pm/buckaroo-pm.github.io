import Link from 'next/link';

export default () => (
  <div className="banner footer">
    <div className="view column">
      <div className="actions">
        <div className="links">
          <Link href="/">Buckaroo</Link>
          <a href="https://github.com/LoopPerfect/buckaroo/wiki" target="_blank">Docs</a>
          <a href="https://github.com/LoopPerfect/buckaroo" target="_blank">GitHub</a>
        </div>

        <div className="signup">
          <h1 className="action">
              Sign up for our Newsletter
          </h1>
          <div className="info">
            Get the latest updates about new packages and Buckaroo releases.
          </div>
          <button>Sign Up</button>
        </div>
      </div>
      <div className="powered">
        <img src="/LoopPerfectInvertSmall.png" />
        <span>
          Powered by LoopPerfect
        </span>
      </div>
    </div>
  </div>
);