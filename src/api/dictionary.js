import fetch from '@/utils/fetch'

export function getDictionaries (data) {
  return fetch({
    url: '/Dictionary ',
    method: 'get',
    data: { data }
  })
}
