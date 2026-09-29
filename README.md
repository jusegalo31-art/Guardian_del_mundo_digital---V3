# 🔎 DETECTIVES DIGITALES
### "Aprende a tomar buenas decisiones en el mundo digital"

**Recurso Educativo Interactivo basado en Casos y Evidencias**  
* **Población objetivo:** Estudiantes de 4.º de primaria (9–10 años).  
* **Tecnologías:** HTML5 semántico, CSS3 moderno y JavaScript Vanilla.  
* **Conectividad:** 100% Offline (Sin dependencias externas, sin CDNs, sin servidores, sin Node/npm requerido).  
* **Modelo pedagógico:** **OBSERVAR → INVESTIGAR → RELACIONAR → DECIDIR → COMPROBAR → REFLEXIONAR**.

---

## 🎯 Enfoque Pedagógico de Alta Dificultad Cognitiva

A diferencia de los cuestionarios tradicionales o juegos arcade simples, este recurso desafía al estudiante a **pensar antes de actuar**, buscando que no elija una opción por intuición o por ver un emoji feliz, sino porque **puede argumentar y demostrar el porqué**:

1. **Analizar situaciones y escenarios:** Encontrar riesgos ocultos en aulas, chats, ventanas del sistema e instaladores.
2. **Tablero de Evidencias:** Archivar pistas que fundamentan cada deducción.
3. **Organizar secuencias seguras:** Ordenar acciones lógicas (ej: *Detenerse ➔ Revisar permisos ➔ Consultar con un adulto ➔ Instalar solo con autorización*).
4. **Clasificación por contexto:** Separar información general de datos confidenciales y de riesgo.
5. **Justificación de decisiones:** Seleccionar las razones lógicas que respaldan cada conclusión.
6. **Comprensión de consecuencias:** Experimentar cómo las decisiones en chats o redes afectan a los demás.

---

## 🗂️ Estructura de Casos y Etapas

El recurso consta de **6 Casos de Investigación Principales** + **1 Caso Final Integrador**:

Cada caso principal cuenta con **3 Etapas Pedagógicas**:
* **🔎 Etapa 1 — Investiga:** Búsqueda y hallazgo de pistas en la escena.
* **🧩 Etapa 2 — Resuelve:** Actividad interactiva de ordenamiento, clasificación en cajas o semáforo.
* **🧠 Etapa 3 — Reflexiona:** Transferencia del aprendizaje a un nuevo reto donde debe justificar su respuesta.

### Resumen de Casos:
1. **🖥️ Caso 1 — El Computador en Peligro:** Cuidar los dispositivos y el espacio físico escolar (líquidos, cables, peso sobre teclas, sol directo).
2. **📦 Caso 2 — La Aplicación Misteriosa:** No instalar programas sin permiso (identificación de permisos abusivos, autor desconocido y urgencia engañosa).
3. **🔐 Caso 3 — El Robo de Información:** Protección de datos privados y confidenciales (diferenciar gustos inofensivos de rutinas, direcciones y contraseñas).
4. **💬 Caso 4 — El Chat de la Clase:** Convivencia y respeto digital (escala de respeto, asertividad y dilema de la fotografía comprometedora).
5. **🚫 Caso 5 — El Misterio del Archivo Borrado:** Ética y no dañar equipos ni trabajos ajenos (recuperación responsable de archivos compartidos).
6. **🚨 Caso 6 — La Alerta Extraña:** El Semáforo Digital y cuándo pedir ayuda a un adulto frente a virus falsos y extraños.
7. **🧩 Caso Final — El Día Digital de Sofía:** Experiencia integral a través de 5 momentos en el día escolar y hogareño de Sofía, aplicando el ciclo cognitivo: *1. Observar ➔ 2. Analizar ➔ 3. Actuar ➔ 4. Comprobar ➔ 5. Aprender*.

---

## 🚀 Cómo Ejecutar el Recurso

1. Dirígete a la carpeta del proyecto:
   `c:\Users\Usuario eat\Documents\Colegio_mexico\Primer periodo\3 y 4\Clase 4 Ser un buen ciudadano digital\Guardian_del_mundo_digital - V3`
2. Haz doble clic en el archivo [index.html](file:///c:/Users/Usuario%20eat/Documents/Colegio_mexico/Primer%20periodo/3%20y%204/Clase%204%20Ser%20un%20buen%20ciudadano%20digital/Guardian_del_mundo_digital%20-%20V3/index.html).
3. Se abrirá automáticamente en tu navegador web preferido (Edge, Chrome, Firefox, Safari) de forma inmediata y sin requerir internet.

---

## 🛠️ Cómo Modificar y Personalizar Casos, Pistas y Actividades

Toda la información pedagógica está centralizada en arrays y objetos de datos fáciles de editar en [script.js](file:///c:/Users/Usuario%20eat/Documents/Colegio_mexico/Primer%20periodo/3%20y%204/Clase%204%20Ser%20un%20buen%20ciudadano%20digital/Guardian_del_mundo_digital%20-%20V3/script.js):

### 1. Modificar los Casos Principales (`CASES_DATA`)
En las líneas iniciales de [script.js](file:///c:/Users/Usuario%20eat/Documents/Colegio_mexico/Primer%20periodo/3%20y%204/Clase%204%20Ser%20un%20buen%20ciudadano%20digital/Guardian_del_mundo_digital%20-%20V3/script.js), busca la constante `CASES_DATA`:
* **Cambiar título o concepto:** Edita las propiedades `title`, `concept` o `desc`.
* **Modificar la pista de la lupa:** Modifica `hintText`.
* **Modificar el microaprendizaje final:** Edita el bloque `remember: { quote: "...", explanation: "..." }`.
* **Agregar o cambiar pistas de la Etapa 1:**
  * En el Caso 1, modifica los objetos del array `items: [...]`. Puedes ajustar qué objetos tienen `isClue: true` o `false`.
  * En el Caso 2, modifica las evidencias sospechosas en `clues: [...]`.
  * En el Caso 3, modifica los mensajes de chat en `messages: [...]` con `isRisky: true` o `false`.
* **Modificar las secuencias de la Etapa 2:**
  * Modifica `correctOrder: ["id1", "id2", "id3"]` y las tarjetas disponibles en `options: [...]`.
* **Modificar las opciones y justificaciones de la Etapa 3:**
  * Modifica las preguntas en `question`, las alternativas en `choices` (marcando `correct: true`), y las evidencias en `justifications` (con `isEvidence: true`).

### 2. Modificar el Caso Final de Sofía (`SOFIA_STORY`)
En [script.js](file:///c:/Users/Usuario%20eat/Documents/Colegio_mexico/Primer%20periodo/3%20y%204/Clase%204%20Ser%20un%20buen%20ciudadano%20digital/Guardian_del_mundo_digital%20-%20V3/script.js), ubica la constante `SOFIA_STORY`:
Cada situación del día de Sofía tiene 5 propiedades directas:
* `observe`: Texto de la escena y pistas a encontrar (`clues`).
* `analyze`: Explicación del problema que Sofía deduce.
* `act`: Pregunta y opciones (`choices`), definiendo cuál es la correcta (`correct: true`) y el comentario explicativo (`feedback`).
* `verify`: Consecuencia inmediata visible.
* `learn`: Frase breve de microaprendizaje.

---

## 🧑‍🏫 Guía para el Docente en el Aula

Al pulsar el botón **🧑‍🏫 Docente** en la barra superior se despliega:
* Tasa de acierto directo y casos resueltos.
* Tiempo total transcurrido.
* Pistas solicitadas con costo de estrella.
* **Guía de Observación Pedagógica:**
  1. *¿El estudiante busca pistas antes de actuar?*
  2. *¿Puede explicar por qué una información es personal?*
  3. *¿Reconoce situaciones ambiguas con trampas de prisa o regalos?*
  4. *¿Comprende que una acción digital puede afectar a otra persona?*
  5. *¿Sabe cuándo pedir ayuda a un adulto?*
* Botón para **Imprimir o Guardar en PDF** el informe pedagógico de la sesión.
