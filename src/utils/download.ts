/**
 * 获取 blob
 * @param  {String} url 目标文件地址
 * @return {cb}
 */
function getBlob(url, cb) {
  const xhr = new XMLHttpRequest()
  xhr.open('GET', url, true)
  xhr.responseType = 'blob'
  xhr.onload = function() {
    if (xhr.status === 200) {
      cb(xhr.response)
    }
  }
  xhr.send()
}
/* eslint-disable */
/**
 * 保存
 * @param  {Blob} blob
 * @param  {String} filename 想要保存的文件名称
 */
function saveAs(blob, filename) {
  if ('msSaveOrOpenBlob' in window.navigator) {
    navigator.msSaveBlob(blob, filename);
  } else {
    let link = document.createElement("a")
    let body = document.querySelector("body")

    link.href = window.URL.createObjectURL(blob)
    link.download = filename

    // fix Firefox
    link.style.display = 'none';
    (body as any).appendChild(link)

    link.click();
    (body as any).removeChild(link)

    window.URL.revokeObjectURL(link.href)
  }
}

/**
 * 下载
 * @param  {String} url 目标文件地址
 * @param  {String} filename 想要保存的文件名称
 */
export default function download(url, filename) {
  getBlob(url, function(blob) {
    saveAs(blob, filename)
  })
}

export function downloadFile(resource, filename, fileType) {
  let objectUrl = resource
  if (fileType) {
    const blob = new Blob([resource], {
      type:fileType
    });
    objectUrl = URL.createObjectURL(blob);
  }
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = filename;
  a.click();
  a.remove();
  URL.revokeObjectURL(objectUrl)
}
