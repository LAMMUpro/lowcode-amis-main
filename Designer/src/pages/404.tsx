import React from 'react';
import {Link} from 'react-router-dom';

export default () => (
  <div style={{backgroundColor: 'white', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
    <div style={{textAlign: 'center'}}>
      <p className="text-shadow" style={{textAlign: 'center', margin: '0', color: 'white'}}>404</p>
      <Link 
        to="/" 
        className="list-group-item"
        style={{border: '1px solid var(--link-onHover-color)', padding: '6px 10px', borderRadius: '6px'}}
      >
        <i className="fa fa-fw fa-mail-forward m-r-xs" />
        返回首页
      </Link>
    </div>
  </div>
);
