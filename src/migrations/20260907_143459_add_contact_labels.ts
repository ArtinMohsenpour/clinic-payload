import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "contact_phone_numbers" ADD COLUMN "label" varchar;
  ALTER TABLE "contact" ADD COLUMN "email_label" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "contact_phone_numbers" DROP COLUMN "label";
  ALTER TABLE "contact" DROP COLUMN "email_label";`)
}
