import request from '@/utils/request'
export function getAccessTokenApi(data) {
  return request.get(`/wzsmh/getAccessToken/${data.applyId}`, { params: data })
}
export function getSiteInfoListApi(data) {
  return request.get(`/wzsmh/getSiteInfoList`, { params: data })
}
