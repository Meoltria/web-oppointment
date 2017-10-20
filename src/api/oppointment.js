import fetch from '@/utils/fetch'

export function synchronizingHospital () {
  return fetch({
    url: '/Oppointments/SynchronizingHospital',
    method: 'post'
  })
}

export function synchronizingDept (data) {
  return fetch({
    url: '/Oppointments/SynchronizingDept',
    method: 'post',
    data
  })
}

export function synchronizingDoctor (data) {
  return fetch({
    url: '/Oppointments/SynchronizingDoctor',
    method: 'post',
    data
  })
}

export function synchronizingWork (data) {
  return fetch({
    url: '/Oppointments/SynchronizingWork',
    method: 'post',
    data
  })
}

export function synchronizingOrderStates (data) {
  return fetch({
    url: '/Oppointments/SynchronizingOrderStates',
    method: 'post',
    data
  })
}

export function synchronizingStop (data) {
  return fetch({
    url: '/Oppointments/SynchronizingStop',
    method: 'post',
    data
  })
}

export function synchronizingStops () {
  return fetch({
    url: '/Oppointments/SynchronizingStops',
    method: 'post'
  })
}

export function synchronizingOrder (data) {
  return fetch({
    url: '/Oppointments/SynchronizingOrder',
    method: 'post',
    data
  })
}

export function synchronizingOrders () {
  return fetch({
    url: '/Oppointments/SynchronizingOrders',
    method: 'post'
  })
}

export function synchronizingMed (data) {
  return fetch({
    url: '/Oppointments/synchronizingMed',
    method: 'post',
    data
  })
}
