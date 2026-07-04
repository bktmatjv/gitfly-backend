// ══════════════════════════════════════════════════════════════════════
//  Giftly — MongoDB Init & Seed Script
//  Tag: SEED_GIFTLY_G9_001
//
//  Ejecuta:
//    1. Selección de base de datos
//    2. Creación de colecciones e índices
//    3. Limpieza de datos de prueba anteriores (idempotente)
//    4. Inserción de datos de prueba ricos
//
//  CREDENCIALES DE PRUEBA (bcrypt rounds=10 — usa estas en Postman/curl):
//  ┌─────────────────────────────────┬──────────────────┬────────────────┐
//  │ email                           │ password         │ rol            │
//  ├─────────────────────────────────┼──────────────────┼────────────────┤
//  │ francesco.meza@upc.pe           │ Francesco123!    │ usuario normal │
//  │ matias.castillo@upc.pe          │ Matias123!       │ usuario normal │
//  │ sofia.garcia@upc.pe             │ Sofia123!        │ usuario normal │
//  │ diego.ramirez@upc.pe            │ Diego123!        │ usuario normal │
//  │ admin@giftly.com                │ Admin123!        │ administrador  │
//  └─────────────────────────────────┴──────────────────┴────────────────┘
// ══════════════════════════════════════════════════════════════════════

// ─── 1. Seleccionar base de datos ────────────────────────────────────
// La base de datos ya es seleccionada automáticamente por Docker a través
// de la variable MONGO_INITDB_DATABASE. No forzamos un nombre fijo.

print('📦 [1/4] Base de datos seleccionada (desde env).');

// ─── 2. Colecciones e índices ─────────────────────────────────────────
db.createCollection('users');
db.createCollection('wishlists');
db.createCollection('friendships');
db.createCollection('contributions');
db.createCollection('interactions');
db.createCollection('notifications');

// Índices — users
db.users.createIndex({ "cuenta.email": 1 }, { unique: true });
db.users.createIndex({ "cuenta.username": 1 }, { unique: true });
db.users.createIndex({ "metadata_sistema.fecha_registro": -1 });

// Índices — wishlists
db.wishlists.createIndex({ creador_id: 1 });
db.wishlists.createIndex({ "control_estado.estado_regalo": 1, creador_id: 1 });
db.wishlists.createIndex({ "evento.fecha_celebracion": 1 });

// Índices — friendships
db.friendships.createIndex(
    { solicitante_id: 1, receptor_id: 1 },
    { unique: true }
);
db.friendships.createIndex({ receptor_id: 1, "auditoria_relacion.estado_vinculo": 1 });

// Índices — contributions
db.contributions.createIndex({ wishlist_id: 1 });
db.contributions.createIndex({ usuario_id: 1 });

// Índices — interactions
db.interactions.createIndex({ wishlist_id: 1 });
db.interactions.createIndex({ usuario_id: 1 });

// Índices — notifications
db.notifications.createIndex({ usuario_destino_id: 1, "estado_lectura.leido": 1 });
db.notifications.createIndex({ "estado_lectura.fecha_emision": -1 });

print('✅ [2/4] Colecciones e índices creados.');

// ─── 3. Limpieza idempotente ──────────────────────────────────────────
const SEED = "SEED_GIFTLY_G9_001";

db.users.deleteMany({ "perfil.seed_tag": SEED });
db.friendships.deleteMany({ seed_tag: SEED });
db.wishlists.deleteMany({ seed_tag: SEED });
db.contributions.deleteMany({ seed_tag: SEED });
db.interactions.deleteMany({ seed_tag: SEED });
db.notifications.deleteMany({ seed_tag: SEED });

print('🧹 [3/4] Datos de prueba anteriores eliminados.');

// ─── 4. SEED DATA ─────────────────────────────────────────────────────
print('🌱 [4/4] Insertando datos de prueba...');

// ════════════════════════════════════
//  USUARIOS
// ════════════════════════════════════
// Hashes pre-computados con bcrypt (rounds=10). Contraseñas en la cabecera.
const HASH_FRANCESCO = "$2b$10$Nx6is4kNrNwLuSiWSfz.KeWWa.agXTGv7pM/gn9cYX5goVCNJsWqK";
const HASH_MATIAS = "$2b$10$Koud7IGj7DFnCqSw7akqGu/RrjpnpKCCoexWC0owoEDx.7jkYjw1i";
const HASH_SOFIA = "$2b$10$a4TpmhJe0VQWxQ0aXo.LFO/BuJcgm.dT/aWuw3J.1YNvpwsEdEvtG";
const HASH_DIEGO = "$2b$10$.pDJUWKO9WjUbKzN3p2OxO2N.zZ4c9jeUDq2FfMkuglSfYZLogg.q";
const HASH_ADMIN = "$2b$10$xB5Svu8Krg3Toas3UJQ/OOEyWt4hiBwLKarIaJPhNOnKwlzHkRtJm";

db.users.insertMany([
    // ── Usuario 1: Francesco (dueño principal de wishlists) ──────────────
    {
        codigo_alumno: "U202414738",
        cuenta: {
            username: "francesco_meza",
            email: "francesco.meza@upc.pe",
            password: HASH_FRANCESCO,
            estado_registro: "verificado"
        },
        perfil: {
            nombres: "Francesco",
            apellidos: "Meza Dagnino",
            biografia: "Compartiendo mis tableros de deseos. 🎁",
            avatar_url: "https://giftlystorage.blob.core.windows.net/media/avatars/francesco.png",
            seed_tag: SEED
        },
        metadata_sistema: {
            fecha_registro: new Date("2026-01-10T10:00:00Z"),
            ultimo_acceso: new Date("2026-06-20T15:30:00Z"),
            dispositivo_os: "iOS",
            cuenta_activa: true
        }
    },

    // ── Usuario 2: Matías (amigo y colaborador) ───────────────────────────
    {
        codigo_alumno: "U202310045",
        cuenta: {
            username: "matias_castillo",
            email: "matias.castillo@upc.pe",
            password: HASH_MATIAS,
            estado_registro: "verificado"
        },
        perfil: {
            nombres: "Matías",
            apellidos: "Del Castillo Ríos",
            biografia: "Organizando regalos grupales con estilo. 🎉",
            avatar_url: "https://giftlystorage.blob.core.windows.net/media/avatars/matias.png",
            seed_tag: SEED
        },
        metadata_sistema: {
            fecha_registro: new Date("2026-01-15T09:00:00Z"),
            ultimo_acceso: new Date("2026-06-21T11:00:00Z"),
            dispositivo_os: "Android",
            cuenta_activa: true
        }
    },

    // ── Usuario 3: Sofía (amiga, tiene su propia wishlist) ───────────────
    {
        codigo_alumno: "U202289017",
        cuenta: {
            username: "sofia_garcia",
            email: "sofia.garcia@upc.pe",
            password: HASH_SOFIA,
            estado_registro: "verificado"
        },
        perfil: {
            nombres: "Sofía",
            apellidos: "García Villanueva",
            biografia: "Amante de los regalos creativos y personalizados ✨",
            avatar_url: "https://giftlystorage.blob.core.windows.net/media/avatars/sofia.png",
            seed_tag: SEED
        },
        metadata_sistema: {
            fecha_registro: new Date("2026-02-01T08:00:00Z"),
            ultimo_acceso: new Date("2026-06-19T18:45:00Z"),
            dispositivo_os: "iOS",
            cuenta_activa: true
        }
    },

    // ── Usuario 4: Diego (amigo pendiente de aceptar solicitud) ──────────
    {
        codigo_alumno: "U202367823",
        cuenta: {
            username: "diego_ramirez",
            email: "diego.ramirez@upc.pe",
            password: HASH_DIEGO,
            estado_registro: "verificado"
        },
        perfil: {
            nombres: "Diego",
            apellidos: "Ramírez Torres",
            biografia: "Fan de los gadgets y la tecnología 🖥️",
            avatar_url: "https://giftlystorage.blob.core.windows.net/media/avatars/diego.png",
            seed_tag: SEED
        },
        metadata_sistema: {
            fecha_registro: new Date("2026-03-10T14:00:00Z"),
            ultimo_acceso: new Date("2026-06-15T10:00:00Z"),
            dispositivo_os: "Android",
            cuenta_activa: true
        }
    },

    // ── Usuario 5: Admin ──────────────────────────────────────────────────
    {
        codigo_alumno: "ADMIN-001",
        cuenta: {
            username: "admin_giftly",
            email: "admin@giftly.com",
            password: HASH_ADMIN,
            estado_registro: "verificado"
        },
        perfil: {
            nombres: "Admin",
            apellidos: "Giftly",
            biografia: "Cuenta administrativa del sistema.",
            avatar_url: "https://giftlystorage.blob.core.windows.net/media/avatars/admin.png",
            seed_tag: SEED
        },
        metadata_sistema: {
            fecha_registro: new Date("2026-01-01T00:00:00Z"),
            ultimo_acceso: new Date(),
            dispositivo_os: "Web",
            cuenta_activa: true
        }
    }
]);

// Recuperar IDs de los usuarios insertados
var u_francesco = db.users.findOne({ "cuenta.email": "francesco.meza@upc.pe" })._id;
var u_matias = db.users.findOne({ "cuenta.email": "matias.castillo@upc.pe" })._id;
var u_sofia = db.users.findOne({ "cuenta.email": "sofia.garcia@upc.pe" })._id;
var u_diego = db.users.findOne({ "cuenta.email": "diego.ramirez@upc.pe" })._id;

print('  👤 5 usuarios insertados.');

// ════════════════════════════════════
//  FRIENDSHIPS
//  Estado del grafo social:
//    Francesco ↔ Matías  → aceptado
//    Francesco ↔ Sofía   → aceptado
//    Francesco ↔ Diego   → pendiente (Francesco envió)
//    Matías    ↔ Sofía   → aceptado
// ════════════════════════════════════
db.friendships.insertMany([
    {
        seed_tag: SEED,
        solicitante_id: u_francesco,
        receptor_id: u_matias,
        auditoria_relacion: {
            estado_vinculo: "aceptado",
            fecha_solicitud: new Date("2026-01-20T10:00:00Z"),
            fecha_respuesta: new Date("2026-01-20T12:30:00Z")
        },
        configuracion: {
            nivel_prioridad: "destacado",
            recibir_notificaciones: true
        }
    },
    {
        seed_tag: SEED,
        solicitante_id: u_francisco = u_francesco,
        receptor_id: u_sofia,
        auditoria_relacion: {
            estado_vinculo: "aceptado",
            fecha_solicitud: new Date("2026-02-05T09:00:00Z"),
            fecha_respuesta: new Date("2026-02-05T11:00:00Z")
        },
        configuracion: {
            nivel_prioridad: "normal",
            recibir_notificaciones: true
        }
    },
    {
        seed_tag: SEED,
        solicitante_id: u_francesco,
        receptor_id: u_diego,
        auditoria_relacion: {
            estado_vinculo: "pendiente",
            fecha_solicitud: new Date("2026-06-18T14:00:00Z"),
            fecha_respuesta: null
        },
        configuracion: {
            nivel_prioridad: "normal",
            recibir_notificaciones: true
        }
    },
    {
        seed_tag: SEED,
        solicitante_id: u_matias,
        receptor_id: u_sofia,
        auditoria_relacion: {
            estado_vinculo: "aceptado",
            fecha_solicitud: new Date("2026-02-10T08:00:00Z"),
            fecha_respuesta: new Date("2026-02-10T16:00:00Z")
        },
        configuracion: {
            nivel_prioridad: "normal",
            recibir_notificaciones: true
        }
    }
]);

print('  🤝 4 friendships insertadas.');

// ════════════════════════════════════
//  WISHLISTS
//  - WL1: Zapatillas de Francesco (financiamiento grupal, en progreso)
//  - WL2: Auriculares Sony de Francesco (financiamiento grupal, casi completo)
//  - WL3: Kindle de Sofía (sin financiamiento grupal)
//  - WL4: Silla Gamer de Matías (financiamiento grupal, recién creada)
// ════════════════════════════════════
db.wishlists.insertMany([
    // ── WL1: Zapatillas ──────────────────────────────────────────────────
    {
        seed_tag: SEED,
        creador_id: u_francesco,
        evento: {
            titulo: "Cumpleaños Francesco 2026",
            descripcion: "Tablero principal para coordinar el regalo de grupo.",
            fecha_celebracion: new Date("2026-06-15T00:00:00Z"),
            categoria: "cumpleaños"
        },
        item_regalo: {
            nombre: "Zapatillas Nike Running React",
            tienda_sugerida: "Nike Store Miraflores",
            url_referencia: "https://www.nike.com.pe/zapatillas-running-react",
            precio_estimado: 120.50,
            divisa: "USD",
            prioridad_deseo: "Alta"
        },
        recursos_multimedia: {
            imagen_url: "https://giftlystorage.blob.core.windows.net/media/regalos/zapatillas_nike.jpg",
            video_review_url: "https://giftlystorage.blob.core.windows.net/media/videos/review-zapatillas.mp4"
        },
        control_estado: {
            estado_regalo: "Activa",
            permite_financiamiento: true,
            fecha_creacion: new Date("2026-05-01T10:00:00Z"),
            ultima_modificacion: new Date("2026-06-10T09:00:00Z")
        }
    },

    // ── WL2: Auriculares ─────────────────────────────────────────────────
    {
        seed_tag: SEED,
        creador_id: u_francesco,
        evento: {
            titulo: "Graduación UPC 2026",
            descripcion: "Regalo de graduación que tanto soñé.",
            fecha_celebracion: new Date("2026-12-10T00:00:00Z"),
            categoria: "graduación"
        },
        item_regalo: {
            nombre: "Sony WH-1000XM5 Auriculares Noise Cancelling",
            tienda_sugerida: "Falabella Lima",
            url_referencia: "https://www.falabella.com.pe/sony-wh1000xm5",
            precio_estimado: 350.00,
            divisa: "USD",
            prioridad_deseo: "Alta"
        },
        recursos_multimedia: {
            imagen_url: "https://giftlystorage.blob.core.windows.net/media/regalos/sony_xm5.jpg",
            video_review_url: null
        },
        control_estado: {
            estado_regalo: "Activa",
            permite_financiamiento: true,
            fecha_creacion: new Date("2026-06-01T08:00:00Z"),
            ultima_modificacion: new Date("2026-06-20T12:00:00Z")
        }
    },

    // ── WL3: Kindle (Sofía) ───────────────────────────────────────────────
    {
        seed_tag: SEED,
        creador_id: u_sofia,
        evento: {
            titulo: "Lista de deseos Sofía — Julio 2026",
            descripcion: "Para cualquier ocasión especial.",
            fecha_celebracion: new Date("2026-07-20T00:00:00Z"),
            categoria: "general"
        },
        item_regalo: {
            nombre: "Amazon Kindle Paperwhite 11va gen",
            tienda_sugerida: "Amazon.com",
            url_referencia: "https://www.amazon.com/kindle-paperwhite",
            precio_estimado: 139.99,
            divisa: "USD",
            prioridad_deseo: "Media"
        },
        recursos_multimedia: {
            imagen_url: "https://giftlystorage.blob.core.windows.net/media/regalos/kindle.jpg",
            video_review_url: null
        },
        control_estado: {
            estado_regalo: "Activa",
            permite_financiamiento: false,
            fecha_creacion: new Date("2026-06-05T11:00:00Z"),
            ultima_modificacion: new Date("2026-06-05T11:00:00Z")
        }
    },

    // ── WL4: Silla Gamer (Matías) ─────────────────────────────────────────
    {
        seed_tag: SEED,
        creador_id: u_matias,
        evento: {
            titulo: "Aniversario Matías & amigos — Setup Gaming",
            descripcion: "Para el setup definitivo de streaming.",
            fecha_celebracion: new Date("2026-08-05T00:00:00Z"),
            categoria: "otro"
        },
        item_regalo: {
            nombre: "Silla Gamer DXRacer Formula Series",
            tienda_sugerida: "Linio Perú",
            url_referencia: "https://www.linio.com.pe/dxracer-formula",
            precio_estimado: 280.00,
            divisa: "USD",
            prioridad_deseo: "Alta"
        },
        recursos_multimedia: {
            imagen_url: "https://giftlystorage.blob.core.windows.net/media/regalos/silla_gamer.jpg",
            video_review_url: "https://giftlystorage.blob.core.windows.net/media/videos/review-silla.mp4"
        },
        control_estado: {
            estado_regalo: "Activa",
            permite_financiamiento: true,
            fecha_creacion: new Date("2026-06-15T10:00:00Z"),
            ultima_modificacion: new Date("2026-06-15T10:00:00Z")
        }
    }
]);

var wl_zapatillas = db.wishlists.findOne({ "item_regalo.nombre": "Zapatillas Nike Running React" })._id;
var wl_auriculares = db.wishlists.findOne({ "item_regalo.nombre": { $regex: "Sony" } })._id;
var wl_kindle = db.wishlists.findOne({ "item_regalo.nombre": { $regex: "Kindle" } })._id;
var wl_silla = db.wishlists.findOne({ "item_regalo.nombre": { $regex: "DXRacer" } })._id;

print('  🎁 4 wishlists insertadas.');

// ════════════════════════════════════
//  CONTRIBUTIONS
//  WL1 (Zapatillas $120.50):
//    - Matías: $50.00 (Yape, confirmado)
//    - Sofía:  $35.00 (Plin, confirmado)
//    → Total: $85.00 / $120.50 = 70.54%
//
//  WL2 (Auriculares $350.00):
//    - Matías: $100.00 (Yape, confirmado)
//    - Sofía:  $100.00 (BCP, confirmado)
//    - Diego:  $100.00 (Yape, pendiente)
//    → Total confirmado: $200.00 / $350.00 = 57.14%
//
//  WL4 (Silla Gamer $280.00):
//    - Francesco: $80.00 (Yape, confirmado)
// ════════════════════════════════════
db.contributions.insertMany([
    // ── WL1 — Aporte 1: Matías ────────────────────────────────────────────
    {
        seed_tag: SEED,
        wishlist_id: wl_zapatillas,
        usuario_id: u_matias,
        aporte_id: 1,
        nombre_aportante: "Matías Del Castillo Ríos",
        monto_aportado: 50.00,
        pasarela_pago: "Yape",
        auditoria_pago: {
            numero_operacion: "YAPE-98561040",
            timestamp: new Date("2026-05-15T10:30:00Z"),
            pago_confirmado: true
        },
        resumen_financiero: {
            monto_meta: 120.50,
            monto_actual: 50.00,
            monto_restante: 70.50,
            divisa: "USD",
            estado_fondos: "en_progreso",
            porcentaje_completado: 41.49
        }
    },

    // ── WL1 — Aporte 2: Sofía ─────────────────────────────────────────────
    {
        seed_tag: SEED,
        wishlist_id: wl_zapatillas,
        usuario_id: u_sofia,
        aporte_id: 2,
        nombre_aportante: "Sofía García Villanueva",
        monto_aportado: 35.00,
        pasarela_pago: "Plin",
        auditoria_pago: {
            numero_operacion: "PLIN-44812093",
            timestamp: new Date("2026-05-18T14:00:00Z"),
            pago_confirmado: true
        },
        resumen_financiero: {
            monto_meta: 120.50,
            monto_actual: 85.00,
            monto_restante: 35.50,
            divisa: "USD",
            estado_fondos: "en_progreso",
            porcentaje_completado: 70.54
        }
    },

    // ── WL2 — Aporte 1: Matías ────────────────────────────────────────────
    {
        seed_tag: SEED,
        wishlist_id: wl_auriculares,
        usuario_id: u_matias,
        aporte_id: 1,
        nombre_aportante: "Matías Del Castillo Ríos",
        monto_aportado: 100.00,
        pasarela_pago: "Yape",
        auditoria_pago: {
            numero_operacion: "YAPE-20340221",
            timestamp: new Date("2026-06-10T09:00:00Z"),
            pago_confirmado: true
        },
        resumen_financiero: {
            monto_meta: 350.00,
            monto_actual: 100.00,
            monto_restante: 250.00,
            divisa: "USD",
            estado_fondos: "en_progreso",
            porcentaje_completado: 28.57
        }
    },

    // ── WL2 — Aporte 2: Sofía ─────────────────────────────────────────────
    {
        seed_tag: SEED,
        wishlist_id: wl_auriculares,
        usuario_id: u_sofia,
        aporte_id: 2,
        nombre_aportante: "Sofía García Villanueva",
        monto_aportado: 100.00,
        pasarela_pago: "BCP Transferencia",
        auditoria_pago: {
            numero_operacion: "BCP-00419852TRF",
            timestamp: new Date("2026-06-12T16:00:00Z"),
            pago_confirmado: true
        },
        resumen_financiero: {
            monto_meta: 350.00,
            monto_actual: 200.00,
            monto_restante: 150.00,
            divisa: "USD",
            estado_fondos: "en_progreso",
            porcentaje_completado: 57.14
        }
    },

    // ── WL2 — Aporte 3: Diego (pendiente de confirmación) ─────────────────
    {
        seed_tag: SEED,
        wishlist_id: wl_auriculares,
        usuario_id: u_diego,
        aporte_id: 3,
        nombre_aportante: "Diego Ramírez Torres",
        monto_aportado: 100.00,
        pasarela_pago: "Yape",
        auditoria_pago: {
            numero_operacion: "YAPE-77123456",
            timestamp: new Date("2026-06-19T20:00:00Z"),
            pago_confirmado: false   // ← Aun no confirmado, útil para probar estados
        },
        resumen_financiero: {
            monto_meta: 350.00,
            monto_actual: 200.00,   // No cambia hasta confirmar
            monto_restante: 150.00,
            divisa: "USD",
            estado_fondos: "en_progreso",
            porcentaje_completado: 57.14
        }
    },

    // ── WL4 — Aporte 1: Francesco ─────────────────────────────────────────
    {
        seed_tag: SEED,
        wishlist_id: wl_silla,
        usuario_id: u_francesco,
        aporte_id: 1,
        nombre_aportante: "Francesco Meza Dagnino",
        monto_aportado: 80.00,
        pasarela_pago: "Yape",
        auditoria_pago: {
            numero_operacion: "YAPE-55098123",
            timestamp: new Date("2026-06-16T12:00:00Z"),
            pago_confirmado: true
        },
        resumen_financiero: {
            monto_meta: 280.00,
            monto_actual: 80.00,
            monto_restante: 200.00,
            divisa: "USD",
            estado_fondos: "en_progreso",
            porcentaje_completado: 28.57
        }
    }
]);

print('  💰 6 contributions insertadas.');

// ════════════════════════════════════
//  INTERACTIONS
//  (cada usuario_id + wishlist_id es único por documento)
// ════════════════════════════════════
db.interactions.insertMany([
    // ── Matías reacciona y comenta en WL1 (Zapatillas de Francesco) ───────
    {
        seed_tag: SEED,
        usuario_id: u_matias,
        wishlist_id: wl_zapatillas,
        reacciones: [
            {
                nombre: "Matías Del Castillo Ríos",
                tipo_reaccion: "me_gusta",
                timestamp: new Date("2026-05-10T08:00:00Z")
            }
        ],
        comentarios: [
            {
                contenido_texto: "¡Me uno al regalo grupal! Avisen cuando completen la meta.",
                nombre_autor: "Matías Del Castillo Ríos",
                moderado: false,
                timestamp: new Date("2026-05-10T08:05:00Z")
            }
        ],
        metricas_sociales: {
            total_likes: 1,
            total_comentarios: 1
        }
    },

    // ── Sofía reacciona y comenta en WL1 (Zapatillas de Francesco) ────────
    {
        seed_tag: SEED,
        usuario_id: u_sofia,
        wishlist_id: wl_zapatillas,
        reacciones: [
            {
                nombre: "Sofía García Villanueva",
                tipo_reaccion: "me_encanta",
                timestamp: new Date("2026-05-11T09:00:00Z")
            }
        ],
        comentarios: [
            {
                contenido_texto: "Ya hice mi aporte por Plin 🎁 ¡Espero que te gusten, Francesco!",
                nombre_autor: "Sofía García Villanueva",
                moderado: false,
                timestamp: new Date("2026-05-18T14:10:00Z")
            }
        ],
        metricas_sociales: {
            total_likes: 1,
            total_comentarios: 1
        }
    },

    // ── Francesco reacciona en WL4 (Silla Gamer de Matías) ───────────────
    {
        seed_tag: SEED,
        usuario_id: u_francesco,
        wishlist_id: wl_silla,
        reacciones: [
            {
                nombre: "Francesco Meza Dagnino",
                tipo_reaccion: "me_gusta",
                timestamp: new Date("2026-06-16T08:00:00Z")
            }
        ],
        comentarios: [
            {
                contenido_texto: "Genial elección, esa silla es brutal. Ya aporté 💪",
                nombre_autor: "Francesco Meza Dagnino",
                moderado: false,
                timestamp: new Date("2026-06-16T08:10:00Z")
            }
        ],
        metricas_sociales: {
            total_likes: 1,
            total_comentarios: 1
        }
    },

    // ── Matías reacciona en WL3 (Kindle de Sofía) ────────────────────────
    {
        seed_tag: SEED,
        usuario_id: u_matias,
        wishlist_id: wl_kindle,
        reacciones: [
            {
                nombre: "Matías Del Castillo Ríos",
                tipo_reaccion: "me_gusta",
                timestamp: new Date("2026-06-06T10:00:00Z")
            }
        ],
        comentarios: [],
        metricas_sociales: {
            total_likes: 1,
            total_comentarios: 0
        }
    }
]);

print('  ❤️  4 interactions insertadas.');

// ════════════════════════════════════
//  NOTIFICATIONS
//  Distintos tipos de alerta para cubrir todos los casos de prueba:
//    - wishlist_actualizada
//    - nuevo_aporte
//    - solicitud_amistad
//    - comentario_recibido
//    - aporte_confirmado
// ════════════════════════════════════
db.notifications.insertMany([
    // ── Francesco: nuevo aporte de Matías en sus zapatillas ───────────────
    {
        seed_tag: SEED,
        usuario_destino_id: u_francesco,
        evento_origen: {
            tipo_alerta: "nuevo_aporte",
            entidad_origen_id: wl_zapatillas,
            disparador_notificacion: "Matías Del Castillo Ríos"
        },
        contenido_notificacion: {
            mensaje_corto: "Matías aportó $50.00 a tu wishlist 'Zapatillas Nike Running React'.",
            accion_click: "/app/wishlists/" + wl_zapatillas
        },
        estado_lectura: {
            leido: true,
            fecha_emision: new Date("2026-05-15T10:31:00Z"),
            fecha_lectura: new Date("2026-05-15T11:00:00Z")
        }
    },

    // ── Francesco: nuevo aporte de Sofía ─────────────────────────────────
    {
        seed_tag: SEED,
        usuario_destino_id: u_francesco,
        evento_origen: {
            tipo_alerta: "nuevo_aporte",
            entidad_origen_id: wl_zapatillas,
            disparador_notificacion: "Sofía García Villanueva"
        },
        contenido_notificacion: {
            mensaje_corto: "Sofía aportó $35.00 a tu wishlist. Ya vas al 70%! 🎉",
            accion_click: "/app/wishlists/" + wl_zapatillas
        },
        estado_lectura: {
            leido: true,
            fecha_emision: new Date("2026-05-18T14:01:00Z"),
            fecha_lectura: new Date("2026-05-18T16:30:00Z")
        }
    },

    // ── Francesco: comentario de Sofía (sin leer) ─────────────────────────
    {
        seed_tag: SEED,
        usuario_destino_id: u_francesco,
        evento_origen: {
            tipo_alerta: "comentario_recibido",
            entidad_origen_id: wl_zapatillas,
            disparador_notificacion: "Sofía García Villanueva"
        },
        contenido_notificacion: {
            mensaje_corto: "Sofía comentó en tu wishlist 'Zapatillas Nike Running React'.",
            accion_click: "/app/wishlists/" + wl_zapatillas
        },
        estado_lectura: {
            leido: false,
            fecha_emision: new Date("2026-05-18T14:10:00Z"),
            fecha_lectura: null
        }
    },

    // ── Matías: solicitud de amistad de Francesco (sin leer) ──────────────
    {
        seed_tag: SEED,
        usuario_destino_id: u_diego,
        evento_origen: {
            tipo_alerta: "solicitud_amistad",
            entidad_origen_id: u_francesco,
            disparador_notificacion: "Francesco Meza Dagnino"
        },
        contenido_notificacion: {
            mensaje_corto: "Francesco Meza quiere agregarte como amigo en Giftly.",
            accion_click: "/app/friends/requests"
        },
        estado_lectura: {
            leido: false,
            fecha_emision: new Date("2026-06-18T14:01:00Z"),
            fecha_lectura: null
        }
    },

    // ── Sofía: su wishlist fue vista por Matías ───────────────────────────
    {
        seed_tag: SEED,
        usuario_destino_id: u_sofia,
        evento_origen: {
            tipo_alerta: "wishlist_actualizada",
            entidad_origen_id: wl_kindle,
            disparador_notificacion: "Matías Del Castillo Ríos"
        },
        contenido_notificacion: {
            mensaje_corto: "Matías reaccionó a tu wishlist 'Amazon Kindle Paperwhite'.",
            accion_click: "/app/wishlists/" + wl_kindle
        },
        estado_lectura: {
            leido: false,
            fecha_emision: new Date("2026-06-06T10:01:00Z"),
            fecha_lectura: null
        }
    },

    // ── Matías: aporte de Francesco en su silla confirmado ────────────────
    {
        seed_tag: SEED,
        usuario_destino_id: u_matias,
        evento_origen: {
            tipo_alerta: "aporte_confirmado",
            entidad_origen_id: wl_silla,
            disparador_notificacion: "Francesco Meza Dagnino"
        },
        contenido_notificacion: {
            mensaje_corto: "¡Francesco confirmó su aporte de $80.00 en tu wishlist! 🎉",
            accion_click: "/app/wishlists/" + wl_silla
        },
        estado_lectura: {
            leido: true,
            fecha_emision: new Date("2026-06-16T12:01:00Z"),
            fecha_lectura: new Date("2026-06-16T12:30:00Z")
        }
    }
]);

print('  🔔 6 notifications insertadas.');

// ─── Resumen final ────────────────────────────────────────────────────
print('');
print('═══════════════════════════════════════════════════════════');
print('  ✅ Giftly DB inicializada correctamente.');
print('  📊 Resumen:');
print('     • users:         ' + db.users.countDocuments({ "perfil.seed_tag": SEED }));
print('     • friendships:   ' + db.friendships.countDocuments({ seed_tag: SEED }));
print('     • wishlists:     ' + db.wishlists.countDocuments({ seed_tag: SEED }));
print('     • contributions: ' + db.contributions.countDocuments({ seed_tag: SEED }));
print('     • interactions:  ' + db.interactions.countDocuments({ seed_tag: SEED }));
print('     • notifications: ' + db.notifications.countDocuments({ seed_tag: SEED }));
print('═══════════════════════════════════════════════════════════');
