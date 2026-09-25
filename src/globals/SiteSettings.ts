import type { GlobalConfig } from 'payload'
import { adminCeoManagerEditor, anyone } from '../access/hasRole'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'تنظیمات سایت و SEO',
  admin: {
    hidden: ({ user }) => {
      if (!user) return true
      return !['admin', 'ceo', 'manager'].includes(user.role as string)
    },
  },
  access: {
    read: anyone,
    update: adminCeoManagerEditor,
  },
  fields: [
    // ─── اطلاعات پایه سایت ───────────────────────────────────────
    {
      name: 'siteName',
      type: 'text',
      label: 'نام سایت',
      required: true,
      defaultValue: 'عصر سلامت',
      admin: {
        description: 'نامی که در عنوان مرورگر و گوگل نمایش داده می‌شود',
      },
    },
    {
      name: 'tagline',
      type: 'text',
      label: 'شعار سایت (Tagline)',
      admin: {
        description: 'توضیح کوتاه سایت — مثال: مرکز جامع دیالیز و درمانگاه',
      },
    },
    {
      name: 'defaultMetaDescription',
      type: 'textarea',
      label: 'توضیحات پیش‌فرض سایت (Default Meta Description)',
      admin: {
        description: 'این توضیحات در صفحاتی که توضیح خاصی ندارند نمایش داده می‌شود — ۱۵۰ تا ۱۶۰ کاراکتر',
      },
    },
    {
      name: 'defaultKeywords',
      type: 'array',
      label: 'کلمات کلیدی پیش‌فرض سایت',
      labels: {
        singular: 'کلمه کلیدی',
        plural: 'کلمات کلیدی',
      },
      admin: {
        description: 'کلمات کلیدی کلی سایت که در تمام صفحات اعمال می‌شوند',
      },
      fields: [
        {
          name: 'keyword',
          type: 'text',
          label: 'کلمه کلیدی',
          required: true,
        },
      ],
    },
    {
      name: 'defaultOgImage',
      type: 'upload',
      relationTo: 'media',
      label: 'تصویر پیش‌فرض اشتراک‌گذاری (Default OG Image)',
      admin: {
        description: 'تصویر پیش‌فرض برای لینک‌ها در واتساپ، تلگرام و شبکه‌های اجتماعی — ۱۲۰۰×۶۳۰ پیکسل',
      },
    },

    // ─── SEO پیشرفته ──────────────────────────────────────────────
    {
      name: 'googleVerification',
      type: 'text',
      label: 'کد تأیید Google Search Console',
      admin: {
        description: 'کدی که از Google Search Console دریافت می‌کنید برای تأیید مالکیت سایت',
      },
    },
    {
      name: 'twitterHandle',
      type: 'text',
      label: 'نام کاربری توییتر / X',
      admin: {
        description: 'مثال: @asrsalamat',
      },
    },

    // ─── اطلاعات سازمان برای JSON-LD ──────────────────────────────
    {
      name: 'organization',
      type: 'group',
      label: 'اطلاعات سازمان (JSON-LD Schema)',
      admin: {
        description: 'این اطلاعات به گوگل کمک می‌کند سازمان شما را شناسایی کند و در Knowledge Panel نمایش دهد',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'نام سازمان',
          admin: {
            description: 'نام دقیق سازمان — مثال: مرکز درمانی عصر سلامت',
          },
        },
        {
          name: 'legalName',
          type: 'text',
          label: 'نام قانونی / ثبت شده',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'توضیحات سازمان',
          admin: {
            description: 'توضیح جامع درباره سازمان برای موتورهای جستجو',
          },
        },
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'brand',
          label: 'لوگو سازمان',
          admin: {
            description: 'لوگو برای Knowledge Panel گوگل — فرمت PNG با پس‌زمینه شفاف',
          },
        },
        {
          name: 'url',
          type: 'text',
          label: 'آدرس وب‌سایت',
          admin: {
            description: 'مثال: https://asrsalamat.ir',
          },
        },
        {
          name: 'telephone',
          type: 'text',
          label: 'شماره تماس',
          admin: {
            description: 'مثال: +98-21-12345678',
          },
        },
        {
          name: 'email',
          type: 'email',
          label: 'ایمیل سازمان',
        },
        {
          name: 'foundingDate',
          type: 'text',
          label: 'سال تأسیس (میلادی)',
          admin: {
            description: 'مثال: 2010',
          },
        },
        {
          name: 'address',
          type: 'group',
          label: 'آدرس',
          fields: [
            {
              name: 'streetAddress',
              type: 'text',
              label: 'آدرس خیابان',
            },
            {
              name: 'addressLocality',
              type: 'text',
              label: 'شهر',
            },
            {
              name: 'addressRegion',
              type: 'text',
              label: 'استان',
            },
            {
              name: 'postalCode',
              type: 'text',
              label: 'کد پستی',
            },
            {
              name: 'addressCountry',
              type: 'text',
              label: 'کد کشور',
              defaultValue: 'IR',
            },
          ],
        },
        {
          name: 'sameAs',
          type: 'array',
          label: 'پروفایل‌های شبکه‌های اجتماعی (sameAs)',
          labels: {
            singular: 'پروفایل',
            plural: 'پروفایل‌ها',
          },
          admin: {
            description: 'لینک به پروفایل سازمان در اینستاگرام، تلگرام، لینکدین و سایر شبکه‌ها — گوگل از این‌ها برای Knowledge Panel استفاده می‌کند',
          },
          fields: [
            {
              name: 'url',
              type: 'text',
              label: 'آدرس پروفایل',
              required: true,
            },
          ],
        },
        {
          name: 'schemaType',
          type: 'select',
          label: 'نوع سازمان در Schema.org',
          defaultValue: 'MedicalClinic',
          admin: {
            description: 'نوع دقیق‌تر به گوگل کمک می‌کند محتوا را بهتر دسته‌بندی کند',
          },
          options: [
            { label: 'MedicalClinic — درمانگاه', value: 'MedicalClinic' },
            { label: 'Hospital — بیمارستان', value: 'Hospital' },
            { label: 'MedicalOrganization — سازمان پزشکی', value: 'MedicalOrganization' },
            { label: 'Physician — پزشک', value: 'Physician' },
            { label: 'Organization — سازمان عمومی', value: 'Organization' },
          ],
        },
      ],
    },

    // ─── SEO بخش "ما که هستیم" ────────────────────────────────────
    {
      name: 'aboutSection',
      type: 'group',
      label: 'SEO بخش "ما که هستیم"',
      admin: {
        description: 'تنظیمات SEO خاص برای بخش درباره ما در صفحه اصلی',
      },
      fields: [
        {
          name: 'heading',
          type: 'text',
          label: 'عنوان بخش (H2)',
          defaultValue: 'ما که هستیم؟',
          admin: {
            description: 'عنوانی که در صفحه نمایش داده می‌شود و گوگل ایندکس می‌کند',
          },
        },
        {
          name: 'anchorId',
          type: 'text',
          label: 'شناسه لینک مستقیم',
          defaultValue: 'who-we-are',
          admin: {
            description: 'کاربران می‌توانند با yoursite.com/#who-we-are مستقیماً به این بخش برسند',
          },
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          label: 'توضیحات بخش برای موتورهای جستجو',
          admin: {
            description: 'توضیح خلاصه از کل بخش درباره ما که در استراکچرد دیتا استفاده می‌شود',
          },
        },
      ],
    },
  ],
}
