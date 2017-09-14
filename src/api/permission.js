import fetch from '@/utils/fetch'

export function getPermissionWithMenu (roleId, permId) {
  return fetch({
    url: `/Roles/${roleId}/ParentPerm/${permId}/WithMenu/Permissions`,
    method: 'get'
  })
}
