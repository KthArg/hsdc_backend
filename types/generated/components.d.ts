import type { Schema, Struct } from '@strapi/strapi';

export interface RwBestiaryItem extends Struct.ComponentSchema {
  collectionName: 'components_rw_bestiary_items';
  info: {
    description: 'Animal del bestiario: nombre comun, latin, nota e imagen';
    displayName: 'Bestiary Item';
    icon: 'paw-print';
  };
  attributes: {
    commonName: Schema.Attribute.String;
    genus: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    imageUrl: Schema.Attribute.String;
    latinName: Schema.Attribute.String;
    note: Schema.Attribute.Text;
    roman: Schema.Attribute.String;
  };
}

export interface RwDescBlock extends Struct.ComponentSchema {
  collectionName: 'components_rw_desc_blocks';
  info: {
    description: 'Bloque de descripcion (detalle): titulo opcional + texto';
    displayName: 'Description Block';
    icon: 'align-left';
  };
  attributes: {
    text: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface RwDish extends Struct.ComponentSchema {
  collectionName: 'components_rw_dishes';
  info: {
    description: 'Plato del restaurante Papiro: nombre, subtitulo, precio e imagen';
    displayName: 'Dish';
    icon: 'fork-knife';
  };
  attributes: {
    image: Schema.Attribute.Media<'images'>;
    imageUrl: Schema.Attribute.String;
    name: Schema.Attribute.String;
    number: Schema.Attribute.String;
    price: Schema.Attribute.String;
    subtitle: Schema.Attribute.String;
  };
}

export interface RwFact extends Struct.ComponentSchema {
  collectionName: 'components_rw_facts';
  info: {
    description: 'Par label/valor (ej. Bueno saber): WiFi = Gratuito';
    displayName: 'Fact';
    icon: 'info';
  };
  attributes: {
    label: Schema.Attribute.String;
    value: Schema.Attribute.String;
  };
}

export interface RwGardenHerb extends Struct.ComponentSchema {
  collectionName: 'components_rw_garden_herbs';
  info: {
    description: 'Hierba de la huerta mandala: nombre, latin e imagen';
    displayName: 'Garden Herb';
    icon: 'plant';
  };
  attributes: {
    image: Schema.Attribute.Media<'images'>;
    imageUrl: Schema.Attribute.String;
    latinName: Schema.Attribute.String;
    name: Schema.Attribute.String;
  };
}

export interface RwListItem extends Struct.ComponentSchema {
  collectionName: 'components_rw_list_items';
  info: {
    description: 'Item simple de lista (ej. La finca incluye)';
    displayName: 'List Item';
    icon: 'check';
  };
  attributes: {
    text: Schema.Attribute.String;
  };
}

export interface RwSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_rw_social_links';
  info: {
    description: 'Red social: plataforma, handle y URL';
    displayName: 'Social Link';
    icon: 'link';
  };
  attributes: {
    handle: Schema.Attribute.String;
    label: Schema.Attribute.String;
    platform: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface RwStat extends Struct.ComponentSchema {
  collectionName: 'components_rw_stats';
  info: {
    description: 'Cifra animada (Nosotros): valor, label y si es anio';
    displayName: 'Stat';
    icon: 'chart-bar';
  };
  attributes: {
    isYear: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    label: Schema.Attribute.String;
    value: Schema.Attribute.String;
  };
}

export interface RwThermalPool extends Struct.ComponentSchema {
  collectionName: 'components_rw_thermal_pools';
  info: {
    description: 'Poza de aguas termales: temperatura, nombre, descripcion e imagen';
    displayName: 'Thermal Pool';
    icon: 'drop';
  };
  attributes: {
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'>;
    imageUrl: Schema.Attribute.String;
    name: Schema.Attribute.String;
    temperature: Schema.Attribute.String;
  };
}

export interface RwTimelineItem extends Struct.ComponentSchema {
  collectionName: 'components_rw_timeline_items';
  info: {
    description: 'Hito de la linea de tiempo (Esencia): anio, titulo y texto';
    displayName: 'Timeline Item';
    icon: 'clock';
  };
  attributes: {
    text: Schema.Attribute.Text;
    title: Schema.Attribute.String;
    year: Schema.Attribute.String;
  };
}

export interface RwValue extends Struct.ComponentSchema {
  collectionName: 'components_rw_values';
  info: {
    description: 'Valor de la marca (Nosotros): titulo y descripcion';
    displayName: 'Value';
    icon: 'heart';
  };
  attributes: {
    description: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'rw.bestiary-item': RwBestiaryItem;
      'rw.desc-block': RwDescBlock;
      'rw.dish': RwDish;
      'rw.fact': RwFact;
      'rw.garden-herb': RwGardenHerb;
      'rw.list-item': RwListItem;
      'rw.social-link': RwSocialLink;
      'rw.stat': RwStat;
      'rw.thermal-pool': RwThermalPool;
      'rw.timeline-item': RwTimelineItem;
      'rw.value': RwValue;
    }
  }
}
