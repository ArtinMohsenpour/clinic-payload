import type { GlobalConfig } from 'payload'
import { adminCeoManagerEditor, anyone } from '../access/hasRole'
import { linkField } from '../fields/link'

export const Contact: GlobalConfig = {
  slug: 'contact',
  label: 'تماس با ما (Contact Page)',
  admin: {
    hidden: ({ user }) => !user,
  },
  access: {
    read: anyone,
    update: adminCeoManagerEditor,
  },
  fields: [
    {
      name: 'pageTitle',
      type: 'text',
      label: 'عنوان صفحه (Page Title)',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'عنوان فرعی (Subtitle)',
    },
    {
      name: 'description',
      type: 'richText',
      label: 'توضیحات (Description)',
    },
    {
      name: 'phoneNumbers',
      type: 'array',
      label: 'شماره‌های تماس (Phone Numbers)',
      labels: {
        singular: 'شماره تماس (Phone Number)',
        plural: 'شماره‌های تماس (Phone Numbers)',
      },
      fields: [
        {
          // Optional on purpose: existing rows predate this field, and making it
          // required would block editors from saving the page until every
          // number already in the database had been given a label.
          name: 'label',
          type: 'text',
          label: 'عنوان (Label)',
          admin: {
            description: 'مثال: پذیرش، اورژانس، بخش دیالیز',
          },
        },
        {
          name: 'number',
          type: 'text',
          label: 'شماره (Number)',
          required: true,
        },
      ],
    },
    {
      name: 'address',
      type: 'textarea',
      label: 'آدرس (Address)',
    },
    linkField({
      name: 'googleMapsLink',
      label: 'لینک گوگل مپ (Google Maps Link)',
    }),
    {
      name: 'emailLabel',
      type: 'text',
      label: 'عنوان ایمیل (Email Label)',
      admin: {
        description: 'مثال: پشتیبانی، امور اداری',
      },
    },
    {
      name: 'emailAddress',
      type: 'email',
      label: 'آدرس ایمیل (Email Address)',
    },
  ],
}
