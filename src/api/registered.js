import fetch from '@/utils/fetch'

export function getRegistereds (params) {
  return fetch({
    url: '/Registered',
    method: 'get',
    params
  })
}

export function getRegistered (id) {
  return fetch({
    url: `/Registered/${id}`,
    method: 'get'
  })
}

export function createRegistered (data) {
  return fetch({
    url: '/Registered',
    method: 'post',
    data
  })
}

export function updateRegistered (data) {
  return fetch({
    url: `/Registered/${data.id}`,
    method: 'put',
    data
  })
}

export function deleteRegistered (id) {
  return fetch({
    url: `/Registered/${id}`,
    method: 'delete'
  })
}

export function cancelRegistered (id) {
  return fetch({
    url: `/Registered/WithCancel/${id}`,
    method: 'put'
  })
}

export function breakPromiseRegistered (id) {
  return fetch({
    url: `/Registered/WithBreakPromise/${id}`,
    method: 'put'
  })
}

export function takeRegistered (data) {
  return fetch({
    url: `/Registered/WithTake/${data.id}`,
    method: 'put',
    data
  })
}
