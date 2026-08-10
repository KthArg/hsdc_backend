'use strict';
/* Siembra el contenido rw-* en Strapi Cloud via REST (locale ES).
   Reusa los datos de seed-rework.js. Idempotente (por slug/key/single).
   Solo agrega tipos rw-*; no toca nada de los tipos viejos.
   Lee STRAPI_URL / STRAPI_WRITE_TOKEN de ../.seed-cloud.env (no imprime el token). */
const fs = require('fs');
const path = require('path');
const D = require('./seed-rework.js'); // solo datos (no corre el seed local)

const env = {};
fs.readFileSync(path.join(__dirname, '..', '.seed-cloud.env'), 'utf8').split('\n').forEach((l) => {
  const m = l.match(/^\s*([A-Za-z_]+)\s*=\s*(.*)\s*$/);
  if (m) env[m[1]] = m[2].trim();
});
const URL = env.STRAPI_URL;
const TOKEN = env.STRAPI_WRITE_TOKEN;
if (!URL || !TOKEN) { console.error('Falta STRAPI_URL / STRAPI_WRITE_TOKEN en .seed-cloud.env'); process.exit(1); }
const H = { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' };
const LOCALE = 'es';

async function jget(p) { const r = await fetch(`${URL}${p}`, { headers: H }); return r.ok ? r.json() : null; }

const fileCache = new Map();
async function fileId(filename) {
  if (!filename) return null;
  const hash = String(filename).replace(/\.[^.]+$/, '');
  if (fileCache.has(hash)) return fileCache.get(hash);
  const r = await fetch(`${URL}/api/upload/files?filters[hash][$eq]=${encodeURIComponent(hash)}`, { headers: H });
  let fid = null;
  if (r.ok) { const j = await r.json(); const arr = Array.isArray(j) ? j : (j.data || []); if (arr[0]) fid = arr[0].id; }
  if (!fid) console.log(`  ! media no encontrada: ${filename}`);
  fileCache.set(hash, fid);
  return fid;
}
async function fileIds(list) { const out = []; for (const f of list || []) { const id = await fileId(f); if (id) out.push(id); } return out; }

async function upsertCollection(plural, keyField, keyVal, data) {
  const ex = await jget(`/api/${plural}?locale=${LOCALE}&filters[${keyField}][$eq]=${encodeURIComponent(keyVal)}&status=published`);
  if (ex && ex.data && ex.data.length) {
    const docId = ex.data[0].documentId;
    await fetch(`${URL}/api/${plural}/${docId}?locale=${LOCALE}`, { method: 'PUT', headers: H, body: JSON.stringify({ data }) });
    return docId;
  }
  const c = await fetch(`${URL}/api/${plural}?locale=${LOCALE}`, { method: 'POST', headers: H, body: JSON.stringify({ data }) });
  if (!c.ok) { console.log(`  ! error creando ${plural} (${keyVal}): ${c.status} ${(await c.text()).slice(0, 200)}`); return null; }
  return (await c.json()).data.documentId;
}

async function upsertSingle(singular, data) {
  const r = await fetch(`${URL}/api/${singular}?locale=${LOCALE}`, { method: 'PUT', headers: H, body: JSON.stringify({ data }) });
  if (!r.ok) console.log(`  ! error single ${singular}: ${r.status} ${(await r.text()).slice(0, 200)}`);
}

async function main() {
  console.log('Seed -> Cloud:', URL, '\n');

  console.log('Amenidades...'); const amId = {};
  for (const a of D.AMENITIES) amId[a.key] = await upsertCollection('rw-amenities', 'key', a.key, a);

  console.log('Categorias de tour...'); const catId = {};
  for (const c of D.TOUR_CATEGORIES) catId[c.key] = await upsertCollection('rw-tour-categories', 'key', c.key, c);

  console.log('Villas...');
  for (let i = 0; i < D.VILLAS.length; i++) { const v = D.VILLAS[i];
    await upsertCollection('rw-villas', 'slug', v.slug, {
      slug: v.slug, name: v.name, tagline: v.tagline, capacity: v.capacity, beds: v.beds,
      description: v.description, accentColor: v.accentColor, order: i + 1,
      amenities: v.amenities.map((k) => amId[k]).filter(Boolean),
      image: await fileId(v.image), gallery: await fileIds([v.image, ...D.STAY_SCENES]),
    });
  }

  console.log('Instalaciones...');
  for (let i = 0; i < D.FACILITIES.length; i++) { const f = D.FACILITIES[i];
    await upsertCollection('rw-facilities', 'slug', f.slug, {
      slug: f.slug, name: f.name, legend: f.legend, homeDesc: f.homeDesc, intro: f.intro,
      descBlocks: f.descBlocks, order: i + 1, images: await fileIds(f.images),
    });
  }

  console.log('Servicios...');
  for (let i = 0; i < D.SERVICES.length; i++) { const s = D.SERVICES[i];
    await upsertCollection('rw-services', 'slug', s.slug, {
      slug: s.slug, name: s.name, tag: s.tag, homeDesc: s.homeDesc, intro: s.intro,
      ctaLabel: s.ctaLabel, descBlocks: s.descBlocks, order: i + 1, images: await fileIds(s.images),
    });
  }

  console.log('Tours...');
  for (let i = 0; i < D.TOURS.length; i++) { const t = D.TOURS[i];
    await upsertCollection('rw-tours', 'slug', t.slug, {
      slug: t.slug, name: t.name, duration: t.duration, difficulty: t.difficulty, price: t.price,
      included: !!t.included, blurb: t.blurb, highlight: t.highlight, internalLink: t.internalLink || null,
      featured: !!t.featured, order: i + 1, category: catId[t.category] || null,
      image: t.image ? await fileId(t.image) : null, imageUrl: t.imageUrl || null,
    });
  }

  console.log('Equipo...');
  for (let i = 0; i < D.TEAM.length; i++) { const m = D.TEAM[i];
    await upsertCollection('rw-team-members', 'name', m.name, { name: m.name, role: m.role, order: i + 1, image: await fileId(m.img) });
  }

  console.log('Resenas...');
  for (let i = 0; i < D.REVIEWS.length; i++) { const r = D.REVIEWS[i];
    await upsertCollection('rw-reviews', 'name', r.name, { name: r.name, quote: r.quote, source: r.source, rating: r.rating, order: i + 1 });
  }

  console.log('Ajustes del sitio...'); await upsertSingle('rw-site-setting', D.SITE_SETTING);

  console.log('Home...');
  { const h = { ...D.HOME }; h.essenceRevealImage = await fileId(D.HOME.essenceRevealImage); h.stayImage = await fileId(D.HOME.stayImage); await upsertSingle('rw-home', h); }

  console.log('Nosotros...');
  { const a = { ...D.ABOUT }; a.heroImage = await fileId(D.ABOUT.heroImage); a.storyImage = await fileId(D.ABOUT.storyImage); a.placeImage = await fileId(D.ABOUT.placeImage); await upsertSingle('rw-about', a); }

  console.log('Contacto...'); await upsertSingle('rw-contact', D.CONTACT);
  console.log('Tours (pagina)...'); await upsertSingle('rw-tours-page', D.TOURS_PAGE);

  console.log('\nLISTO. Seed a Cloud completado.');
}
main().catch((e) => { console.error('ERROR:', e.message); process.exit(1); });
