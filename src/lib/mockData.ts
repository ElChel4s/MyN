import { DateMemory, PlanItem } from './types';

export const INITIAL_MEMORIES: DateMemory[] = [
  {
    id: 'mem-1',
    title: 'Tarde de café, lluvia y gerberas en Sopocachi',
    scheduled_date: '26 Sep 2026',
    location_name: 'Typica Café Tostaduría',
    gerbera_color: 'purple',
    stamp_code: 'CITA #014',
    random_quote:
      '«Si nos quedamos diez minutos más, nos adoptan como parte de la decoración del jardín.»',
    person1_liked:
      'Qué buen plan fue pasar por la florería de la esquina antes de entrar por el café filtrado y sentarnos junto a la ventana.',
    person2_liked:
      'El cheesecake de maracuyá estaba brutal, pero lo mejor fue ponernos a garabatear ideas en la servilleta mientras llovía.',
    person1_nice_note:
      'Me encantó cómo te brillaron los ojos cuando viste las gerberas moradas al entrar y tu risa durante toda la tarde.',
    person2_nice_note:
      'Gracias por hacer que hasta una tarde nublada y con lluvia se sienta tan cálida y divertida cuando estamos charlando.',
    photos: [
      {
        id: 'p1',
        url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
        caption: 'Dos cafés calientes mientras caía la lluvia afuera',
        secret_back:
          'Intentamos hacer arte latte con la cuchara y terminó pareciendo un pulpo.',
        rotation: '-2deg'
      },
      {
        id: 'p2',
        url: 'https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=800&q=80',
        caption: 'Las gerberas que nos acompañaron toda la tarde',
        secret_back:
          'Guardamos un pétalo entre las hojas del cuaderno para tenerlo de recuerdo.',
        rotation: '2.5deg'
      }
    ]
  },
  {
    id: 'mem-2',
    title: 'Escapada sin planear al mirador para ver el atardecer',
    scheduled_date: '19 Sep 2026',
    location_name: 'Mirador Killi Killi',
    gerbera_color: 'teal',
    stamp_code: 'CITA #013',
    random_quote:
      '«No teníamos nada planeado a las 5:00 pm y a las 5:40 pm teníamos el mejor cielo violeta y turquesa del mes.»',
    person1_liked:
      'Esas salidas que salen de la nada con un "¿vamos ahorita?" siempre terminan siendo las más épicas. El cielo tenía colores increíbles.',
    person2_liked:
      'Llevamos sándwiches calientes y nos quedamos charlando hasta que se prendieron todas las luces de la ciudad.',
    person1_nice_note:
      'Admiro cómo siempre te apuntas a cualquier locura de último minuto con la mejor actitud del mundo.',
    person2_nice_note:
      'Me dio mucha ternura que trajeras el termo con té caliente para que no pasáramos frío allá arriba.',
    photos: [
      {
        id: 'p3',
        url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
        caption: 'Cuando el cielo se pintó de violeta y azul verdoso',
        secret_back:
          'Hacía frío pero el termo de té con canela nos salvó toda la tarde.',
        rotation: '2deg'
      },
      {
        id: 'p4',
        url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=800&q=80',
        caption: 'Colores bonitos que encontramos de subida',
        secret_back:
          'Quedamos en seguir armando más planes así de último minuto.',
        rotation: '-2.5deg'
      }
    ]
  },
  {
    id: 'mem-3',
    title: 'Noche de pastas caseras y música a todo volumen',
    scheduled_date: '29 Ago 2026',
    location_name: 'Cocina y Comedor',
    gerbera_color: 'aqua',
    stamp_code: 'CITA #012',
    random_quote:
      '«La salsa pesto quedó 10/10, aunque la mitad de la albahaca terminó decorando toda la mesada.»',
    person1_liked:
      'Cocinar sin apuro, con buena música de fondo y probando la salsa cada tres minutos fue tremendo plan de viernes.',
    person2_liked:
      'Me encantó emplatar como si fuéramos jurados de cocina y poner una gerbera en un frasquito de vidrio al centro.',
    person1_nice_note:
      'Haces que cocinar juntos sea divertidísimo, hasta cuando nos ponemos a cantar con las cucharas de madera.',
    person2_nice_note:
      'Te quedó increíble el toque final de la pasta, eres el mejor compañero de equipo en la cocina.',
    photos: [
      {
        id: 'p5',
        url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
        caption: 'Nuestra pasta con albahaca fresca recién salida',
        secret_back:
          'El truco secreto fue echarle doble queso parmesano y cantar mientras hervía el agua.',
        rotation: '-1.5deg'
      },
      {
        id: 'p6',
        url: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=800&q=80',
        caption: 'El toque de flores en la mesa antes de cenar',
        secret_back: 'Repetir sí o sí el próximo mes con pizza casera.',
        rotation: '2deg'
      }
    ]
  }
];

export const INITIAL_WISHLIST: PlanItem[] = [
  {
    id: 'wish-1',
    title: 'Picnic con acuarelas y flores en el Jardín Botánico',
    location_name: 'Jardín Botánico / Zona Sur',
    tentative_date: 'Algún sábado soleado',
    planning_notes:
      'Llevar un bloc de hojas gruesas, pinceles con agua, fruta picada, sanguchitos y una manta color turquesa.',
    reference_photo:
      'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=700&q=80',
    references: [
      {
        id: 'ref-1',
        label: 'Ubicación del Jardín en Maps',
        url: 'https://maps.google.com'
      },
      {
        id: 'ref-2',
        label: 'Ideas de bocetos fáciles en acuarela',
        url: 'https://pinterest.com'
      }
    ],
    checklist: [
      {
        id: 'c1',
        item: 'Conseguir acuarelas moradas y verde-agua',
        completed: true
      },
      {
        id: 'c2',
        item: 'Comprar pan rico y quesos de camino',
        completed: true
      },
      {
        id: 'c3',
        item: 'Pasar por gerberas frescas para dibujarlas',
        completed: false
      }
    ]
  },
  {
    id: 'wish-2',
    title: 'Taller de cerámica para pintar nuestras propias tazas',
    location_name: 'Taller de Cerámica Artesanal',
    tentative_date: '',
    planning_notes:
      'Ir un fin de semana por la mañana. La idea es que cada uno pinte y decore la taza del otro con flores y olas.',
    reference_photo:
      'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=700&q=80',
    references: [
      {
        id: 'ref-3',
        label: 'Instagram del taller de cerámica',
        url: 'https://instagram.com'
      }
    ],
    checklist: [
      {
        id: 'c5',
        item: 'Preguntar horarios disponibles',
        completed: true
      },
      {
        id: 'c6',
        item: 'Guardar ideas de diseños en colores pastel',
        completed: false
      }
    ]
  },
  {
    id: 'wish-3',
    title: 'Ruta de postres escondidos y cafetería nueva',
    location_name: 'Sopocachi / San Miguel',
    tentative_date: 'Cualquier tarde libre',
    planning_notes:
      'Ir probando un postre distinto en dos o tres lugares tranquilos y anotar cuál gana.',
    reference_photo:
      'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=700&q=80',
    references: [
      {
        id: 'ref-4',
        label: 'Lista de cafeterías recomendadas',
        url: 'https://maps.google.com'
      }
    ],
    checklist: [
      { id: 'c8', item: 'Elegir las 3 pastelerías candidatas', completed: true },
      { id: 'c9', item: 'Ir con hambre y sin apuro', completed: false }
    ]
  }
];
