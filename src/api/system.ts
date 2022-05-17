import request from '@/utils/request'

export function userLoginApi(data) {
  return request.post(`/admin/login`, data)
}

// 上传文件
export function uploadFile() {
  return process.env.VUE_APP_BASE_API + `/sos-files/files/manager/allow/upload`
}
