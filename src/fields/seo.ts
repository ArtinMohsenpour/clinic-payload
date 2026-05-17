import type { Field } from 'payload'

export const seoFields = (): Field => ({
  name: 'seo',
  type: 'group',
  label: 'SEO و بهینه‌سازی موتور جستجو',
  admin: {
    description: 'این فیلدها به بهبود رتبه‌بندی سایت در گوگل کمک می‌کنند',
  },
  fields: [
    {
      name: 'metaTitle',
      type: 'text',
      label: 'عنوان متا (Meta Title)',
      admin: {
        description: 'عنوانی که در نتایج گوگل نمایش داده می‌شود — بهترین طول: ۵۰ تا ۶۰ کاراکتر',
      },
    },
    {
      name: 'metaDescription',
      type: 'textarea',
      label: 'توضیحات متا (Meta Description)',
      admin: {
        description: 'توضیحات خلاصه که در نتایج گوگل زیر عنوان نشان داده می‌شود — بهترین طول: ۱۵۰ تا ۱۶۰ کاراکتر',
      },
    },
    {
      name: 'keywords',
      type: 'array',
      label: 'کلمات کلیدی (Keywords)',
      labels: {
        singular: 'کلمه کلیدی',
        plural: 'کلمات کلیدی',
      },
      admin: {
        description: 'کلمات کلیدی مرتبط برای موتورهای جستجو',
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
      name: 'ogTitle',
      type: 'text',
      label: 'عنوان شبکه‌های اجتماعی (Open Graph Title)',
      admin: {
        description: 'عنوانی که هنگام اشتراک‌گذاری در واتساپ، تلگرام و اینستاگرام نمایش داده می‌شود',
      },
    },
    {
      name: 'ogDescription',
      type: 'textarea',
      label: 'توضیحات شبکه‌های اجتماعی (Open Graph Description)',
      admin: {
        description: 'توضیح مختصری که در پیش‌نمایش لینک در شبکه‌های اجتماعی نمایش داده می‌شود',
      },
    },
    {
      name: 'ogImage',
      type: 'upload',
      relationTo: 'media',
      label: 'تصویر اشتراک‌گذاری (Open Graph Image)',
      admin: {
        description: 'تصویر نمایش داده شده هنگام اشتراک‌گذاری لینک — اندازه توصیه شده: ۱۲۰۰×۶۳۰ پیکسل',
      },
    },
    {
      name: 'anchorId',
      type: 'text',
      label: 'شناسه لینک مستقیم (Anchor ID)',
      admin: {
        description: 'برای لینک مستقیم به این بخش (مثلاً: who-we-are → yoursite.com/#who-we-are). فقط حروف انگلیسی و خط تیره',
      },
    },
    {
      name: 'noIndex',
      type: 'checkbox',
      label: 'مخفی از موتورهای جستجو (noindex)',
      defaultValue: false,
      admin: {
        description: 'اگر فعال باشد، این محتوا در گوگل نمایش داده نخواهد شد',
      },
    },
  ],
})
