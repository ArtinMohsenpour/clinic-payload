import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_site_settings_organization_schema_type" AS ENUM('MedicalClinic', 'Hospital', 'MedicalOrganization', 'Physician', 'Organization');
  ALTER TYPE "public"."enum_users_role" ADD VALUE 'stock-clerk';
  CREATE TABLE "blog_seo_keywords" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"keyword" varchar NOT NULL
  );
  
  CREATE TABLE "services_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer NOT NULL
  );
  
  CREATE TABLE "services_seo_keywords" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"keyword" varchar NOT NULL
  );
  
  CREATE TABLE "branches_phones" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"number" varchar NOT NULL
  );
  
  CREATE TABLE "branches_seo_keywords" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"keyword" varchar NOT NULL
  );
  
  CREATE TABLE "about_seo_keywords" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"keyword" varchar NOT NULL
  );
  
  CREATE TABLE "about" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"title" varchar NOT NULL,
  	"description" jsonb NOT NULL,
  	"image_id" integer NOT NULL,
  	"theme_color" varchar,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_og_title" varchar,
  	"seo_og_description" varchar,
  	"seo_og_image_id" integer,
  	"seo_anchor_id" varchar,
  	"seo_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings_default_keywords" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"keyword" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_organization_same_as" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_name" varchar DEFAULT 'عصر سلامت' NOT NULL,
  	"tagline" varchar,
  	"default_meta_description" varchar,
  	"default_og_image_id" integer,
  	"google_verification" varchar,
  	"twitter_handle" varchar,
  	"organization_name" varchar,
  	"organization_legal_name" varchar,
  	"organization_description" varchar,
  	"organization_logo_id" integer,
  	"organization_url" varchar,
  	"organization_telephone" varchar,
  	"organization_email" varchar,
  	"organization_founding_date" varchar,
  	"organization_address_street_address" varchar,
  	"organization_address_address_locality" varchar,
  	"organization_address_address_region" varchar,
  	"organization_address_postal_code" varchar,
  	"organization_address_address_country" varchar DEFAULT 'IR',
  	"organization_schema_type" "enum_site_settings_organization_schema_type" DEFAULT 'MedicalClinic',
  	"about_section_heading" varchar DEFAULT 'ما که هستیم؟',
  	"about_section_anchor_id" varchar DEFAULT 'who-we-are',
  	"about_section_meta_description" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "news" ALTER COLUMN "theme_color" SET DATA TYPE varchar;
  ALTER TABLE "branches" ALTER COLUMN "bg_image_id" DROP NOT NULL;
  ALTER TABLE "users" ADD COLUMN "show_in_team" boolean DEFAULT false;
  ALTER TABLE "news" ADD COLUMN "_order" varchar;
  ALTER TABLE "news" ADD COLUMN "slug" varchar NOT NULL;
  ALTER TABLE "news" ADD COLUMN "author_id" integer;
  ALTER TABLE "blog" ADD COLUMN "slug" varchar;
  ALTER TABLE "blog" ADD COLUMN "seo_meta_title" varchar;
  ALTER TABLE "blog" ADD COLUMN "seo_meta_description" varchar;
  ALTER TABLE "blog" ADD COLUMN "seo_og_title" varchar;
  ALTER TABLE "blog" ADD COLUMN "seo_og_description" varchar;
  ALTER TABLE "blog" ADD COLUMN "seo_og_image_id" integer;
  ALTER TABLE "blog" ADD COLUMN "seo_anchor_id" varchar;
  ALTER TABLE "blog" ADD COLUMN "seo_no_index" boolean DEFAULT false;
  ALTER TABLE "services" ADD COLUMN "_order" varchar;
  ALTER TABLE "services" ADD COLUMN "slug" varchar;
  ALTER TABLE "services" ADD COLUMN "detailed_description" jsonb;
  ALTER TABLE "services" ADD COLUMN "history" jsonb;
  ALTER TABLE "services" ADD COLUMN "seo_meta_title" varchar;
  ALTER TABLE "services" ADD COLUMN "seo_meta_description" varchar;
  ALTER TABLE "services" ADD COLUMN "seo_og_title" varchar;
  ALTER TABLE "services" ADD COLUMN "seo_og_description" varchar;
  ALTER TABLE "services" ADD COLUMN "seo_og_image_id" integer;
  ALTER TABLE "services" ADD COLUMN "seo_anchor_id" varchar;
  ALTER TABLE "services" ADD COLUMN "seo_no_index" boolean DEFAULT false;
  ALTER TABLE "branches" ADD COLUMN "slug" varchar;
  ALTER TABLE "branches" ADD COLUMN "email" varchar;
  ALTER TABLE "branches" ADD COLUMN "introduction_title" varchar;
  ALTER TABLE "branches" ADD COLUMN "introduction_subtitle" varchar;
  ALTER TABLE "branches" ADD COLUMN "introduction_text" jsonb;
  ALTER TABLE "branches" ADD COLUMN "introduction_image_id" integer;
  ALTER TABLE "branches" ADD COLUMN "seo_meta_title" varchar;
  ALTER TABLE "branches" ADD COLUMN "seo_meta_description" varchar;
  ALTER TABLE "branches" ADD COLUMN "seo_og_title" varchar;
  ALTER TABLE "branches" ADD COLUMN "seo_og_description" varchar;
  ALTER TABLE "branches" ADD COLUMN "seo_og_image_id" integer;
  ALTER TABLE "branches" ADD COLUMN "seo_anchor_id" varchar;
  ALTER TABLE "branches" ADD COLUMN "seo_no_index" boolean DEFAULT false;
  ALTER TABLE "insurances" ADD COLUMN "_order" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "about_id" integer;
  ALTER TABLE "blog_seo_keywords" ADD CONSTRAINT "blog_seo_keywords_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_gallery" ADD CONSTRAINT "services_gallery_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_gallery" ADD CONSTRAINT "services_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_seo_keywords" ADD CONSTRAINT "services_seo_keywords_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "branches_phones" ADD CONSTRAINT "branches_phones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."branches"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "branches_seo_keywords" ADD CONSTRAINT "branches_seo_keywords_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."branches"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_seo_keywords" ADD CONSTRAINT "about_seo_keywords_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about" ADD CONSTRAINT "about_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about" ADD CONSTRAINT "about_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_default_keywords" ADD CONSTRAINT "site_settings_default_keywords_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_organization_same_as" ADD CONSTRAINT "site_settings_organization_same_as_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_default_og_image_id_media_id_fk" FOREIGN KEY ("default_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_organization_logo_id_media_id_fk" FOREIGN KEY ("organization_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "blog_seo_keywords_order_idx" ON "blog_seo_keywords" USING btree ("_order");
  CREATE INDEX "blog_seo_keywords_parent_id_idx" ON "blog_seo_keywords" USING btree ("_parent_id");
  CREATE INDEX "services_gallery_order_idx" ON "services_gallery" USING btree ("_order");
  CREATE INDEX "services_gallery_parent_id_idx" ON "services_gallery" USING btree ("_parent_id");
  CREATE INDEX "services_gallery_media_idx" ON "services_gallery" USING btree ("media_id");
  CREATE INDEX "services_seo_keywords_order_idx" ON "services_seo_keywords" USING btree ("_order");
  CREATE INDEX "services_seo_keywords_parent_id_idx" ON "services_seo_keywords" USING btree ("_parent_id");
  CREATE INDEX "branches_phones_order_idx" ON "branches_phones" USING btree ("_order");
  CREATE INDEX "branches_phones_parent_id_idx" ON "branches_phones" USING btree ("_parent_id");
  CREATE INDEX "branches_seo_keywords_order_idx" ON "branches_seo_keywords" USING btree ("_order");
  CREATE INDEX "branches_seo_keywords_parent_id_idx" ON "branches_seo_keywords" USING btree ("_parent_id");
  CREATE INDEX "about_seo_keywords_order_idx" ON "about_seo_keywords" USING btree ("_order");
  CREATE INDEX "about_seo_keywords_parent_id_idx" ON "about_seo_keywords" USING btree ("_parent_id");
  CREATE INDEX "about__order_idx" ON "about" USING btree ("_order");
  CREATE INDEX "about_image_idx" ON "about" USING btree ("image_id");
  CREATE INDEX "about_seo_seo_og_image_idx" ON "about" USING btree ("seo_og_image_id");
  CREATE INDEX "about_updated_at_idx" ON "about" USING btree ("updated_at");
  CREATE INDEX "about_created_at_idx" ON "about" USING btree ("created_at");
  CREATE INDEX "site_settings_default_keywords_order_idx" ON "site_settings_default_keywords" USING btree ("_order");
  CREATE INDEX "site_settings_default_keywords_parent_id_idx" ON "site_settings_default_keywords" USING btree ("_parent_id");
  CREATE INDEX "site_settings_organization_same_as_order_idx" ON "site_settings_organization_same_as" USING btree ("_order");
  CREATE INDEX "site_settings_organization_same_as_parent_id_idx" ON "site_settings_organization_same_as" USING btree ("_parent_id");
  CREATE INDEX "site_settings_default_og_image_idx" ON "site_settings" USING btree ("default_og_image_id");
  CREATE INDEX "site_settings_organization_organization_logo_idx" ON "site_settings" USING btree ("organization_logo_id");
  ALTER TABLE "news" ADD CONSTRAINT "news_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog" ADD CONSTRAINT "blog_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "branches" ADD CONSTRAINT "branches_introduction_image_id_media_id_fk" FOREIGN KEY ("introduction_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "branches" ADD CONSTRAINT "branches_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_about_fk" FOREIGN KEY ("about_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "news__order_idx" ON "news" USING btree ("_order");
  CREATE UNIQUE INDEX "news_slug_idx" ON "news" USING btree ("slug");
  CREATE INDEX "news_author_idx" ON "news" USING btree ("author_id");
  CREATE UNIQUE INDEX "blog_slug_idx" ON "blog" USING btree ("slug");
  CREATE INDEX "blog_seo_seo_og_image_idx" ON "blog" USING btree ("seo_og_image_id");
  CREATE INDEX "services__order_idx" ON "services" USING btree ("_order");
  CREATE UNIQUE INDEX "services_slug_idx" ON "services" USING btree ("slug");
  CREATE INDEX "services_seo_seo_og_image_idx" ON "services" USING btree ("seo_og_image_id");
  CREATE UNIQUE INDEX "branches_slug_idx" ON "branches" USING btree ("slug");
  CREATE INDEX "branches_introduction_introduction_image_idx" ON "branches" USING btree ("introduction_image_id");
  CREATE INDEX "branches_seo_seo_og_image_idx" ON "branches" USING btree ("seo_og_image_id");
  CREATE INDEX "insurances__order_idx" ON "insurances" USING btree ("_order");
  CREATE INDEX "payload_locked_documents_rels_about_id_idx" ON "payload_locked_documents_rels" USING btree ("about_id");
  DROP TYPE "public"."enum_news_theme_color";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_news_theme_color" AS ENUM('#2563eb', '#3b82f6', '#10b981', '#ef4444', '#ffffff', '#9ca3af', '#111827', '#1f2937', '#374151');
  ALTER TABLE "blog_seo_keywords" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_seo_keywords" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "branches_phones" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "branches_seo_keywords" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_seo_keywords" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_default_keywords" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_organization_same_as" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "blog_seo_keywords" CASCADE;
  DROP TABLE "services_gallery" CASCADE;
  DROP TABLE "services_seo_keywords" CASCADE;
  DROP TABLE "branches_phones" CASCADE;
  DROP TABLE "branches_seo_keywords" CASCADE;
  DROP TABLE "about_seo_keywords" CASCADE;
  DROP TABLE "about" CASCADE;
  DROP TABLE "site_settings_default_keywords" CASCADE;
  DROP TABLE "site_settings_organization_same_as" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  ALTER TABLE "news" DROP CONSTRAINT "news_author_id_users_id_fk";
  
  ALTER TABLE "blog" DROP CONSTRAINT "blog_seo_og_image_id_media_id_fk";
  
  ALTER TABLE "services" DROP CONSTRAINT "services_seo_og_image_id_media_id_fk";
  
  ALTER TABLE "branches" DROP CONSTRAINT "branches_introduction_image_id_media_id_fk";
  
  ALTER TABLE "branches" DROP CONSTRAINT "branches_seo_og_image_id_media_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_about_fk";
  
  ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE text;
  ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'content-editor'::text;
  DROP TYPE "public"."enum_users_role";
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'ceo', 'nurse', 'doctor', 'content-editor', 'manager', 'accountant');
  ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'content-editor'::"public"."enum_users_role";
  ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE "public"."enum_users_role" USING "role"::"public"."enum_users_role";
  DROP INDEX "news__order_idx";
  DROP INDEX "news_slug_idx";
  DROP INDEX "news_author_idx";
  DROP INDEX "blog_slug_idx";
  DROP INDEX "blog_seo_seo_og_image_idx";
  DROP INDEX "services__order_idx";
  DROP INDEX "services_slug_idx";
  DROP INDEX "services_seo_seo_og_image_idx";
  DROP INDEX "branches_slug_idx";
  DROP INDEX "branches_introduction_introduction_image_idx";
  DROP INDEX "branches_seo_seo_og_image_idx";
  DROP INDEX "insurances__order_idx";
  DROP INDEX "payload_locked_documents_rels_about_id_idx";
  ALTER TABLE "news" ALTER COLUMN "theme_color" SET DATA TYPE "public"."enum_news_theme_color" USING "theme_color"::"public"."enum_news_theme_color";
  ALTER TABLE "branches" ALTER COLUMN "bg_image_id" SET NOT NULL;
  ALTER TABLE "users" DROP COLUMN "show_in_team";
  ALTER TABLE "news" DROP COLUMN "_order";
  ALTER TABLE "news" DROP COLUMN "slug";
  ALTER TABLE "news" DROP COLUMN "author_id";
  ALTER TABLE "blog" DROP COLUMN "slug";
  ALTER TABLE "blog" DROP COLUMN "seo_meta_title";
  ALTER TABLE "blog" DROP COLUMN "seo_meta_description";
  ALTER TABLE "blog" DROP COLUMN "seo_og_title";
  ALTER TABLE "blog" DROP COLUMN "seo_og_description";
  ALTER TABLE "blog" DROP COLUMN "seo_og_image_id";
  ALTER TABLE "blog" DROP COLUMN "seo_anchor_id";
  ALTER TABLE "blog" DROP COLUMN "seo_no_index";
  ALTER TABLE "services" DROP COLUMN "_order";
  ALTER TABLE "services" DROP COLUMN "slug";
  ALTER TABLE "services" DROP COLUMN "detailed_description";
  ALTER TABLE "services" DROP COLUMN "history";
  ALTER TABLE "services" DROP COLUMN "seo_meta_title";
  ALTER TABLE "services" DROP COLUMN "seo_meta_description";
  ALTER TABLE "services" DROP COLUMN "seo_og_title";
  ALTER TABLE "services" DROP COLUMN "seo_og_description";
  ALTER TABLE "services" DROP COLUMN "seo_og_image_id";
  ALTER TABLE "services" DROP COLUMN "seo_anchor_id";
  ALTER TABLE "services" DROP COLUMN "seo_no_index";
  ALTER TABLE "branches" DROP COLUMN "slug";
  ALTER TABLE "branches" DROP COLUMN "email";
  ALTER TABLE "branches" DROP COLUMN "introduction_title";
  ALTER TABLE "branches" DROP COLUMN "introduction_subtitle";
  ALTER TABLE "branches" DROP COLUMN "introduction_text";
  ALTER TABLE "branches" DROP COLUMN "introduction_image_id";
  ALTER TABLE "branches" DROP COLUMN "seo_meta_title";
  ALTER TABLE "branches" DROP COLUMN "seo_meta_description";
  ALTER TABLE "branches" DROP COLUMN "seo_og_title";
  ALTER TABLE "branches" DROP COLUMN "seo_og_description";
  ALTER TABLE "branches" DROP COLUMN "seo_og_image_id";
  ALTER TABLE "branches" DROP COLUMN "seo_anchor_id";
  ALTER TABLE "branches" DROP COLUMN "seo_no_index";
  ALTER TABLE "insurances" DROP COLUMN "_order";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "about_id";
  DROP TYPE "public"."enum_site_settings_organization_schema_type";`)
}
