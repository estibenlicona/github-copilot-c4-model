# Plataforma de Dimensionamiento — Investigación de funcionalidades

Síntesis de buenas prácticas de herramientas de *capacity planning*, estimación ágil, marcos de capacidades (SFIA) y estimación bajo incertidumbre, con las funcionalidades recomendadas para evolucionar el modelo actual hacia una plataforma. Al final, la priorización y qué se incluyó en la primera versión de la plataforma.

## Qué hace hoy el modelo

La versión web actual evalúa **una** iniciativa: tamizaje, formulario de complejidad y resultados en vivo (talla, PM, FTE y mix de capacidades con SFIA). Es un excelente evaluador, pero todavía no es una plataforma: los parámetros están fijos, no guarda iniciativas, no agrega la demanda del portafolio ni aprende de datos reales.

## Hallazgos por dominio

### Capacity planning (gestión de capacidad)

Las herramientas del mercado coinciden en un núcleo: **demanda vs. capacidad**, planeación **por rol/skill**, **simulación de carga** y visibilidad de **utilización** para detectar sobre-asignación antes de que sea un problema de entrega. También destacan la **planeación de pipeline** (iniciativas potenciales como "placeholders") y los **reportes de utilización** (sobre/sub-asignación). La conclusión clave: dimensionar una iniciativa aislada vale poco si no se ve contra la **capacidad disponible** y la **demanda agregada del portafolio**.

### Estimación ágil y T-shirt sizing

El T-shirt sizing es ideal en etapa temprana (poca información, rápido, sirve para portafolio). Dos prácticas que conviene incorporar: **anclas de calibración** (acordar un ejemplo real de S, M, L como referencia) y el uso de **datos históricos** para comparar estimado vs. real a lo largo del tiempo y descubrir dónde el equipo subestima o sobreestima. El mapeo talla→rango (p. ej. S = 1–2 pts) debe ser **acordado y editable**, no fijo.

### SFIA y planeación de fuerza laboral

SFIA aporta un **lenguaje común** de capacidades y 7 niveles de responsabilidad (autonomía, influencia, complejidad). Sus usos de *workforce planning*: **inventario de skills**, identificación de **brechas y excedentes**, **perfiles de rol** y pronóstico de demanda futura de capacidades. Esto habilita una vista de **brecha de capacidades** (lo que el portafolio demanda vs. lo que el equipo tiene).

### Estimación bajo incertidumbre

Tres ideas robustas:

- **Estimación de tres puntos (PERT):** optimista, más probable y pesimista, con promedio ponderado y rango de confianza. Encaja con el rango PM mín–máx que ya maneja el modelo; conviene nombrarlo y mostrar el escenario "esperado".
- **Cono de incertidumbre:** al inicio del ciclo las estimaciones tienen un error de hasta ±4× (o ±40% en planeación temprana). La plataforma debería **comunicar explícitamente** que los números son una banda temprana, no una promesa.
- **Reference class forecasting:** estimar comparando con una **clase de proyectos similares** ya cerrados, para neutralizar el sesgo de optimismo. Habilita comparar una iniciativa nueva contra históricos parecidos.

## Funcionalidades recomendadas

### Imprescindibles (núcleo de plataforma)

1. **Recalibración total de parámetros.** Editar pesos por pregunta, bandas de talla, rangos de PM, matriz de mix de capacidades, niveles SFIA por talla, rangos de las preguntas cuantitativas y etiquetas de la escala. Con *reset* a valores por defecto y validación (el mix debe sumar 100% por talla).
2. **Persistencia.** Guardar configuración, iniciativas y capacidad localmente para no perder el trabajo entre sesiones.
3. **Portafolio de iniciativas.** Guardar cada evaluación (nombre, talla, %, PM, FTE, plazo, estado), listarlas, editarlas, recargarlas y eliminarlas.
4. **Demanda vs. capacidad.** Capturar la capacidad disponible por capacidad (FTE) y compararla con la **demanda agregada** del portafolio activo; resaltar brechas y sobre-asignación.
5. **Import/Export.** Respaldo y traspaso de toda la configuración y datos en JSON; exportar el portafolio a CSV.

### Alto valor

6. **Calibración con datos reales.** Registrar, al cierre, FTE/PM/duración reales vs. estimados; calcular **desviación** y un **factor de ajuste sugerido**; mantener **anclas** (ejemplo de referencia) por talla.
7. **Banda de incertidumbre explícita.** Mostrar escenario optimista / esperado / pesimista y una nota del cono de incertidumbre según madurez de la iniciativa.
8. **Tablero de portafolio.** KPIs: número de iniciativas por talla, FTE total demandado, demanda por capacidad, y semáforo de capacidad.
9. **Análisis what-if.** Variar el plazo (y opcionalmente parámetros) y ver el impacto en FTE; comparar escenarios.
10. **Brecha de capacidades (SFIA).** Vista de capacidades demandadas por el portafolio vs. disponibles, con nivel SFIA objetivo.

### Futuras / evolutivas

11. **Reference class forecasting:** sugerir talla/esfuerzo comparando con iniciativas históricas similares.
12. **Multi-evaluador y consenso** (varias valoraciones de la misma iniciativa, promedio y dispersión).
13. **Historial/versionado de parámetros** con notas de cambio (auditoría de calibración).
14. **Roles reales y asignación** (mapear FTE por capacidad a personas concretas y su disponibilidad).
15. **Pipeline/placeholders** de iniciativas potenciales para planeación de demanda futura.
16. **Predictivo:** tendencias de desviación en el tiempo para ajustar pesos automáticamente.

## Qué incluye la primera versión de la plataforma

Se priorizaron los imprescindibles y varios de alto valor, todo en un archivo autónomo con persistencia local:

- **Evaluar:** tamizaje + formulario + resultados en vivo, con banda de incertidumbre, what-if de plazo y "guardar al portafolio".
- **Portafolio:** lista de iniciativas guardadas con KPIs agregados; recargar, editar estado y eliminar.
- **Capacidad y demanda:** captura de FTE disponible por capacidad y comparación contra la demanda agregada del portafolio activo (brecha y semáforo).
- **Calibración:** registro de estimado vs. real por iniciativa, desviación y factor sugerido.
- **Parámetros:** recalibración total (pesos, tallas, PM, mix, SFIA, rangos cuantitativos), con validación, *reset*, e import/export JSON.

Las funcionalidades 11–16 quedan como evolución natural una vez se acumulen datos reales.
