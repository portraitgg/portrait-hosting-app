const postUpdateContentTopic = (portraitId) => `/portrait_test/1/updates-${portraitId}/proto`;
// const postUpdateToAllContentTopic = `/portrait_test/1/updates-all/proto`;
const getLatestPortraitContentTopic = (portraitId) => `/portrait_test/1/latest-${portraitId}/proto`;
const requestLatestPortraitContentTopic = (portraitId) => `/portrait_test/1/requests-${portraitId}/proto`;
const pingAllNodesContentTopic = `/portrait_test/1/ping-all/proto`;
const pingNodeContentTopic = (nodeAddress) => `/portrait_test/1/ping-${nodeAddress}/proto`;

export {
  postUpdateContentTopic,
  // postUpdateToAllContentTopic,
  getLatestPortraitContentTopic,
  requestLatestPortraitContentTopic,
  pingAllNodesContentTopic,
  pingNodeContentTopic,
};
