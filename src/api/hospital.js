import fetch from '@/utils/fetch'

export function getHospitals (params) {
  return fetch({
    url: '/Hosptial',
    method: 'get',
    params
  })
}

export function getHospital (id) {
  return fetch({
    url: `/Hosptial/${id}`,
    method: 'get'
  })
}

export function createHospital (data) {
  return fetch({
    url: '/Hosptial',
    method: 'post',
    data
  })
}

export function updateHospital (data) {
  return fetch({
    url: `/Hosptial/${data.id}`,
    method: 'put',
    data
  })
}

export function deleteHospital (id) {
  return fetch({
    url: `/Hosptial/${id}`,
    method: 'delete'
  })
}
