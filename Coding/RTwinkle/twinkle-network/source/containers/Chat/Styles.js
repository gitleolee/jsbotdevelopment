import { Color, mobileMaxWidth } from 'constants/css';
import { css } from 'emotion';

export const MessageStyle = {
  container: css`
    display: flex;
    width: 100%;
    padding: 1rem 0;
    position: relative;
  `,
  profilePic: css`
    width: 5.5vw;
    height: 5.5vw;
    @media (max-width: ${mobileMaxWidth}) {
      width: 6vw;
      height: 6vw;
    }
  `,
  contentWrapper: css`
    margin-left: 1rem;
    margin-right: 1rem;
    width: 100%;
    position: relative;
    white-space: pre-wrap;
    overflow-wrap: break-word;
    word-break: break-word;
  `,
  usernameText: { fontSize: '1.8rem', lineHeight: '100%' },
  messageWrapper: css`
    margin-top: 0.5rem;
    position: relative;
  `,
  timeStamp: css`
    font-size: 1rem;
    color: ${Color.gray()};
  `,
  relatedConversationsButton: css`
    margin-top: 1rem;
  `,
  subjectPrefix: css`
    font-weight: bold;
    color: ${Color.green()};
  `
};
