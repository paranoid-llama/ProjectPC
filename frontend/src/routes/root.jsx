import {Outlet, useLocation} from 'react-router-dom';

export default function Root() {
    return (
      <>
        <div>
            <h1>Home Page!</h1>
            <a href='/collections'>Go to collections</a>
        </div>
      </>
    );
  }