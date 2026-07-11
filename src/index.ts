import type { Core } from '@strapi/strapi';

/**
 * Content-types del rework (prefijo rw-) que deben ser legibles publicamente
 * por el frontend. Los tipos "collection" exponen find + findOne; los
 * "single" solo find.
 */
const RW_COLLECTIONS = [
  'rw-amenity',
  'rw-tour-category',
  'rw-villa',
  'rw-facility',
  'rw-service',
  'rw-tour',
  'rw-team-member',
  'rw-review',
];

const RW_SINGLE_TYPES = [
  'rw-site-setting',
  'rw-home',
  'rw-about',
  'rw-contact',
  'rw-tours-page',
];

const REQUIRED_LOCALES: Array<{ code: string; name: string }> = [
  { code: 'es', name: 'Spanish (es)' },
  { code: 'en', name: 'English (en)' },
];

/**
 * Garantiza que existan los locales ES/EN (idempotente). No cambia el locale
 * por defecto ya configurado en el proyecto.
 */
async function ensureLocales(strapi: Core.Strapi) {
  try {
    const localesService = strapi.plugin('i18n').service('locales');
    const existing = await localesService.find();
    const existingCodes = new Set((existing || []).map((l: any) => l.code));
    for (const loc of REQUIRED_LOCALES) {
      if (!existingCodes.has(loc.code)) {
        await localesService.create({ code: loc.code, name: loc.name });
        strapi.log.info(`[rework] locale creado: ${loc.code}`);
      }
    }
  } catch (err) {
    strapi.log.warn(`[rework] no se pudieron asegurar los locales: ${(err as Error).message}`);
  }
}

/**
 * Otorga al rol "public" permisos de lectura sobre los content-types rw-*.
 * Idempotente: no duplica permisos ya existentes. No toca ningun otro permiso,
 * asi que las configuraciones actuales (sitio viejo) quedan intactas.
 */
async function ensurePublicReadPermissions(strapi: Core.Strapi) {
  const publicRole = await strapi.db
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'public' } });

  if (!publicRole) {
    strapi.log.warn('[rework] rol public no encontrado; se omiten permisos');
    return;
  }

  const wanted: string[] = [];
  for (const uid of RW_COLLECTIONS) {
    wanted.push(`api::${uid}.${uid}.find`, `api::${uid}.${uid}.findOne`);
  }
  for (const uid of RW_SINGLE_TYPES) {
    wanted.push(`api::${uid}.${uid}.find`);
  }

  for (const action of wanted) {
    const exists = await strapi.db
      .query('plugin::users-permissions.permission')
      .findOne({ where: { action, role: publicRole.id } });
    if (!exists) {
      await strapi.db
        .query('plugin::users-permissions.permission')
        .create({ data: { action, role: publicRole.id } });
      strapi.log.info(`[rework] permiso public creado: ${action}`);
    }
  }
}

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await ensureLocales(strapi);
    await ensurePublicReadPermissions(strapi);
  },
};
