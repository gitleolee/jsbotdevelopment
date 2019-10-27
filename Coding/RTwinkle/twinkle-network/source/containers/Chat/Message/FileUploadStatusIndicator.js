import React, { useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import ProgressBar from 'components/ProgressBar';
import LocalContext from '../Context';
import { Color } from 'constants/css';
import { useMyState } from 'helpers/hooks';
import { useChatContext } from 'contexts';

FileUploadStatusIndicator.propTypes = {
  channelId: PropTypes.number.isRequired,
  checkScrollIsAtTheBottom: PropTypes.func.isRequired,
  content: PropTypes.string,
  fileToUpload: PropTypes.object.isRequired,
  filePath: PropTypes.string.isRequired,
  onSendFileMessage: PropTypes.func.isRequired,
  recepientId: PropTypes.number,
  profilePicId: PropTypes.number,
  subjectId: PropTypes.number
};

export default function FileUploadStatusIndicator({
  channelId,
  checkScrollIsAtTheBottom,
  content,
  fileToUpload,
  filePath,
  onSendFileMessage,
  recepientId,
  subjectId
}) {
  const { authLevel, profilePicId, userId, username } = useMyState();
  const {
    state: { filesBeingUploaded },
    actions: { onDisplayAttachedFile }
  } = useChatContext();
  const { onFileUpload } = useContext(LocalContext);
  useEffect(() => {
    if (
      !filesBeingUploaded[channelId] ||
      filesBeingUploaded[channelId].filter(file => file.filePath === filePath)
        .length === 0
    ) {
      onFileUpload({
        channelId,
        content,
        fileName: fileToUpload.name,
        filePath,
        fileToUpload,
        userId,
        recepientId,
        subjectId
      });
    }
  }, []);
  const [
    {
      uploadComplete = false,
      clientToApiServerProgress = 0,
      apiServerToS3Progress = 0
    } = {}
  ] =
    filesBeingUploaded[channelId]?.filter(
      ({ filePath: path }) => path === filePath
    ) || [];
  useEffect(() => {
    if (uploadComplete) {
      const params = {
        content,
        fileName: fileToUpload.name,
        filePath,
        uploaderAuthLevel: authLevel,
        channelId,
        userId,
        username,
        profilePicId,
        scrollAtBottom: checkScrollIsAtTheBottom()
      };
      onDisplayAttachedFile(params);
      if (channelId) {
        onSendFileMessage(params);
      }
    }
  }, [filesBeingUploaded]);
  const [uploadProgress, setUploadProgress] = useState(0);
  useEffect(() => {
    setUploadProgress(
      Math.ceil(5 + 15 * clientToApiServerProgress + 80 * apiServerToS3Progress)
    );
  }, [clientToApiServerProgress, apiServerToS3Progress]);

  return useMemo(
    () => (
      <div style={{ marginTop: '1rem' }}>
        <div>{`Uploading ${fileToUpload.name}...`}</div>
        <ProgressBar
          text={uploadComplete ? 'Upload Complete!' : ''}
          color={uploadComplete ? Color.green() : Color.blue()}
          progress={uploadComplete ? 100 : uploadProgress}
        />
      </div>
    ),
    [fileToUpload.name, uploadComplete, uploadProgress]
  );
}
