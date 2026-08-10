'use strict';

/**
 * Seed del contenido del REWORK (content-types rw-*), locale ES.
 *
 * Reproduce el contenido que hoy esta hardcodeado en el frontend nuevo, para:
 *   1) darle al staff un punto de partida (solo faltaria revisar y traducir a EN)
 *   2) permitir probar el frontend contra datos reales en local
 *
 * Es idempotente: si una entrada ya existe (por slug/key) la actualiza; no duplica.
 * Solo toca content-types rw-*; jamas altera los tipos viejos.
 *
 * Uso (con el server de Strapi APAGADO):
 *   node scripts/seed-rework.js
 *
 * IMPORTANTE: pensado para LOCAL. No lo corras contra produccion (Cloud) sin
 * revisar, porque sobreescribe las entradas rw-* del locale ES.
 */

const { createStrapi, compileStrapi } = require('@strapi/strapi');

const LOCALE = 'es';
const un = (id) =>
  `https://images.unsplash.com/${id}?fm=jpg&q=75&w=1600&auto=format&fit=crop`;

// ---------------------------------------------------------------- DATA

const AMENITIES = [
  { key: 'jacuzzi', name: 'Jacuzzi privado', icon: 'Bathtub', order: 1 },
  { key: 'ac', name: 'Aire acondicionado', icon: 'Snowflake', order: 2 },
  { key: 'tv', name: 'Televisión', icon: 'Television', order: 3 },
  { key: 'coffee', name: 'Cafetera', icon: 'Coffee', order: 4 },
  { key: 'wifi', name: 'WiFi', icon: 'WifiHigh', order: 5 },
  { key: 'hot-water', name: 'Agua caliente', icon: 'Drop', order: 6 },
  { key: 'shower', name: 'Ducha', icon: 'Shower', order: 7 },
  { key: 'minibar', name: 'Minibar', icon: 'Wine', order: 8 },
  { key: 'accessible', name: 'Habitación accesible', icon: 'Wheelchair', order: 9 },
];

const TOUR_CATEGORIES = [
  { key: 'naturaleza', name: 'Naturaleza', order: 1 },
  { key: 'aventura', name: 'Aventura', order: 2 },
  { key: 'agua', name: 'Agua', order: 3 },
  { key: 'cultura', name: 'Cultura', order: 4 },
  { key: 'bienestar', name: 'Bienestar', order: 5 },
];

const BASE = ['ac', 'tv', 'coffee', 'wifi', 'hot-water', 'shower', 'minibar'];
const STAY_SCENES = [
  'Copia_de_Copia_de_Hotel_El_Silencio_Del_Campo_Piscina_07_db7f5664c7.jpg',
  'Copia_de_IMG_8867_13838ae643.JPG',
  'Copia_de_Fa_Ma_Lo_Fotografia_159_601d65745f.jpg',
  'Fa_Ma_Lo_Fotografia_469_99d598e32d.jpg',
];

const VILLAS = [
  {
    slug: 'romantica-con-jacuzzi', name: 'Romántica con Jacuzzi', tagline: 'Para una luna de miel',
    capacity: 2, price: '$420', beds: 'Cama King · jacuzzi interno', accentColor: '196,110,48',
    amenities: ['jacuzzi', ...BASE], image: 'DSCF_9965_e59341e872.jpg',
    description: 'Villa Romántica con jacuzzi, perfecta para una luna de miel. Ofrece un espacio íntimo ideal para disfrutar en pareja. Equipada con una cama King, mesa de juegos y un jacuzzi interno, es la mejor opción para una escapada romántica.',
  },
  {
    slug: 'villa-especial', name: 'Villa Especial', tagline: 'Accesible, sin barreras',
    capacity: 4, price: '$380', beds: 'Amplitud en terraza y baño', accentColor: '90,155,110',
    amenities: [...BASE, 'accessible'], image: 'Foto_134_d65b777494.jpg',
    description: 'Nuestras Villas Accesibles están especialmente adaptadas para personas con discapacidad y adultos mayores. Cuidadosamente diseñadas y equipadas para garantizar la máxima accesibilidad y comodidad, ofrecen mayor amplitud en terraza y baño, sin barreras arquitectónicas, y con elementos de apoyo físico pensados para tu bienestar.',
  },
  {
    slug: 'villa-estandar', name: 'Villa Estándar', tagline: 'Descanso meticuloso',
    capacity: 4, price: '$320', beds: 'Dos camas Queen', accentColor: '48,110,165',
    amenities: [...BASE], image: 'DSCF_9993_8a14ad98dc.jpg',
    description: 'Disfruta la comodidad de dos camas Queen size y de una habitación meticulosamente diseñada, con una exquisita decoración interior, con el único propósito de proporcionar la máxima relajación a nuestros distinguidos huéspedes.',
  },
  {
    slug: 'villa-familiar', name: 'Villa Familiar', tagline: 'Toda la familia, junta',
    capacity: 5, price: '$540', beds: 'Dos camas Queen + una individual', accentColor: '36,88,58',
    amenities: [...BASE], image: 'DSCF_0041_e67eb9273a.jpg',
    description: 'Esta villa está equipada con dos camas Queen y una cama individual, proporcionando un espacio cómodo y acogedor para que toda la familia descanse junta en una misma habitación.',
  },
  {
    slug: 'villa-romantica', name: 'Villa Romántica', tagline: 'Un ambiente para dos',
    capacity: 2, price: '$360', beds: 'Cama King', accentColor: '160,72,100',
    amenities: [...BASE], image: 'DSCF_0024_c5aa0be951.jpg',
    description: 'La habitación ideal para disfrutar en pareja. Sumérgete en un ambiente romántico, decorado con cálidos colores, y relájate en la comodidad de una cama King.',
  },
];

const FACILITIES = [
  {
    slug: 'restaurante-papiro', name: 'Restaurante Papiro',
    legend: 'Lo mejor de nuestra gastronomía lista para su deleite',
    homeDesc: 'Cocina de la huerta a la mesa, servida entre jardines y el canto del bosque.',
    intro: 'Una traducción honesta de lo que crece a cien metros de la mesa. La carta cambia con la lluvia y cada plato lleva una hierba distinta de la huerta mandala.',
    images: ['Copia_de_Fa_Ma_Lo_Fotografia_299_74830d6a1e.jpg', 'Desayuno_de_Fa_Ma_Lo_Fotografia_65_ac8a779fb7.jpg', 'comida_de_mar_a425bc80bc.jpg', 'Bowl_de_Fa_Ma_Lo_Fotografia_5_65c520a7c1.jpg', 'hamburguesa_d3cfbc73e4.jpg', 'dedos_de_pescado_de_Fa_Ma_Lo_Fotografia_14_676af97f7f.jpg', 'Panzada_de_Fa_Ma_Lo_Fotografia_7_a0634838d2.jpg', 'Gerson_bebidas_de_Fa_Ma_Lo_Fotografia_16_992d759636.jpg'],
    descBlocks: [
      { title: 'De la huerta al plato', text: 'Las verduras, las hierbas y buena parte de la fruta llegan de nuestra propia huerta mandala, a pocos pasos de la cocina.' },
      { title: 'Cocina de temporada', text: 'La carta cambia con la lluvia y con lo que la tierra da esa semana. El desayuno va incluido para los huéspedes.' },
    ],
  },
  {
    slug: 'spa-termal', name: 'Spa Termal',
    legend: 'Un regalo para su cuerpo en manos expertas',
    homeDesc: 'Un regalo para el cuerpo en manos expertas, junto a las pozas calientes.',
    intro: 'Masajes y tratamientos junto a las pozas termales, calentadas por el corazón del volcán Arenal. Un ritual pensado para que el cuerpo se afloje y la mente se aquiete.',
    images: ['DSC_4287_adfa9c9575.jpg', 'Copia_de_Fa_Ma_Lo_Fotografia_320_c24de8ca99.jpg', 'Copia_de_Fa_Ma_Lo_Fotografia_328_5e7d7a8169.jpg', 'Copia_de_Fa_Ma_Lo_Fotografia_337_4b0e2c2c9d.jpg', 'Copia_de_Fa_Ma_Lo_Fotografia_339_ebeecef11b.jpg', 'Copia_de_Fa_Ma_Lo_Fotografia_438_023d47756f.jpg', '3_Spa_Recepcion_647b1b4aff.jpg', 'Copia_de_Fa_Ma_Lo_Fotografia_385_1b0733d118.jpg'],
    descBlocks: [
      { title: 'En manos expertas', text: 'Masajes y tratamientos guiados por terapeutas del hotel, pensados para soltar el cuerpo después de un día de bosque.' },
      { title: 'Junto a las pozas', text: 'El spa se asoma a las aguas termales, así que el ritual se puede continuar en el agua caliente, sin prisa.' },
    ],
  },
  {
    slug: 'granja-pavo-real', name: 'Granja Pavo Real',
    legend: 'Aprenda y conviva con estos dulces animales',
    homeDesc: 'Convive con pavos reales, gallinas y los animales que habitan la finca.',
    intro: 'Pavos reales, gallinas, patos y ovejas conviven en la finca. Un lugar para aprender de cerca y compartir con los animales que hacen del campo un lugar vivo.',
    images: ['Gallinas_0486c0388f.jpg', 'Pavo_Real_Blanco_868e36d821.jpg', 'Ovejas_e67a239dee.jpg', 'Patos_ca0eb65ee1.jpg', 'Fa_Ma_Lo_Fotografia_140_90cc82940b.jpg', 'Fa_Ma_Lo_Fotografia_99_17359545d9.jpg', 'Fa_Ma_Lo_Fotografia_191_cef9ac0fc6.jpg', 'Fa_Ma_Lo_Fotografia_120_68cdf5583f.jpg'],
    descBlocks: [
      { title: 'Los que ya vivían aquí', text: 'Pavos reales, gallinas, patos y ovejas conviven en la finca. Muchos llegaron solos y decidieron quedarse.' },
      { title: 'Para los curiosos', text: 'Un espacio para acercarse, aprender y compartir con los animales, sobre todo para los más pequeños.' },
    ],
  },
  {
    slug: 'piscina-fria', name: 'Piscina Fría',
    legend: 'Perfecta para refrescarte en un día caluroso',
    homeDesc: 'Agua de manantial para refrescar los días de calor.',
    intro: 'Agua de manantial que despierta el cuerpo entre los baños termales. La regla del bosque: caliente, frío, y de vuelta.',
    images: ['Copia_de_Copia_de_Hotel_El_Silencio_Del_Campo_Piscina_07_db7f5664c7.jpg', 'Copia_de_Copia_de_Hotel_El_Silencio_Del_Campo_Piscina_01_copia_32037bbda9.jpg', 'Copia_de_Fa_Ma_Lo_Fotografia_475_f40cfb669f.jpg', 'Copia_de_Fa_Ma_Lo_Fotografia_465_e9fce0a470.jpg', 'Copia_de_Fa_Ma_Lo_Fotografia_294_7e1d7225d5.jpg', 'Copia_de_Fa_Ma_Lo_Fotografia_461_3928a1bf0d.jpg', 'Copia_de_Fa_Ma_Lo_Fotografia_185_ef6f49e336.jpg', 'Copia_de_Fa_Ma_Lo_Fotografia_186_ee9039d9fe.jpg'],
    descBlocks: [
      { title: 'Agua de manantial', text: 'Fría y limpia, ideal para cerrar los poros y despertar el cuerpo entre un baño termal y el siguiente.' },
      { title: 'La regla del bosque', text: 'Caliente, frío y de vuelta. El contraste es parte del ritual de aguas del hotel.' },
    ],
  },
  {
    slug: 'actividades-ninos', name: 'Actividades para los más pequeños',
    legend: 'Un lugar para explorar y aprender',
    homeDesc: 'Un lugar para explorar, jugar y aprender al aire libre.',
    intro: 'Un espacio pensado para que los más pequeños exploren, jueguen y aprendan al aire libre, rodeados de naturaleza y de los animales de la finca.',
    images: ['8_Copia_de_IMG_5385_TIF_cd2c7c42e6.jpg', '9_Copia_de_IMG_5373_TIF_61f1c115e5.jpg', 'Copia_de_IMG_5361_TIF_1c14049ce1.jpg', 'Copia_de_Fa_Ma_Lo_Fotografia_187_90f40e1a88.jpg', 'Foto_183_7558f23854.jpg', 'Copia_de_Fa_Ma_Lo_Fotografia_241_8dc55a81ee.jpg', 'Copia_de_Fa_Ma_Lo_Fotografia_143_28e8012f00.jpg', 'Copia_de_Fa_Ma_Lo_Fotografia_181_09c9ce4f67.jpg'],
    descBlocks: [
      { title: 'Al aire libre', text: 'Un lugar pensado para que niñas y niños exploren, jueguen y aprendan rodeados de naturaleza.' },
      { title: 'Cerca de los animales', text: 'Las actividades se cruzan con la granja y la huerta, para que la visita también enseñe.' },
    ],
  },
  {
    slug: 'termales-el-silencio', name: 'Termales El Silencio',
    legend: 'Viva una auténtica experiencia de bienestar para cuerpo y alma',
    homeDesc: 'Bienestar para cuerpo y alma en las pozas más reservadas, a la luz de las velas.',
    intro: 'Las pozas más reservadas del hotel, alimentadas por el volcán Arenal. Iluminadas a vela y abiertas hasta la medianoche, para una experiencia de bienestar de cuerpo y alma.',
    images: ['Copia_de_IMG_8867_13838ae643.JPG', 'Copia_de_Fa_Ma_Lo_Fotografia_253_4f6c7c71d2.jpg', 'Copia_de_Copy_of_IMG_5423_TIF_d887994c00.jpg', 'Copia_de_Copy_of_IMG_5409_TIF_8ed76c9938.jpg', 'Copia_de_Copy_of_IMG_5416_TIF_b663de79d7.jpg', 'Copia_de_Copy_of_IMG_5384_TIF_86e98c5a30.jpg', 'Copia_de_Copy_of_IMG_5382_TIF_fbe45766a1.jpg', 'Copia_de_Fa_Ma_Lo_Fotografia_480_93de5eb0ec.jpg'],
    descBlocks: [
      { title: 'Las más reservadas', text: 'Las pozas más íntimas del hotel, alimentadas por el calor del volcán Arenal.' },
      { title: 'A la luz de las velas', text: 'Abiertas hasta la medianoche e iluminadas a vela, para cerrar el día en calma.' },
    ],
  },
  {
    slug: 'huerta-mandala', name: 'Huerta Mandala',
    legend: 'De la huerta a tu mesa',
    homeDesc: 'Doce hierbas en círculo, de la tierra directo a tu plato.',
    intro: 'Doce hierbas sembradas en círculo, una para cada mes. Geometría que se come: de la tierra directo a los platos del restaurante Papiro.',
    images: ['Copia_de_Fa_Ma_Lo_Fotografia_159_601d65745f.jpg', 'Copia_de_Copia_de_DSC_6475_457e63563e.jpg', 'Copia_de_Fa_Ma_Lo_Fotografia_161_57273d6a3d.jpg', 'Copia_de_Lechugas_460729d851.jpg', 'Copia_de_Fa_Ma_Lo_Fotografia_472_99cf307aee.jpg', 'Copia_de_Fa_Ma_Lo_Fotografia_173_5e0ef9c96a.jpg', 'Copia_de_Grupo_de04da9f4c.jpg', 'Copia_de_Fa_Ma_Lo_Fotografia_168_64c4928432.jpg'],
    descBlocks: [
      { title: 'Doce hierbas en círculo', text: 'Sembrada en forma de mandala, una hierba para cada mes. Geometría que se puede comer.' },
      { title: 'De la tierra a la mesa', text: 'Casi todo lo que prueba el restaurante Papiro nace aquí, a cien metros de la cocina.' },
    ],
  },
  {
    slug: 'estacion-de-carga', name: 'Estación de Carga',
    legend: 'Cada vez más ecológicos',
    homeDesc: 'Cargá tu auto eléctrico. Cada vez más cerca de la naturaleza.',
    intro: 'En nuestro compromiso con la sostenibilidad, ofrecemos una estación de carga para vehículos eléctricos con tecnología de última generación: carga rápida y eficiente, compatible con la mayoría de modelos, para que llegues con total comodidad.',
    images: ['cce95cdf_dcd4_4001_b0de_799d5febb24c_1_31386da470.jpg'],
    descBlocks: [
      { title: 'Cargá tu vehículo eléctrico', text: 'En nuestro compromiso con la sostenibilidad ofrecemos una estación con tecnología de última generación: carga rápida y eficiente.' },
      { title: 'Compatible con tu modelo', text: 'Funciona con la mayoría de los vehículos eléctricos, para que llegues y cargues con total comodidad durante tu estancia.' },
    ],
  },
  {
    slug: 'pet-friendly-villas', name: 'Pet Friendly Villas',
    legend: 'Nuestros amigos de cuatro patas',
    homeDesc: 'Tus amigos de cuatro patas también son bienvenidos en el bosque.',
    intro: 'Aquí tus amigos de cuatro patas también son bienvenidos. Villas pensadas para que tu mascota descanse contigo, dentro del bosque.',
    images: ['Samy_Fuly_99812c42f7.jpg', 'Kate_Maya_59ac70bed2.jpg'],
    descBlocks: [
      { title: 'Tu mascota, bienvenida', text: 'Villas pensadas para que tus amigos de cuatro patas descansen contigo, dentro del bosque.' },
      { title: 'Sin dejar a nadie atrás', text: 'Porque un refugio de verdad lo es para toda la familia, también la que camina en cuatro patas.' },
    ],
  },
];

const SERVICES = [
  {
    slug: 'atv-super-quads', name: 'ATV Super Quads', tag: 'Aventura · con guía',
    homeDesc: 'Recorré los senderos del bosque y las faldas del volcán Arenal en cuatrimoto.',
    intro: 'Barro, río y adrenalina. Recorré los senderos del bosque y las faldas del volcán Arenal en cuatrimoto, siempre con guía. Una forma distinta de conocer el campo: la que deja el corazón acelerado.',
    images: ['BNXT_4_A8756_454737ad18.jpg', '018_7c2dc02af0.jpg', '015_f67e0ab59a.jpg', '011_a76fb47115.jpg', 'BNXT_4_A8712_9de4c85081.jpg', '024_2eb28ab69d.jpg', '009_5f4c30ed96.jpg', '020_8e7fac1998.jpg'],
    ctaLabel: '',
    descBlocks: [
      { title: 'El recorrido', text: 'Senderos de barro, cruces de río y las faldas del volcán Arenal. Un circuito que combina bosque y adrenalina.' },
      { title: 'Siempre con guía', text: 'Vas acompañado por un guía que conoce el terreno, para que disfrutes sin preocuparte por el camino.' },
      { title: 'Para quién es', text: 'Ideal para quienes quieren una dosis de aventura sin alejarse del hotel. Consultá disponibilidad al reservar.' },
    ],
  },
  {
    slug: 'transporte-privado', name: 'Transporte Privado', tag: 'Traslados · a demanda',
    homeDesc: 'Traslados privados desde y hacia el aeropuerto, a tu ritmo y sin esperas.',
    intro: '¿Necesitás transporte desde el aeropuerto o tu lugar de estadía? Mauricio Ángulo, parte de nuestra familia, cuenta con una buseta cómoda para ocho pasajeros. Un conductor de confianza, amable, para que disfrutes el trayecto. El servicio también cubre playas, volcanes y otras atracciones de Costa Rica.',
    images: ['2024_03_09_1_11_33_50_1_870be34250.jpg', '2024_03_06_09_46_55_2_21132e6938.jpg', '2024_03_06_09_47_24_1_5a23095a8e.jpg', '2024_03_06_09_46_40_5d4d4e1a93.jpg', '2024_03_05_11_31_29_1_25200ca39f.jpg', '2024_03_05_11_27_37_913b90da64.jpg'],
    ctaLabel: 'Solicitar traslado',
    descBlocks: [
      { title: 'Desde el aeropuerto, sin esperas', text: 'Coordinamos tu traslado privado desde el aeropuerto o tu lugar de estadía. Vos avisás, nosotros resolvemos.' },
      { title: 'Mauricio, de la familia', text: 'Mauricio Ángulo es parte de nuestra gran familia. Su buseta es cómoda para ocho pasajeros y es un conductor de confianza, amable, para que disfrutes el trayecto.' },
      { title: 'Más allá del hotel', text: 'El servicio también cubre playas, volcanes y otras atracciones de Costa Rica, además de traslados cortos cerca del hotel.' },
    ],
  },
];

const TOURS = [
  { slug: 'volcan-arenal-1968', name: 'Volcán Arenal · Sendero 1968', category: 'naturaleza', duration: 'Medio día', difficulty: 2, price: '58', included: false, blurb: 'Caminá los antiguos flujos de lava con el coloso de frente y el lago a un costado.', highlight: 'Con guía naturalista · miradores al lago', image: 'Copia_de_Hotel_El_Silencio_Del_Campo_Vista_Volcan_06_329f0e7449.jpg', featured: true },
  { slug: 'puentes-colgantes', name: 'Puentes Colgantes', category: 'naturaleza', duration: '3–4 h', difficulty: 1, price: '52', included: false, blurb: 'Seis puentes suspendidos sobre el dosel del bosque lluvioso, a la altura de los tucanes.', highlight: 'Senderos entre el dosel · aves y ranas', imageUrl: un('photo-1742909622076-dd07df8a7003') },
  { slug: 'catarata-rio-fortuna', name: 'Catarata Río Fortuna', category: 'aventura', duration: 'Medio día', difficulty: 2, price: '40', included: false, blurb: 'Quinientos escalones bajan a una cascada de setenta metros y su poza de agua fría.', highlight: '500 escalones · poza para nadar', imageUrl: un('photo-1595963178022-98bafc4dd550') },
  { slug: 'rio-celeste', name: 'Río Celeste · Tenorio', category: 'naturaleza', duration: 'Día completo', difficulty: 2, price: '115', included: false, blurb: 'El río que se pinta de celeste en pleno bosque nuboso, por un capricho de la química y la luz.', highlight: 'Bosque nuboso · aguas turquesa', imageUrl: un('photo-1738003084151-a8125755d327'), featured: true },
  { slug: 'rafting-rio-balsa', name: 'Rafting Río Balsa', category: 'aventura', duration: 'Medio día', difficulty: 3, price: '78', included: false, blurb: 'Rápidos clase III entre paredes de selva, garzas y remojones garantizados.', highlight: 'Clase III–IV · equipo incluido', imageUrl: un('photo-1642933196504-62107dac9258'), featured: true },
  { slug: 'cano-negro', name: 'Caño Negro', category: 'naturaleza', duration: 'Día completo', difficulty: 1, price: '75', included: false, blurb: 'Safari en bote por el humedal: caimanes, monos aulladores y cientos de aves.', highlight: 'En bote · almuerzo típico incluido', imageUrl: un('photo-1605999352683-ee01111710e1') },
  { slug: 'canopy-tirolesas', name: 'Canopy · Tirolesas', category: 'aventura', duration: '3 h', difficulty: 2, price: '65', included: false, blurb: 'Vuelo entre copas por catorce cables tendidos sobre el cañón del río.', highlight: '14 cables · puente tibetano', imageUrl: un('photo-1679117730976-cdb5f6b05b88') },
  { slug: 'cabalgata-atardecer', name: 'Cabalgata al Atardecer', category: 'aventura', duration: '2–3 h', difficulty: 1, price: '55', included: false, blurb: 'A caballo por potreros y bosque, justo cuando la luz cae sobre el Arenal.', highlight: 'Caballos mansos · apto principiantes', imageUrl: un('photo-1624125276915-39e2afd37438') },
  { slug: 'cafe-y-chocolate', name: 'Café y Chocolate', category: 'cultura', duration: '3 h', difficulty: 1, price: '48', included: false, blurb: 'Del grano y la mazorca a la taza, en una finca de familia que trabaja a la antigua.', highlight: 'Cata incluida · finca de familia', imageUrl: un('photo-1746623691157-c4c7a3bad0c4'), featured: true },
  { slug: 'tour-nocturno', name: 'Tour Nocturno', category: 'naturaleza', duration: '2 h', difficulty: 1, price: '42', included: false, blurb: 'El bosque despierta de noche: ranas de ojos rojos, insectos y pares de ojos en la oscuridad.', highlight: 'Con linterna · guía naturalista', imageUrl: un('photo-1559253664-ca249d4608c6') },
  { slug: 'perezosos-bogarin', name: 'Perezosos · Bogarín', category: 'naturaleza', duration: '3 h', difficulty: 1, price: '45', included: false, blurb: 'Sendero lento y silencioso tras perezosos, tucanes y ranitas de colores.', highlight: 'Con telescopio · perezosos y tucanes', imageUrl: un('photo-1604165645922-eb8fdc7d84ee') },
  { slug: 'kayak-lago-arenal', name: 'Kayak en el Lago Arenal', category: 'agua', duration: 'Medio día', difficulty: 2, price: '60', included: false, blurb: 'Remá el lago más grande del país con el volcán reflejado en el agua quieta.', highlight: 'Aguas calmas · apto principiantes', imageUrl: un('photo-1629248457649-b082812aea6c') },
  { slug: 'atv-super-quads', name: 'ATV Super Quads', category: 'aventura', duration: '2–3 h', difficulty: 2, price: '85', included: false, blurb: 'Barro, río y adrenalina por senderos y faldas del volcán, siempre con guía.', highlight: 'Con guía · casco y botas incluidos', image: 'BNXT_4_A8756_454737ad18.jpg', internalLink: '/servicios/atv-super-quads' },
  { slug: 'termales-el-silencio', name: 'Termales El Silencio', category: 'bienestar', duration: 'A tu ritmo', difficulty: 1, price: '', included: true, blurb: 'Nuestras propias pozas de agua termal natural, a pasos de tu villa, sin horario.', highlight: 'Sin horario · a pasos de tu villa', image: 'Copia_de_IMG_8867_13838ae643.JPG', internalLink: '/instalaciones/termales-el-silencio' },
];

const TEAM = [
  { name: 'Eylin Umaña', role: 'Reservaciones', img: 'eylin_umana_1_735d20628d.jpg' },
  { name: 'Herenia Rocha', role: 'Restaurante', img: 'herenia_rocha_1_e03c0973ee.jpg' },
  { name: 'Kevin López', role: 'Restaurante', img: 'kevin_lopez_1_01efbe3eb9.jpg' },
  { name: 'Maikel Vargas', role: 'Mantenimiento', img: 'maikel_vargas_1_99fa33c267.jpg' },
  { name: 'Manuel Zúñiga', role: 'Jardinería', img: 'manuel_zuniga_1_999a78350e.jpg' },
  { name: 'Marisela Requenes', role: 'Spa', img: 'marisela_requenes_1_f93fa36bcc.jpg' },
  { name: 'Alejandro Lazo', role: 'Granja', img: 'alejandro_lazo_1_0fb55e50a1.jpg' },
  { name: 'Belkys Aguilar', role: 'Restaurante', img: 'belkys_aguilar_1_5229f1db59.jpg' },
  { name: 'Diego Reyes', role: 'Restaurante', img: 'diego_reyes_1_86896c97df.jpg' },
  { name: 'Eliomar Marcía', role: 'Reservaciones', img: 'eliomar_marcia_1_b769538d2b.jpg' },
  { name: 'May Ling', role: 'Restaurante', img: 'may_ling_1_a2744456b9.jpg' },
  { name: 'Olivia Gonzales', role: 'Limpieza', img: 'olivia_gonzales_1_413c11e023.jpg' },
];

const REVIEWS = [
  { name: 'Johan Manuel Hernández', quote: 'Uno de los mejores hoteles de La Fortuna. Sus aguas termales invitan a la paz, con la granja, la huerta y la vista al volcán Arenal como gran plus.', source: 'Reseña de Google', rating: 5 },
  { name: 'Andrés', quote: 'El mejor hotel de todo el viaje por Costa Rica. Amabilidad sin comparación, servicio impecable y termas que no envidian a ninguna.', source: 'Reseña de Google', rating: 5 },
  { name: 'Mia Garic', quote: 'Nunca me sentí tan viva como los días que pasé aquí. La belleza, los animales, la comida y el servicio, de primera.', source: 'Reseña de Google', rating: 5 },
];

const SITE_SETTING = {
  brandName: 'Silencio del Campo',
  tagline: 'Un hotel entre la bruma, la copa de los árboles y la voz del bosque.',
  established: 'est. mcmxcviii',
  foundedYear: '1998',
  location: 'La Fortuna, Costa Rica',
  coordinates: '10°27′N · 84°42′W',
  altitude: '556 msnm',
  checkIn: '3:00 pm',
  checkOut: '12:00 pm',
  phonePrimary: '(+506) 2479-7056',
  phoneSecondary: '(+506) 2479-7055',
  email: 'info@hotelsilenciodelcampo.com',
  address: 'Zona del Volcán Arenal, La Fortuna de San Carlos, Alajuela, Costa Rica.',
  mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d4802.1950812948735!2d-84.68097514765309!3d10.485651547144244!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8fa00c088782ba9f%3A0x5615bcc1858d8cd2!2sHotel%20el%20Silencio%20del%20Campo!5e0!3m2!1ses-419!2scr!4v1754432602637!5m2!1ses-419!2scr',
  wazeUrl: 'https://waze.com/ul?q=Hotel%20El%20Silencio%20del%20Campo%20La%20Fortuna',
  googleMapsUrl: 'https://www.google.com/maps/search/Hotel+El+Silencio+del+Campo+La+Fortuna+Costa+Rica',
  ratingValue: '5.0',
  ratingText: 'en La Fortuna, Costa Rica',
  seoTitle: 'Silencio del Campo — Hotel',
  seoDescription: 'Un hotel entre la bruma, la copa de los árboles y la voz del bosque.',
  socials: [
    { platform: 'instagram', label: 'Instagram', handle: '@elsilenciodelcampo', url: 'https://instagram.com/elsilenciodelcampo' },
    { platform: 'facebook', label: 'Facebook', handle: 'elsilenciodelcampo', url: 'https://facebook.com/elsilenciodelcampo' },
    { platform: 'tiktok', label: 'TikTok', handle: '@hotel.el.silencio', url: 'https://www.tiktok.com/@hotel.el.silencio' },
    { platform: 'waze', label: 'Waze', handle: 'Cómo llegar', url: 'https://waze.com/ul?q=Hotel%20El%20Silencio%20del%20Campo%20La%20Fortuna' },
  ],
};

const HOME = {
  heroTitle: 'Silencio del Campo',
  heroSubtitle: 'Un hotel entre la bruma, la copa de los árboles y la voz del bosque.',
  heroImageUrl: 'https://images.unsplash.com/photo-1732090789452-f1675d33e554?fm=jpg&q=75&w=2400&auto=format&fit=crop',
  essenceEyebrow: 'Esencia · línea de tiempo',
  essenceTitle: 'Donde el bosque te recibe',
  essenceQuote: 'El silencio tiene un lugar, y aquí se sienta a esperar.',
  timeline: [
    { year: '1998', title: 'Las primeras semillas', text: 'Plantamos un lugar que no quería ser ruido. Cuatro hectáreas, una cabaña de madera y la promesa de no talar más de lo necesario.' },
    { year: '2005', title: 'Brota la huerta mandala', text: 'Doce hierbas en círculo, una para cada mes. Es geometría que se come, y desde entonces lleva todos los platos del Papiro.' },
    { year: '2010', title: 'El bestiario decide quedarse', text: 'Llegó primero el burro. Después los pavos reales, las mariposas morpho, un perezoso lento y un conejo blanco que aún hace guardia.' },
    { year: '2018', title: 'Se abren las pozas', text: 'Las aguas termales — tres temperaturas, una sola fuente — empiezan a recibir huéspedes. Iluminadas a vela, abiertas hasta la medianoche.' },
    { year: 'Hoy', title: 'Un fragmento de naturaleza', text: 'Cuarenta hectáreas. Cinco refugios. Ocho aguas. No vendemos habitaciones — alquilamos un pedazo de bosque para que descanses dentro de él.' },
  ],
  essenceRevealTitle: 'Un fragmento de naturaleza, cuidado como se cuida algo que se ama.',
  essenceRevealImage: 'Fa_Ma_Lo_Fotografia_469_99d598e32d.jpg',
  villasTitle: 'Cinco refugios en la copa',
  villasIntro: 'Maderas locales, ventanales generosos, una jacuzzi privada y silencio reservado para cada huésped.',
  bestiaryEyebrow: 'Pequeño bestiario · ocho especies',
  bestiaryTitle: 'Bestiario del campo',
  bestiaryIntro: 'No los criamos para entretener. Llegaron, se quedaron, y decidimos hacerles lugar. El burro responde si le hablas bajo; el pavo real prefiere las mañanas.',
  bestiary: [
    { roman: 'i — equus', genus: 'equus', commonName: 'burro', latinName: 'Equus asinus', note: 'Reside cerca de la huerta. Acepta caricias en la frente y rechaza el ruido.', imageUrl: 'https://unsplash.com/photos/-p-ew_IsNZk/download?force=true&w=1200' },
    { roman: 'ii — pavo', genus: 'pavo', commonName: 'pavo real', latinName: 'Pavo cristatus', note: 'Aparece al amanecer, despliega cuando lo escuchas en silencio.', imageUrl: 'https://unsplash.com/photos/GvyyGV2uWns/download?force=true&w=1200' },
    { roman: 'iii — morpho', genus: 'morpho', commonName: 'morpho', latinName: 'Morpho peleides', note: 'Azul como un cielo recortado, prefiere los senderos de la huerta mandala.', imageUrl: 'https://unsplash.com/photos/wNypLh377_o/download?force=true&w=1200' },
    { roman: 'iv — tucán', genus: 'tucán', commonName: 'tucán', latinName: 'Ramphastos sulfuratus', note: 'Asoma cuando llueve. Su pico es más grande que cualquier expectativa.', imageUrl: 'https://unsplash.com/photos/uY87o9euBx0/download?force=true&w=1200' },
    { roman: 'v — agalychnis', genus: 'agalychnis', commonName: 'rana de ojos rojos', latinName: 'Agalychnis callidryas', note: 'Habita las hojas. Es responsable del concierto nocturno tras la lluvia.', imageUrl: 'https://unsplash.com/photos/WM2frq8vnG8/download?force=true&w=1200' },
    { roman: 'vi — bradypus', genus: 'bradypus', commonName: 'perezoso', latinName: 'Bradypus variegatus', note: 'Pasa los días en la copa de los almendros. Aparece si miras con calma.', imageUrl: 'https://unsplash.com/photos/ISVVq_xqCZs/download?force=true&w=1200' },
    { roman: 'vii — oryctolagus', genus: 'oryctolagus', commonName: 'conejo', latinName: 'Oryctolagus cuniculus', note: 'Aparece entre las hierbas de la huerta. Inquieto al medio día, manso al atardecer.', imageUrl: 'https://unsplash.com/photos/u_kMWN-BWyU/download?force=true&w=1200' },
    { roman: 'viii — phaethornis', genus: 'phaethornis', commonName: 'colibrí', latinName: 'Phaethornis longirostris', note: 'Llega antes que el sol. Bebe del comedero junto a la recepción.', imageUrl: 'https://unsplash.com/photos/9APFPoNb9iw/download?force=true&w=1200' },
  ],
  gardenEyebrow: 'Huerta Mandala · doce sectores',
  gardenTitle: 'Doce hierbas en círculo',
  gardenIntro: 'Sembramos en forma de mandala porque la geometría de la tierra es circular. Doce hierbas, una para cada mes, que llegan directo a los platos del Papiro.',
  gardenImageUrl: 'https://plus.unsplash.com/premium_photo-1681965509696-7fc54b52281d?fm=jpg&q=80&w=2400&auto=format&fit=crop',
  herbs: [
    { name: 'Albahaca', latinName: 'Ocimum basilicum', imageUrl: 'https://images.unsplash.com/photo-1538596313828-41d729090199?fm=jpg&q=75&w=400&auto=format&fit=crop' },
    { name: 'Romero', latinName: 'Salvia rosmarinus', imageUrl: 'https://images.unsplash.com/photo-1515586000433-45406d8e6662?fm=jpg&q=75&w=400&auto=format&fit=crop' },
    { name: 'Menta', latinName: 'Mentha spicata', imageUrl: 'https://images.unsplash.com/photo-1580716937776-6196d257ee3d?fm=jpg&q=75&w=400&auto=format&fit=crop' },
    { name: 'Caléndula', latinName: 'Calendula officinalis', imageUrl: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?fm=jpg&q=75&w=400&auto=format&fit=crop' },
    { name: 'Lavanda', latinName: 'Lavandula angustifolia', imageUrl: 'https://images.unsplash.com/photo-1499002238440-d264edd596ec?fm=jpg&q=75&w=400&auto=format&fit=crop' },
    { name: 'Tomillo', latinName: 'Thymus vulgaris', imageUrl: 'https://images.unsplash.com/photo-1589562037508-ae76f4c445e2?fm=jpg&q=75&w=400&auto=format&fit=crop' },
    { name: 'Manzanilla', latinName: 'Matricaria chamomilla', imageUrl: 'https://images.unsplash.com/photo-1563467743682-704cc8ccb9c6?fm=jpg&q=75&w=400&auto=format&fit=crop' },
    { name: 'Citronela', latinName: 'Cymbopogon nardus', imageUrl: 'https://images.unsplash.com/photo-1654659932057-5163eb80289d?fm=jpg&q=75&w=400&auto=format&fit=crop' },
    { name: 'Cilantro', latinName: 'Coriandrum sativum', imageUrl: 'https://images.unsplash.com/photo-1583484963886-cfe2bff2945f?fm=jpg&q=75&w=400&auto=format&fit=crop' },
    { name: 'Orégano', latinName: 'Origanum vulgare', imageUrl: 'https://images.unsplash.com/photo-1587372767238-84dca9e88123?fm=jpg&q=75&w=400&auto=format&fit=crop' },
    { name: 'Hierbabuena', latinName: 'Mentha × piperita', imageUrl: 'https://images.unsplash.com/photo-1568569350062-ebfa3cb195df?fm=jpg&q=75&w=400&auto=format&fit=crop' },
    { name: 'Verbena', latinName: 'Verbena officinalis', imageUrl: 'https://images.unsplash.com/photo-1592394533824-9440e5d68530?fm=jpg&q=75&w=400&auto=format&fit=crop' },
  ],
  watersTitle: 'Bajo el agua, el campo respira',
  pools: [
    { temperature: '38°C · cálida', name: 'Spa Termal', description: 'Pozas naturales calentadas por el corazón del volcán Arenal. Inmersión profunda hasta que el cuerpo se afloja.', imageUrl: 'https://unsplash.com/photos/ZsQU5g90QMw/download?force=true&w=1600' },
    { temperature: '18°C · fresca', name: 'Piscina Fría', description: 'Agua de manantial que cierra los poros y despierta al cuerpo entre los baños calientes. La regla del bosque.', imageUrl: 'https://unsplash.com/photos/5M9S53JUXB8/download?force=true&w=1600' },
    { temperature: '42°C · ritual', name: 'Termales El Silencio', description: 'Las pozas más reservadas del hotel. Iluminadas a vela, abiertas hasta la medianoche, ocupadas por solo dos personas a la vez.', imageUrl: 'https://unsplash.com/photos/ZVJqmMpqPiY/download?force=true&w=1600' },
  ],
  diningEyebrow: 'Restaurante Papiro',
  diningTitle: 'La huerta en el plato',
  diningIntro: 'Nuestra cocina es una traducción honesta de lo que crece a cien metros de la mesa.',
  dishes: [
    { number: '01', name: 'Sopa de plátano y cilantro', subtitle: 'Plátano verde de la finca · cilantro de la mandala', price: '$12', imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?fm=jpg&q=80&w=1200&auto=format&fit=crop' },
    { number: '02', name: 'Trucha del río en hoja de bijao', subtitle: 'Trucha local · achiote · cocción al vapor', price: '$26', imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?fm=jpg&q=80&w=1200&auto=format&fit=crop' },
    { number: '03', name: 'Casado de raíces', subtitle: 'Yuca, ñame, camote · vegetariano', price: '$18', imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?fm=jpg&q=80&w=1200&auto=format&fit=crop' },
    { number: '04', name: 'Postre de cas y manzanilla', subtitle: 'Fruta nacional · miel de la huerta', price: '$10', imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?fm=jpg&q=80&w=1200&auto=format&fit=crop' },
  ],
  facilitiesTitle: 'La finca, por dentro',
  facilitiesIntro: 'Más allá de tu villa, el bosque esconde pozas, huertas, animales y rincones para cada miembro de la familia.',
  servicesEyebrow: 'Servicios',
  servicesTitle: 'Salí del bosque, sin salir de casa',
  toursEyebrow: 'Experiencias · Tours guiados',
  toursTitle: 'Afuera espera el Arenal entero',
  toursSubtitle: 'Cascadas, puentes sobre el dosel, rápidos, café y perezosos: un abanico de salidas guiadas que armamos y reservamos por vos.',
  stayEyebrow: 'La estancia',
  stayTitle: 'Todo listo para quedarte',
  stayLede: 'Un refugio sereno y familiar en el corazón de La Fortuna, donde lo rústico y lo cómodo conviven sin ruido.',
  stayImage: 'DSCF_0012_4578713c58.jpg',
  stayImageCaption: 'Habitaciones estilo cabaña · madera, cerámica y luz tibia',
  fincaIncluye: [
    'Habitaciones estilo cabaña', 'Piscinas de agua termal natural', 'Piscinas de agua fría', 'Bar', 'Restaurante Papiro', 'Spa Termal', 'Granja Pavo Real', 'Huerta orgánica mandala', 'Actividades para niñas y niños', 'Tours guiados', 'Servicio de transporte',
  ].map((text) => ({ text })),
  buenoSaber: [
    { label: 'Desayunos', value: 'Incluidos' },
    { label: 'Parqueo', value: 'Vigilado' },
    { label: 'WiFi', value: 'Gratuito' },
    { label: 'Mascotas', value: 'Bienvenidas' },
    { label: 'Habitaciones', value: 'Accesibles' },
  ],
  reviewsEyebrow: 'Lo que cuentan',
  reviewsTitle: 'Se llega huésped, se vuelve historia',
  reviewsAggregate: '★★★★★ 5.0 en La Fortuna, Costa Rica',
  ctaEyebrow: 'Reserva · disponible todo el año',
  ctaTitle: 'Quédate con nosotros',
  ctaText: 'Aceptamos huéspedes y a sus mascotas. El bosque ya está listo; falta tu fecha.',
};

const ABOUT = {
  heroKicker: 'Nosotros · ¿Quiénes somos?',
  heroTitle: 'No vendemos habitaciones. Prestamos un pedazo de bosque.',
  heroImage: 'Fa_Ma_Lo_Fotografia_469_99d598e32d.jpg',
  storyLead: 'Un refugio sereno y familiar en el corazón de La Fortuna, Costa Rica. Una mezcla única de encanto rústico y confort moderno.',
  storyBody: 'Es el lugar perfecto para relajarse, rejuvenecer y experimentar la belleza natural de Costa Rica. Empezó con cuatro hectáreas y una cabaña de madera. Hoy son cuarenta hectáreas, cinco refugios y un pedazo de bosque cuidado como se cuida algo que se ama.',
  storyImage: 'Fa_Ma_Lo_Fotografia_36_7d61405aee.jpg',
  storyCaption: 'Cuarenta hectáreas · cinco refugios',
  pullQuote: 'El silencio tiene un lugar, y aquí se sienta a esperar.',
  valuesEyebrow: 'Lo que nos mueve',
  values: [
    { title: 'La naturaleza primero', description: 'No talamos más de lo necesario. El bosque manda y nosotros nos acomodamos a él.' },
    { title: 'Hospitalidad de verdad', description: 'La auténtica calidez costarricense: te recibimos como familia, no como huésped de paso.' },
    { title: 'De la tierra a la mesa', description: 'Nuestra huerta mandala alimenta la cocina. Lo que crece a cien metros llega a tu plato.' },
    { title: 'Un refugio para todos', description: 'Familias, parejas y también mascotas. Un pedazo de bosque para descansar dentro de él.' },
  ],
  stats: [
    { value: '1998', label: 'Sembramos las primeras semillas', isYear: true },
    { value: '40', label: 'Hectáreas de bosque', isYear: false },
    { value: '5', label: 'Villas entre jardines', isYear: false },
    { value: '12', label: 'Hierbas en la huerta mandala', isYear: false },
  ],
  teamEyebrow: 'Las manos detrás',
  teamTitle: 'La gente del campo',
  teamSubtitle: 'Doce personas que hacen del bosque un hogar. Reservas, cocina, jardín, spa, granja y limpieza.',
  placeKicker: 'Dónde estamos',
  placeTitle: 'A los pies del volcán Arenal',
  placeImage: 'Copia_de_Hotel_El_Silencio_Del_Campo_Vista_Volcan_06_329f0e7449.jpg',
  ctaTitle: 'El bosque ya está listo. Falta tu fecha.',
};

const CONTACT = {
  heroKicker: 'Contacto · Escribinos',
  heroTitle: 'Contáctanos.',
  heroLede: 'Contanos qué tenés en mente y te respondemos personalmente. Podés escribirnos por el formulario, llamarnos o pasar a saludar entre el bosque.',
  whereTitle: 'Dónde estamos',
  phoneTitle: 'Teléfono',
  emailTitle: 'Correo',
  socialsTitle: 'Seguinos',
  formHeading: 'Contáctanos vía email',
  formSuccessTitle: 'Gracias, {nombre}.',
  formSuccessText: 'Recibimos tu mensaje y te respondemos muy pronto a {correo}.',
  mapEyebrow: 'A los pies del Arenal',
  mapTitle: 'Vení a encontrarnos',
};

const TOURS_PAGE = {
  heroKicker: 'Experiencias · Tours guiados',
  heroTitle: 'El Arenal, salida por salida',
  heroLede: 'Cascadas, puentes sobre el dosel, rápidos y bosque a la puerta. Estas son las salidas que armamos para vos: te ayudamos a ordenar los días y a reservar cada una.',
  priceNote: 'Precios «desde», por persona · orientativos y en constante ajuste',
  emptyState: 'Todavía no tenemos salidas en esta categoría. Escribinos y te armamos algo a medida.',
};

// ---------------------------------------------------------------- SEED LOGIC

async function run() {
  const appContext = await compileStrapi();
  const strapi = await createStrapi(appContext).load();
  strapi.log.level = 'error';

  const log = (...a) => console.log('[seed]', ...a);

  // Cache: filename hash -> file id
  const fileCache = new Map();
  async function mediaId(filename) {
    if (!filename) return null;
    const hash = String(filename).replace(/\.[^.]+$/, '');
    if (fileCache.has(hash)) return fileCache.get(hash);
    const file = await strapi.db
      .query('plugin::upload.file')
      .findOne({ where: { hash } });
    const id = file ? file.id : null;
    if (!id) log(`  ! media no encontrada: ${filename}`);
    fileCache.set(hash, id);
    return id;
  }
  async function mediaIds(filenames) {
    const out = [];
    for (const f of filenames || []) {
      const id = await mediaId(f);
      if (id) out.push(id);
    }
    return out;
  }

  async function upsertCollection(uid, keyField, keyValue, data) {
    const found = await strapi.documents(uid).findMany({
      locale: LOCALE,
      filters: { [keyField]: keyValue },
      limit: 1,
    });
    let doc;
    if (found && found[0]) {
      doc = await strapi.documents(uid).update({
        documentId: found[0].documentId,
        locale: LOCALE,
        data,
      });
    } else {
      doc = await strapi.documents(uid).create({ locale: LOCALE, data });
    }
    await strapi.documents(uid).publish({ documentId: doc.documentId, locale: LOCALE });
    return doc;
  }

  async function upsertSingle(uid, data) {
    const existing = await strapi.documents(uid).findFirst({ locale: LOCALE });
    let doc;
    if (existing) {
      doc = await strapi.documents(uid).update({
        documentId: existing.documentId,
        locale: LOCALE,
        data,
      });
    } else {
      doc = await strapi.documents(uid).create({ locale: LOCALE, data });
    }
    await strapi.documents(uid).publish({ documentId: doc.documentId, locale: LOCALE });
    return doc;
  }

  try {
    // 1. Amenities
    log('Amenidades...');
    const amenityId = {};
    for (const a of AMENITIES) {
      const doc = await upsertCollection('api::rw-amenity.rw-amenity', 'key', a.key, a);
      amenityId[a.key] = doc.documentId;
    }

    // 2. Tour categories
    log('Categorias de tour...');
    const categoryId = {};
    for (const c of TOUR_CATEGORIES) {
      const doc = await upsertCollection('api::rw-tour-category.rw-tour-category', 'key', c.key, c);
      categoryId[c.key] = doc.documentId;
    }

    // 3. Villas
    log('Villas...');
    for (let i = 0; i < VILLAS.length; i++) {
      const v = VILLAS[i];
      const image = await mediaId(v.image);
      const gallery = await mediaIds([v.image, ...STAY_SCENES]);
      await upsertCollection('api::rw-villa.rw-villa', 'slug', v.slug, {
        slug: v.slug, name: v.name, tagline: v.tagline, capacity: v.capacity,
        price: v.price, beds: v.beds, description: v.description,
        accentColor: v.accentColor, order: i + 1,
        amenities: v.amenities.map((k) => amenityId[k]).filter(Boolean),
        image, gallery,
      });
    }

    // 4. Facilities
    log('Instalaciones...');
    for (let i = 0; i < FACILITIES.length; i++) {
      const f = FACILITIES[i];
      const images = await mediaIds(f.images);
      await upsertCollection('api::rw-facility.rw-facility', 'slug', f.slug, {
        slug: f.slug, name: f.name, legend: f.legend, homeDesc: f.homeDesc,
        intro: f.intro, descBlocks: f.descBlocks, order: i + 1, images,
      });
    }

    // 5. Services
    log('Servicios...');
    for (let i = 0; i < SERVICES.length; i++) {
      const s = SERVICES[i];
      const images = await mediaIds(s.images);
      await upsertCollection('api::rw-service.rw-service', 'slug', s.slug, {
        slug: s.slug, name: s.name, tag: s.tag, homeDesc: s.homeDesc,
        intro: s.intro, ctaLabel: s.ctaLabel, descBlocks: s.descBlocks,
        order: i + 1, images,
      });
    }

    // 6. Tours
    log('Tours...');
    for (let i = 0; i < TOURS.length; i++) {
      const t = TOURS[i];
      const image = t.image ? await mediaId(t.image) : null;
      await upsertCollection('api::rw-tour.rw-tour', 'slug', t.slug, {
        slug: t.slug, name: t.name, duration: t.duration, difficulty: t.difficulty,
        price: t.price, included: !!t.included, blurb: t.blurb, highlight: t.highlight,
        internalLink: t.internalLink || null, featured: !!t.featured, order: i + 1,
        category: categoryId[t.category] || null,
        image, imageUrl: t.imageUrl || null,
      });
    }

    // 7. Team members
    log('Equipo...');
    for (let i = 0; i < TEAM.length; i++) {
      const m = TEAM[i];
      const image = await mediaId(m.img);
      // team has no slug/key; upsert by name
      await upsertCollection('api::rw-team-member.rw-team-member', 'name', m.name, {
        name: m.name, role: m.role, order: i + 1, image,
      });
    }

    // 8. Reviews
    log('Resenas...');
    for (let i = 0; i < REVIEWS.length; i++) {
      const r = REVIEWS[i];
      await upsertCollection('api::rw-review.rw-review', 'name', r.name, {
        name: r.name, quote: r.quote, source: r.source, rating: r.rating, order: i + 1,
      });
    }

    // 9. Single types
    log('Ajustes del sitio...');
    await upsertSingle('api::rw-site-setting.rw-site-setting', SITE_SETTING);

    log('Home...');
    const homeData = { ...HOME };
    homeData.essenceRevealImage = await mediaId(HOME.essenceRevealImage);
    homeData.stayImage = await mediaId(HOME.stayImage);
    await upsertSingle('api::rw-home.rw-home', homeData);

    log('Nosotros...');
    const aboutData = { ...ABOUT };
    aboutData.heroImage = await mediaId(ABOUT.heroImage);
    aboutData.storyImage = await mediaId(ABOUT.storyImage);
    aboutData.placeImage = await mediaId(ABOUT.placeImage);
    await upsertSingle('api::rw-about.rw-about', aboutData);

    log('Contacto...');
    await upsertSingle('api::rw-contact.rw-contact', CONTACT);

    log('Tours (pagina)...');
    await upsertSingle('api::rw-tours-page.rw-tours-page', TOURS_PAGE);

    log('LISTO. Seed completado en locale ES.');
  } catch (err) {
    console.error('[seed] ERROR:', err);
    process.exitCode = 1;
  } finally {
    await strapi.destroy();
  }
}

run();
