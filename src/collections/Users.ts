import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: '使用者',
    plural: '使用者',
  },
  admin: {
    useAsTitle: 'email',
    group: '系統管理',
  },
  auth: true,
  fields: [
    // Email added by default
    // Add more fields as needed
  ],
}
