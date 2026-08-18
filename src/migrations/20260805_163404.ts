import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'ceo', 'nurse', 'doctor', 'content-editor', 'manager', 'accountant', 'stock-clerk');
  CREATE TYPE "public"."enum_branches_address_google_maps_link_type" AS ENUM('customUrl', 'reference');
  CREATE TYPE "public"."enum_audit_logs_action" AS ENUM('create', 'update', 'delete', 'publish');
  CREATE TYPE "public"."enum_navbar_nav_items_dropdown_items_link_type" AS ENUM('customUrl', 'reference');
  CREATE TYPE "public"."enum_navbar_nav_items_type" AS ENUM('link', 'dropdown');
  CREATE TYPE "public"."enum_navbar_nav_items_link_type" AS ENUM('customUrl', 'reference');
  CREATE TYPE "public"."enum_footer_blocks_footer_link_link_type" AS ENUM('customUrl', 'reference');
  CREATE TYPE "public"."enum_contact_google_maps_link_type" AS ENUM('customUrl', 'reference');
  CREATE TYPE "public"."enum_site_settings_organization_schema_type" AS ENUM('MedicalClinic', 'Hospital', 'MedicalOrganization', 'Physician', 'Organization');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"full_name" varchar,
  	"first_name" varchar,
  	"last_name" varchar,
  	"profile_image_id" integer,
  	"phone_number" varchar,
  	"department_id" integer,
  	"branch_id" integer,
  	"role" "enum_users_role" DEFAULT 'content-editor' NOT NULL,
  	"show_in_team" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "departments" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cities" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "news_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer NOT NULL
  );
  
  CREATE TABLE "news" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"slug" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"thumbnail_id" integer NOT NULL,
  	"text" jsonb NOT NULL,
  	"theme_color" varchar,
  	"branch_id" integer,
  	"author_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "blog_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer NOT NULL
  );
  
  CREATE TABLE "blog_seo_keywords" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"keyword" varchar NOT NULL
  );
  
  CREATE TABLE "blog" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"title" varchar NOT NULL,
  	"thumbnail_id" integer NOT NULL,
  	"text" jsonb NOT NULL,
  	"theme_color" varchar,
  	"author_id" integer,
  	"source" varchar,
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
  
  CREATE TABLE "services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"slug" varchar,
  	"title" varchar NOT NULL,
  	"image_id" integer NOT NULL,
  	"description" jsonb NOT NULL,
  	"theme_color" varchar,
  	"detailed_description" jsonb,
  	"history" jsonb,
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
  
  CREATE TABLE "branches_phones" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"number" varchar NOT NULL
  );
  
  CREATE TABLE "branches_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer NOT NULL
  );
  
  CREATE TABLE "branches_seo_keywords" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"keyword" varchar NOT NULL
  );
  
  CREATE TABLE "branches" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"title" varchar NOT NULL,
  	"bg_image_id" integer,
  	"city_id" integer NOT NULL,
  	"email" varchar,
  	"introduction_title" varchar,
  	"introduction_subtitle" varchar,
  	"introduction_text" jsonb,
  	"introduction_image_id" integer,
  	"address_text" jsonb NOT NULL,
  	"address_google_maps_link_label" varchar NOT NULL,
  	"address_google_maps_link_type" "enum_branches_address_google_maps_link_type" DEFAULT 'reference' NOT NULL,
  	"address_google_maps_link_url" varchar,
  	"address_google_maps_link_slug" varchar,
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
  
  CREATE TABLE "branches_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer
  );
  
  CREATE TABLE "audit_logs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"user_id" integer NOT NULL,
  	"collection_name" varchar NOT NULL,
  	"doc_id" varchar NOT NULL,
  	"doc_title" varchar,
  	"action" "enum_audit_logs_action" NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "insurances" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"logo_id" integer NOT NULL,
  	"coverage" jsonb,
  	"theme_color" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
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
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"departments_id" integer,
  	"cities_id" integer,
  	"news_id" integer,
  	"blog_id" integer,
  	"services_id" integer,
  	"branches_id" integer,
  	"audit_logs_id" integer,
  	"insurances_id" integer,
  	"about_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "navbar_nav_items_dropdown_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_label" varchar,
  	"link_type" "enum_navbar_nav_items_dropdown_items_link_type" DEFAULT 'reference',
  	"link_url" varchar,
  	"link_slug" varchar
  );
  
  CREATE TABLE "navbar_nav_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_navbar_nav_items_type" DEFAULT 'link' NOT NULL,
  	"link_label" varchar,
  	"link_type" "enum_navbar_nav_items_link_type" DEFAULT 'reference',
  	"link_url" varchar,
  	"link_slug" varchar,
  	"dropdown_label" varchar
  );
  
  CREATE TABLE "navbar" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "footer_blocks_footer_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" jsonb NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "footer_blocks_footer_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_label" varchar NOT NULL,
  	"link_type" "enum_footer_blocks_footer_link_link_type" DEFAULT 'reference' NOT NULL,
  	"link_url" varchar,
  	"link_slug" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "footer_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "contact_phone_numbers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" varchar NOT NULL
  );
  
  CREATE TABLE "contact" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"page_title" varchar NOT NULL,
  	"subtitle" varchar,
  	"description" jsonb,
  	"address" varchar,
  	"google_maps_link_label" varchar NOT NULL,
  	"google_maps_link_type" "enum_contact_google_maps_link_type" DEFAULT 'reference' NOT NULL,
  	"google_maps_link_url" varchar,
  	"google_maps_link_slug" varchar,
  	"email_address" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "privacy_blocks_privacy_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" jsonb NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "privacy" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"page_title" varchar NOT NULL,
  	"subtitle" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "opening_hours_exceptions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"is_closed" boolean DEFAULT true,
  	"open_time" varchar,
  	"close_time" varchar,
  	"reason" varchar
  );
  
  CREATE TABLE "opening_hours" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"weekly_schedule_saturday_is_open" boolean DEFAULT true,
  	"weekly_schedule_saturday_open_time" varchar DEFAULT '08:00',
  	"weekly_schedule_saturday_close_time" varchar DEFAULT '18:00',
  	"weekly_schedule_sunday_is_open" boolean DEFAULT true,
  	"weekly_schedule_sunday_open_time" varchar DEFAULT '08:00',
  	"weekly_schedule_sunday_close_time" varchar DEFAULT '18:00',
  	"weekly_schedule_monday_is_open" boolean DEFAULT true,
  	"weekly_schedule_monday_open_time" varchar DEFAULT '08:00',
  	"weekly_schedule_monday_close_time" varchar DEFAULT '18:00',
  	"weekly_schedule_tuesday_is_open" boolean DEFAULT true,
  	"weekly_schedule_tuesday_open_time" varchar DEFAULT '08:00',
  	"weekly_schedule_tuesday_close_time" varchar DEFAULT '18:00',
  	"weekly_schedule_wednesday_is_open" boolean DEFAULT true,
  	"weekly_schedule_wednesday_open_time" varchar DEFAULT '08:00',
  	"weekly_schedule_wednesday_close_time" varchar DEFAULT '18:00',
  	"weekly_schedule_thursday_is_open" boolean DEFAULT true,
  	"weekly_schedule_thursday_open_time" varchar DEFAULT '08:00',
  	"weekly_schedule_thursday_close_time" varchar DEFAULT '18:00',
  	"weekly_schedule_friday_is_open" boolean DEFAULT false,
  	"weekly_schedule_friday_open_time" varchar DEFAULT '08:00',
  	"weekly_schedule_friday_close_time" varchar DEFAULT '18:00',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
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
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users" ADD CONSTRAINT "users_profile_image_id_media_id_fk" FOREIGN KEY ("profile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users" ADD CONSTRAINT "users_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users" ADD CONSTRAINT "users_branch_id_branches_id_fk" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news_gallery" ADD CONSTRAINT "news_gallery_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news_gallery" ADD CONSTRAINT "news_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news" ADD CONSTRAINT "news_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news" ADD CONSTRAINT "news_branch_id_branches_id_fk" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news" ADD CONSTRAINT "news_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog_gallery" ADD CONSTRAINT "blog_gallery_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog_gallery" ADD CONSTRAINT "blog_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_seo_keywords" ADD CONSTRAINT "blog_seo_keywords_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog" ADD CONSTRAINT "blog_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog" ADD CONSTRAINT "blog_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog" ADD CONSTRAINT "blog_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_gallery" ADD CONSTRAINT "services_gallery_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_gallery" ADD CONSTRAINT "services_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_seo_keywords" ADD CONSTRAINT "services_seo_keywords_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "branches_phones" ADD CONSTRAINT "branches_phones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."branches"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "branches_gallery" ADD CONSTRAINT "branches_gallery_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "branches_gallery" ADD CONSTRAINT "branches_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."branches"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "branches_seo_keywords" ADD CONSTRAINT "branches_seo_keywords_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."branches"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "branches" ADD CONSTRAINT "branches_bg_image_id_media_id_fk" FOREIGN KEY ("bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "branches" ADD CONSTRAINT "branches_city_id_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "branches" ADD CONSTRAINT "branches_introduction_image_id_media_id_fk" FOREIGN KEY ("introduction_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "branches" ADD CONSTRAINT "branches_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "branches_rels" ADD CONSTRAINT "branches_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."branches"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "branches_rels" ADD CONSTRAINT "branches_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "insurances" ADD CONSTRAINT "insurances_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_seo_keywords" ADD CONSTRAINT "about_seo_keywords_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about" ADD CONSTRAINT "about_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about" ADD CONSTRAINT "about_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_departments_fk" FOREIGN KEY ("departments_id") REFERENCES "public"."departments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_cities_fk" FOREIGN KEY ("cities_id") REFERENCES "public"."cities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_news_fk" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_blog_fk" FOREIGN KEY ("blog_id") REFERENCES "public"."blog"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_branches_fk" FOREIGN KEY ("branches_id") REFERENCES "public"."branches"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_audit_logs_fk" FOREIGN KEY ("audit_logs_id") REFERENCES "public"."audit_logs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_insurances_fk" FOREIGN KEY ("insurances_id") REFERENCES "public"."insurances"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_about_fk" FOREIGN KEY ("about_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navbar_nav_items_dropdown_items" ADD CONSTRAINT "navbar_nav_items_dropdown_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navbar_nav_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navbar_nav_items" ADD CONSTRAINT "navbar_nav_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navbar"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navbar" ADD CONSTRAINT "navbar_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "footer_blocks_footer_rich_text" ADD CONSTRAINT "footer_blocks_footer_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_blocks_footer_link" ADD CONSTRAINT "footer_blocks_footer_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns" ADD CONSTRAINT "footer_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer" ADD CONSTRAINT "footer_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "contact_phone_numbers" ADD CONSTRAINT "contact_phone_numbers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "privacy_blocks_privacy_block" ADD CONSTRAINT "privacy_blocks_privacy_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."privacy"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "opening_hours_exceptions" ADD CONSTRAINT "opening_hours_exceptions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."opening_hours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_default_keywords" ADD CONSTRAINT "site_settings_default_keywords_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_organization_same_as" ADD CONSTRAINT "site_settings_organization_same_as_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_default_og_image_id_media_id_fk" FOREIGN KEY ("default_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_organization_logo_id_media_id_fk" FOREIGN KEY ("organization_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_profile_image_idx" ON "users" USING btree ("profile_image_id");
  CREATE INDEX "users_department_idx" ON "users" USING btree ("department_id");
  CREATE INDEX "users_branch_idx" ON "users" USING btree ("branch_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "departments_updated_at_idx" ON "departments" USING btree ("updated_at");
  CREATE INDEX "departments_created_at_idx" ON "departments" USING btree ("created_at");
  CREATE INDEX "cities_updated_at_idx" ON "cities" USING btree ("updated_at");
  CREATE INDEX "cities_created_at_idx" ON "cities" USING btree ("created_at");
  CREATE INDEX "news_gallery_order_idx" ON "news_gallery" USING btree ("_order");
  CREATE INDEX "news_gallery_parent_id_idx" ON "news_gallery" USING btree ("_parent_id");
  CREATE INDEX "news_gallery_media_idx" ON "news_gallery" USING btree ("media_id");
  CREATE INDEX "news__order_idx" ON "news" USING btree ("_order");
  CREATE UNIQUE INDEX "news_slug_idx" ON "news" USING btree ("slug");
  CREATE INDEX "news_thumbnail_idx" ON "news" USING btree ("thumbnail_id");
  CREATE INDEX "news_branch_idx" ON "news" USING btree ("branch_id");
  CREATE INDEX "news_author_idx" ON "news" USING btree ("author_id");
  CREATE INDEX "news_updated_at_idx" ON "news" USING btree ("updated_at");
  CREATE INDEX "news_created_at_idx" ON "news" USING btree ("created_at");
  CREATE INDEX "blog_gallery_order_idx" ON "blog_gallery" USING btree ("_order");
  CREATE INDEX "blog_gallery_parent_id_idx" ON "blog_gallery" USING btree ("_parent_id");
  CREATE INDEX "blog_gallery_media_idx" ON "blog_gallery" USING btree ("media_id");
  CREATE INDEX "blog_seo_keywords_order_idx" ON "blog_seo_keywords" USING btree ("_order");
  CREATE INDEX "blog_seo_keywords_parent_id_idx" ON "blog_seo_keywords" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "blog_slug_idx" ON "blog" USING btree ("slug");
  CREATE INDEX "blog_thumbnail_idx" ON "blog" USING btree ("thumbnail_id");
  CREATE INDEX "blog_author_idx" ON "blog" USING btree ("author_id");
  CREATE INDEX "blog_seo_seo_og_image_idx" ON "blog" USING btree ("seo_og_image_id");
  CREATE INDEX "blog_updated_at_idx" ON "blog" USING btree ("updated_at");
  CREATE INDEX "blog_created_at_idx" ON "blog" USING btree ("created_at");
  CREATE INDEX "services_gallery_order_idx" ON "services_gallery" USING btree ("_order");
  CREATE INDEX "services_gallery_parent_id_idx" ON "services_gallery" USING btree ("_parent_id");
  CREATE INDEX "services_gallery_media_idx" ON "services_gallery" USING btree ("media_id");
  CREATE INDEX "services_seo_keywords_order_idx" ON "services_seo_keywords" USING btree ("_order");
  CREATE INDEX "services_seo_keywords_parent_id_idx" ON "services_seo_keywords" USING btree ("_parent_id");
  CREATE INDEX "services__order_idx" ON "services" USING btree ("_order");
  CREATE UNIQUE INDEX "services_slug_idx" ON "services" USING btree ("slug");
  CREATE INDEX "services_image_idx" ON "services" USING btree ("image_id");
  CREATE INDEX "services_seo_seo_og_image_idx" ON "services" USING btree ("seo_og_image_id");
  CREATE INDEX "services_updated_at_idx" ON "services" USING btree ("updated_at");
  CREATE INDEX "services_created_at_idx" ON "services" USING btree ("created_at");
  CREATE INDEX "branches_phones_order_idx" ON "branches_phones" USING btree ("_order");
  CREATE INDEX "branches_phones_parent_id_idx" ON "branches_phones" USING btree ("_parent_id");
  CREATE INDEX "branches_gallery_order_idx" ON "branches_gallery" USING btree ("_order");
  CREATE INDEX "branches_gallery_parent_id_idx" ON "branches_gallery" USING btree ("_parent_id");
  CREATE INDEX "branches_gallery_media_idx" ON "branches_gallery" USING btree ("media_id");
  CREATE INDEX "branches_seo_keywords_order_idx" ON "branches_seo_keywords" USING btree ("_order");
  CREATE INDEX "branches_seo_keywords_parent_id_idx" ON "branches_seo_keywords" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "branches_slug_idx" ON "branches" USING btree ("slug");
  CREATE INDEX "branches_bg_image_idx" ON "branches" USING btree ("bg_image_id");
  CREATE INDEX "branches_city_idx" ON "branches" USING btree ("city_id");
  CREATE INDEX "branches_introduction_introduction_image_idx" ON "branches" USING btree ("introduction_image_id");
  CREATE INDEX "branches_seo_seo_og_image_idx" ON "branches" USING btree ("seo_og_image_id");
  CREATE INDEX "branches_updated_at_idx" ON "branches" USING btree ("updated_at");
  CREATE INDEX "branches_created_at_idx" ON "branches" USING btree ("created_at");
  CREATE INDEX "branches_rels_order_idx" ON "branches_rels" USING btree ("order");
  CREATE INDEX "branches_rels_parent_idx" ON "branches_rels" USING btree ("parent_id");
  CREATE INDEX "branches_rels_path_idx" ON "branches_rels" USING btree ("path");
  CREATE INDEX "branches_rels_services_id_idx" ON "branches_rels" USING btree ("services_id");
  CREATE INDEX "audit_logs_user_idx" ON "audit_logs" USING btree ("user_id");
  CREATE INDEX "audit_logs_updated_at_idx" ON "audit_logs" USING btree ("updated_at");
  CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs" USING btree ("created_at");
  CREATE INDEX "insurances__order_idx" ON "insurances" USING btree ("_order");
  CREATE INDEX "insurances_logo_idx" ON "insurances" USING btree ("logo_id");
  CREATE INDEX "insurances_updated_at_idx" ON "insurances" USING btree ("updated_at");
  CREATE INDEX "insurances_created_at_idx" ON "insurances" USING btree ("created_at");
  CREATE INDEX "about_seo_keywords_order_idx" ON "about_seo_keywords" USING btree ("_order");
  CREATE INDEX "about_seo_keywords_parent_id_idx" ON "about_seo_keywords" USING btree ("_parent_id");
  CREATE INDEX "about__order_idx" ON "about" USING btree ("_order");
  CREATE INDEX "about_image_idx" ON "about" USING btree ("image_id");
  CREATE INDEX "about_seo_seo_og_image_idx" ON "about" USING btree ("seo_og_image_id");
  CREATE INDEX "about_updated_at_idx" ON "about" USING btree ("updated_at");
  CREATE INDEX "about_created_at_idx" ON "about" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_departments_id_idx" ON "payload_locked_documents_rels" USING btree ("departments_id");
  CREATE INDEX "payload_locked_documents_rels_cities_id_idx" ON "payload_locked_documents_rels" USING btree ("cities_id");
  CREATE INDEX "payload_locked_documents_rels_news_id_idx" ON "payload_locked_documents_rels" USING btree ("news_id");
  CREATE INDEX "payload_locked_documents_rels_blog_id_idx" ON "payload_locked_documents_rels" USING btree ("blog_id");
  CREATE INDEX "payload_locked_documents_rels_services_id_idx" ON "payload_locked_documents_rels" USING btree ("services_id");
  CREATE INDEX "payload_locked_documents_rels_branches_id_idx" ON "payload_locked_documents_rels" USING btree ("branches_id");
  CREATE INDEX "payload_locked_documents_rels_audit_logs_id_idx" ON "payload_locked_documents_rels" USING btree ("audit_logs_id");
  CREATE INDEX "payload_locked_documents_rels_insurances_id_idx" ON "payload_locked_documents_rels" USING btree ("insurances_id");
  CREATE INDEX "payload_locked_documents_rels_about_id_idx" ON "payload_locked_documents_rels" USING btree ("about_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "navbar_nav_items_dropdown_items_order_idx" ON "navbar_nav_items_dropdown_items" USING btree ("_order");
  CREATE INDEX "navbar_nav_items_dropdown_items_parent_id_idx" ON "navbar_nav_items_dropdown_items" USING btree ("_parent_id");
  CREATE INDEX "navbar_nav_items_order_idx" ON "navbar_nav_items" USING btree ("_order");
  CREATE INDEX "navbar_nav_items_parent_id_idx" ON "navbar_nav_items" USING btree ("_parent_id");
  CREATE INDEX "navbar_logo_idx" ON "navbar" USING btree ("logo_id");
  CREATE INDEX "footer_blocks_footer_rich_text_order_idx" ON "footer_blocks_footer_rich_text" USING btree ("_order");
  CREATE INDEX "footer_blocks_footer_rich_text_parent_id_idx" ON "footer_blocks_footer_rich_text" USING btree ("_parent_id");
  CREATE INDEX "footer_blocks_footer_rich_text_path_idx" ON "footer_blocks_footer_rich_text" USING btree ("_path");
  CREATE INDEX "footer_blocks_footer_link_order_idx" ON "footer_blocks_footer_link" USING btree ("_order");
  CREATE INDEX "footer_blocks_footer_link_parent_id_idx" ON "footer_blocks_footer_link" USING btree ("_parent_id");
  CREATE INDEX "footer_blocks_footer_link_path_idx" ON "footer_blocks_footer_link" USING btree ("_path");
  CREATE INDEX "footer_columns_order_idx" ON "footer_columns" USING btree ("_order");
  CREATE INDEX "footer_columns_parent_id_idx" ON "footer_columns" USING btree ("_parent_id");
  CREATE INDEX "footer_logo_idx" ON "footer" USING btree ("logo_id");
  CREATE INDEX "contact_phone_numbers_order_idx" ON "contact_phone_numbers" USING btree ("_order");
  CREATE INDEX "contact_phone_numbers_parent_id_idx" ON "contact_phone_numbers" USING btree ("_parent_id");
  CREATE INDEX "privacy_blocks_privacy_block_order_idx" ON "privacy_blocks_privacy_block" USING btree ("_order");
  CREATE INDEX "privacy_blocks_privacy_block_parent_id_idx" ON "privacy_blocks_privacy_block" USING btree ("_parent_id");
  CREATE INDEX "privacy_blocks_privacy_block_path_idx" ON "privacy_blocks_privacy_block" USING btree ("_path");
  CREATE INDEX "opening_hours_exceptions_order_idx" ON "opening_hours_exceptions" USING btree ("_order");
  CREATE INDEX "opening_hours_exceptions_parent_id_idx" ON "opening_hours_exceptions" USING btree ("_parent_id");
  CREATE INDEX "site_settings_default_keywords_order_idx" ON "site_settings_default_keywords" USING btree ("_order");
  CREATE INDEX "site_settings_default_keywords_parent_id_idx" ON "site_settings_default_keywords" USING btree ("_parent_id");
  CREATE INDEX "site_settings_organization_same_as_order_idx" ON "site_settings_organization_same_as" USING btree ("_order");
  CREATE INDEX "site_settings_organization_same_as_parent_id_idx" ON "site_settings_organization_same_as" USING btree ("_parent_id");
  CREATE INDEX "site_settings_default_og_image_idx" ON "site_settings" USING btree ("default_og_image_id");
  CREATE INDEX "site_settings_organization_organization_logo_idx" ON "site_settings" USING btree ("organization_logo_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "departments" CASCADE;
  DROP TABLE "cities" CASCADE;
  DROP TABLE "news_gallery" CASCADE;
  DROP TABLE "news" CASCADE;
  DROP TABLE "blog_gallery" CASCADE;
  DROP TABLE "blog_seo_keywords" CASCADE;
  DROP TABLE "blog" CASCADE;
  DROP TABLE "services_gallery" CASCADE;
  DROP TABLE "services_seo_keywords" CASCADE;
  DROP TABLE "services" CASCADE;
  DROP TABLE "branches_phones" CASCADE;
  DROP TABLE "branches_gallery" CASCADE;
  DROP TABLE "branches_seo_keywords" CASCADE;
  DROP TABLE "branches" CASCADE;
  DROP TABLE "branches_rels" CASCADE;
  DROP TABLE "audit_logs" CASCADE;
  DROP TABLE "insurances" CASCADE;
  DROP TABLE "about_seo_keywords" CASCADE;
  DROP TABLE "about" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "navbar_nav_items_dropdown_items" CASCADE;
  DROP TABLE "navbar_nav_items" CASCADE;
  DROP TABLE "navbar" CASCADE;
  DROP TABLE "footer_blocks_footer_rich_text" CASCADE;
  DROP TABLE "footer_blocks_footer_link" CASCADE;
  DROP TABLE "footer_columns" CASCADE;
  DROP TABLE "footer" CASCADE;
  DROP TABLE "contact_phone_numbers" CASCADE;
  DROP TABLE "contact" CASCADE;
  DROP TABLE "privacy_blocks_privacy_block" CASCADE;
  DROP TABLE "privacy" CASCADE;
  DROP TABLE "opening_hours_exceptions" CASCADE;
  DROP TABLE "opening_hours" CASCADE;
  DROP TABLE "site_settings_default_keywords" CASCADE;
  DROP TABLE "site_settings_organization_same_as" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_branches_address_google_maps_link_type";
  DROP TYPE "public"."enum_audit_logs_action";
  DROP TYPE "public"."enum_navbar_nav_items_dropdown_items_link_type";
  DROP TYPE "public"."enum_navbar_nav_items_type";
  DROP TYPE "public"."enum_navbar_nav_items_link_type";
  DROP TYPE "public"."enum_footer_blocks_footer_link_link_type";
  DROP TYPE "public"."enum_contact_google_maps_link_type";
  DROP TYPE "public"."enum_site_settings_organization_schema_type";`)
}
