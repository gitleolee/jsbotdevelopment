import React, { useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import VideoThumbImage from 'components/VideoThumbImage';
import Link from 'components/Link';
import LongText from 'components/Texts/LongText';
import Embedly from 'components/Embedly';
import RewardLevelBar from 'components/RewardLevelBar';
import SecretAnswer from 'components/SecretAnswer';
import { cleanString } from 'helpers/stringHelpers';
import { Color, borderRadius, mobileMaxWidth } from 'constants/css';
import { css } from 'emotion';
import { useContentState, useMyState } from 'helpers/hooks';
import { useContentContext } from 'contexts';

ContentListItem.propTypes = {
  comments: PropTypes.array,
  contentObj: PropTypes.object.isRequired,
  expandable: PropTypes.bool,
  onClick: PropTypes.func,
  selectable: PropTypes.bool,
  selected: PropTypes.bool,
  style: PropTypes.object
};

export default function ContentListItem({
  onClick = () => {},
  contentObj,
  contentObj: { id: contentId, contentType },
  expandable,
  selectable,
  selected,
  style
}) {
  const { profileTheme } = useMyState();
  const {
    content,
    description,
    loaded,
    rewardLevel,
    rootObj,
    secretAnswer,
    title,
    uploader = {}
  } = useContentState({ contentId, contentType });
  const {
    actions: { onInitContent }
  } = useContentContext();
  useEffect(() => {
    if (!loaded) {
      onInitContent({ contentId, contentType, ...contentObj });
    }
    if (rootObj) {
      onInitContent({
        contentId: rootObj.id,
        contentType: rootObj.contentType,
        ...rootObj
      });
    }
  }, []);

  return useMemo(
    () => (
      <div
        onClick={onClick}
        style={{
          cursor: 'pointer',
          borderRadius,
          boxShadow: selected ? `0 0 5px ${Color[profileTheme](0.8)}` : null,
          border: selected ? `0.5rem solid ${Color[profileTheme](0.8)}` : null,
          ...style
        }}
        className={css`
          border: 1px solid ${Color.borderGray()};
          background: ${expandable ? Color.whiteGray() : '#fff'};
          .label {
            color: ${expandable ? Color.darkerGray() : Color.darkGray()};
            transition: color 1s;
          }
          margin-top: ${expandable ? '-1rem' : '0'};
          transition: background 0.5s, border 0.5s;
          &:hover {
            border-color: ${Color.darkerBorderGray()};
            .label {
              color: ${expandable ? Color.darkGray() : Color.darkerGray()};
            }
            background: ${expandable ? '#fff' : Color.highlightGray()};
          }
          @media (max-width: ${mobileMaxWidth}) {
            margin-top: -0.5rem;
            border-left: 0;
            border-right: 0;
          }
        `}
      >
        <Link
          style={{ textDecoration: 'none' }}
          to={
            expandable || selectable
              ? ''
              : `/${contentType === 'url' ? 'link' : contentType}s/${contentId}`
          }
        >
          <div style={{ padding: '1rem' }}>
            <div
              style={{
                display: 'flex',
                width: '100%',
                fontSize: '1.3rem',
                minHeight: contentType === 'subject' ? '10rem' : ''
              }}
            >
              {contentType === 'video' && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '25%'
                  }}
                >
                  <VideoThumbImage
                    rewardLevel={rewardLevel}
                    videoId={contentId}
                    src={`https://img.youtube.com/vi/${content}/mqdefault.jpg`}
                  />
                </div>
              )}
              <div
                style={{
                  width:
                    contentType !== 'subject' && contentType !== 'url'
                      ? '75%'
                      : '100%',
                  padding: '1rem 0',
                  ...(contentType === 'url' ? { paddingTop: '0.5rem' } : {})
                }}
              >
                {contentType === 'video' && (
                  <>
                    <div style={{ marginLeft: '1rem' }}>
                      <p
                        style={{
                          fontSize: '2rem',
                          fontWeight: 'bold',
                          lineHeight: 1.5
                        }}
                        className="label"
                      >
                        {cleanString(title)}
                      </p>
                      <p style={{ color: Color.gray() }}>
                        Uploaded by {uploader.username}
                      </p>
                    </div>
                    <div
                      style={{
                        marginTop: '1rem',
                        marginLeft: '1rem',
                        color: Color.darkerGray()
                      }}
                    >
                      <LongText
                        className={css`
                          p {
                            text-overflow: ellipsis;
                            overflow: hidden;
                          }
                        `}
                        cleanString
                        noExpand
                        maxLines={4}
                      >
                        {description}
                      </LongText>
                    </div>
                  </>
                )}
                {contentType === 'book' && (
                  <div
                    style={{
                      display: 'flex'
                    }}
                  >
                    <div className="label">
                      <LongText
                        noExpand
                        cleanString
                        maxLines={4}
                        style={{
                          fontWeight: 'bold',
                          fontSize: '2.5rem'
                        }}
                      >
                        {title}
                      </LongText>
                      <p style={{ color: Color.gray() }}>
                        Written by {uploader.username}
                      </p>
                      {description && (
                        <div
                          style={{
                            marginTop: '1rem',
                            width: '100%',
                            textAlign: 'left',
                            color: Color.darkerGray()
                          }}
                        >
                          <LongText noExpand cleanString maxLines={4}>
                            {description}
                          </LongText>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {contentType === 'subject' && (
                  <div
                    style={{
                      display: 'flex'
                    }}
                  >
                    <div className="label">
                      <LongText
                        noExpand
                        cleanString
                        maxLines={4}
                        style={{
                          fontWeight: 'bold',
                          fontSize: '2.5rem'
                        }}
                      >
                        {title}
                      </LongText>
                      <p style={{ color: Color.gray() }}>
                        Posted by {uploader.username}
                      </p>
                      {description && (
                        <div
                          style={{
                            marginTop: '1rem',
                            width: '100%',
                            textAlign: 'left',
                            color: Color.darkerGray()
                          }}
                        >
                          <LongText noExpand cleanString maxLines={4}>
                            {description}
                          </LongText>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {contentType === 'url' && (
                  <div>
                    <span
                      style={{
                        fontWeight: 'bold',
                        fontSize: '2rem'
                      }}
                      className="label"
                    >
                      {cleanString(title)}
                    </span>
                    <Embedly
                      small
                      noLink
                      style={{ marginTop: '0.5rem' }}
                      contentId={contentId}
                    />
                  </div>
                )}
              </div>
              {contentType === 'subject' && rootObj?.id && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '25%',
                    marginBottom: secretAnswer ? '1rem' : ''
                  }}
                >
                  {rootObj?.contentType === 'video' && (
                    <VideoThumbImage
                      rewardLevel={rootObj.rewardLevel}
                      videoId={rootObj.id}
                      src={`https://img.youtube.com/vi/${rootObj.content}/mqdefault.jpg`}
                    />
                  )}
                  {rootObj?.contentType === 'url' && (
                    <Embedly imageOnly noLink contentId={rootObj?.id} />
                  )}
                </div>
              )}
            </div>
            {contentType === 'subject' && secretAnswer && (
              <SecretAnswer
                answer={secretAnswer}
                subjectId={contentId}
                uploaderId={uploader.id}
              />
            )}
          </div>
          {!!rewardLevel && contentType === 'subject' && (
            <div
              className={css`
                margin-right: -1px;
                margin-left: -1px;
                @media (max-width: ${mobileMaxWidth}) {
                  margin-left: 0px;
                  margin-right: 0px;
                }
              `}
              style={{
                paddingBottom: !!rewardLevel && '1rem'
              }}
            >
              <RewardLevelBar
                style={{ fontSize: '1.3rem' }}
                rewardLevel={rewardLevel}
              />
            </div>
          )}
        </Link>
      </div>
    ),
    [
      rewardLevel,
      secretAnswer,
      title,
      description,
      rootObj,
      selected,
      profileTheme
    ]
  );
}
