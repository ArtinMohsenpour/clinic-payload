import * as migration_20260805_163404 from './20260805_163404';
import * as migration_20260820_163826_media_storage_restructure from './20260820_163826_media_storage_restructure';
import * as migration_20260823_150000_serve_uploads_through_app from './20260823_150000_serve_uploads_through_app';
import * as migration_20260907_143459_add_contact_labels from './20260907_143459_add_contact_labels';

export const migrations = [
  {
    up: migration_20260805_163404.up,
    down: migration_20260805_163404.down,
    name: '20260805_163404',
  },
  {
    up: migration_20260820_163826_media_storage_restructure.up,
    down: migration_20260820_163826_media_storage_restructure.down,
    name: '20260820_163826_media_storage_restructure',
  },
  {
    up: migration_20260823_150000_serve_uploads_through_app.up,
    down: migration_20260823_150000_serve_uploads_through_app.down,
    name: '20260823_150000_serve_uploads_through_app',
  },
  {
    up: migration_20260907_143459_add_contact_labels.up,
    down: migration_20260907_143459_add_contact_labels.down,
    name: '20260907_143459_add_contact_labels'
  },
];
