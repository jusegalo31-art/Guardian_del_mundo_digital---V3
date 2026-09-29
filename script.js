/**
 * ==========================================================================
 * DETECTIVES DIGITALES - MOTOR EDUCATIVO INTERACTIVO (VANILLA JAVASCRIPT)
 * Nivel: 4.º Primaria (9-10 años)
 * Modelo Pedagógico: OBSERVAR → INVESTIGAR → RELACIONAR → DECIDIR → COMPROBAR → REFLEXIONAR
 * 100% Offline • Sin librerías externas • Audio sintético Web Audio API
 * ==========================================================================
 */

(function () {
  'use strict';

  /* ========================================================================
     1. SISTEMA DE AUDIO SINTÉTICO (WEB AUDIO API - 100% OFFLINE)
     ======================================================================== */
  class SoundController {
    constructor() {
      this.enabled = true;
      this.ctx = null;
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    toggle() {
      this.enabled = !this.enabled;
      return this.enabled;
    }

    playTone(freq, type, duration, delay = 0, gainLevel = 0.15) {
      if (!this.enabled) return;
      try {
        this.init();
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + delay);

        gain.gain.setValueAtTime(gainLevel, this.ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + delay + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + delay);
        osc.stop(this.ctx.currentTime + delay + duration);
      } catch (e) {
        // Fallback silencioso si el audio está bloqueado por el navegador
      }
    }

    playClueFound() {
      // Tono de descubrimiento de pista (lupa misteriosa)
      this.playTone(523.25, 'sine', 0.15, 0, 0.2); // C5
      this.playTone(659.25, 'sine', 0.25, 0.12, 0.2); // E5
      this.playTone(783.99, 'triangle', 0.35, 0.24, 0.25); // G5
    }

    playSuccess() {
      // Fanfarria breve de caso resuelto
      this.playTone(440, 'triangle', 0.15, 0, 0.2);
      this.playTone(554.37, 'triangle', 0.15, 0.1, 0.2);
      this.playTone(659.25, 'triangle', 0.2, 0.2, 0.2);
      this.playTone(880, 'sine', 0.45, 0.32, 0.25);
    }

    playWarning() {
      // Tono de precaución / alerta
      this.playTone(320, 'sawtooth', 0.15, 0, 0.12);
      this.playTone(280, 'sawtooth', 0.25, 0.15, 0.12);
    }

    playClick() {
      // Clic suave de interfaz
      this.playTone(800, 'sine', 0.04, 0, 0.08);
    }

    playError() {
      // Tono de deducción incorrecta
      this.playTone(220, 'square', 0.2, 0, 0.1);
      this.playTone(196, 'square', 0.3, 0.18, 0.1);
    }
  }

  const sound = new SoundController();

  /* ========================================================================
     2. BASE DE DATOS DE CASOS PEDAGÓGICOS (6 CASOS + RETO FINAL)
     ======================================================================== */
  const CASES_DATA = [
    {
      id: 1,
      title: "El Computador en Peligro",
      concept: "Cuidar los dispositivos y el espacio",
      icon: "🖥️",
      skillKey: "responsibility",
      desc: "Un equipo en el aula escolar está expuesto a varios riesgos silenciosos. Encuentra qué elementos amenazan el computador y organízalo de forma segura.",
      hintText: "Examina los líquidos cerca del teclado, los cables sueltos en el suelo y objetos pesados sobre las teclas.",
      remember: {
        quote: "Un dispositivo seguro empieza por un espacio de trabajo limpio, ordenado y sin líquidos.",
        explanation: "Los líquidos pueden provocar cortocircuitos irreparables, los cables en el suelo causan caídas y golpes, y el calor solar directo daña la pantalla y la batería.",
        skill: "Responsabilidad (+1⭐)"
      },
      stages: [
        {
          num: 1,
          type: "hotspot-search",
          instruction: "Explora la escena del aula. Haz clic sobre los 5 elementos sospechosos que ponen en riesgo el equipo.",
          targetCount: 5,
          items: [
            { id: "water", name: "Vaso de agua", icon: "💧", isClue: true, clueNote: "Líquido al borde de la mesa: riesgo alto de derrame." },
            { id: "food", name: "Galletas con migajas", icon: "🍪", isClue: true, clueNote: "Comida sobre la mesa: las migajas traban las teclas." },
            { id: "cable", name: "Cable cruzando el paso", icon: "🔌", isClue: true, clueNote: "Cable en el suelo: alguien puede tropezar y tirar la torre." },
            { id: "sun", name: "Sol directo en pantalla", icon: "☀️", isClue: true, clueNote: "Luz solar directa: sobrecalienta la pantalla y el equipo." },
            { id: "backpack", name: "Mochila pesada", icon: "🎒", isClue: true, clueNote: "Mochila encima del teclado o mal ubicada." },
            { id: "cloth", name: "Paño de microfibra", icon: "🧽", isClue: false, clueNote: "Elemento seguro: sirve para limpiar la pantalla sin rayarla." },
            { id: "mousepad", name: "Alfombrilla limpia", icon: "🖱️", isClue: false, clueNote: "Elemento seguro: protege la base del ratón." }
          ]
        },
        {
          num: 2,
          type: "sequence-filter",
          instruction: "El computador necesita ser preparado antes de usarlo. Ordena las 3 acciones correctas y descarta las peligrosas.",
          correctOrder: ["hands", "cables", "posture"],
          options: [
            { id: "hands", text: "Lavarse y secarse muy bien las manos", icon: "🧼", safe: true },
            { id: "drink", text: "Colocar un refresco abierto al lado del teclado", icon: "🥤", safe: false },
            { id: "cables", text: "Revisar que cables y enchufes estén firmes y seguros", icon: "🔌", safe: true },
            { id: "hit", text: "Golpear las teclas con fuerza para probarlas", icon: "🔨", safe: false },
            { id: "backpack_on", text: "Poner la mochila encima del teclado para ahorrar espacio", icon: "🎒", safe: false },
            { id: "posture", text: "Ajustar la silla y sentarse con buena postura", icon: "🪑", safe: true }
          ]
        },
        {
          num: 3,
          type: "transfer-ordering",
          instruction: "RETO DE REFLEXIÓN: Estás en casa y necesitas transportar una tableta a otra habitación. Ordena los 4 pasos seguros.",
          correctOrder: ["unplug", "cover", "walk", "flat_desk"],
          steps: [
            { id: "unplug", text: "1. Desconectar el cable de carga con suavidad sin tirar del cable.", icon: "🔌" },
            { id: "cover", text: "2. Sujetarla con ambas manos firmes o cerrar su funda protectora.", icon: "🤲" },
            { id: "walk", text: "3. Caminar despacio mirando el suelo sin correr ni saltar.", icon: "🚶" },
            { id: "flat_desk", text: "4. Apoyarla en el centro de una mesa plana lejos de los bordes.", icon: "🗄️" }
          ]
        }
      ]
    },

    {
      id: 2,
      title: "La Aplicación Misteriosa",
      concept: "No instalar programas sin permiso",
      icon: "📦",
      skillKey: "security",
      desc: "Aparece una ventana que promete un 'Super Juego Gratis'. Descubre las señales de alerta antes de tomar cualquier decisión de descarga.",
      hintText: "Revisa quién es el autor, qué permisos extraños pide (cámara/ubicación) y si te meten prisa innecesaria.",
      remember: {
        quote: "Antes de instalar algo: detente, investiga y consulta siempre con un adulto.",
        explanation: "Los programas de creadores desconocidos pueden incluir virus o pedir permisos para vigilar tu cámara y ubicación sin que lo notes.",
        skill: "Seguridad (+1⭐)"
      },
      stages: [
        {
          num: 1,
          type: "evidence-board",
          instruction: "Haz clic sobre las 4 pistas sospechosas en la ventana del instalador para agregarlas al Tablero de Evidencias.",
          targetCount: 4,
          clues: [
            { id: "author", label: "Autor: 'Desconocido / Anónimo'", note: "No conocemos al creador ni su reputación escolar.", found: false },
            { id: "perms", label: "Permisos: Cámara 📷, Micrófono 🎙️ y Ubicación 📍", note: "Un juego simple no necesita saber dónde vives ni escuchar tu casa.", found: false },
            { id: "urgency", label: "Mensaje: '¡Instálalo YA antes de que se agote!'", note: "Presión para actuar de prisa sin pensar.", found: false },
            { id: "no_auth", label: "Aviso: 'Sin verificación del docente ni antivirus'", note: "No cuenta con autorización ni filtro de seguridad.", found: false }
          ]
        },
        {
          num: 2,
          type: "sequence-safe",
          instruction: "Construye la secuencia de seguridad correcta para actuar ante una descarga misteriosa.",
          correctOrder: ["stop", "inspect", "consult", "verify"],
          options: [
            { id: "stop", text: "1. Detenerse y no hacer clic en 'Instalar'", icon: "🛑" },
            { id: "inspect", text: "2. Revisar autor, comentarios y permisos solicitados", icon: "🔍" },
            { id: "consult", text: "3. Consultar al docente o a tus padres con la pantalla abierta", icon: "🗣️" },
            { id: "verify", text: "4. Instalar únicamente si un adulto lo aprueba y es seguro", icon: "✅" }
          ]
        },
        {
          num: 3,
          type: "decision-evidence",
          instruction: "RETO DE REFLEXIÓN: Una app de fondos de pantalla que ya tenías instalada pide actualizarse y solicita acceso a todos tus contactos y micrófono. ¿Qué debes hacer y por qué?",
          question: "¿Cuál es la decisión correcta?",
          choices: [
            { id: "cancel_ask", text: "Cancelar la actualización y consultar a un adulto", correct: true },
            { id: "accept_fast", text: "Aceptar rápido para tener los fondos nuevos", correct: false },
            { id: "share_friends", text: "Compartirla con tus amigos para ver si a ellos les funciona", correct: false }
          ],
          justifications: [
            { id: "j1", text: "Una app de imágenes no necesita escuchar mi micrófono", isEvidence: true },
            { id: "j2", text: "Los contactos son datos privados de mis amigos y familia", isEvidence: true },
            { id: "j3", text: "Porque si es gratis nada malo puede pasar", isEvidence: false },
            { id: "j4", text: "Las actualizaciones pueden cambiar permisos sin previo aviso", isEvidence: true }
          ]
        }
      ]
    },

    {
      id: 3,
      title: "El Robo de Información",
      concept: "No compartir información personal",
      icon: "🔐",
      skillKey: "security",
      desc: "En un chat llegan preguntas aparentemente comunes. Algunas parecen inofensivas, pero combinadas pueden permitir a extraños saber todo sobre ti.",
      hintText: "Tu dirección, colegio, horarios y contraseña son privados. Tus gustos como color o animal favorito son generales.",
      remember: {
        quote: "Tu información personal es tu mayor tesoro: protégela y no la regales.",
        explanation: "Preguntas como '¿A qué hora sales?' o '¿En qué salón estás?' pueden parecer inocentes, pero unidas revelan tu rutina exacta a desconocidos.",
        skill: "Seguridad (+1⭐)"
      },
      stages: [
        {
          num: 1,
          type: "chat-inspection",
          instruction: "Lee los mensajes recibidos en el chat. Haz clic sobre los 4 datos que representan información personal de alto riesgo.",
          targetCount: 4,
          messages: [
            { id: "c1", sender: "Alex (Amigo)", text: "¿Cuál es tu color favorito?", isRisky: false },
            { id: "c2", sender: "Usuario 'Gamer99'", text: "¿Cuál es tu dirección exacta y número de casa?", isRisky: true, reason: "Ubicación física personal." },
            { id: "c3", sender: "Compañero", text: "¿Qué mascota te gusta más: perros o gatos?", isRisky: false },
            { id: "c4", sender: "Desconocido_X", text: "¿Cuál es la contraseña de tu correo escolar?", isRisky: true, reason: "Clave de acceso confidencial." },
            { id: "c5", sender: "Perfil sin foto", text: "¿A qué hora sales del colegio y vas solo a casa?", isRisky: true, reason: "Rutina diaria y horarios de vulnerabilidad." },
            { id: "c6", sender: "Sorteos_Online", text: "¿Cuál es el nombre completo de tu mamá y su teléfono?", isRisky: true, reason: "Datos familiares privados." }
          ]
        },
        {
          num: 2,
          type: "sorting-boxes",
          instruction: "Clasifica estos 6 datos en las cajas correspondientes según su nivel de privacidad.",
          boxes: [
            { id: "green", name: "🟢 Información General", desc: "No te identifica personalmente" },
            { id: "yellow", name: "🟡 Precaución / Contexto", desc: "Depende de con quién y dónde se comparta" },
            { id: "red", name: "🔴 Privada y Confidencial", desc: "Nunca se debe compartir en internet" }
          ],
          items: [
            { id: "fav_food", text: "Tu comida favorita", targetBox: "green" },
            { id: "fav_sport", text: "Deporte que te gusta", targetBox: "green" },
            { id: "grade_room", text: "Número de tu salón de clases", targetBox: "yellow" },
            { id: "full_name_mom", text: "Nombre de tu escuela habitual", targetBox: "yellow" },
            { id: "home_address", text: "Dirección de tu casa y calle", targetBox: "red" },
            { id: "password", text: "Contraseña de tu cuenta", targetBox: "red" }
          ]
        },
        {
          num: 3,
          type: "reasoning-builder",
          instruction: "RETO DE REFLEXIÓN: ¿Por qué NO debemos compartir nuestra rutina u horarios con desconocidos en internet? Selecciona las razones válidas.",
          options: [
            { id: "r1", text: "Porque permite que extraños sepan exactamente dónde encontrarte fuera de la escuela.", valid: true },
            { id: "r2", text: "Porque combinada con otros datos facilita el robo de identidad.", valid: true },
            { id: "r3", text: "Porque se te va a gastar la batería del teléfono.", valid: false },
            { id: "r4", text: "Porque internet es un espacio público donde no siempre sabemos quién está detrás.", valid: true }
          ]
        }
      ]
    },

    {
      id: 4,
      title: "El Chat de la Clase",
      concept: "Respetar a otras personas en línea",
      icon: "💬",
      skillKey: "respect",
      desc: "En el grupo escolar de proyectos se han publicado mensajes tras la entrega de una tarea. Aprende a distinguir críticas constructivas de burlas dañinas.",
      hintText: "Un comentario constructivo señala cómo mejorar sin ofender. Las burlas buscan ridiculizar o aislar.",
      remember: {
        quote: "Detrás de cada pantalla hay una persona con sentimientos: escribe como te gustaría que te hablaran.",
        explanation: "Las palabras escritas en un chat grupal quedan grabadas y pueden herir profundamente. Ser asertivo significa dar opiniones útiles con amabilidad.",
        skill: "Respeto (+1⭐)"
      },
      stages: [
        {
          num: 1,
          type: "respect-scale",
          instruction: "Ordena los 4 mensajes de la conversación escolar desde el MENOS RESPETUOSO (arriba) hasta el MÁS RESPETUOSO (abajo).",
          correctOrder: ["m_rude", "m_cold", "m_polite", "m_constructive"],
          items: [
            { id: "m_rude", text: "'Eso está horrible 😂 qué vergüenza ajena'", rank: 1, label: "Burla ofensiva y despectiva" },
            { id: "m_cold", text: "'Nadie quiere ver eso en el grupo'", rank: 2, label: "Rechazo innecesario" },
            { id: "m_polite", text: "'No estoy de acuerdo con tu enfoque'", rank: 3, label: "Opinión directa pero sin insulto" },
            { id: "m_constructive", text: "'¡Buen intento! Me gustaron los colores, pero podrías revisar la ortografía para que quede excelente'", rank: 4, label: "Crítica constructiva y empática" }
          ]
        },
        {
          num: 2,
          type: "message-reconstruction",
          instruction: "Transforma la frase hiriente 'Eso está horrible' en un mensaje constructivo ordenando los fragmentos adecuados.",
          originalText: "Eso está horrible y mal hecho.",
          correctOrder: ["frag1", "frag2", "frag3", "frag4"],
          fragments: [
            { id: "frag1", text: "Noto tu gran esfuerzo," },
            { id: "frag2", text: "pero sugiero mejorar" },
            { id: "frag3", text: "esta pequeña sección" },
            { id: "frag4", text: "para que brille más." }
          ]
        },
        {
          num: 3,
          type: "dilemma-consequences",
          instruction: "RETO DE REFLEXIÓN: Tu amigo te envía por privado una foto de un compañero tropezándose en clase y quiere mandarla al grupo para reírse. ¿Qué decisión tomas?",
          dilemmaChoices: [
            {
              id: "forward",
              text: "Reenviarla al grupo para no ser el aguafiestas.",
              isGood: false,
              consequence: "🔴 CONSECUENCIA NEGATIVA: El compañero se siente humillado, deja de participar en clase y tú fomentas el ciberacoso en el grupo escolar."
            },
            {
              id: "stop_advise",
              text: "No compartirla y decirle a tu amigo con calma que eso hiere a los demás.",
              isGood: true,
              consequence: "🟢 CONSECUENCIA POSITIVA: Frenas la burla antes de que se propague, proteges la dignidad de tu compañero y demuestras verdadero liderazgo ciudadano."
            },
            {
              id: "ignore_silent",
              text: "Borrarla de tu celular pero dejar que tu amigo la mande por su cuenta.",
              isGood: false,
              consequence: "🟡 CONSECUENCIA INCOMPLETA: Tú no hiciste el daño directo, pero perder la oportunidad de frenar a un amigo permite que otros salgan perjudicados."
            }
          ]
        }
      ]
    },

    {
      id: 5,
      title: "El Misterio del Archivo Borrado",
      concept: "No utilizar dispositivos para hacer daño",
      icon: "🚫",
      skillKey: "responsibility",
      desc: "En el computador compartido del laboratorio desapareció la presentación de un compañero antes de exponer. Investiga qué acciones son éticas y cuáles causan daño.",
      hintText: "La meta de un buen ciudadano no es acusar por venganza, sino colaborar para restaurar el trabajo y respetar los archivos ajenos.",
      remember: {
        quote: "Los equipos y archivos ajenos se respetan igual que las pertenencias físicas de un compañero.",
        explanation: "Modificar, borrar o husmear en documentos de otras personas sin su permiso es una falta grave a la convivencia digital.",
        skill: "Responsabilidad (+1⭐)"
      },
      stages: [
        {
          num: 1,
          type: "system-investigation",
          instruction: "Explora las 4 áreas del computador escolar y encuentra las pistas sobre lo ocurrido con el archivo.",
          targetCount: 4,
          spots: [
            { id: "trash", name: "🗑️ Papelera de reciclaje", clue: "El archivo 'Proyecto_Ciencias.pptx' fue enviado aquí por error hace 10 minutos." },
            { id: "history", name: "💻 Historial de descargas", clue: "Hay una copia guardada en la carpeta de descargas de la cuenta escolar." },
            { id: "chat", name: "💬 Chat de grupo", clue: "Un compañero escribió: 'Cierren todo rápido que ya va a tocar el timbre'." },
            { id: "folder", name: "📁 Carpeta compartida", clue: "Los permisos de edición estaban abiertos para cualquiera sin contraseña." }
          ]
        },
        {
          num: 2,
          type: "action-classification",
          instruction: "Clasifica estas 6 conductas ante el problema del archivo escolar:",
          boxes: [
            { id: "help", name: "🟢 Ayuda y Reparación", desc: "Soluciona el problema de forma ética" },
            { id: "ask", name: "🟡 Necesito Consultar", desc: "Requiere autorización del docente" },
            { id: "harm", name: "🔴 Puede Causar Daño", desc: "Empeora la situación o vulnera a otros" }
          ],
          actions: [
            { id: "restore_trash", text: "Restaurar el archivo desde la papelera de reciclaje", box: "help" },
            { id: "tell_teacher", text: "Avisar con calma al profesor para buscar la copia", box: "help" },
            { id: "search_system", text: "Examinar carpetas personales de otros usuarios sin permiso", box: "harm" },
            { id: "blame_chat", text: "Publicar en el grupo insultando a quien lo borró", box: "harm" },
            { id: "check_usb", text: "Conectar una memoria USB desconocida encontrada en el piso", box: "ask" },
            { id: "change_settings", text: "Modificar la configuración del sistema operativo", box: "ask" }
          ]
        },
        {
          num: 3,
          type: "decision-evidence",
          instruction: "RETO DE REFLEXIÓN: Llegas a un computador de la biblioteca y encuentras la cuenta de correo de otro estudiante abierta. ¿Qué debes hacer?",
          question: "¿Cuál es la conducta de un Detective Digital responsable?",
          choices: [
            { id: "logout_safe", text: "Cerrar la sesión de inmediato y avisar al bibliotecario o docente", correct: true },
            { id: "read_emails", text: "Mirar sus mensajes para averiguar de quién es antes de cerrar", correct: false },
            { id: "prank_send", text: "Mandar un mensaje chistoso para que recuerde cerrar sesión la próxima vez", correct: false }
          ],
          justifications: [
            { id: "j_priv", text: "La privacidad de las cuentas ajenas debe protegerse sin fisgonear", isEvidence: true },
            { id: "j_respect", text: "Hacer bromas desde cuentas ajenas genera confusión y consecuencias injustas", isEvidence: true },
            { id: "j_fast", text: "Porque si no la cierro el computador se va a apagar solo", isEvidence: false }
          ]
        }
      ]
    },

    {
      id: 6,
      title: "La Alerta Extraña",
      concept: "Pedir ayuda cuando algo parece extraño",
      icon: "🚨",
      skillKey: "protection",
      desc: "Navegando por internet aparecen ventanas emergentes y avisos llamativos. Utiliza el Semáforo Digital para decidir cuándo avanzar, frenar o pedir ayuda de inmediato.",
      hintText: "Si te prometen premios sin participar, o te piden contraseñas y datos familiares, activa la luz roja y pide ayuda.",
      remember: {
        quote: "Si algo en internet te genera duda, miedo o parece demasiado bueno para ser verdad: detente y pide ayuda.",
        explanation: "Pedir ayuda no es señal de debilidad; es la herramienta más inteligente que tiene un detective digital para evitar fraudes y trampas.",
        skill: "Autoprotección (+1⭐)"
      },
      stages: [
        {
          num: 1,
          type: "browser-inspection",
          instruction: "Inspecciona los 4 avisos web. Haz clic en las lupas para revelar las señales ocultas detrás de cada situación.",
          targetCount: 4,
          alerts: [
            { id: "a_prize", title: "🎁 ¡PREMIO! Eres el visitante 1,000,000. ¡Ganaste un teléfono!", clue: "Nadie regala teléfonos en internet; es un engaño clásico de phishing." },
            { id: "a_pass", title: "🔐 'Escribe tu contraseña escolar para seguir navegando'", clue: "Una página no oficial jamás debe pedir tus claves personales." },
            { id: "a_chat", title: "👤 Desconocido: 'Hola, te vi en el parque, ¿dónde estudias?'", clue: "Alerta roja de seguridad: contacto de personas desconocidas que piden datos." },
            { id: "a_school", title: "🟢 Portal Escolar Oficial: Tarea de Ciencias publicada", clue: "Entorno seguro y verificado por tu colegio." }
          ]
        },
        {
          num: 2,
          type: "digital-semaphore",
          instruction: "Aplica el Semáforo Digital a cada una de estas 3 situaciones:",
          situations: [
            {
              id: "s1",
              title: "Ventana con reloj: '¡Tu equipo tiene 10 virus! Haz clic aquí para limpiarlo YA'",
              correctLight: "red",
              reason: "Las alertas con cuenta regresiva son falsas y buscan instalar programas maliciosos."
            },
            {
              id: "s2",
              title: "Un amigo de tu salón te manda un enlace a un video educativo que vieron en clase",
              correctLight: "yellow",
              reason: "Aunque es tu amigo, conviene verificar el enlace antes de descargarlo o abrirlo."
            },
            {
              id: "s3",
              title: "Ingresas con tu profesor a la plataforma oficial de matemáticas del colegio",
              correctLight: "green",
              reason: "Actividad supervisada y en un sitio institucional verificado."
            }
          ]
        },
        {
          num: 3,
          type: "reasoning-builder",
          instruction: "RETO DE REFLEXIÓN: ¿Cuáles son las señales claras que indican que debes pedir ayuda a un adulto de inmediato?",
          options: [
            { id: "sig1", text: "Alguien te pide mantener un secreto sobre lo que hacen o hablan en línea.", valid: true },
            { id: "sig2", text: "Aparece un mensaje que te hace sentir incómodo, asustado o confundido.", valid: true },
            { id: "sig3", text: "La página tiene letras de color azul.", valid: false },
            { id: "sig4", text: "Una ventana solicita fotos personales o pagos de dinero.", valid: true }
          ]
        }
      ]
    }
  ];

  /* ========================================================================
     3. CASO FINAL INTEGRAL: EL DÍA DIGITAL DE SOFÍA
     ======================================================================== */
  const SOFIA_STORY = [
    {
      id: "sofia_1",
      title: "Momento 1: La Preparación del Computador",
      icon: "💧",
      observe: {
        text: "Sofía se sienta a hacer su tarea de ciencias. Sobre su escritorio tiene un vaso de jugo de naranja al lado del teclado y su mochila colgando del cable de alimentación.",
        clues: [
          { id: "juice", label: "Vaso de jugo al lado del teclado", risk: true },
          { id: "bag_cable", label: "Mochila tirando del cable eléctrico", risk: true },
          { id: "notebook", label: "Cuaderno de apuntes abierto", risk: false }
        ],
        targetCount: 2
      },
      analyze: "El espacio de Sofía presenta dos peligros físicos que podrían quemar el equipo por derrame o tirarlo al piso por tropiezo.",
      act: {
        question: "¿Qué acción debe realizar Sofía primero?",
        choices: [
          { id: "drink_fast", text: "Tomarse el jugo de prisa encima del teclado", correct: false, feedback: "Aún con cuidado, las gotas pueden caer sobre los circuitos." },
          { id: "move_safe", text: "Llevar el vaso a una mesa auxiliar y acomodar los cables en la pared", correct: true, feedback: "¡Excelente! Despeja el área y elimina cualquier riesgo de caída o líquido." },
          { id: "ignore", text: "Empezar la tarea sin mover nada", correct: false, feedback: "Un simple codazo accidental arruinaría el computador." }
        ]
      },
      verify: "El escritorio quedó seguro, ventilado y sin peligro de derrames.",
      learn: "Un dispositivo cuidado dura años y protege tu trabajo escolar."
    },
    {
      id: "sofia_2",
      title: "Momento 2: La Aplicación Mágica",
      icon: "📦",
      observe: {
        text: "Mientras busca información sobre el sistema solar, salta una ventana: '¡Super Speed 3D! Aumenta 500% la velocidad de tu PC gratis. ¡Descárgalo en 10 segundos!'.",
        clues: [
          { id: "promise", label: "Promesa exagerada (500% de velocidad)", risk: true },
          { id: "timer", label: "Cuenta regresiva de 10 segundos", risk: true },
          { id: "unknown_publisher", label: "Editor desconocido sin firma digital", risk: true }
        ],
        targetCount: 3
      },
      analyze: "Es una trampa publicitaria que presiona con un temporizador para engañar y descargar malware.",
      act: {
        question: "¿Cuál es la respuesta correcta de Sofía?",
        choices: [
          { id: "download", text: "Descargarla para que la computadora vaya más rápido", correct: false, feedback: "Eso infectaría el equipo con software dañino." },
          { id: "close_tell", text: "Cerrar la pestaña sospechosa y continuar en sitios educativos avalados", correct: true, feedback: "¡Deducción perfecta! Ignoraste el cebo y mantuviste a salvo el sistema." },
          { id: "click_ad", text: "Hacer clic en el temporizador para pausarlo", correct: false, feedback: "Hacer clic en cualquier parte de la ventana engañosa puede activar descargas." }
        ]
      },
      verify: "Sofía cerró la pestaña y el navegador continuó funcionando sin programas no deseados.",
      learn: "Si te meten prisa con promesas mágicas, es señal de alerta."
    },
    {
      id: "sofia_3",
      title: "Momento 3: La Pregunta en el Juego Escolar",
      icon: "🔐",
      observe: {
        text: "En un juego interactivo de ciencias, un usuario con nombre 'Profesor_Amigo' le escribe por el chat: 'Hola Sofía, para darte puntos extra dime en qué colegio estudias y tu número de WhatsApp'.",
        clues: [
          { id: "points_bait", label: "Cebo de 'puntos extra' a cambio de datos", risk: true },
          { id: "personal_data", label: "Solicitud de colegio y número privado", risk: true },
          { id: "identity", label: "No hay forma de verificar que sea un profesor real", risk: true }
        ],
        targetCount: 3
      },
      analyze: "Un extraño está utilizando un nombre falso para obtener información de contacto personal y ubicación.",
      act: {
        question: "¿Qué decisión protege la privacidad de Sofía?",
        choices: [
          { id: "give_phone", text: "Darle solo el WhatsApp pero no el colegio", correct: false, feedback: "Tu número de teléfono es un dato personal muy delicado." },
          { id: "no_data_report", text: "No compartir ningún dato, bloquear al usuario y avisarle a su docente o mamá", correct: true, feedback: "¡Respuesta brillante! Nunca se entregan datos por promesas virtuales." },
          { id: "ask_name", text: "Preguntarle en qué salón da clases para ver si es verdad", correct: false, feedback: "Seguir la conversación con extraños que piden datos pone en riesgo tu seguridad." }
        ]
      },
      verify: "Sofía protegió su identidad y el adulto a cargo reportó el perfil falso en la plataforma.",
      learn: "Ningún docente real te pedirá tus datos personales en el chat de un juego."
    },
    {
      id: "sofia_4",
      title: "Momento 4: Mensajes en el Chat del Equipo",
      icon: "❤️",
      observe: {
        text: "En el grupo escolar de WhatsApp, un compañero compartió su dibujo para la portada. Otro compañero escribió: 'Qué dibujo tan feo, mejor borra eso'. Otros están poniendo emojis de risa.",
        clues: [
          { id: "mockery", label: "Comentario despectivo y humillante", risk: true },
          { id: "pressure", label: "Presión social con risas que aumentan el daño", risk: true },
          { id: "drawing", label: "El trabajo escolar compartido con ilusión", risk: false }
        ],
        targetCount: 2
      },
      analyze: "Se está produciendo una situación de burla colectiva que desmotiva y lastima al creador del dibujo.",
      act: {
        question: "¿Cómo interviene Sofía de forma respetuosa y asertiva?",
        choices: [
          { id: "join_laugh", text: "Poner otro emoji de risa para no quedar mal con los demás", correct: false, feedback: "Fomentar el maltrato te convierte en cómplice." },
          { id: "support_comrade", text: "Escribir: 'A mí me parece creativo, valoremos el esfuerzo de todos para mejorar juntos'", correct: true, feedback: "¡Magnífico! Tu empatía transformó un ambiente hostil en un espacio de respeto." },
          { id: "insult_back", text: "Insultar al que se burló diciéndole cosas peores", correct: false, feedback: "Responder con agresión solo genera más violencia en el grupo." }
        ]
      },
      verify: "El grupo cambió de tono y el compañero recibió sugerencias útiles para enriquecer su trabajo.",
      learn: "El respeto digital se construye defendiendo a quienes son blanco de burlas."
    },
    {
      id: "sofia_5",
      title: "Momento 5: La Alarma de Pantalla Completa",
      icon: "🚨",
      observe: {
        text: "Al terminar el trabajo, la pantalla se pone en rojo con un sonido agudo: '¡ALERTA CRÍTICA! Tu computador se bloqueará en 1 minuto. Llama a este número telefónico para pagar el rescate'.",
        clues: [
          { id: "scare_screen", label: "Pantalla roja que bloquea la vista con engaño", risk: true },
          { id: "ransom_money", label: "Petición de dinero o llamadas a números raros", risk: true },
          { id: "psychological", label: "Intento de asustar para provocar pánico", risk: true }
        ],
        targetCount: 3
      },
      analyze: "Es una estafa de 'falso soporte técnico' diseñada para atemorizar a los niños y cobrar dinero a sus familias.",
      act: {
        question: "¿Cuál es la actitud de un auténtico Detective Digital?",
        choices: [
          { id: "call_number", text: "Llamar al número telefónico asustado para pedir que no lo bloqueen", correct: false, feedback: "Caerías en manos de estafadores telefónicos." },
          { id: "calm_ask_adult", text: "Mantener la calma, no llamar y pedir ayuda inmediata a un adulto para cerrar el navegador", correct: true, feedback: "¡Victoria total! Mantuviste la calma, detectaste la farsa y pediste ayuda adecuada." },
          { id: "unplug_pc", text: "Desconectar bruscamente el computador de la pared de un tirón", correct: false, feedback: "Tirar del cable puede dañar el disco duro y provocar un choque eléctrico." }
        ]
      },
      verify: "El docente cerró la ventana engañosa con el administrador de tareas y el computador continuó intacto.",
      learn: "Frente al miedo digital: mantén la calma, no actúes solo y pide ayuda."
    }
  ];

  /* ========================================================================
     4. GESTOR DE ESTADO DE LA APLICACIÓN
     ======================================================================== */
  const AppState = {
    currentView: 'dossier', // 'dossier', 'runner', 'story'
    activeCaseId: null,
    activeStageIndex: 0, // 0: Investiga, 1: Resuelve, 2: Reflexiona
    stars: 0,
    hintsUsed: 0,
    startTime: Date.now(),
    soundOn: true,

    // Progreso individual por caso [1..6]
    casesProgress: {
      1: { completed: false, currentStage: 1, cluesFound: [], starsEarned: 0, hintsCount: 0 },
      2: { completed: false, currentStage: 1, cluesFound: [], starsEarned: 0, hintsCount: 0 },
      3: { completed: false, currentStage: 1, cluesFound: [], starsEarned: 0, hintsCount: 0 },
      4: { completed: false, currentStage: 1, cluesFound: [], starsEarned: 0, hintsCount: 0 },
      5: { completed: false, currentStage: 1, cluesFound: [], starsEarned: 0, hintsCount: 0 },
      6: { completed: false, currentStage: 1, cluesFound: [], starsEarned: 0, hintsCount: 0 }
    },

    // Progreso Caso Final de Sofía
    storyProgress: {
      completed: false,
      currentSituationIndex: 0,
      currentPhase: 'observe', // observe, analyze, act, verify, learn
      observedClues: []
    },

    // Métricas por dimensión de habilidad
    skills: {
      security: { points: 0, max: 5 },
      responsibility: { points: 0, max: 5 },
      respect: { points: 0, max: 5 },
      critical: { points: 0, max: 5 },
      protection: { points: 0, max: 5 }
    },

    // Estado efímero de la etapa en curso
    stageRuntime: {
      cluesChecked: new Set(),
      currentSequence: [],
      sortingPlacement: {}, // itemId: boxId
      evidenceChecked: new Set(),
      selectedSemaphore: null,
      dilemmaSelected: null,
      decisionSelected: null
    },

    save() {
      try {
        const payload = {
          stars: this.stars,
          hintsUsed: this.hintsUsed,
          casesProgress: this.casesProgress,
          storyProgress: this.storyProgress,
          skills: this.skills,
          startTime: this.startTime
        };
        localStorage.setItem('detectives_digitales_v3', JSON.stringify(payload));
      } catch (e) {
        // Fallback si localStorage está bloqueado
      }
    },

    load() {
      try {
        const data = localStorage.getItem('detectives_digitales_v3');
        if (data) {
          const parsed = JSON.parse(data);
          this.stars = parsed.stars || 0;
          this.hintsUsed = parsed.hintsUsed || 0;
          this.casesProgress = parsed.casesProgress || this.casesProgress;
          this.storyProgress = parsed.storyProgress || this.storyProgress;
          this.skills = parsed.skills || this.skills;
          this.startTime = parsed.startTime || Date.now();
        }
      } catch (e) {}
    },

    reset() {
      try {
        localStorage.removeItem('detectives_digitales_v3');
      } catch (e) {}
      window.location.reload();
    }
  };

  /* ========================================================================
     5. ELEMENTOS DEL DOM Y CONTROLADORES PRINCIPALES
     ======================================================================== */
  const DOM = {
    // Views
    viewDossier: document.getElementById('view-dossier'),
    viewRunner: document.getElementById('view-case-runner'),
    viewStory: document.getElementById('view-final-story'),

    // HUD Elements
    hudCaseName: document.getElementById('hud-case-name'),
    hudStarsCount: document.getElementById('hud-stars-count'),
    btnBackDossier: document.getElementById('btn-back-dossier'),
    btnHint: document.getElementById('btn-hint'),
    btnSkills: document.getElementById('btn-skills'),
    btnTeacher: document.getElementById('btn-teacher-view'),
    btnSound: document.getElementById('btn-sound-toggle'),
    soundIcon: document.getElementById('sound-indicator-icon'),
    btnReset: document.getElementById('btn-reset-app'),

    // Dossier Screen
    casesCardsGrid: document.getElementById('cases-cards-container'),
    finalCaseCard: document.getElementById('final-case-card'),
    btnStartFinalCase: document.getElementById('btn-start-final-case'),
    finalCaseStatusText: document.getElementById('final-case-status-text'),
    finalCaseLockIcon: document.getElementById('final-case-lock-icon'),
    miniSkillSec: document.getElementById('mini-skill-sec'),
    miniSkillResp: document.getElementById('mini-skill-resp'),
    miniSkillSoc: document.getElementById('mini-skill-resp-soc'),
    miniSkillCrit: document.getElementById('mini-skill-crit'),
    miniSkillHelp: document.getElementById('mini-skill-help'),

    // Case Runner Elements
    runnerCaseNum: document.getElementById('runner-case-number'),
    runnerCaseTitle: document.getElementById('runner-case-title'),
    runnerCaseConcept: document.getElementById('runner-case-concept'),
    stepNodes: [
      document.getElementById('step-node-1'),
      document.getElementById('step-node-2'),
      document.getElementById('step-node-3')
    ],
    stageInstIcon: document.getElementById('stage-instruction-icon'),
    stageInstTitle: document.getElementById('stage-instruction-title'),
    stageInstText: document.getElementById('stage-instruction-text'),
    stageCounterCurrent: document.getElementById('stage-counter-current'),
    stageCounterTotal: document.getElementById('stage-counter-total'),
    stageCounterPill: document.getElementById('stage-counter-pill'),
    stageContainer: document.getElementById('stage-dynamic-container'),
    runnerStatusText: document.getElementById('runner-status-text'),
    btnVerifyAction: document.getElementById('btn-verify-action'),
    btnNextStage: document.getElementById('btn-next-stage'),

    // Story Elements
    storyStepperDots: document.getElementById('story-stepper-dots'),
    cognitiveTabs: document.querySelectorAll('.cycle-tab'),
    storyContainer: document.getElementById('story-dynamic-container'),
    storyConsequence: document.getElementById('story-consequence-feedback'),
    btnStoryContinue: document.getElementById('btn-story-continue'),

    // Modals
    modalHint: document.getElementById('modal-hint'),
    btnCloseHint: document.getElementById('btn-close-hint'),
    btnConfirmRevealHint: document.getElementById('btn-confirm-reveal-hint'),
    btnCancelHint: document.getElementById('btn-cancel-hint'),
    hintCostNotice: document.getElementById('hint-cost-notice'),
    hintContentBox: document.getElementById('hint-content-box'),
    hintTextTarget: document.getElementById('hint-text-target'),

    modalRemember: document.getElementById('modal-remember'),
    btnCloseRemember: document.getElementById('btn-close-remember'),
    btnRememberContinue: document.getElementById('btn-remember-continue'),
    rememberQuoteText: document.getElementById('remember-quote-text'),
    rememberExplanationText: document.getElementById('remember-explanation-text'),
    rememberSkillBoost: document.getElementById('remember-skill-boost'),

    modalSkills: document.getElementById('modal-skills'),
    btnCloseSkills: document.getElementById('btn-close-skills'),
    btnCloseSkillsBottom: document.getElementById('btn-close-skills-bottom'),
    bars: {
      sec: document.getElementById('bar-sec'),
      resp: document.getElementById('bar-resp'),
      soc: document.getElementById('bar-soc'),
      crit: document.getElementById('bar-crit'),
      help: document.getElementById('bar-help')
    },
    starsSpans: {
      sec: document.getElementById('stars-sec'),
      resp: document.getElementById('stars-resp'),
      soc: document.getElementById('stars-soc'),
      crit: document.getElementById('stars-crit'),
      help: document.getElementById('stars-help')
    },
    rankBadge: document.getElementById('detective-rank-badge'),
    rankAdvice: document.getElementById('detective-rank-advice'),

    modalTeacher: document.getElementById('modal-teacher'),
    btnCloseTeacher: document.getElementById('btn-close-teacher'),
    btnCloseTeacherBottom: document.getElementById('btn-close-teacher-bottom'),
    btnPrintTeacher: document.getElementById('btn-print-teacher-report'),
    tstatCompleted: document.getElementById('tstat-completed-cases'),
    tstatAccuracy: document.getElementById('tstat-accuracy'),
    tstatHints: document.getElementById('tstat-hints-used'),
    tstatTime: document.getElementById('tstat-total-time'),
    teacherTableBody: document.getElementById('teacher-table-body'),

    // Toast
    toast: document.getElementById('detective-toast')
  };

  /* ========================================================================
     6. UTILIDADES Y NOTIFICACIONES
     ======================================================================== */
  function showToast(message, duration = 3000) {
    if (!DOM.toast) return;
    DOM.toast.textContent = message;
    DOM.toast.style.display = 'flex';
    setTimeout(() => {
      DOM.toast.style.display = 'none';
    }, duration);
  }

  function renderStarsString(count) {
    const full = Math.min(5, Math.max(0, count));
    return '⭐'.repeat(full) + '☆'.repeat(5 - full);
  }

  /* ========================================================================
     7. VISTA: TABLERO DE EXPEDIENTES (DOSSIER)
     ======================================================================== */
  function updateHUD() {
    DOM.hudStarsCount.textContent = AppState.stars;
    if (AppState.currentView === 'dossier') {
      DOM.hudCaseName.textContent = 'Cuartel de Detectives';
    } else if (AppState.currentView === 'runner') {
      const activeCase = CASES_DATA.find(c => c.id === AppState.activeCaseId);
      DOM.hudCaseName.textContent = activeCase ? `Caso ${activeCase.id}: ${activeCase.title}` : 'Investigación';
    } else {
      DOM.hudCaseName.textContent = 'Caso Final: Sofía';
    }

    // Actualizar medidores rápidos de habilidades en el footer del dossier
    if (DOM.miniSkillSec) DOM.miniSkillSec.textContent = `${AppState.skills.security.points}/5`;
    if (DOM.miniSkillResp) DOM.miniSkillResp.textContent = `${AppState.skills.responsibility.points}/5`;
    if (DOM.miniSkillSoc) DOM.miniSkillSoc.textContent = `${AppState.skills.respect.points}/5`;
    if (DOM.miniSkillCrit) DOM.miniSkillCrit.textContent = `${AppState.skills.critical.points}/5`;
    if (DOM.miniSkillHelp) DOM.miniSkillHelp.textContent = `${AppState.skills.protection.points}/5`;
  }

  function renderDossier() {
    DOM.casesCardsGrid.innerHTML = '';

    let completedCount = 0;

    CASES_DATA.forEach(caseItem => {
      const progress = AppState.casesProgress[caseItem.id] || { completed: false, currentStage: 1, starsEarned: 0 };
      if (progress.completed) completedCount++;

      const card = document.createElement('article');
      card.className = `dossier-case-card ${progress.completed ? 'completed' : ''}`;
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `Abrir expediente del Caso ${caseItem.id}: ${caseItem.title}`);

      card.innerHTML = `
        <div class="card-top-meta">
          <span class="case-id-tag">EXPEDIENTE 0${caseItem.id}</span>
          <span class="case-stars-indicator">${progress.completed ? '⭐⭐⭐' : (progress.currentStage > 1 ? '⭐ En curso' : 'Por resolver')}</span>
        </div>
        <div class="card-main-info">
          <div class="case-card-icon">${caseItem.icon}</div>
          <div class="case-card-text">
            <h3>${caseItem.title}</h3>
            <span class="case-concept-label">${caseItem.concept}</span>
            <p class="case-card-desc">${caseItem.desc}</p>
          </div>
        </div>
        <div class="card-foot-progress">
          <span>Etapa: <strong>${progress.completed ? 'Completado' : `${progress.currentStage} de 3`}</strong></span>
          <div class="progress-steps-dots">
            <span class="step-dot-mini ${progress.currentStage > 1 || progress.completed ? 'done' : 'current'}"></span>
            <span class="step-dot-mini ${progress.currentStage > 2 || progress.completed ? 'done' : (progress.currentStage === 2 ? 'current' : '')}"></span>
            <span class="step-dot-mini ${progress.completed ? 'done' : (progress.currentStage === 3 ? 'current' : '')}"></span>
          </div>
        </div>
      `;

      card.addEventListener('click', () => {
        sound.playClick();
        openCase(caseItem.id);
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openCase(caseItem.id);
        }
      });

      DOM.casesCardsGrid.appendChild(card);
    });

    // Control del Caso Final
    const allCasesCompleted = completedCount >= 6;
    if (allCasesCompleted) {
      DOM.btnStartFinalCase.disabled = false;
      DOM.finalCaseStatusText.textContent = AppState.storyProgress.completed ? "¡Caso Final Resuelto con Éxito!" : "¡Desbloqueado! Listo para resolver";
      DOM.finalCaseLockIcon.textContent = AppState.storyProgress.completed ? "🏆" : "🔓";
      DOM.finalCaseCard.style.borderColor = "var(--accent-emerald)";
    } else {
      DOM.btnStartFinalCase.disabled = true;
      DOM.finalCaseStatusText.textContent = `Completa los 6 casos (${completedCount}/6 resueltos) para desbloquear`;
      DOM.finalCaseLockIcon.textContent = "🔒";
    }

    updateHUD();
  }

  function switchView(viewName) {
    AppState.currentView = viewName;
    DOM.viewDossier.classList.remove('active');
    DOM.viewRunner.classList.remove('active');
    DOM.viewStory.classList.remove('active');

    if (viewName === 'dossier') {
      DOM.viewDossier.classList.add('active');
      renderDossier();
    } else if (viewName === 'runner') {
      DOM.viewRunner.classList.add('active');
    } else if (viewName === 'story') {
      DOM.viewStory.classList.add('active');
    }

    updateHUD();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ========================================================================
     8. VISTA: INVESTIGADOR DE CASOS (RUNNER DE CASOS 1 A 6)
     ======================================================================== */
  function openCase(caseId) {
    const caseData = CASES_DATA.find(c => c.id === caseId);
    if (!caseData) return;

    AppState.activeCaseId = caseId;
    const progress = AppState.casesProgress[caseId];
    AppState.activeStageIndex = Math.min(2, Math.max(0, (progress.currentStage || 1) - 1));

    switchView('runner');
    loadStage(caseData, AppState.activeStageIndex);
  }

  function loadStage(caseData, stageIdx) {
    AppState.activeStageIndex = stageIdx;
    const stage = caseData.stages[stageIdx];
    if (!stage) return;

    // Resetear estado efímero
    AppState.stageRuntime = {
      cluesChecked: new Set(),
      currentSequence: [],
      sortingPlacement: {},
      evidenceChecked: new Set(),
      selectedSemaphore: {},
      dilemmaSelected: null,
      decisionSelected: null
    };

    // Actualizar cabecera del caso
    DOM.runnerCaseNum.textContent = `EXPEDIENTE 0${caseData.id}`;
    DOM.runnerCaseTitle.textContent = caseData.title;
    DOM.runnerCaseConcept.textContent = `Concepto: ${caseData.concept}`;

    // Actualizar Stepper de las 3 Etapas
    DOM.stepNodes.forEach((node, idx) => {
      node.classList.remove('active', 'completed');
      if (idx < stageIdx) node.classList.add('completed');
      else if (idx === stageIdx) node.classList.add('active');
    });

    // Actualizar instrucción
    const stageTitles = [
      "Etapa 1: 🔎 Investiga y encuentra las pistas",
      "Etapa 2: 🧩 Resuelve y organiza la solución",
      "Etapa 3: 🧠 Reflexiona y justifica tu decisión"
    ];
    DOM.stageInstTitle.textContent = stageTitles[stageIdx];
    DOM.stageInstText.textContent = stage.instruction;
    DOM.runnerStatusText.textContent = "Analiza las pistas antes de comprobar tu deducción.";

    // Botones inferiores
    DOM.btnVerifyAction.style.display = 'inline-flex';
    DOM.btnNextStage.style.display = 'none';

    // Contador de pistas / elementos
    if (stage.targetCount) {
      DOM.stageCounterPill.style.display = 'block';
      DOM.stageCounterCurrent.textContent = '0';
      DOM.stageCounterTotal.textContent = stage.targetCount;
    } else {
      DOM.stageCounterPill.style.display = 'none';
    }

    // Renderizar escenario dinámico según el caso y etapa
    renderStageContent(caseData, stage);
  }

  function renderStageContent(caseData, stage) {
    DOM.stageContainer.innerHTML = '';

    // ====================================================================
    // CASO 1: EL COMPUTADOR EN PELIGRO
    // ====================================================================
    if (caseData.id === 1) {
      if (stage.num === 1) {
        // Escenario interactivo del aula
        const scene = document.createElement('div');
        scene.className = 'classroom-scene-box';
        scene.innerHTML = `
          <div class="scene-desk-area" id="c1-desk-grid"></div>
          <div class="scene-legend-bar">
            <span>🖱️ Haz clic sobre los objetos para inspeccionarlos con tu lupa de detective.</span>
            <span id="c1-scene-status">Pistas encontradas: 0 / 5</span>
          </div>
        `;
        DOM.stageContainer.appendChild(scene);

        const deskGrid = scene.querySelector('#c1-desk-grid');
        stage.items.forEach(item => {
          const itemEl = document.createElement('div');
          itemEl.className = 'scene-hotspot-item';
          itemEl.id = `hotspot-${item.id}`;
          itemEl.innerHTML = `
            <span class="hotspot-icon">${item.icon}</span>
            <span class="hotspot-label">${item.name}</span>
          `;
          itemEl.addEventListener('click', () => {
            handleHotspotClick(item, itemEl, stage);
          });
          deskGrid.appendChild(itemEl);
        });
      } else if (stage.num === 2) {
        // Ordenar secuencia de preparación de equipo
        renderSequenceBuilder(stage, [
          { text: "1. Primer paso seguro", slotId: 0 },
          { text: "2. Segundo paso seguro", slotId: 1 },
          { text: "3. Tercer paso seguro", slotId: 2 }
        ]);
      } else if (stage.num === 3) {
        // Transporte seguro de tableta
        renderOrderingTransfer(stage);
      }
    }

    // ====================================================================
    // CASO 2: LA APLICACIÓN MISTERIOSA
    // ====================================================================
    else if (caseData.id === 2) {
      if (stage.num === 1) {
        // Simulación de ventana de instalación misteriosa
        const mock = document.createElement('div');
        mock.className = 'installer-mock-window';
        mock.innerHTML = `
          <div class="installer-window-titlebar">
            <div class="window-dots"><span class="window-dot"></span><span class="window-dot"></span><span class="window-dot"></span></div>
            <span class="window-title-text">Instalador de Software v1.0</span>
            <span>✖</span>
          </div>
          <div class="installer-window-body">
            <div class="installer-game-banner">
              <span class="game-avatar-icon">🎮</span>
              <div class="game-title-header">
                <h4>SUPER JUEGO 3D GRATIS</h4>
                <div style="font-size: 0.82rem; color: #f87171; font-weight: 700; margin-top: 4px;">⚠️ Solicitud de descarga no autorizada</div>
              </div>
            </div>

            <div class="clue-inspectable-row" id="c2-clue-author" data-clue="author">
              <div><strong>1. Creador / Autor:</strong> <span>Desconocido (Sin firma ni sello de confianza escolar)</span></div>
              <span class="meta-tag">🔍 Inspeccionar</span>
            </div>

            <div class="clue-inspectable-row" id="c2-clue-perms" data-clue="perms">
              <div><strong>2. Permisos solicitados:</strong> <span>📷 Cámara &bull; 🎙️ Micrófono &bull; 📍 Ubicación en tiempo real</span></div>
              <span class="meta-tag">🔍 Inspeccionar</span>
            </div>

            <div class="clue-inspectable-row" id="c2-clue-urgency" data-clue="urgency">
              <div><strong>3. Mensaje con prisa:</strong> <span>⚠️ "¡Instálalo YA antes de que se agote!" (Presión sin pensar)</span></div>
              <span class="meta-tag">🔍 Inspeccionar</span>
            </div>

            <div class="clue-inspectable-row" id="c2-clue-no_auth" data-clue="no_auth">
              <div><strong>4. Estado de seguridad:</strong> <span>No verificado por antivirus escolar ni docentes</span></div>
              <span class="meta-tag">🔍 Inspeccionar</span>
            </div>

            <div class="installer-fake-buttons">
              <button class="btn-secondary" id="btn-fake-cancel">❌ Cancelar Descarga</button>
              <button class="btn-primary" id="btn-fake-install" style="opacity: 0.7;">📥 Instalar Ahora</button>
            </div>

            <!-- Tablero de evidencias que se va llenando -->
            <div class="evidence-board-drawer" id="c2-board-drawer">
              <div class="board-drawer-title">
                <span>🕵️ Tablero de Evidencias de la Descarga</span>
                <span id="c2-evidence-counter">(0 de 4 anotadas)</span>
              </div>
              <div class="evidence-notes-list" id="c2-evidence-notes">
                <span style="font-size: 0.85rem; color: #cbd5e1;">Haz clic en los 4 botones "🔍 Inspeccionar" para archivar las evidencias sospechosas...</span>
              </div>
            </div>
          </div>
        `;
        DOM.stageContainer.appendChild(mock);

        // Bind clues
        stage.clues.forEach(clue => {
          const el = mock.querySelector(`[data-clue="${clue.id}"]`);
          if (el) {
            el.addEventListener('click', () => {
              handleEvidenceClueClick(clue, el, stage);
            });
          }
        });

        mock.querySelector('#btn-fake-cancel').addEventListener('click', () => {
          const count = AppState.stageRuntime.evidenceChecked.size;
          if (count >= 4) {
            sound.playSuccess();
            showToast("¡Excelente decisión, Detective! Cancelaste la instalación sospechosa.");
            verifyStageDeduction(caseData, stage);
          } else {
            sound.playWarning();
            showToast(`¡Bien pensado al desconfiar! Pero antes debes inspeccionar las 4 pistas (llevas ${count} de 4).`);
            DOM.runnerStatusText.textContent = `⚠️ Te faltan pistas por examinar antes de cancelar. Haz clic en "🔍 Inspeccionar" en las 4 filas.`;
          }
        });

        mock.querySelector('#btn-fake-install').addEventListener('click', () => {
          sound.playError();
          showToast("⚠️ ¡Peligro, Detective! Instalar este programa desconocido dañaría el equipo escolar.");
          DOM.runnerStatusText.textContent = `❌ ¡No debes instalarlo! Es un juego sospechoso. Inspecciona las 4 pistas que demuestran el riesgo.`;
        });
      } else if (stage.num === 2) {
        // Secuencia segura de descarga
        renderSequenceBuilder(stage, [
          { text: "Paso 1: Detenerse", slotId: 0 },
          { text: "Paso 2: Revisar", slotId: 1 },
          { text: "Paso 3: Consultar", slotId: 2 },
          { text: "Paso 4: Decisión", slotId: 3 }
        ]);
      } else if (stage.num === 3) {
        // Justificación por evidencias
        renderDecisionWithEvidence(stage);
      }
    }

    // ====================================================================
    // CASO 3: EL ROBO DE INFORMACIÓN
    // ====================================================================
    else if (caseData.id === 3) {
      if (stage.num === 1) {
        // Inspección de chat con mensajes sutiles y directos
        const layout = document.createElement('div');
        layout.className = 'chat-investigation-layout';
        layout.innerHTML = `
          <div class="mock-chat-device">
            <div class="chat-device-topbar">
              <span class="chat-avatar-status"></span>
              <span class="chat-device-title">Bandeja de Mensajes Escolares</span>
            </div>
            <div class="chat-messages-scroll" id="c3-messages-list"></div>
          </div>
          <div class="evidence-board-drawer" style="height: 380px;">
            <div class="board-drawer-title">
              <span>🔐 Datos Privados Detectados</span>
              <span id="c3-clue-counter">(0 de 4)</span>
            </div>
            <p style="font-size: 0.85rem; color: #cbd5e1;">Haz clic en los mensajes del chat que pidan información que NUNCA debes compartir con desconocidos.</p>
            <div class="evidence-notes-list" id="c3-notes-list" style="margin-top: 10px;"></div>
          </div>
        `;
        DOM.stageContainer.appendChild(layout);

        const listEl = layout.querySelector('#c3-messages-list');
        stage.messages.forEach(msg => {
          const bubble = document.createElement('div');
          bubble.className = 'chat-bubble bubble-incoming';
          bubble.id = `msg-${msg.id}`;
          bubble.innerHTML = `
            <span class="bubble-sender-name">${msg.sender}</span>
            <span class="bubble-text">${msg.text}</span>
          `;
          bubble.addEventListener('click', () => {
            handleChatMessageClick(msg, bubble, stage);
          });
          listEl.appendChild(bubble);
        });
      } else if (stage.num === 2) {
        // Cajas clasificadoras (Verde, Amarillo, Rojo)
        renderSortingBoxes(stage);
      } else if (stage.num === 3) {
        // Razonamiento combinatorio
        renderReasoningChecklist(stage);
      }
    }

    // ====================================================================
    // CASO 4: EL CHAT DE LA CLASE
    // ====================================================================
    else if (caseData.id === 4) {
      if (stage.num === 1) {
        // Escala de respeto
        renderRespectRanking(stage);
      } else if (stage.num === 2) {
        // Transformar frase ofensiva en constructiva
        renderSentenceWorkshop(stage);
      } else if (stage.num === 3) {
        // Dilema con consecuencias inmediatas
        renderDilemmaTree(stage);
      }
    }

    // ====================================================================
    // CASO 5: EL MISTERIO DEL ARCHIVO BORRADO
    // ====================================================================
    else if (caseData.id === 5) {
      if (stage.num === 1) {
        // Estaciones del sistema operativo
        renderSystemInvestigation(stage);
      } else if (stage.num === 2) {
        // Clasificación de acciones éticas
        renderActionClassification(stage);
      } else if (stage.num === 3) {
        // Decisión de cuenta ajena abierta
        renderDecisionWithEvidence(stage);
      }
    }

    // ====================================================================
    // CASO 6: LA ALERTA EXTRAÑA
    // ====================================================================
    else if (caseData.id === 6) {
      if (stage.num === 1) {
        // Navegador con pestañas e inspección
        renderBrowserAlertsInspection(stage);
      } else if (stage.num === 2) {
        // Semáforo Digital
        renderDigitalSemaphore(stage);
      } else if (stage.num === 3) {
        // Checklist de autoprotección
        renderReasoningChecklist(stage);
      }
    }
  }

  /* ========================================================================
     9. MECÁNICAS ESPECÍFICAS DE ETAPAS
     ======================================================================== */

  // Función auxiliar para mostrar un botón de comprobación directo dentro del escenario
  function showInSituVerifyButton(containerEl, labelText) {
    if (!containerEl) return;
    let btn = containerEl.querySelector('.in-situ-verify-btn');
    if (!btn) {
      btn = document.createElement('button');
      btn.className = 'in-situ-verify-btn';
      btn.onclick = () => {
        const caseData = CASES_DATA.find(c => c.id === AppState.activeCaseId);
        if (caseData) {
          verifyStageDeduction(caseData, caseData.stages[AppState.activeStageIndex]);
        }
      };
      containerEl.appendChild(btn);
    }
    btn.innerHTML = `<span>${labelText}</span>`;
    btn.style.display = 'inline-flex';
  }

  // --- CASO 1: HOTSPOTS DEL AULA ---
  function handleHotspotClick(item, element, stage) {
    if (AppState.stageRuntime.cluesChecked.has(item.id)) {
      AppState.stageRuntime.cluesChecked.delete(item.id);
      element.classList.remove('inspected');
    } else {
      AppState.stageRuntime.cluesChecked.add(item.id);
      element.classList.add('inspected');
      sound.playClueFound();
    }

    const currentCount = AppState.stageRuntime.cluesChecked.size;
    DOM.stageCounterCurrent.textContent = currentCount;
    document.getElementById('c1-scene-status').textContent = `Elementos marcados: ${currentCount}`;
    DOM.runnerStatusText.textContent = `Has marcado ${currentCount} de ${stage.targetCount} elementos. Pulsa 'Comprobar Deducción' al estar listo.`;

    if (currentCount >= stage.targetCount) {
      const legendBar = document.getElementById('c1-scene-status');
      if (legendBar && legendBar.parentElement) {
        showInSituVerifyButton(legendBar.parentElement, "✅ ¡5 Riesgos Marcados! Comprobar Deducción ➔");
      }
    }
  }

  // --- CASO 2: EVIDENCIAS EN VENTANA ---
  function handleEvidenceClueClick(clue, element, stage) {
    if (AppState.stageRuntime.evidenceChecked.has(clue.id)) return;
    AppState.stageRuntime.evidenceChecked.add(clue.id);

    element.classList.add('found');
    const metaTag = element.querySelector('.meta-tag');
    if (metaTag) metaTag.textContent = '✅ Archivada';
    sound.playClueFound();

    const notesContainer = document.getElementById('c2-evidence-notes');
    if (AppState.stageRuntime.evidenceChecked.size === 1) notesContainer.innerHTML = '';

    const note = document.createElement('div');
    note.className = 'evidence-sticky-note';
    note.innerHTML = `<span>📌</span> <strong>${clue.note}</strong>`;
    notesContainer.appendChild(note);

    const count = AppState.stageRuntime.evidenceChecked.size;
    document.getElementById('c2-evidence-counter').textContent = `(${count} de ${stage.targetCount} anotadas)`;
    DOM.stageCounterCurrent.textContent = count;
    DOM.runnerStatusText.textContent = `Evidencia archivada: ${clue.note}`;

    // Si ya están las 4 evidencias, mostrar botón directo y claro
    if (count >= stage.targetCount) {
      const drawer = document.getElementById('c2-board-drawer') || notesContainer.parentElement;
      showInSituVerifyButton(drawer, "✅ ¡4 de 4 Evidencias Registradas! Comprobar y Avanzar ➔");
      showToast("¡Excelente, Detective! Las 4 evidencias están listas en tu tablero.");
    }
  }

  // --- CASO 3: MENSAJES DEL CHAT ---
  function handleChatMessageClick(msg, bubbleEl, stage) {
    if (AppState.stageRuntime.cluesChecked.has(msg.id)) {
      AppState.stageRuntime.cluesChecked.delete(msg.id);
      bubbleEl.classList.remove('classified');
      const existing = document.getElementById(`note-${msg.id}`);
      if (existing) existing.remove();
    } else {
      AppState.stageRuntime.cluesChecked.add(msg.id);
      bubbleEl.classList.add('classified');
      sound.playClueFound();

      const notes = document.getElementById('c3-notes-list');
      const noteEl = document.createElement('div');
      noteEl.className = 'evidence-sticky-note';
      noteEl.id = `note-${msg.id}`;
      noteEl.innerHTML = `<span>🔒</span> <strong>${msg.sender}:</strong> "${msg.text}"`;
      notes.appendChild(noteEl);
    }

    const current = AppState.stageRuntime.cluesChecked.size;
    DOM.stageCounterCurrent.textContent = current;
    document.getElementById('c3-clue-counter').textContent = `(${current} de ${stage.targetCount})`;
    DOM.runnerStatusText.textContent = `Has seleccionado ${current} solicitudes sospechosas.`;

    if (current >= stage.targetCount) {
      const notes = document.getElementById('c3-notes-list');
      if (notes && notes.parentElement) {
        showInSituVerifyButton(notes.parentElement, "✅ ¡4 Mensajes Sospechosos Marcados! Comprobar ➔");
      }
    }
  }

  // --- COMPONENTE: CONSTRUCTOR DE SECUENCIAS (DRAG & DROP + CLIC) ---
  function renderSequenceBuilder(stage, slotDefinitions) {
    const wrapper = document.createElement('div');
    wrapper.className = 'sequence-builder-container';
    wrapper.innerHTML = `
      <div class="sequence-slots-row" id="seq-slots-row"></div>
      <div style="font-size: 0.88rem; font-weight: 700; color: #38bdf8; margin-top: 8px;">
        Banco de acciones disponibles (Haz clic o arrastra para ordenar):
      </div>
      <div class="sequence-bank-options" id="seq-bank-row"></div>
    `;
    DOM.stageContainer.appendChild(wrapper);

    const slotsRow = wrapper.querySelector('#seq-slots-row');
    const bankRow = wrapper.querySelector('#seq-bank-row');

    AppState.stageRuntime.currentSequence = new Array(slotDefinitions.length).fill(null);

    // Render slots
    slotDefinitions.forEach((slot, idx) => {
      const slotEl = document.createElement('div');
      slotEl.className = 'sequence-drop-slot';
      slotEl.id = `slot-${idx}`;
      slotEl.dataset.slotIndex = idx;
      slotEl.innerHTML = `
        <span class="slot-order-number">${idx + 1}</span>
        <span class="slot-placeholder">${slot.text}</span>
      `;

      // Drag and drop events
      slotEl.addEventListener('dragover', (e) => {
        e.preventDefault();
        slotEl.classList.add('dragover');
      });
      slotEl.addEventListener('dragleave', () => {
        slotEl.classList.remove('dragover');
      });
      slotEl.addEventListener('drop', (e) => {
        e.preventDefault();
        slotEl.classList.remove('dragover');
        const itemId = e.dataTransfer.getData('text/plain');
        assignItemToSlot(itemId, idx, stage);
      });

      // Clic para desasignar
      slotEl.addEventListener('click', () => {
        if (AppState.stageRuntime.currentSequence[idx]) {
          unassignSlot(idx, stage);
        }
      });

      slotsRow.appendChild(slotEl);
    });

    // Render items in bank
    stage.options.forEach(item => {
      const card = document.createElement('div');
      card.className = `draggable-card-item ${item.safe === false ? 'danger-trap' : ''}`;
      card.id = `card-item-${item.id}`;
      card.draggable = true;
      card.innerHTML = `
        <span>${item.icon || '📌'}</span>
        <span>${item.text}</span>
      `;

      card.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', item.id);
        card.classList.add('dragging');
      });
      card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
      });

      // Alternativa accesible por clic: asigna al primer hueco libre
      card.addEventListener('click', () => {
        const freeSlotIdx = AppState.stageRuntime.currentSequence.findIndex(s => s === null);
        if (freeSlotIdx !== -1) {
          assignItemToSlot(item.id, freeSlotIdx, stage);
        } else {
          showToast("Todos los lugares están ocupados. Haz clic en uno para liberarlo.");
        }
      });

      bankRow.appendChild(card);
    });
  }

  function assignItemToSlot(itemId, slotIdx, stage) {
    const item = stage.options.find(o => o.id === itemId);
    if (!item) return;

    // Si ya estaba en otro slot, lo liberamos
    const previousIndex = AppState.stageRuntime.currentSequence.indexOf(itemId);
    if (previousIndex !== -1) {
      AppState.stageRuntime.currentSequence[previousIndex] = null;
      resetSlotUI(previousIndex);
    }

    // Asignar
    AppState.stageRuntime.currentSequence[slotIdx] = itemId;
    sound.playClick();

    const slotEl = document.getElementById(`slot-${slotIdx}`);
    slotEl.innerHTML = `
      <span class="slot-order-number">${slotIdx + 1}</span>
      <div style="font-weight: 700; color: #fff; text-align: center;">
        ${item.icon || ''} ${item.text}
        <span class="card-item-remove-btn" title="Quitar">✖</span>
      </div>
    `;
    slotEl.style.borderColor = 'var(--accent-cyan)';
    slotEl.style.background = 'rgba(6, 182, 212, 0.15)';

    // Ocultar del banco
    const cardEl = document.getElementById(`card-item-${itemId}`);
    if (cardEl) cardEl.style.opacity = '0.3';

    DOM.runnerStatusText.textContent = `Acción asignada en el paso ${slotIdx + 1}.`;

    if (!AppState.stageRuntime.currentSequence.includes(null)) {
      const container = document.getElementById('seq-bank-row');
      if (container && container.parentElement) {
        showInSituVerifyButton(container.parentElement, "✅ ¡Secuencia Completa! Comprobar Deducción ➔");
      }
    }
  }

  function unassignSlot(slotIdx, stage) {
    const itemId = AppState.stageRuntime.currentSequence[slotIdx];
    if (!itemId) return;

    AppState.stageRuntime.currentSequence[slotIdx] = null;
    sound.playClick();
    resetSlotUI(slotIdx);

    const cardEl = document.getElementById(`card-item-${itemId}`);
    if (cardEl) cardEl.style.opacity = '1';
  }

  function resetSlotUI(slotIdx) {
    const slotEl = document.getElementById(`slot-${slotIdx}`);
    if (!slotEl) return;
    slotEl.innerHTML = `
      <span class="slot-order-number">${slotIdx + 1}</span>
      <span class="slot-placeholder">Paso ${slotIdx + 1} vacío</span>
    `;
    slotEl.style.borderColor = 'rgba(255, 255, 255, 0.2)';
    slotEl.style.background = 'rgba(0, 0, 0, 0.28)';
  }

  // --- COMPONENTE: ORDENAMIENTO DE TRANSFERENCIA (CASO 1 ETAPA 3) ---
  function renderOrderingTransfer(stage) {
    const container = document.createElement('div');
    container.className = 'sequence-builder-container';
    container.innerHTML = `
      <p style="font-size: 0.92rem; color: #cbd5e1;">Haz clic sobre cada paso en el orden en que deberían realizarse:</p>
      <div class="respect-ranking-grid" id="transfer-steps-pool"></div>
      <div style="margin-top: 14px; font-weight: 700; color: #38bdf8;">Tu orden de traslado propuesto:</div>
      <div class="sentence-builder-zone" id="transfer-built-list" style="min-height: 90px;"></div>
    `;
    DOM.stageContainer.appendChild(container);

    const pool = container.querySelector('#transfer-steps-pool');
    const built = container.querySelector('#transfer-built-list');

    // Barajar pasos
    const shuffled = [...stage.steps].sort(() => Math.random() - 0.5);

    shuffled.forEach(step => {
      const stepBtn = document.createElement('button');
      stepBtn.className = 'dilemma-choice-btn';
      stepBtn.id = `step-trans-${step.id}`;
      stepBtn.innerHTML = `
        <span style="font-weight: 600;">${step.icon} ${step.text}</span>
        <span style="font-size: 0.8rem; color: #38bdf8;">Añadir ➔</span>
      `;
      stepBtn.addEventListener('click', () => {
        if (!AppState.stageRuntime.currentSequence.includes(step.id)) {
          AppState.stageRuntime.currentSequence.push(step.id);
          sound.playClick();
          stepBtn.style.opacity = '0.3';
          stepBtn.disabled = true;

          const chip = document.createElement('span');
          chip.className = 'draggable-card-item';
          chip.id = `chip-trans-${step.id}`;
          chip.innerHTML = `${AppState.stageRuntime.currentSequence.length}. ${step.text} <span class="card-item-remove-btn">✖</span>`;
          chip.addEventListener('click', () => {
            // Quitar chip
            AppState.stageRuntime.currentSequence = AppState.stageRuntime.currentSequence.filter(id => id !== step.id);
            chip.remove();
            stepBtn.style.opacity = '1';
            stepBtn.disabled = false;
            sound.playClick();
          });
          built.appendChild(chip);
          if (AppState.stageRuntime.currentSequence.length === stage.steps.length) {
            showInSituVerifyButton(built.parentElement, "✅ ¡4 Pasos Ordenados! Comprobar Traslado ➔");
          }
        }
      });
      pool.appendChild(stepBtn);
    });
  }

  // --- COMPONENTE: CAJAS CLASIFICADORAS (CASO 3 ETAPA 2 & CASO 5 ETAPA 2) ---
  function renderSortingBoxes(stage) {
    const container = document.createElement('div');
    container.className = 'chat-investigation-layout';
    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <span style="font-size: 0.9rem; font-weight: 700; color: #38bdf8;">Elementos a clasificar:</span>
        <div class="sequence-bank-options" id="sorting-items-pool"></div>
      </div>
      <div class="sorting-boxes-grid" id="sorting-target-boxes"></div>
    `;
    DOM.stageContainer.appendChild(container);

    const pool = container.querySelector('#sorting-items-pool');
    const boxesContainer = container.querySelector('#sorting-target-boxes');

    // Cajas destino
    stage.boxes.forEach(box => {
      const boxEl = document.createElement('div');
      const boxColorClass = box.id === 'green' ? 'box-green' : (box.id === 'yellow' ? 'box-yellow' : 'box-red');
      boxEl.className = `classification-dropzone ${boxColorClass}`;
      boxEl.id = `box-drop-${box.id}`;
      boxEl.innerHTML = `
        <div class="zone-header-title">
          <span>${box.name}</span>
          <span style="font-size: 0.75rem; font-weight: 400; color: #94a3b8;">(${box.desc})</span>
        </div>
        <div class="zone-items-bin" id="bin-${box.id}"></div>
      `;

      // Drag and drop events
      boxEl.addEventListener('dragover', (e) => {
        e.preventDefault();
        boxEl.classList.add('dragover');
      });
      boxEl.addEventListener('dragleave', () => {
        boxEl.classList.remove('dragover');
      });
      boxEl.addEventListener('drop', (e) => {
        e.preventDefault();
        boxEl.classList.remove('dragover');
        const itemId = e.dataTransfer.getData('text/plain');
        placeItemInBox(itemId, box.id, stage);
      });

      boxesContainer.appendChild(boxEl);
    });

    // Elementos arrastrables
    (stage.items || stage.actions).forEach(item => {
      const itemEl = document.createElement('div');
      itemEl.className = 'draggable-card-item';
      itemEl.id = `sort-item-${item.id}`;
      itemEl.draggable = true;
      itemEl.innerHTML = `<span>📌</span> <span>${item.text}</span>`;

      itemEl.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', item.id);
      });

      // Alternativa por clic
      itemEl.addEventListener('click', () => {
        cycleItemBox(item.id, stage);
      });

      pool.appendChild(itemEl);
    });
  }

  function placeItemInBox(itemId, boxId, stage) {
    AppState.stageRuntime.sortingPlacement[itemId] = boxId;
    sound.playClick();

    const bin = document.getElementById(`bin-${boxId}`);
    const itemCard = document.getElementById(`sort-item-${itemId}`);
    if (bin && itemCard) {
      itemCard.remove();
      const placed = document.createElement('span');
      placed.className = 'draggable-card-item';
      placed.id = `placed-${itemId}`;
      const itemData = (stage.items || stage.actions).find(i => i.id === itemId);
      placed.innerHTML = `<span>${itemData.text}</span> <span class="card-item-remove-btn">✖</span>`;
      placed.addEventListener('click', () => {
        // Devolver al banco
        delete AppState.stageRuntime.sortingPlacement[itemId];
        placed.remove();
        returnItemToPool(itemData, stage);
      });
      bin.appendChild(placed);
    }

    const totalItems = (stage.items || stage.actions).length;
    if (Object.keys(AppState.stageRuntime.sortingPlacement).length === totalItems) {
      const boxesContainer = document.getElementById('sorting-target-boxes');
      if (boxesContainer && boxesContainer.parentElement) {
        showInSituVerifyButton(boxesContainer.parentElement, "✅ ¡Todos los elementos clasificados! Comprobar ➔");
      }
    }
  }

  function cycleItemBox(itemId, stage) {
    const boxes = stage.boxes.map(b => b.id);
    const currentBox = AppState.stageRuntime.sortingPlacement[itemId];
    let nextBox = boxes[0];
    if (currentBox) {
      const idx = boxes.indexOf(currentBox);
      nextBox = boxes[(idx + 1) % boxes.length];
    }
    placeItemInBox(itemId, nextBox, stage);
  }

  function returnItemToPool(itemData, stage) {
    const pool = document.getElementById('sorting-items-pool');
    if (!pool) return;
    const itemEl = document.createElement('div');
    itemEl.className = 'draggable-card-item';
    itemEl.id = `sort-item-${itemData.id}`;
    itemEl.draggable = true;
    itemEl.innerHTML = `<span>📌</span> <span>${itemData.text}</span>`;
    itemEl.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', itemData.id);
    });
    itemEl.addEventListener('click', () => {
      cycleItemBox(itemData.id, stage);
    });
    pool.appendChild(itemEl);
    sound.playClick();
  }

  // --- COMPONENTE: DECISIÓN Y JUSTIFICACIÓN POR EVIDENCIAS (CASO 2 ETAPA 3 & CASO 5 ETAPA 3) ---
  function renderDecisionWithEvidence(stage) {
    const wrapper = document.createElement('div');
    wrapper.className = 'reasoning-builder-panel';
    wrapper.innerHTML = `
      <div class="reasoning-question">${stage.question}</div>
      <div class="respect-ranking-grid" id="decision-choices-list"></div>
      
      <div style="margin-top: 16px; border-top: 1px solid var(--border-light); padding-top: 14px;">
        <div class="reasoning-question">¿Qué pistas y razones justifican tu decisión? (Selecciona todas las correctas):</div>
        <div class="reasoning-chips-pool" id="justifications-chips-list" style="margin-top: 10px;"></div>
      </div>
    `;
    DOM.stageContainer.appendChild(wrapper);

    const choicesList = wrapper.querySelector('#decision-choices-list');
    stage.choices.forEach(ch => {
      const btn = document.createElement('button');
      btn.className = 'dilemma-choice-btn';
      btn.id = `choice-${ch.id}`;
      btn.innerHTML = `<span>⚖️ ${ch.text}</span>`;
      btn.addEventListener('click', () => {
        choicesList.querySelectorAll('.dilemma-choice-btn').forEach(b => {
          b.style.borderColor = 'var(--border-light)';
          b.style.background = 'rgba(255,255,255,0.05)';
        });
        btn.style.borderColor = 'var(--accent-cyan)';
        btn.style.background = 'rgba(6, 182, 212, 0.18)';
        AppState.stageRuntime.decisionSelected = ch.id;
        sound.playClick();
      });
      choicesList.appendChild(btn);
    });

    const justList = wrapper.querySelector('#justifications-chips-list');
    stage.justifications.forEach(just => {
      const label = document.createElement('label');
      label.className = 'chip-checkbox-label';
      label.id = `chip-just-${just.id}`;
      label.innerHTML = `
        <input type="checkbox" value="${just.id}">
        <span>${just.text}</span>
      `;
      const input = label.querySelector('input');
      input.addEventListener('change', () => {
        if (input.checked) {
          AppState.stageRuntime.evidenceChecked.add(just.id);
          label.classList.add('selected');
        } else {
          AppState.stageRuntime.evidenceChecked.delete(just.id);
          label.classList.remove('selected');
        }
        sound.playClick();
      });
      justList.appendChild(label);
    });

    showInSituVerifyButton(wrapper, "🔍 Comprobar Decisión y Evidencias ➔");
  }

  // --- COMPONENTE: REASONING CHECKLIST (CASO 3 ETAPA 3 & CASO 6 ETAPA 3) ---
  function renderReasoningChecklist(stage) {
    const wrapper = document.createElement('div');
    wrapper.className = 'reasoning-builder-panel';
    wrapper.innerHTML = `
      <div class="reasoning-question">Selecciona las afirmaciones que demuestran una justificación válida y reflexiva:</div>
      <div class="reasoning-chips-pool" id="reasoning-checks-pool" style="display: flex; flex-direction: column; gap: 10px; margin-top: 12px;"></div>
    `;
    DOM.stageContainer.appendChild(wrapper);

    const pool = wrapper.querySelector('#reasoning-checks-pool');
    stage.options.forEach(opt => {
      const label = document.createElement('label');
      label.className = 'chip-checkbox-label';
      label.style.width = '100%';
      label.innerHTML = `
        <input type="checkbox" value="${opt.id}">
        <span style="font-size: 0.92rem;">${opt.text}</span>
      `;
      const input = label.querySelector('input');
      input.addEventListener('change', () => {
        if (input.checked) {
          AppState.stageRuntime.evidenceChecked.add(opt.id);
          label.classList.add('selected');
        } else {
          AppState.stageRuntime.evidenceChecked.delete(opt.id);
          label.classList.remove('selected');
        }
        sound.playClick();
      });
      pool.appendChild(label);
    });

    showInSituVerifyButton(wrapper, "🔍 Comprobar Razonamiento ➔");
  }

  // --- CASO 4: RANKING DE RESPETO (ETAPA 1) ---
  function renderRespectRanking(stage) {
    const wrapper = document.createElement('div');
    wrapper.className = 'sequence-builder-container';
    wrapper.innerHTML = `
      <p style="font-size: 0.9rem; color: #cbd5e1;">Haz clic en cada mensaje para ordenarlos desde el <strong>MENOS RESPETUOSO</strong> (1) hasta el <strong>MÁS RESPETUOSO</strong> (4):</p>
      <div class="respect-ranking-grid" id="respect-cards-source"></div>
      <div style="margin-top: 14px; font-weight: 700; color: #38bdf8;">Tu escala de respeto ordenada:</div>
      <div id="respect-ranked-target" style="display: flex; flex-direction: column; gap: 8px;"></div>
    `;
    DOM.stageContainer.appendChild(wrapper);

    const source = wrapper.querySelector('#respect-cards-source');
    const target = wrapper.querySelector('#respect-ranked-target');

    // Mezclar
    const shuffled = [...stage.items].sort(() => Math.random() - 0.5);

    shuffled.forEach(item => {
      const btn = document.createElement('button');
      btn.className = 'dilemma-choice-btn';
      btn.id = `btn-rank-${item.id}`;
      btn.innerHTML = `<span>💬 "${item.text}"</span> <span style="font-size: 0.8rem; color: #38bdf8;">Ubicar ➔</span>`;
      btn.addEventListener('click', () => {
        if (!AppState.stageRuntime.currentSequence.includes(item.id)) {
          AppState.stageRuntime.currentSequence.push(item.id);
          btn.style.opacity = '0.3';
          btn.disabled = true;
          sound.playClick();

          const rankIdx = AppState.stageRuntime.currentSequence.length;
          const slot = document.createElement('div');
          slot.className = 'respect-item-slot';
          slot.id = `ranked-slot-${item.id}`;
          slot.innerHTML = `
            <span class="slot-rank-badge">Nivel ${rankIdx}</span>
            <span style="flex:1; font-weight: 600;">"${item.text}"</span>
            <span class="card-item-remove-btn">✖</span>
          `;
          slot.querySelector('.card-item-remove-btn').addEventListener('click', () => {
            AppState.stageRuntime.currentSequence = AppState.stageRuntime.currentSequence.filter(id => id !== item.id);
            slot.remove();
            btn.style.opacity = '1';
            btn.disabled = false;
            sound.playClick();
          });
          target.appendChild(slot);

          if (AppState.stageRuntime.currentSequence.length === stage.items.length) {
            showInSituVerifyButton(target.parentElement, "✅ ¡Escala Completa! Comprobar Orden ➔");
          }
        }
      });
      source.appendChild(btn);
    });
  }

  // --- CASO 4: TALLER DE RECONSTRUCCIÓN ASERTIVA (ETAPA 2) ---
  function renderSentenceWorkshop(stage) {
    const wrapper = document.createElement('div');
    wrapper.className = 'message-transform-workshop';
    wrapper.innerHTML = `
      <div class="message-original-offense">
        <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 800; color: #f87171;">Mensaje Ofensivo Original:</span>
        <div style="font-size: 1.1rem; font-weight: 700; color: #fff;">"${stage.originalText}"</div>
      </div>
      <p style="font-size: 0.9rem; color: #cbd5e1;">Haz clic sobre los fragmentos en orden para reconstruir una respuesta asertiva y constructiva:</p>
      <div class="sequence-bank-options" id="fragments-pool"></div>
      <div style="font-weight: 700; color: #38bdf8;">Tu mensaje constructivo formulado:</div>
      <div class="sentence-builder-zone" id="sentence-zone"></div>
    `;
    DOM.stageContainer.appendChild(wrapper);

    const pool = wrapper.querySelector('#fragments-pool');
    const zone = wrapper.querySelector('#sentence-zone');

    const shuffled = [...stage.fragments].sort(() => Math.random() - 0.5);

    shuffled.forEach(frag => {
      const chip = document.createElement('button');
      chip.className = 'draggable-card-item';
      chip.id = `frag-btn-${frag.id}`;
      chip.textContent = frag.text;

      chip.addEventListener('click', () => {
        if (!AppState.stageRuntime.currentSequence.includes(frag.id)) {
          AppState.stageRuntime.currentSequence.push(frag.id);
          chip.style.opacity = '0.3';
          chip.disabled = true;
          sound.playClick();

          const placedFrag = document.createElement('span');
          placedFrag.className = 'draggable-card-item';
          placedFrag.id = `placed-frag-${frag.id}`;
          placedFrag.innerHTML = `${frag.text} <span class="card-item-remove-btn">✖</span>`;
          placedFrag.addEventListener('click', () => {
            AppState.stageRuntime.currentSequence = AppState.stageRuntime.currentSequence.filter(id => id !== frag.id);
            placedFrag.remove();
            chip.style.opacity = '1';
            chip.disabled = false;
            sound.playClick();
          });
          zone.appendChild(placedFrag);

          if (AppState.stageRuntime.currentSequence.length === stage.fragments.length) {
            showInSituVerifyButton(zone.parentElement, "✅ ¡Mensaje Formulado! Comprobar Asertividad ➔");
          }
        }
      });

      pool.appendChild(chip);
    });
  }

  // --- CASO 4: ÁRBOL DE CONSECUENCIAS (ETAPA 3) ---
  function renderDilemmaTree(stage) {
    const wrapper = document.createElement('div');
    wrapper.className = 'consequence-tree-box';
    wrapper.innerHTML = `
      <p style="font-size: 0.95rem; font-weight: 700; color: #fbbf24;">${stage.instruction}</p>
      <div class="respect-ranking-grid" id="dilemma-choices-grid"></div>
      <div id="dilemma-consequence-display" style="display: none; margin-top: 14px;"></div>
    `;
    DOM.stageContainer.appendChild(wrapper);

    const choicesGrid = wrapper.querySelector('#dilemma-choices-grid');
    const consequenceBox = wrapper.querySelector('#dilemma-consequence-display');

    stage.dilemmaChoices.forEach(choice => {
      const btn = document.createElement('button');
      btn.className = 'dilemma-choice-btn';
      btn.id = `dilemma-btn-${choice.id}`;
      btn.innerHTML = `<span>👉 ${choice.text}</span>`;
      btn.addEventListener('click', () => {
        choicesGrid.querySelectorAll('.dilemma-choice-btn').forEach(b => {
          b.style.borderColor = 'var(--border-light)';
          b.style.background = 'rgba(255,255,255,0.05)';
        });
        btn.style.borderColor = choice.isGood ? 'var(--accent-emerald)' : 'var(--accent-ruby)';
        btn.style.background = choice.isGood ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)';

        AppState.stageRuntime.dilemmaSelected = choice;
        sound.playClick();

        consequenceBox.style.display = 'block';
        consequenceBox.className = `consequence-callout ${choice.isGood ? 'good' : 'bad'}`;
        consequenceBox.innerHTML = `<strong>Resultado de tu acción:</strong><br>${choice.consequence}`;

        showInSituVerifyButton(consequenceBox.parentElement, "✅ Confirmar Decisión y Consecuencia ➔");
      });
      choicesGrid.appendChild(btn);
    });
  }

  // --- CASO 5: ESTACIONES DE INVESTIGACIÓN (ETAPA 1) ---
  function renderSystemInvestigation(stage) {
    const wrapper = document.createElement('div');
    wrapper.className = 'classroom-scene-box';
    wrapper.innerHTML = `
      <p style="font-size: 0.9rem; color: #cbd5e1;">Haz clic en cada estación del computador escolar para examinar las evidencias:</p>
      <div class="scene-desk-area" id="sys-spots-grid"></div>
      <div class="evidence-board-drawer" style="margin-top: 16px;">
        <div class="board-drawer-title">
          <span>📁 Registro de Evidencias Técnicas</span>
          <span id="sys-counter">(0 de 4 inspeccionadas)</span>
        </div>
        <div class="evidence-notes-list" id="sys-notes-list"></div>
      </div>
    `;
    DOM.stageContainer.appendChild(wrapper);

    const grid = wrapper.querySelector('#sys-spots-grid');
    const notesList = wrapper.querySelector('#sys-notes-list');

    stage.spots.forEach(spot => {
      const card = document.createElement('div');
      card.className = 'scene-hotspot-item';
      card.id = `spot-${spot.id}`;
      card.innerHTML = `<span class="hotspot-label" style="font-size: 0.95rem;">${spot.name}</span>`;

      card.addEventListener('click', () => {
        if (!AppState.stageRuntime.cluesChecked.has(spot.id)) {
          AppState.stageRuntime.cluesChecked.add(spot.id);
          card.classList.add('inspected');
          sound.playClueFound();

          const note = document.createElement('div');
          note.className = 'evidence-sticky-note';
          note.innerHTML = `<span>📌</span> <strong>${spot.name}:</strong> ${spot.clue}`;
          notesList.appendChild(note);

          const count = AppState.stageRuntime.cluesChecked.size;
          document.getElementById('sys-counter').textContent = `(${count} de 4 inspeccionadas)`;
          DOM.stageCounterCurrent.textContent = count;

          if (count >= 4) {
            showInSituVerifyButton(notesList.parentElement, "✅ ¡Estaciones Inspeccionadas! Comprobar ➔");
          }
        }
      });
      grid.appendChild(card);
    });
  }

  // --- CASO 5: CLASIFICACIÓN DE ACCIONES (ETAPA 2) ---
  function renderActionClassification(stage) {
    renderSortingBoxes({
      boxes: stage.boxes,
      items: stage.actions
    });
  }

  // --- CASO 6: INSPECCIÓN DE ALERTAS EN NAVEGADOR (ETAPA 1) ---
  function renderBrowserAlertsInspection(stage) {
    const wrapper = document.createElement('div');
    wrapper.className = 'installer-mock-window';
    wrapper.innerHTML = `
      <div class="installer-window-titlebar">
        <div class="window-dots"><span class="window-dot"></span><span class="window-dot"></span><span class="window-dot"></span></div>
        <span class="window-title-text">Navegador Web Seguro &bull; https://portal-escolar.edu</span>
        <span>🔍</span>
      </div>
      <div class="installer-window-body" id="browser-alerts-list">
        <p style="font-size: 0.88rem; color: #cbd5e1;">Haz clic en la lupa de cada situación para examinar su autenticidad:</p>
      </div>
    `;
    DOM.stageContainer.appendChild(wrapper);

    const list = wrapper.querySelector('#browser-alerts-list');
    stage.alerts.forEach(al => {
      const row = document.createElement('div');
      row.className = 'clue-inspectable-row';
      row.id = `alert-${al.id}`;
      row.innerHTML = `
        <div style="flex:1;">
          <div style="font-weight: 700; color: #fff;">${al.title}</div>
          <div class="alert-clue-detail" style="font-size: 0.82rem; color: #38bdf8; display: none; margin-top: 4px;">
            🔎 Deducción: ${al.clue}
          </div>
        </div>
        <span class="meta-tag">🔍 Examinar</span>
      `;

      row.addEventListener('click', () => {
        if (!AppState.stageRuntime.cluesChecked.has(al.id)) {
          AppState.stageRuntime.cluesChecked.add(al.id);
          row.classList.add('found');
          row.querySelector('.alert-clue-detail').style.display = 'block';
          sound.playClueFound();

          const count = AppState.stageRuntime.cluesChecked.size;
          DOM.stageCounterCurrent.textContent = count;

          if (count >= 4) {
            showInSituVerifyButton(list.parentElement, "✅ ¡Alertas Examinadas! Comprobar ➔");
          }
        }
      });
      list.appendChild(row);
    });
  }

  // --- CASO 6: SEMÁFORO DIGITAL (ETAPA 2) ---
  function renderDigitalSemaphore(stage) {
    const wrapper = document.createElement('div');
    wrapper.className = 'sequence-builder-container';
    wrapper.innerHTML = `
      <p style="font-size: 0.9rem; color: #cbd5e1;">Asigna a cada situación la luz adecuada del Semáforo Digital:</p>
      <div style="display: flex; flex-direction: column; gap: 16px;" id="semaphore-situations-list"></div>
    `;
    DOM.stageContainer.appendChild(wrapper);

    const list = wrapper.querySelector('#semaphore-situations-list');
    stage.situations.forEach(sit => {
      const card = document.createElement('div');
      card.className = 'consequence-tree-box';
      card.id = `sem-sit-${sit.id}`;
      card.innerHTML = `
        <div style="font-weight: 700; font-size: 0.95rem; color: #fff;">${sit.title}</div>
        <div class="semaphore-controls-bar">
          <button class="btn-semaphore sem-green" data-light="green" data-sit="${sit.id}">
            <span style="font-size: 1.4rem;">🟢</span>
            <span>PUEDO CONTINUAR</span>
          </button>
          <button class="btn-semaphore sem-yellow" data-light="yellow" data-sit="${sit.id}">
            <span style="font-size: 1.4rem;">🟡</span>
            <span>ME DETENGO Y REVISO</span>
          </button>
          <button class="btn-semaphore sem-red" data-light="red" data-sit="${sit.id}">
            <span style="font-size: 1.4rem;">🔴</span>
            <span>NO CONTINÚO Y PIDO AYUDA</span>
          </button>
        </div>
      `;

      card.querySelectorAll('.btn-semaphore').forEach(btn => {
        btn.addEventListener('click', () => {
          card.querySelectorAll('.btn-semaphore').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          AppState.stageRuntime.selectedSemaphore[sit.id] = btn.dataset.light;
          sound.playClick();

          if (Object.keys(AppState.stageRuntime.selectedSemaphore).length === stage.situations.length) {
            showInSituVerifyButton(list.parentElement, "✅ ¡Semáforo Asignado! Comprobar ➔");
          }
        });
      });

      list.appendChild(card);
    });
  }

  /* ========================================================================
     10. COMPROBACIÓN Y VALIDACIÓN PEDAGÓGICA DE DEDUCCIONES
     ======================================================================== */
  DOM.btnVerifyAction.addEventListener('click', () => {
    const caseData = CASES_DATA.find(c => c.id === AppState.activeCaseId);
    if (!caseData) return;
    const stage = caseData.stages[AppState.activeStageIndex];
    if (!stage) return;

    verifyStageDeduction(caseData, stage);
  });

  function verifyStageDeduction(caseData, stage) {
    let passed = false;
    let feedback = "";

    // CASO 1 ETAPA 1: 5 HOTSPOTS
    if (caseData.id === 1 && stage.num === 1) {
      const selected = Array.from(AppState.stageRuntime.cluesChecked);
      const correctClues = stage.items.filter(i => i.isClue).map(i => i.id);
      const correctFound = selected.filter(id => correctClues.includes(id));
      const wrongFound = selected.filter(id => !correctClues.includes(id));

      if (correctFound.length === 5 && wrongFound.length === 0) {
        passed = true;
        feedback = "¡Perfecto! Identificaste los 5 riesgos para el equipo: agua, comida, cables sueltos, sol directo y peso sobre el teclado.";
      } else {
        feedback = `Has encontrado ${correctFound.length} de 5 riesgos reales${wrongFound.length > 0 ? ` (y marcaste ${wrongFound.length} objeto seguro que no daña el equipo)` : ''}. Vuelve a examinar el aula.`;
      }
    }

    // CASO 1 ETAPA 2: SECUENCIA DE PREPARACIÓN
    else if (caseData.id === 1 && stage.num === 2) {
      const current = AppState.stageRuntime.currentSequence;
      const isCorrect = JSON.stringify(current) === JSON.stringify(stage.correctOrder);
      if (isCorrect) {
        passed = true;
        feedback = "¡Excelente! Orden correcto: 1. Manos limpias y secas ➔ 2. Revisar cables seguros ➔ 3. Sentarse con buena postura. ¡Descartaste las trampas!";
      } else {
        feedback = "El orden no es el adecuado o incluiste alguna acción peligrosa (bebida cerca, golpear teclas o mochila encima). Revisa y vuelve a ordenar.";
      }
    }

    // CASO 1 ETAPA 3: TRANSPORTE DE TABLETA
    else if (caseData.id === 1 && stage.num === 3) {
      const isCorrect = JSON.stringify(AppState.stageRuntime.currentSequence) === JSON.stringify(stage.correctOrder);
      if (isCorrect) {
        passed = true;
        feedback = "¡Magnífico! Desconectar con cuidado ➔ Sujetar firme con dos manos ➔ Caminar despacio ➔ Apoyar en el centro de la mesa.";
      } else {
        feedback = "Ese orden de traslado pondría en riesgo la tableta de una caída. Recuerda desenchufar antes de caminar y sostener con ambas manos.";
      }
    }

    // CASO 2 ETAPA 1: EVIDENCIAS DE DESCARGA
    else if (caseData.id === 2 && stage.num === 1) {
      if (AppState.stageRuntime.evidenceChecked.size >= 4) {
        passed = true;
        feedback = "¡Tablero completo! Detectaste: Autor desconocido, permisos abusivos, prisa innecesaria y falta de verificación.";
      } else {
        feedback = `Llevas ${AppState.stageRuntime.evidenceChecked.size} de 4 evidencias. Haz clic sobre los datos dudosos de la ventana.`;
      }
    }

    // CASO 2 ETAPA 2: SECUENCIA SEGURA DE DESCARGA
    else if (caseData.id === 2 && stage.num === 2) {
      const isCorrect = JSON.stringify(AppState.stageRuntime.currentSequence) === JSON.stringify(stage.correctOrder);
      if (isCorrect) {
        passed = true;
        feedback = "¡Deducción brillante! Detenerse ➔ Revisar permisos ➔ Consultar con un adulto ➔ Instalar solo si está autorizado.";
      } else {
        feedback = "La secuencia no es segura. Primero debes detenerte a inspeccionar antes de consultar o tomar una decisión de instalación.";
      }
    }

    // CASO 2 ETAPA 3: DECISIÓN Y JUSTIFICACIÓN
    else if (caseData.id === 2 && stage.num === 3) {
      const isChoiceGood = AppState.stageRuntime.decisionSelected === 'cancel_ask';
      const evs = Array.from(AppState.stageRuntime.evidenceChecked);
      const correctEvs = ['j1', 'j2', 'j4'];
      const hasAllCorrect = correctEvs.every(id => evs.includes(id)) && !evs.includes('j3');

      if (isChoiceGood && hasAllCorrect) {
        passed = true;
        feedback = "¡Extraordinario! Cancelaste y argumentaste con fundamentos: una app de fotos no necesita micrófono ni tus contactos familiares.";
      } else {
        feedback = "Tu decisión o tus justificaciones no están completas. Recuerda que cancelar y preguntar requiere respaldarse con evidencias de privacidad.";
      }
    }

    // CASO 3 ETAPA 1: DETECCIÓN DE DATOS DE RIESGO
    else if (caseData.id === 3 && stage.num === 1) {
      const selected = Array.from(AppState.stageRuntime.cluesChecked);
      const risky = stage.messages.filter(m => m.isRisky).map(m => m.id);
      const correctFound = selected.filter(id => risky.includes(id));
      const harmlessMarked = selected.filter(id => !risky.includes(id));

      if (correctFound.length === 4 && harmlessMarked.length === 0) {
        passed = true;
        feedback = "¡Gran ojo de detective! Identificaste que dirección, contraseña, horario de salida y nombres familiares son datos de alto riesgo.";
      } else {
        feedback = `Has detectado ${correctFound.length} de los 4 datos peligrosos${harmlessMarked.length > 0 ? ' (y marcaste preguntas inofensivas como color o animal favorito)' : ''}.`;
      }
    }

    // CASO 3 ETAPA 2: CLASIFICACIÓN DE INFORMACIÓN (3 CAJAS)
    else if (caseData.id === 3 && stage.num === 2) {
      const placement = AppState.stageRuntime.sortingPlacement;
      const allPlaced = stage.items.every(i => placement[i.id]);
      const allCorrect = stage.items.every(i => placement[i.id] === i.targetBox);

      if (allPlaced && allCorrect) {
        passed = true;
        feedback = "¡Clasificación impecable! Comprendiste qué datos son generales, cuáles dependen del contexto escolar y cuáles son estrictamente confidenciales.";
      } else {
        feedback = "Algunos datos están en la caja incorrecta o faltan por clasificar. La contraseña y tu casa son rojas; gustos generales son verdes.";
      }
    }

    // CASO 3 ETAPA 3: RAZONAMIENTO COMBINATORIO
    else if (caseData.id === 3 && stage.num === 3) {
      const evs = Array.from(AppState.stageRuntime.evidenceChecked);
      const correct = ['r1', 'r2', 'r4'];
      const passedCheck = correct.every(id => evs.includes(id)) && !evs.includes('r3');

      if (passedCheck) {
        passed = true;
        feedback = "¡Pensamiento crítico de primer nivel! Demostraste que la información unida permite rastrear a una persona y vulnerar su privacidad.";
      } else {
        feedback = "Selecciona las razones válidas sobre seguridad física y digital. (Pista: el gasto de batería no es el motivo de riesgo).";
      }
    }

    // CASO 4 ETAPA 1: ORDEN DE RESPETO
    else if (caseData.id === 4 && stage.num === 1) {
      const isCorrect = JSON.stringify(AppState.stageRuntime.currentSequence) === JSON.stringify(stage.correctOrder);
      if (isCorrect) {
        passed = true;
        feedback = "¡Excelente escala! Desde la burla ofensiva, pasando por el rechazo frío y el desacuerdo educado, hasta la crítica constructiva.";
      } else {
        feedback = "El orden no es el correcto. Comienza por la burla más hiriente arriba y termina con el comentario más constructivo y amable abajo.";
      }
    }

    // CASO 4 ETAPA 2: TRANSFORMACIÓN ASERTIVA
    else if (caseData.id === 4 && stage.num === 2) {
      const isCorrect = JSON.stringify(AppState.stageRuntime.currentSequence) === JSON.stringify(stage.correctOrder);
      if (isCorrect) {
        passed = true;
        feedback = "¡Transformación lograda! 'Noto tu gran esfuerzo, pero sugiero mejorar esta pequeña sección para que brille más'. ¡Asertividad pura!";
      } else {
        feedback = "Los fragmentos no forman una frase lógica o constructiva. Intenta valorar el esfuerzo primero y sugerir la mejora después.";
      }
    }

    // CASO 4 ETAPA 3: DILEMA DE LA FOTO
    else if (caseData.id === 4 && stage.num === 3) {
      if (AppState.stageRuntime.dilemmaSelected && AppState.stageRuntime.dilemmaSelected.isGood) {
        passed = true;
        feedback = "¡Decisión ejemplar! No compartir y explicar con calma a tu amigo frena el ciberacoso y cuida la convivencia escolar.";
      } else {
        feedback = "Esa decisión amplifica el daño o deja desprotegido a tu compañero. Un buen ciudadano digital actúa para detener las burlas.";
      }
    }

    // CASO 5 ETAPA 1: INVESTIGACIÓN DEL SISTEMA
    else if (caseData.id === 5 && stage.num === 1) {
      if (AppState.stageRuntime.cluesChecked.size >= 4) {
        passed = true;
        feedback = "¡Investigación completa! Encontraste el archivo en la papelera, la copia de descargas, el chat y la falta de contraseñas compartidas.";
      } else {
        feedback = `Has explorado ${AppState.stageRuntime.cluesChecked.size} de 4 estaciones del computador. Revisa todas las carpetas e historiales.`;
      }
    }

    // CASO 5 ETAPA 2: CLASIFICACIÓN ÉTICA DE ACCIONES
    else if (caseData.id === 5 && stage.num === 2) {
      const placement = AppState.stageRuntime.sortingPlacement;
      const allPlaced = stage.actions.every(i => placement[i.id]);
      const allCorrect = stage.actions.every(i => placement[i.id] === i.box);

      if (allPlaced && allCorrect) {
        passed = true;
        feedback = "¡Comportamiento ético impecable! Sabes qué acciones restauran la paz y cuáles empeoran el conflicto o dañan a otros.";
      } else {
        feedback = "Hay acciones mal clasificadas. Restaurar y avisar ayudan; culpar o mirar cuentas ajenas causa daño.";
      }
    }

    // CASO 5 ETAPA 3: CUENTA ABIERTA EN BIBLIOTECA
    else if (caseData.id === 5 && stage.num === 3) {
      const isGood = AppState.stageRuntime.decisionSelected === 'logout_safe';
      const evs = Array.from(AppState.stageRuntime.evidenceChecked);
      const passedEvs = evs.includes('j_priv') && evs.includes('j_respect') && !evs.includes('j_fast');

      if (isGood && passedEvs) {
        passed = true;
        feedback = "¡Honor digital intachable! Cerraste la sesión protegiendo su intimidad y explicaste por qué es una falta grave fisgonear o hacer bromas.";
      } else {
        feedback = "Debes elegir la conducta respetuosa y seleccionar las evidencias que defienden la privacidad ajena.";
      }
    }

    // CASO 6 ETAPA 1: INSPECCIÓN DE ALERTAS WEB
    else if (caseData.id === 6 && stage.num === 1) {
      if (AppState.stageRuntime.cluesChecked.size >= 4) {
        passed = true;
        feedback = "¡Pistas al descubierto! Distinguiste el phishing de premios, claves en sitios no oficiales, extraños invasivos y portales escolares.";
      } else {
        feedback = `Has examinado ${AppState.stageRuntime.cluesChecked.size} de 4 avisos web. Haz clic en las lupas para revelar sus trampas.`;
      }
    }

    // CASO 6 ETAPA 2: SEMÁFORO DIGITAL
    else if (caseData.id === 6 && stage.num === 2) {
      const sel = AppState.stageRuntime.selectedSemaphore;
      const isS1 = sel.s1 === 'red';
      const isS2 = sel.s2 === 'yellow';
      const isS3 = sel.s3 === 'green';

      if (isS1 && isS2 && isS3) {
        passed = true;
        feedback = "¡Semáforo perfecto! 🔴 Rojo para alertas falsas de virus, 🟡 Amarillo para enlaces de chat sin verificar, 🟢 Verde para la plataforma oficial.";
      } else {
        feedback = "Revisa los colores del semáforo: los virus falsos requieren frenar y pedir ayuda (🔴), y con enlaces de amigos debes detenerte a revisar (🟡).";
      }
    }

    // CASO 6 ETAPA 3: SEÑALES DE AUTOPROTECCIÓN
    else if (caseData.id === 6 && stage.num === 3) {
      const evs = Array.from(AppState.stageRuntime.evidenceChecked);
      const passedEvs = evs.includes('sig1') && evs.includes('sig2') && evs.includes('sig4') && !evs.includes('sig3');

      if (passedEvs) {
        passed = true;
        feedback = "¡Detección de autoprotección impecable! Si te piden secretos, dinero o te hacen sentir incómodo, pedir ayuda a un adulto es la mejor decisión.";
      } else {
        feedback = "Selecciona las señales reales que amenazan tu bienestar emocional y seguridad digital.";
      }
    }

    // EVALUAR RESULTADO FINAL DE LA ETAPA
    if (passed) {
      sound.playSuccess();
      DOM.runnerStatusText.textContent = `✅ ${feedback}`;
      DOM.btnVerifyAction.style.display = 'none';
      DOM.btnNextStage.style.display = 'inline-flex';

      // Actualizar botones de acción dentro del escenario para avanzar de inmediato
      document.querySelectorAll('.in-situ-verify-btn').forEach(btn => {
        btn.innerHTML = `<span>✅ ¡Deducción Correcta! Avanzar a la Siguiente Etapa</span> <span>➔</span>`;
        btn.style.background = 'linear-gradient(135deg, var(--accent-emerald) 0%, #059669 100%)';
        btn.onclick = () => {
          DOM.btnNextStage.click();
        };
      });

      // Bonificación de habilidad si es etapa 3
      if (AppState.activeStageIndex === 2) {
        const skill = caseData.skillKey;
        if (AppState.skills[skill]) {
          AppState.skills[skill].points = Math.min(5, AppState.skills[skill].points + 1);
        }
        AppState.stars += 1;
        AppState.casesProgress[caseData.id].completed = true;
        AppState.casesProgress[caseData.id].starsEarned += 1;
        AppState.save();
        updateHUD();
      }
    } else {
      sound.playError();
      DOM.runnerStatusText.textContent = `❌ ${feedback}`;
      showToast("Deducción incompleta o con errores. ¡Revisa las pistas e intenta de nuevo!");
    }
  }

  // BOTÓN SIGUIENTE ETAPA / FINALIZAR CASO
  DOM.btnNextStage.addEventListener('click', () => {
    const caseData = CASES_DATA.find(c => c.id === AppState.activeCaseId);
    if (!caseData) return;

    if (AppState.activeStageIndex < 2) {
      // Avanzar a la siguiente etapa (de 1 a 2, o de 2 a 3)
      const nextIdx = AppState.activeStageIndex + 1;
      AppState.casesProgress[caseData.id].currentStage = nextIdx + 1;
      AppState.save();
      loadStage(caseData, nextIdx);
    } else {
      // Caso completado -> Mostrar Microaprendizaje "💡 RECUERDA"
      showRememberModal(caseData);
    }
  });

  function showRememberModal(caseData) {
    DOM.rememberQuoteText.textContent = `"${caseData.remember.quote}"`;
    DOM.rememberExplanationText.textContent = caseData.remember.explanation;
    DOM.rememberSkillBoost.innerHTML = `<span class="boost-icon">🛡️</span><span>Habilidad reforzada: <strong>${caseData.remember.skill}</strong></span>`;
    DOM.modalRemember.classList.add('active');
    DOM.modalRemember.setAttribute('aria-hidden', 'false');
  }

  DOM.btnRememberContinue.addEventListener('click', () => {
    DOM.modalRemember.classList.remove('active');
    DOM.modalRemember.setAttribute('aria-hidden', 'true');
    switchView('dossier');
  });
  DOM.btnCloseRemember.addEventListener('click', () => {
    DOM.modalRemember.classList.remove('active');
    DOM.modalRemember.setAttribute('aria-hidden', 'true');
    switchView('dossier');
  });

  /* ========================================================================
     11. CASO FINAL: EL DÍA DIGITAL DE SOFÍA (INTEGRAL EN 5 FASES)
     ======================================================================== */
  DOM.btnStartFinalCase.addEventListener('click', () => {
    switchView('story');
    AppState.storyProgress.currentSituationIndex = 0;
    AppState.storyProgress.currentPhase = 'observe';
    loadSofiaSituation();
  });

  function loadSofiaSituation() {
    const sitIdx = AppState.storyProgress.currentSituationIndex;
    const situation = SOFIA_STORY[sitIdx];
    if (!situation) {
      finishSofiaStory();
      return;
    }

    // Stepper dots
    const dots = DOM.storyStepperDots.querySelectorAll('.story-dot');
    dots.forEach((dot, idx) => {
      dot.classList.remove('active', 'done');
      if (idx < sitIdx) dot.classList.add('done');
      else if (idx === sitIdx) dot.classList.add('active');
    });

    renderSofiaPhase(situation, AppState.storyProgress.currentPhase);
  }

  function renderSofiaPhase(situation, phase) {
    AppState.storyProgress.currentPhase = phase;

    // Tabs cognitivas
    DOM.cognitiveTabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.phase === phase);
    });

    DOM.storyContainer.innerHTML = '';
    DOM.storyConsequence.style.display = 'none';

    // FASE 1: OBSERVAR
    if (phase === 'observe') {
      DOM.btnStoryContinue.innerHTML = `<span>Analizar Situación</span> <span>➔</span>`;
      DOM.btnStoryContinue.disabled = true;

      const card = document.createElement('div');
      card.innerHTML = `
        <div class="story-situation-banner">
          <span class="story-character-avatar">👧</span>
          <div class="story-situation-desc">
            <h3>${situation.title}</h3>
            <p>${situation.observe.text}</p>
          </div>
        </div>
        <p style="font-weight: 700; color: #38bdf8; margin-top: 16px;">1. OBSERVAR: Haz clic en las pistas de riesgo de la escena:</p>
        <div class="sequence-bank-options" id="sofia-clues-pool" style="margin-top: 10px;"></div>
      `;
      DOM.storyContainer.appendChild(card);

      const pool = card.querySelector('#sofia-clues-pool');
      AppState.storyProgress.observedClues = [];

      situation.observe.clues.forEach(clue => {
        const chip = document.createElement('button');
        chip.className = 'draggable-card-item';
        chip.innerHTML = `<span>🔍</span> <span>${clue.label}</span>`;
        chip.addEventListener('click', () => {
          if (!AppState.storyProgress.observedClues.includes(clue.id)) {
            AppState.storyProgress.observedClues.push(clue.id);
            chip.style.borderColor = clue.risk ? 'var(--accent-amber)' : 'var(--accent-cyan)';
            chip.style.background = clue.risk ? 'rgba(245, 158, 11, 0.2)' : 'rgba(6, 182, 212, 0.15)';
            sound.playClueFound();

            const riskClues = situation.observe.clues.filter(c => c.risk).map(c => c.id);
            const foundAllRisks = riskClues.every(id => AppState.storyProgress.observedClues.includes(id));
            if (foundAllRisks) {
              DOM.btnStoryContinue.disabled = false;
              showToast("¡Has detectado las pistas de riesgo! Puedes pasar a analizar.");
            }
          }
        });
        pool.appendChild(chip);
      });
    }

    // FASE 2: ANALIZAR
    else if (phase === 'analyze') {
      DOM.btnStoryContinue.innerHTML = `<span>Decidir Acción</span> <span>➔</span>`;
      DOM.btnStoryContinue.disabled = false;

      const card = document.createElement('div');
      card.className = 'consequence-tree-box';
      card.innerHTML = `
        <div class="story-situation-banner">
          <span class="story-character-avatar">🧠</span>
          <div class="story-situation-desc">
            <h3>2. ANALIZAR: Deducción del problema</h3>
            <p style="font-size: 1.05rem; color: #fff; margin-top: 6px;">${situation.analyze}</p>
          </div>
        </div>
        <div class="consequence-callout good" style="margin-top: 14px;">
          <strong>Objetivo del Detective:</strong> Ayudar a Sofía a tomar la decisión adecuada para proteger su integridad y la de su equipo escolar.
        </div>
      `;
      DOM.storyContainer.appendChild(card);
    }

    // FASE 3: ACTUAR
    else if (phase === 'act') {
      DOM.btnStoryContinue.innerHTML = `<span>Comprobar Consecuencia</span> <span>➔</span>`;
      DOM.btnStoryContinue.disabled = true;

      const card = document.createElement('div');
      card.innerHTML = `
        <div class="reasoning-question" style="font-size: 1.1rem; margin-bottom: 14px;">3. ACTUAR: ${situation.act.question}</div>
        <div class="respect-ranking-grid" id="sofia-choices-grid"></div>
      `;
      DOM.storyContainer.appendChild(card);

      const grid = card.querySelector('#sofia-choices-grid');
      situation.act.choices.forEach(ch => {
        const btn = document.createElement('button');
        btn.className = 'dilemma-choice-btn';
        btn.innerHTML = `<span>👉 ${ch.text}</span>`;
        btn.addEventListener('click', () => {
          grid.querySelectorAll('.dilemma-choice-btn').forEach(b => {
            b.style.borderColor = 'var(--border-light)';
            b.style.background = 'rgba(255,255,255,0.05)';
          });
          btn.style.borderColor = ch.correct ? 'var(--accent-emerald)' : 'var(--accent-ruby)';
          btn.style.background = ch.correct ? 'rgba(16, 185, 129, 0.18)' : 'rgba(239, 68, 68, 0.18)';

          AppState.stageRuntime.decisionSelected = ch;
          sound.playClick();
          DOM.btnStoryContinue.disabled = false;
        });
        grid.appendChild(btn);
      });
    }

    // FASE 4: COMPROBAR
    else if (phase === 'verify') {
      const choice = AppState.stageRuntime.decisionSelected;
      if (choice && choice.correct) {
        sound.playSuccess();
        DOM.btnStoryContinue.innerHTML = `<span>Ver Aprendizaje</span> <span>➔</span>`;
        DOM.btnStoryContinue.disabled = false;

        const card = document.createElement('div');
        card.className = 'consequence-callout good';
        card.innerHTML = `
          <h4 style="font-size: 1.1rem; margin-bottom: 6px;">4. COMPROBAR: Consecuencia Positiva</h4>
          <p>${choice.feedback}</p>
          <p style="margin-top: 8px; font-weight: 700;">Resultado: ${situation.verify}</p>
        `;
        DOM.storyContainer.appendChild(card);
      } else {
        sound.playError();
        DOM.btnStoryContinue.innerHTML = `<span>Volver a Intentar</span> <span>🔄</span>`;
        DOM.btnStoryContinue.disabled = false;

        const card = document.createElement('div');
        card.className = 'consequence-callout bad';
        card.innerHTML = `
          <h4 style="font-size: 1.1rem; margin-bottom: 6px;">4. COMPROBAR: Consecuencia Inadecuada</h4>
          <p>${choice ? choice.feedback : 'Acción incorrecta'}</p>
          <p style="margin-top: 8px;">Revisa las opciones y elige la que realmente proteja a Sofía.</p>
        `;
        DOM.storyContainer.appendChild(card);
      }
    }

    // FASE 5: APRENDER
    else if (phase === 'learn') {
      sound.playSuccess();
      DOM.btnStoryContinue.innerHTML = `<span>Siguiente Situación de Sofía</span> <span>➔</span>`;
      DOM.btnStoryContinue.disabled = false;

      const card = document.createElement('div');
      card.className = 'remember-quote-card';
      card.innerHTML = `
        <div class="quote-header">5. APRENDER: SABIDURÍA DEL DETECTIVE</div>
        <p class="quote-text">"${situation.learn}"</p>
        <div class="skill-boost-indicator" style="justify-content: center; margin-top: 14px;">
          <span>🌟 +1 Estrella de Maestría Ciudadana</span>
        </div>
      `;
      DOM.storyContainer.appendChild(card);

      AppState.stars += 1;
      AppState.save();
      updateHUD();
    }
  }

  DOM.btnStoryContinue.addEventListener('click', () => {
    const sitIdx = AppState.storyProgress.currentSituationIndex;
    const situation = SOFIA_STORY[sitIdx];
    const phase = AppState.storyProgress.currentPhase;

    if (phase === 'observe') {
      renderSofiaPhase(situation, 'analyze');
    } else if (phase === 'analyze') {
      renderSofiaPhase(situation, 'act');
    } else if (phase === 'act') {
      renderSofiaPhase(situation, 'verify');
    } else if (phase === 'verify') {
      const choice = AppState.stageRuntime.decisionSelected;
      if (choice && choice.correct) {
        renderSofiaPhase(situation, 'learn');
      } else {
        renderSofiaPhase(situation, 'act');
      }
    } else if (phase === 'learn') {
      if (sitIdx < SOFIA_STORY.length - 1) {
        AppState.storyProgress.currentSituationIndex++;
        AppState.storyProgress.currentPhase = 'observe';
        loadSofiaSituation();
      } else {
        finishSofiaStory();
      }
    }
  });

  function finishSofiaStory() {
    AppState.storyProgress.completed = true;
    AppState.stars += 5;
    // Elevar todas las habilidades
    Object.keys(AppState.skills).forEach(k => {
      AppState.skills[k].points = 5;
    });
    AppState.save();
    updateHUD();

    sound.playSuccess();
    alert("🎉 ¡FELICITACIONES, DETECTIVE DIGITAL!\n\nHas guiado a Sofía con total éxito a través de todo su día escolar y hogareño.\n\nDemostraste excelencia en Seguridad, Responsabilidad, Respeto, Pensamiento Crítico y Autoprotección.");
    switchView('dossier');
  }

  /* ========================================================================
     12. SISTEMA DE PISTAS (LUPA 🔎) CON COSTO ESTRATÉGICO (-1 ⭐)
     ======================================================================== */
  DOM.btnHint.addEventListener('click', () => {
    if (AppState.currentView !== 'runner') {
      showToast("Las pistas están disponibles dentro de cada caso de investigación.");
      return;
    }
    const caseData = CASES_DATA.find(c => c.id === AppState.activeCaseId);
    if (!caseData) return;

    DOM.hintTextTarget.textContent = caseData.hintText;
    DOM.hintContentBox.style.display = 'none';
    DOM.hintCostNotice.style.display = 'block';
    DOM.btnConfirmRevealHint.style.display = 'inline-flex';

    DOM.modalHint.classList.add('active');
    DOM.modalHint.setAttribute('aria-hidden', 'false');
  });

  DOM.btnConfirmRevealHint.addEventListener('click', () => {
    AppState.hintsUsed++;
    if (AppState.stars > 0) {
      AppState.stars--;
    }
    if (AppState.activeCaseId && AppState.casesProgress[AppState.activeCaseId]) {
      AppState.casesProgress[AppState.activeCaseId].hintsCount++;
    }
    AppState.save();
    updateHUD();

    sound.playWarning();
    DOM.hintCostNotice.style.display = 'none';
    DOM.hintContentBox.style.display = 'block';
    DOM.btnConfirmRevealHint.style.display = 'none';
  });

  DOM.btnCancelHint.addEventListener('click', () => {
    DOM.modalHint.classList.remove('active');
    DOM.modalHint.setAttribute('aria-hidden', 'true');
  });
  DOM.btnCloseHint.addEventListener('click', () => {
    DOM.modalHint.classList.remove('active');
    DOM.modalHint.setAttribute('aria-hidden', 'true');
  });

  /* ========================================================================
     13. TABLERO DE HABILIDADES DIGITALES (5 DIMENSIONES)
     ======================================================================== */
  DOM.btnSkills.addEventListener('click', () => {
    renderSkillsModal();
    DOM.modalSkills.classList.add('active');
    DOM.modalSkills.setAttribute('aria-hidden', 'false');
  });

  function renderSkillsModal() {
    const s = AppState.skills;
    const calcPct = (pts) => `${Math.min(100, Math.round((pts / 5) * 100))}%`;

    DOM.bars.sec.style.width = calcPct(s.security.points);
    DOM.bars.resp.style.width = calcPct(s.responsibility.points);
    DOM.bars.soc.style.width = calcPct(s.respect.points);
    DOM.bars.crit.style.width = calcPct(s.critical.points);
    DOM.bars.help.style.width = calcPct(s.protection.points);

    DOM.starsSpans.sec.textContent = renderStarsString(s.security.points);
    DOM.starsSpans.resp.textContent = renderStarsString(s.responsibility.points);
    DOM.starsSpans.soc.textContent = renderStarsString(s.respect.points);
    DOM.starsSpans.crit.textContent = renderStarsString(s.critical.points);
    DOM.starsSpans.help.textContent = renderStarsString(s.protection.points);

    const totalPts = s.security.points + s.responsibility.points + s.respect.points + s.critical.points + s.protection.points;
    if (totalPts >= 20) {
      DOM.rankBadge.textContent = "🏆 DETECTIVE MAESTRO DE LA CIUDADANÍA DIGITAL";
      DOM.rankAdvice.textContent = "¡Sobresaliente! Sabes investigar pistas, actuar con empatía y proteger a tus compañeros y equipos.";
    } else if (totalPts >= 10) {
      DOM.rankBadge.textContent = "🕵️ INVESTIGADOR DIGITAL AVANZADO";
      DOM.rankAdvice.textContent = "¡Muy buen camino! Ya reconoces trampas sutiles. Sigue practicando la justificación de tus decisiones.";
    } else {
      DOM.rankBadge.textContent = "🔎 DETECTIVE APRENDIZ";
      DOM.rankAdvice.textContent = "Explora los casos con paciencia. Recuerda que observar antes de hacer clic es el superpoder del detective.";
    }
  }

  DOM.btnCloseSkills.addEventListener('click', () => {
    DOM.modalSkills.classList.remove('active');
    DOM.modalSkills.setAttribute('aria-hidden', 'true');
  });
  DOM.btnCloseSkillsBottom.addEventListener('click', () => {
    DOM.modalSkills.classList.remove('active');
    DOM.modalSkills.setAttribute('aria-hidden', 'true');
  });

  /* ========================================================================
     14. PANEL PEDAGÓGICO PARA EL DOCENTE
     ======================================================================== */
  DOM.btnTeacher.addEventListener('click', () => {
    renderTeacherModal();
    DOM.modalTeacher.classList.add('active');
    DOM.modalTeacher.setAttribute('aria-hidden', 'false');
  });

  function renderTeacherModal() {
    let completedCount = 0;
    Object.values(AppState.casesProgress).forEach(c => {
      if (c.completed) completedCount++;
    });

    const elapsedMinutes = Math.max(1, Math.round((Date.now() - AppState.startTime) / 60000));
    const accuracy = completedCount > 0 ? Math.round((completedCount / (completedCount + (AppState.hintsUsed * 0.3))) * 100) : 0;

    DOM.tstatCompleted.textContent = `${completedCount} / 6`;
    DOM.tstatAccuracy.textContent = `${Math.min(100, Math.max(20, accuracy))}%`;
    DOM.tstatHints.textContent = AppState.hintsUsed;
    DOM.tstatTime.textContent = `${elapsedMinutes} min`;

    DOM.teacherTableBody.innerHTML = '';
    CASES_DATA.forEach(c => {
      const p = AppState.casesProgress[c.id];
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><strong>Caso 0${c.id}</strong></td>
        <td>${c.concept}</td>
        <td>${p.completed ? '3 / 3 (Completas)' : `${p.currentStage} de 3`}</td>
        <td>${p.hintsCount || 0}</td>
        <td><span style="color: ${p.completed ? 'var(--accent-emerald-light)' : 'var(--accent-amber-light)'}; font-weight:700;">
          ${p.completed ? '✅ Resuelto' : '⏳ En progreso'}
        </span></td>
      `;
      DOM.teacherTableBody.appendChild(row);
    });
  }

  DOM.btnPrintTeacher.addEventListener('click', () => {
    window.print();
  });
  DOM.btnCloseTeacher.addEventListener('click', () => {
    DOM.modalTeacher.classList.remove('active');
    DOM.modalTeacher.setAttribute('aria-hidden', 'true');
  });
  DOM.btnCloseTeacherBottom.addEventListener('click', () => {
    DOM.modalTeacher.classList.remove('active');
    DOM.modalTeacher.setAttribute('aria-hidden', 'true');
  });

  /* ========================================================================
     15. NAVEGACIÓN GLOBAL Y ACCIONES DE CABECERA
     ======================================================================== */
  DOM.btnBackDossier.addEventListener('click', () => {
    sound.playClick();
    switchView('dossier');
  });

  DOM.btnSound.addEventListener('click', () => {
    const isEnabled = sound.toggle();
    DOM.soundIcon.textContent = isEnabled ? '🔊' : '🔇';
    showToast(isEnabled ? "Sonido activado" : "Sonido silenciado");
  });

  DOM.btnReset.addEventListener('click', () => {
    const ok = confirm("¿Deseas reiniciar toda la investigación de Detectives Digitales desde cero?");
    if (ok) {
      AppState.reset();
    }
  });

  /* ========================================================================
     16. INICIALIZACIÓN DE LA APLICACIÓN
     ======================================================================== */
  function init() {
    AppState.load();
    switchView('dossier');

    // Desbloquear contexto de audio con la primera interacción del usuario
    document.addEventListener('pointerdown', () => {
      sound.init();
    }, { once: true });
  }

  // Arrancar al cargar el DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
