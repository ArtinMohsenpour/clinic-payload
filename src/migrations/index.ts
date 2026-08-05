import * as migration_20260805_102050_feedback_ui_updated from './20260805_102050_feedback_ui_updated';

export const migrations = [
  {
    up: migration_20260805_102050_feedback_ui_updated.up,
    down: migration_20260805_102050_feedback_ui_updated.down,
    name: '20260805_102050_feedback_ui_updated'
  },
];
