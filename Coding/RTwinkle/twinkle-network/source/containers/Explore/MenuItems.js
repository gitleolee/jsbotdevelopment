import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import { NavLink } from 'react-router-dom';

MenuItems.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object
};

export default function MenuItems({ className, style }) {
  return (
    <div style={style} className={className}>
      <NavLink to="/subjects" activeClassName="active">
        <Icon icon="bolt" />
        <span style={{ marginLeft: '1.1rem' }}>Subjects</span>
      </NavLink>
      <NavLink to="/videos" activeClassName="active">
        <Icon icon="film" />
        <span style={{ marginLeft: '1.1rem' }}>Videos</span>
      </NavLink>
      <NavLink to="/links" activeClassName="active">
        <Icon icon="book" />
        <span style={{ marginLeft: '1.1rem' }}>Links</span>
      </NavLink>
    </div>
  );
}
