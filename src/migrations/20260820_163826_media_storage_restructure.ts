import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_payload_folders_folder_type" AS ENUM('media');
  CREATE TABLE "brand" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"prefix" varchar DEFAULT 'brand',
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
  	"focal_y" numeric,
  	"sizes_small_url" varchar,
  	"sizes_small_width" numeric,
  	"sizes_small_height" numeric,
  	"sizes_small_mime_type" varchar,
  	"sizes_small_filesize" numeric,
  	"sizes_small_filename" varchar,
  	"sizes_medium_url" varchar,
  	"sizes_medium_width" numeric,
  	"sizes_medium_height" numeric,
  	"sizes_medium_mime_type" varchar,
  	"sizes_medium_filesize" numeric,
  	"sizes_medium_filename" varchar
  );
  
  CREATE TABLE "people" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"prefix" varchar DEFAULT 'people',
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
  	"focal_y" numeric,
  	"sizes_avatar_url" varchar,
  	"sizes_avatar_width" numeric,
  	"sizes_avatar_height" numeric,
  	"sizes_avatar_mime_type" varchar,
  	"sizes_avatar_filesize" numeric,
  	"sizes_avatar_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_portrait_url" varchar,
  	"sizes_portrait_width" numeric,
  	"sizes_portrait_height" numeric,
  	"sizes_portrait_mime_type" varchar,
  	"sizes_portrait_filesize" numeric,
  	"sizes_portrait_filename" varchar
  );
  
  CREATE TABLE "documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"prefix" varchar DEFAULT 'documents',
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
  
  CREATE TABLE "payload_folders_folder_type" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_payload_folders_folder_type",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "payload_folders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"folder_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "users" DROP CONSTRAINT "users_profile_image_id_media_id_fk";
  
  ALTER TABLE "insurances" DROP CONSTRAINT "insurances_logo_id_media_id_fk";
  
  ALTER TABLE "navbar" DROP CONSTRAINT "navbar_logo_id_media_id_fk";
  
  ALTER TABLE "footer" DROP CONSTRAINT "footer_logo_id_media_id_fk";
  
  ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_organization_logo_id_media_id_fk";
  
  ALTER TABLE "media" ADD COLUMN "prefix" varchar DEFAULT 'media';
  ALTER TABLE "media" ADD COLUMN "folder_id" integer;
  ALTER TABLE "media" ADD COLUMN "sizes_thumbnail_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_thumbnail_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_thumbnail_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_thumbnail_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_thumbnail_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_thumbnail_filename" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_card_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_card_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_card_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_card_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_card_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_card_filename" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_feature_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_feature_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_feature_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_feature_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_feature_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_feature_filename" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_hero_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_hero_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_hero_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_hero_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_hero_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_hero_filename" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_og_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_og_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_og_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_og_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_og_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_og_filename" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "brand_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "people_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "documents_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "payload_folders_id" integer;
  ALTER TABLE "payload_folders_folder_type" ADD CONSTRAINT "payload_folders_folder_type_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_folders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_folders" ADD CONSTRAINT "payload_folders_folder_id_payload_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."payload_folders"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "brand_updated_at_idx" ON "brand" USING btree ("updated_at");
  CREATE INDEX "brand_created_at_idx" ON "brand" USING btree ("created_at");
  CREATE UNIQUE INDEX "brand_filename_idx" ON "brand" USING btree ("filename");
  CREATE INDEX "brand_sizes_small_sizes_small_filename_idx" ON "brand" USING btree ("sizes_small_filename");
  CREATE INDEX "brand_sizes_medium_sizes_medium_filename_idx" ON "brand" USING btree ("sizes_medium_filename");
  CREATE INDEX "people_updated_at_idx" ON "people" USING btree ("updated_at");
  CREATE INDEX "people_created_at_idx" ON "people" USING btree ("created_at");
  CREATE UNIQUE INDEX "people_filename_idx" ON "people" USING btree ("filename");
  CREATE INDEX "people_sizes_avatar_sizes_avatar_filename_idx" ON "people" USING btree ("sizes_avatar_filename");
  CREATE INDEX "people_sizes_card_sizes_card_filename_idx" ON "people" USING btree ("sizes_card_filename");
  CREATE INDEX "people_sizes_portrait_sizes_portrait_filename_idx" ON "people" USING btree ("sizes_portrait_filename");
  CREATE INDEX "documents_updated_at_idx" ON "documents" USING btree ("updated_at");
  CREATE INDEX "documents_created_at_idx" ON "documents" USING btree ("created_at");
  CREATE UNIQUE INDEX "documents_filename_idx" ON "documents" USING btree ("filename");
  CREATE INDEX "payload_folders_folder_type_order_idx" ON "payload_folders_folder_type" USING btree ("order");
  CREATE INDEX "payload_folders_folder_type_parent_idx" ON "payload_folders_folder_type" USING btree ("parent_id");
  CREATE INDEX "payload_folders_name_idx" ON "payload_folders" USING btree ("name");
  CREATE INDEX "payload_folders_folder_idx" ON "payload_folders" USING btree ("folder_id");
  CREATE INDEX "payload_folders_updated_at_idx" ON "payload_folders" USING btree ("updated_at");
  CREATE INDEX "payload_folders_created_at_idx" ON "payload_folders" USING btree ("created_at");
  ALTER TABLE "media" ADD CONSTRAINT "media_folder_id_payload_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."payload_folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_brand_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brand"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_people_fk" FOREIGN KEY ("people_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_documents_fk" FOREIGN KEY ("documents_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payload_folders_fk" FOREIGN KEY ("payload_folders_id") REFERENCES "public"."payload_folders"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "media_folder_idx" ON "media" USING btree ("folder_id");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_feature_sizes_feature_filename_idx" ON "media" USING btree ("sizes_feature_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE INDEX "media_sizes_og_sizes_og_filename_idx" ON "media" USING btree ("sizes_og_filename");
  CREATE INDEX "payload_locked_documents_rels_brand_id_idx" ON "payload_locked_documents_rels" USING btree ("brand_id");
  CREATE INDEX "payload_locked_documents_rels_people_id_idx" ON "payload_locked_documents_rels" USING btree ("people_id");
  CREATE INDEX "payload_locked_documents_rels_documents_id_idx" ON "payload_locked_documents_rels" USING btree ("documents_id");
  CREATE INDEX "payload_locked_documents_rels_payload_folders_id_idx" ON "payload_locked_documents_rels" USING btree ("payload_folders_id");`)

  // Every file uploaded before this migration was written to the bucket root,
  // because no prefix was configured. The new `prefix` column backfills to its
  // default, which would point those rows at a folder their objects are not in.
  await db.execute(sql`
  UPDATE "media" SET "prefix" = '';`)

  // Logos and staff portraits now live in their own collections. Copy the rows
  // they already point at and remap the foreign keys before the constraints go
  // back on — until this runs, those columns still hold `media` ids.
  await db.execute(sql`
  ALTER TABLE "brand" ADD COLUMN "legacy_media_id" integer;

  INSERT INTO "brand" (alt, prefix, updated_at, created_at, url, thumbnail_u_r_l, filename, mime_type, filesize, width, height, focal_x, focal_y, legacy_media_id)
  SELECT m.alt, '', m.updated_at, m.created_at, m.url, m.thumbnail_u_r_l, m.filename, m.mime_type, m.filesize, m.width, m.height, m.focal_x, m.focal_y, m.id
  FROM "media" m
  WHERE m."id" IN (
    SELECT "logo_id" FROM "insurances" WHERE "logo_id" IS NOT NULL
    UNION SELECT "logo_id" FROM "navbar" WHERE "logo_id" IS NOT NULL
    UNION SELECT "logo_id" FROM "footer" WHERE "logo_id" IS NOT NULL
    UNION SELECT "organization_logo_id" FROM "site_settings" WHERE "organization_logo_id" IS NOT NULL
  );

  UPDATE "insurances" t SET "logo_id" = b."id" FROM "brand" b WHERE b."legacy_media_id" = t."logo_id";
  UPDATE "navbar" t SET "logo_id" = b."id" FROM "brand" b WHERE b."legacy_media_id" = t."logo_id";
  UPDATE "footer" t SET "logo_id" = b."id" FROM "brand" b WHERE b."legacy_media_id" = t."logo_id";
  UPDATE "site_settings" t SET "organization_logo_id" = b."id" FROM "brand" b WHERE b."legacy_media_id" = t."organization_logo_id";

  ALTER TABLE "brand" DROP COLUMN "legacy_media_id";`)

  await db.execute(sql`
  ALTER TABLE "people" ADD COLUMN "legacy_media_id" integer;

  INSERT INTO "people" (alt, prefix, updated_at, created_at, url, thumbnail_u_r_l, filename, mime_type, filesize, width, height, focal_x, focal_y, legacy_media_id)
  SELECT m.alt, '', m.updated_at, m.created_at, m.url, m.thumbnail_u_r_l, m.filename, m.mime_type, m.filesize, m.width, m.height, m.focal_x, m.focal_y, m.id
  FROM "media" m
  WHERE m."id" IN (SELECT "profile_image_id" FROM "users" WHERE "profile_image_id" IS NOT NULL);

  UPDATE "users" t SET "profile_image_id" = p."id" FROM "people" p WHERE p."legacy_media_id" = t."profile_image_id";

  ALTER TABLE "people" DROP COLUMN "legacy_media_id";`)

  await db.execute(sql`
  ALTER TABLE "users" ADD CONSTRAINT "users_profile_image_id_people_id_fk" FOREIGN KEY ("profile_image_id") REFERENCES "public"."people"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "insurances" ADD CONSTRAINT "insurances_logo_id_brand_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."brand"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "navbar" ADD CONSTRAINT "navbar_logo_id_brand_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."brand"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "footer" ADD CONSTRAINT "footer_logo_id_brand_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."brand"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_organization_logo_id_brand_id_fk" FOREIGN KEY ("organization_logo_id") REFERENCES "public"."brand"("id") ON DELETE set null ON UPDATE no action;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "brand" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "people" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "documents" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload_folders_folder_type" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload_folders" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "brand" CASCADE;
  DROP TABLE "people" CASCADE;
  DROP TABLE "documents" CASCADE;
  DROP TABLE "payload_folders_folder_type" CASCADE;
  DROP TABLE "payload_folders" CASCADE;
  ALTER TABLE "users" DROP CONSTRAINT "users_profile_image_id_people_id_fk";
  
  ALTER TABLE "media" DROP CONSTRAINT "media_folder_id_payload_folders_id_fk";
  
  ALTER TABLE "insurances" DROP CONSTRAINT "insurances_logo_id_brand_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_brand_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_people_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_documents_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_payload_folders_fk";
  
  ALTER TABLE "navbar" DROP CONSTRAINT "navbar_logo_id_brand_id_fk";
  
  ALTER TABLE "footer" DROP CONSTRAINT "footer_logo_id_brand_id_fk";
  
  ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_organization_logo_id_brand_id_fk";
  
  DROP INDEX "media_folder_idx";
  DROP INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx";
  DROP INDEX "media_sizes_card_sizes_card_filename_idx";
  DROP INDEX "media_sizes_feature_sizes_feature_filename_idx";
  DROP INDEX "media_sizes_hero_sizes_hero_filename_idx";
  DROP INDEX "media_sizes_og_sizes_og_filename_idx";
  DROP INDEX "payload_locked_documents_rels_brand_id_idx";
  DROP INDEX "payload_locked_documents_rels_people_id_idx";
  DROP INDEX "payload_locked_documents_rels_documents_id_idx";
  DROP INDEX "payload_locked_documents_rels_payload_folders_id_idx";
  ALTER TABLE "users" ADD CONSTRAINT "users_profile_image_id_media_id_fk" FOREIGN KEY ("profile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "insurances" ADD CONSTRAINT "insurances_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "navbar" ADD CONSTRAINT "navbar_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "footer" ADD CONSTRAINT "footer_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_organization_logo_id_media_id_fk" FOREIGN KEY ("organization_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media" DROP COLUMN "prefix";
  ALTER TABLE "media" DROP COLUMN "folder_id";
  ALTER TABLE "media" DROP COLUMN "sizes_thumbnail_url";
  ALTER TABLE "media" DROP COLUMN "sizes_thumbnail_width";
  ALTER TABLE "media" DROP COLUMN "sizes_thumbnail_height";
  ALTER TABLE "media" DROP COLUMN "sizes_thumbnail_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_thumbnail_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_thumbnail_filename";
  ALTER TABLE "media" DROP COLUMN "sizes_card_url";
  ALTER TABLE "media" DROP COLUMN "sizes_card_width";
  ALTER TABLE "media" DROP COLUMN "sizes_card_height";
  ALTER TABLE "media" DROP COLUMN "sizes_card_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_card_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_card_filename";
  ALTER TABLE "media" DROP COLUMN "sizes_feature_url";
  ALTER TABLE "media" DROP COLUMN "sizes_feature_width";
  ALTER TABLE "media" DROP COLUMN "sizes_feature_height";
  ALTER TABLE "media" DROP COLUMN "sizes_feature_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_feature_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_feature_filename";
  ALTER TABLE "media" DROP COLUMN "sizes_hero_url";
  ALTER TABLE "media" DROP COLUMN "sizes_hero_width";
  ALTER TABLE "media" DROP COLUMN "sizes_hero_height";
  ALTER TABLE "media" DROP COLUMN "sizes_hero_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_hero_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_hero_filename";
  ALTER TABLE "media" DROP COLUMN "sizes_og_url";
  ALTER TABLE "media" DROP COLUMN "sizes_og_width";
  ALTER TABLE "media" DROP COLUMN "sizes_og_height";
  ALTER TABLE "media" DROP COLUMN "sizes_og_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_og_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_og_filename";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "brand_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "people_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "documents_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "payload_folders_id";
  DROP TYPE "public"."enum_payload_folders_folder_type";`)
}
