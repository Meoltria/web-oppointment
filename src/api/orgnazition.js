import fetch from '@/utils/fetch'

export function getOrgTree (id) {
  return fetch({
    url: `/Orgs/${id}/WithTree/Orgs`,
    method: 'get'
  })
}

