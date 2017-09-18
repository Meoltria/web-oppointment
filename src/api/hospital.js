import fetch from '@/utils/fetch'

export function getHospitals (params) {
  return fetch({
    url: '/Hospital',
    method: 'get',
    params
  })
}

export function getHospital (id) {
  return fetch({
    url: `/Hospital/${id}`,
    method: 'get'
  })
}

export function createHospital (data) {
  return fetch({
    url: '/Hospital',
    method: 'post',
    data
  })
}

export function updateHospital (data) {
  return fetch({
    url: `/Hospital/${data.id}`,
    method: 'put',
    data
  })
}

export function deleteHospital (id) {
  return fetch({
    url: `/Hospital/${id}`,
    method: 'delete'
  })
}
