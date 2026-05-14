---
name: azdo-wiki
description: Use whenever the user asks to create, generate, or edit documentation for Azure DevOps Wiki, or mentions Wiki / Markdown documentation / technical docs / runbooks / architecture documentation for Azure DevOps.
---

# Azure DevOps Wiki Markdown Skill

Genera documentación técnica utilizando la sintaxis de Markdown específica de **Azure DevOps Wiki**. Produce documentación clara, bien estructurada y que aprovecha todas las características especiales que ofrece Azure DevOps Wiki.

## Documentación de Referencia

- https://learn.microsoft.com/en-us/azure/devops/project/wiki/markdown-guidance
- https://learn.microsoft.com/en-us/azure/devops/project/wiki/wiki-markdown-guidance

---

## Sintaxis Específica de Azure DevOps Wiki

### 1. Tabla de Contenidos Automática

```markdown
[[_TOC_]]
```

Genera automáticamente una tabla de contenidos basada en los encabezados del documento.

### 2. Encabezados

```markdown
# Encabezado 1
## Encabezado 2
### Encabezado 3
#### Encabezado 4
##### Encabezado 5
###### Encabezado 6
```

### 3. Enlaces y Referencias

#### Enlaces a otras páginas de la Wiki

```markdown
[[Nombre de la página]]
[[/ruta/subpágina]]
[[Texto del enlace|Nombre de la página]]
```

#### Enlaces a secciones (anclas)

```markdown
[Ir a sección](#nombre-de-la-sección)
[[Página#Sección]]
```

#### Enlaces externos

```markdown
[Texto del enlace](https://url.com)
```

### 4. Menciones y Referencias de Azure DevOps

#### Work Items

```markdown
#123                    <!-- Enlace a work item -->
AB#123                  <!-- Work item de otro proyecto -->
```

#### Usuarios

```markdown
@<nombre-usuario>
@<nombre-usuario@dominio.com>
```

#### Pull Requests

```markdown
!123                    <!-- Enlace a PR -->
```

### 5. Bloques de Código

#### Código en línea

```markdown
`código en línea`
```

#### Bloques de código con resaltado de sintaxis

````markdown
```javascript
function ejemplo() {
    return "Hola mundo";
}
```
````

Lenguajes soportados: `javascript`, `typescript`, `python`, `csharp`, `java`, `sql`, `powershell`, `bash`, `yaml`, `json`, `xml`, `html`, `css`, y más.

### 6. Tablas

El título de la tabla va en una línea separada, **sin línea vacía** antes de la tabla:

```markdown
**Mi tabla:**
| Columna 1 | Columna 2 | Columna 3 |
|-----------|:---------:|----------:|
| Izquierda | Centro    | Derecha   |
| Texto     | Texto     | Texto     |
```

**Alineación:**
- `|---|` — Izquierda (default)
- `|:---:|` — Centro
- `|---:|` — Derecha

> **Importante:** NO dejar línea vacía entre el título y la tabla.

### 7. Listas

#### Lista sin orden

```markdown
- Elemento 1
- Elemento 2
  - Sub-elemento 2.1
  - Sub-elemento 2.2
- Elemento 3
```

#### Lista ordenada

```markdown
1. Primer elemento
2. Segundo elemento
   1. Sub-elemento
3. Tercer elemento
```

#### Lista de tareas

```markdown
- [ ] Tarea pendiente
- [x] Tarea completada
- [ ] Otra tarea pendiente
```

### 8. Notas y Destacados

Usa blockquotes con texto en negrita para destacar información:

```markdown
> **Nota:** Esta es una nota informativa.

> **Tip:** Este es un consejo útil.

> **Importante:** Este es un mensaje importante.

> **Advertencia:** Esta es una advertencia.

> **REGLA:** Esta es una regla que debe cumplirse.
```

**Convención de prefijos:**

| Prefijo | Uso |
|---------|-----|
| `**Nota:**` | Información adicional o contexto |
| `**Tip:**` | Consejos útiles o mejores prácticas |
| `**Importante:**` | Información crítica |
| `**Advertencia:**` | Precauciones o problemas |
| `**REGLA:**` | Reglas obligatorias |

### 9. Diagramas Mermaid

#### Diagrama de flujo

```markdown
::: mermaid
graph TD
    A[Inicio] --> B{Decisión}
    B -->|Sí| C[Acción 1]
    B -->|No| D[Acción 2]
    C --> E[Fin]
    D --> E
:::
```

#### Diagrama de secuencia

```markdown
::: mermaid
sequenceDiagram
    participant Usuario
    participant API
    participant Base de Datos
    Usuario->>API: Solicitud
    API->>Base de Datos: Consulta
    Base de Datos-->>API: Respuesta
    API-->>Usuario: Datos
:::
```

#### Diagrama de Gantt

```markdown
::: mermaid
gantt
    title Cronograma del Proyecto
    dateFormat  YYYY-MM-DD
    section Fase 1
    Tarea 1           :a1, 2024-01-01, 30d
    Tarea 2           :after a1, 20d
    section Fase 2
    Tarea 3           :2024-02-15, 25d
:::
```

### 10. Videos

```markdown
::: video
<iframe src="https://www.youtube.com/embed/VIDEO_ID" frameborder="0" allowfullscreen></iframe>
:::
```

### 11. Imágenes

```markdown
![Texto alternativo](ruta/imagen.png)
![Texto alternativo](ruta/imagen.png =WIDTHxHEIGHT)
![Texto alternativo](ruta/imagen.png =500x300)
![Texto alternativo](ruta/imagen.png =500x)
```

### 12. Citas

```markdown
> Esta es una cita
> que puede tener múltiples líneas
>
> > Y citas anidadas
```

### 13. Texto con Formato

```markdown
**Negrita**
*Cursiva*
***Negrita y cursiva***
~~Tachado~~
`Código en línea`
```

### 14. Emojis

```markdown
:smile: :thumbsup: :warning: :x: :white_check_mark:
```

### 15. HTML Embebido (Limitado)

```markdown
<br>
<hr>
<details>
<summary>Haz clic para expandir</summary>
Contenido oculto aquí
</details>
```

### 16. Matemáticas (LaTeX/KaTeX)

```markdown
Fórmula en línea: $E = mc^2$

Bloque de fórmula:
$$
\sum_{i=1}^{n} x_i = x_1 + x_2 + ... + x_n
$$
```

---

## Reglas de Generación

1. **Siempre incluir `[[_TOC_]]`** al inicio de documentos largos para navegación.
2. **Usar alertas apropiadas** (`::: tip`, `::: warning`, etc.) para destacar información importante.
3. **Preferir diagramas Mermaid** sobre imágenes estáticas cuando sea posible.
4. **Estructurar con encabezados jerárquicos** claros y descriptivos.
5. **Usar listas de tareas** para procesos paso a paso o checklists.
6. **Incluir ejemplos de código** con el lenguaje especificado para resaltado de sintaxis.
7. **Referenciar work items** con `#ID` cuando corresponda.
8. **Usar tablas** para comparaciones o datos estructurados.
9. **Mantener consistencia** en el formato a lo largo del documento.
10. **Validar que la sintaxis** sea compatible con Azure DevOps Wiki.

---

## Plantilla Base Sugerida

```markdown
[[_TOC_]]

# Título del Documento

## Descripción General

Breve descripción del propósito de este documento.

::: note
Información importante sobre este documento.
:::

## Requisitos Previos

- [ ] Requisito 1
- [ ] Requisito 2
- [ ] Requisito 3

## Contenido Principal

### Sección 1

Contenido de la sección...

### Sección 2

Contenido de la sección...

## Diagrama de Arquitectura

::: mermaid
graph TD
    A[Componente A] --> B[Componente B]
    B --> C[Componente C]
:::

## Referencias

- [[Documento relacionado 1]]
- [[Documento relacionado 2]]
- [Enlace externo](https://ejemplo.com)

## Historial de Cambios

| Fecha | Autor | Descripción |
|-------|-------|-------------|
| YYYY-MM-DD | @usuario | Cambio realizado |

---
*Última actualización: YYYY-MM-DD*
```

---

## Cuándo Usar Este Skill

Cuando el usuario solicite:

- Documentación técnica para Azure DevOps Wiki
- Guías, especificaciones técnicas, READMEs, runbooks
- Documentación de arquitectura (complementario al skill de C4/draw.io)
- Cualquier markdown destinado a la Wiki de Azure DevOps

## Workflow de Uso

1. **Identificar tipo de documento** (guía, especificación, runbook, etc.)
2. **Generar contenido** usando la sintaxis específica de Azure DevOps Wiki
3. **Incluir diagramas Mermaid** cuando ayuden a explicar conceptos
4. **Usar alertas** para destacar información crítica
5. **Estructurar con TOC** si tiene más de 3 secciones
6. **Guardar** el archivo `.md` en la ubicación apropiada

## Integración con Otros Skills

Este skill complementa al skill de **draw.io** para documentación de arquitectura:

| Tipo de Contenido | Skill a Usar |
|-------------------|--------------|
| Diagramas C4 detallados | `drawio` |
| Diagramas simples en Wiki | `azdo-wiki` (Mermaid) |
| Documentación técnica | `azdo-wiki` |
| Arquitectura visual compleja | `drawio` → exportar PNG → `azdo-wiki` |

Para diagramas complejos de arquitectura (C4 Model), usa el skill de draw.io y luego embebe la imagen exportada en la Wiki.
