import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Existing rows have absolute bucket URLs baked into their `url` columns, from
 * when the public image collections used `disablePayloadAccessControl`. Those
 * URLs point at a host that serves `404 page not found` to browsers, and
 * Payload treats a stored absolute URL as authoritative — it only derives
 * `/api/<collection>/file/<name>` when the column is empty.
 *
 * Nulling them lets the upload fields' `afterRead` hook rebuild each URL from
 * the filename on the next read. Rows holding a relative path are left alone,
 * so a database that never ran against S3 is untouched.
 */
const URL_COLUMNS: Record<string, string[]> = {
  brand: ['url', 'thumbnail_u_r_l', 'sizes_small_url', 'sizes_medium_url'],
  media: [
    'url',
    'thumbnail_u_r_l',
    'sizes_thumbnail_url',
    'sizes_card_url',
    'sizes_feature_url',
    'sizes_hero_url',
    'sizes_og_url',
  ],
  people: [
    'url',
    'thumbnail_u_r_l',
    'sizes_avatar_url',
    'sizes_card_url',
    'sizes_portrait_url',
  ],
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  for (const [table, columns] of Object.entries(URL_COLUMNS)) {
    const assignments = columns
      .map((column) => `"${column}" = CASE WHEN "${column}" LIKE 'http%' THEN NULL ELSE "${column}" END`)
      .join(', ')

    const predicate = columns.map((column) => `"${column}" LIKE 'http%'`).join(' OR ')

    await db.execute(sql.raw(`UPDATE "${table}" SET ${assignments} WHERE ${predicate};`))
  }
}

export async function down({}: MigrateDownArgs): Promise<void> {
  // Nothing to restore: the cleared values were derived from `filename` and the
  // collection's storage prefix, and are regenerated on read either way.
}
