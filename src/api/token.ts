import request from '@/utils/request'


export function getSosAuthToken(data) {
  return request.post('auth/sosAuth/authenticationToken', data) 
}

