import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import { settingsChangeColor } from 'settings/settingsSlice';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { Button } from 'react-bootstrap';

const NavIconMenu = () => {
  const { color } = useSelector((state) => state.settings);
  const dispatch = useDispatch();
  const history = useHistory();

  const onLightDarkModeClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(settingsChangeColor(color.includes('light') ? color.replace('light', 'dark') : color.replace('dark', 'light')));
  };

  const handleLogout = () => {
    history.push('/login');
    localStorage.clear();
  };

  return (
    <>
      <ul className="list-unstyled list-inline text-center menu-icons">
        <li className="list-inline-item">
          <a id="colorButton" onClick={onLightDarkModeClick}>
            <CsLineIcons icon="light-on" size="18" className="light" />
            <CsLineIcons icon="light-off" size="18" className="dark" />
          </a>
        </li>
      </ul>

      <ul onClick={handleLogout} className="list-unstyled list-inline text-center menu-icons">
        <li>
          <a>
            <CsLineIcons icon="logout" className="me-2" size="15" />{' '}
            <span className="align-middle" style={{ fontSize: '15px' }}>
              Logout
            </span>
          </a>
        </li>
      </ul>
    </>
  );
};

export default React.memo(NavIconMenu);
