import fetch from '@/utils/fetch'

export function getSchedulings (params) {
  return fetch({
    url: '/Scheduling',
    method: 'get',
    params
  })
}

export function getScheduling (id) {
  return fetch({
    url: `/Scheduling/${id}`,
    method: 'get'
  })
}

export function createScheduling (data) {
  return fetch({
    url: '/Scheduling',
    method: 'post',
    data
  })
}

export function updateScheduling (data) {
  return fetch({
    url: `/Scheduling/${data.id}`,
    method: 'put',
    data
  })
}

export function deleteScheduling (id) {
  return fetch({
    url: `/Scheduling/${id}`,
    method: 'delete'
  })
}

export function endTreatScheduling (data) {
  return fetch({
    url: `/Scheduling/WithEndTreat/${data.id}`,
    method: 'put',
    data
  })
}

export function recoveryTreatScheduling (data) {
  return fetch({
    url: `/Scheduling/WithRecoveryTreat/${data.id}`,
    method: 'put',
    data
  })
}
