import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Color } from 'constants/css';
import { removeLineBreaks } from 'helpers/stringHelpers';
import { useMyState } from '../helpers/hooks';

ContentLink.propTypes = {
  content: PropTypes.shape({
    byUser: PropTypes.number,
    content: PropTypes.string,
    id: PropTypes.number,
    title: PropTypes.string,
    username: PropTypes.string
  }).isRequired,
  style: PropTypes.object,
  contentType: PropTypes.string
};

export default function ContentLink({
  style,
  content: { byUser, id, content, title, username },
  contentType
}) {
  const { profileTheme } = useMyState();
  let destination = '';
  if (contentType === 'url') {
    destination = 'links';
  } else {
    destination = contentType + 's';
  }
  title = title || content || username;
  return useMemo(
    () =>
      title ? (
        <Link
          style={{
            fontWeight: 'bold',
            color:
              contentType === 'video' && byUser
                ? Color[profileTheme](0.9)
                : Color.blue(),
            ...style
          }}
          to={`/${destination}/${contentType === 'user' ? username : id}`}
        >
          {removeLineBreaks(title)}
        </Link>
      ) : (
        <span style={{ fontWeight: 'bold', color: Color.darkerGray() }}>
          (Deleted)
        </span>
      ),
    [profileTheme, byUser, content, title, username]
  );
}
