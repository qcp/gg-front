import fs from "file-saver";

import config from "@/config";
import store from "@/store";

function backCall(url, method, data) {
  return fetch(config.backEndpoint + url, {
    method: method || "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "x-access-token": store.getters.token
    },
    body: data && method != "GET" ? JSON.stringify(data) : null
  })
    .then(res => {
      if (!res.ok) throw res.statusText;
      return res.json();
    })
    .then(res => {
      if (res.status != "OK") throw res.error;
      return Promise.resolve(res);
    })
    .catch(err => {
      return Promise.reject(err);
    });
}

function backUploadFiles(files) {
  let formData = new FormData();
  for (const file of files) formData.append("files[]", file, file.name);
  return fetch(config.backEndpoint + "/utils/upload-files", {
    method: "POST",
    headers: {
      "x-access-token": store.getters.token
    },
    body: formData
  })
    .then(res => {
      if (!res.ok) throw res.statusText;
      return res.json();
    })
    .then(res => {
      if (res.status != "OK") throw res.error;
      return Promise.resolve(res);
    })
    .catch(err => {
      return Promise.reject(err);
    });
}
function downloadFileUrl(id) {
  return `${config.backEndpoint}/utils/download-file?_id=${id}`;
}
function backDownloadFile(id, name) {
  return fs.saveAs(
    `${config.backEndpoint}/utils/download-file?_id=${id}`,
    name
  );
}

const mongoIdList = [];
async function nextMongoId() {
  if (!mongoIdList.length) {
    await backCall("/utils/idList", "GET").then(res =>
      mongoIdList.push(...res.idList)
    );
  }
  return mongoIdList.pop();
}

export default {
  install(Vue) {
    Vue.prototype.$nextMongoId = nextMongoId;

    Vue.prototype.$backCall = backCall;
    Vue.backCall = backCall;

    Vue.prototype.$backUploadFiles = backUploadFiles;
    Vue.prototype.$backDownloadFile = backDownloadFile;
    Vue.prototype.$downloadFileUrl = downloadFileUrl;
  }
};
