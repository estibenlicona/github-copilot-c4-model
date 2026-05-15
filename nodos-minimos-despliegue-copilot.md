# ¿Cuántos nodos pintar en el Diagrama de Despliegue de GitHub Copilot? (KISS)

> **Principio rector:** Keep It Simple. Un diagrama de despliegue C2 debe poder leerse en **menos de 60 segundos**. Si necesitas más, sobra detalle.

---

## Regla práctica

| Concepto | Cantidad recomendada |
|---|---|
| **Entornos (environments / datacenters)** | **3** |
| **Nodos de despliegue (deployment nodes)** | **5 a 7** |
| **Unidades de despliegue (deployment units)** dentro de los nodos | **8 a 12** |
| **Sistemas externos** | **2 a 4** |
| **Total de cajas visibles** | **≤ 20** |

Si pasas de 20 cajas, el diagrama deja de ser C2 y se vuelve un C3 disfrazado. Divídelo.

---

## Los 3 entornos mínimos

1. **Tuya — Endpoints corporativos** `[Environment: on premise]`
2. **GitHub Cloud — Enterprise tuyacol** `[Environment: cloud]`
3. **Azure — Plataforma MCPs** `[Environment: cloud]` *(solo si tienen MCPs remotos; si no, omítelo)*

> Si **no** tienen MCPs remotos, quedan **2 entornos** y el diagrama es aún más simple. Mejor.

---

## Los 5–7 nodos mínimos

### Entorno 1 — Endpoints corporativos (on premise)

1. **Workstation del desarrollador (99.9%)** `[Deployment node: Laptop Windows/Mac]`
2. **Proxy corporativo (99.95%)** `[Deployment node: Network appliance]` *(solo si hay inspección TLS o egreso controlado; si no, omítelo)*

### Entorno 2 — GitHub Cloud

3. **GitHub.com / Copilot SaaS (99.9%)** `[Deployment node: SaaS multi-tenant]`

### Entorno 3 — Azure (solo si aplica)

4. **AKS — Cluster MCPs (99.9%)** `[Deployment node: Managed Kubernetes]`
5. **APIM (99.95%)** `[Deployment node: API Gateway]`

### Repositorios (puede ir dentro de GitHub Cloud o como entorno extra)

6. **Azure DevOps Repos (99.9%)** `[Deployment node: SaaS]` *(solo si los repos NO están en GitHub)*

---

## Las unidades de despliegue mínimas por nodo

| Nodo | Unidades de despliegue (mínimas) |
|---|---|
| Workstation | **VS Code + Copilot**, **Copilot CLI**, **MCPs locales** (1 caja agrupando todos), **Cliente Git** |
| GitHub SaaS | **Copilot Proxy**, **Servicio LLM**, **Audit Log + Metrics API** (1 sola caja agrupada) |
| AKS | **Ingress**, **Pods MCP** (1 caja por familia de MCP, no uno por MCP) |
| APIM | **Ruta MCPs** (1 caja agrupada) |
| Azure DevOps Repos | **Repos**, **Pipelines** *(solo si CI/CD es relevante)* |

> **No dibujes** cada MCP individual, cada extensión, ni cada microservicio. Agrupa.

---

## Los sistemas externos obligatorios

1. **Bóveda de secretos** (Azure Key Vault) — **obligatorio por estándar Tuya**.
2. **IdP corporativo** (Entra ID).
3. **Sistemas internos consumidos por MCPs** — agrupa en **1 caja** llamada *"Sistemas internos consumidos"* a menos que sean ≤ 3, en cuyo caso ponlos individuales.

---

## Heurísticas para decidir si un nodo entra o no

Pregúntate por cada candidato:

- **¿Cambia el flujo de seguridad o de datos?** Si no → no va.
- **¿Lo opera un equipo distinto?** Si no → fusiónalo con su nodo padre.
- **¿Su ausencia rompe la narrativa?** Si no → fuera.
- **¿Está en el Inventario de Aplicaciones?** Si no → probablemente es ruido.

---

## Ejemplo de diagrama mínimo (recomendado para la primera versión)

```
┌──────────────────────────┐   ┌──────────────────────────────┐   ┌──────────────────────────┐
│ Endpoints on-premise     │   │ GitHub Cloud (tuyacol)       │   │ Azure (MCPs)             │
│                          │   │                              │   │                          │
│ ┌──────────────────────┐ │   │ ┌──────────────────────────┐ │   │ ┌──────────────────────┐ │
│ │ Workstation 99.9%    │ │   │ │ GitHub.com / Copilot SaaS│ │   │ │ APIM 99.95%          │ │
│ │ • VS Code + Copilot  │─┼───┼▶│ • Copilot Proxy          │◀┼───┼─│ • Ruta MCPs          │ │
│ │ • Copilot CLI        │ │   │ │ • Servicio LLM           │ │   │ └──────────┬───────────┘ │
│ │ • MCPs locales       │ │   │ │ • Audit + Metrics        │ │   │            │             │
│ │ • Cliente Git        │ │   │ └──────────────────────────┘ │   │ ┌──────────▼───────────┐ │
│ └──────────────────────┘ │   │                              │   │ │ AKS 99.9%            │ │
│                          │   │                              │   │ │ • Ingress            │ │
│ ┌──────────────────────┐ │   │                              │   │ │ • Pods MCP           │ │
│ │ Proxy corporativo    │ │   │                              │   │ └──────────┬───────────┘ │
│ └──────────────────────┘ │   │                              │   │            │             │
└──────────────────────────┘   └──────────────────────────────┘   └────────────┼─────────────┘
                                                                                │
                              ┌──────────────────┐  ┌──────────────────┐  ┌────▼──────────────┐
                              │ Entra ID         │  │ Key Vault        │  │ Sistemas internos │
                              │ [Software System]│  │ [Software System]│  │ [Software System] │
                              └──────────────────┘  └──────────────────┘  └───────────────────┘
```

**Total:** 3 entornos · 6 nodos · 11 unidades · 3 sistemas externos = **23 cajas máximo**, distribuidas claramente.

---

## Cuándo escalar a más detalle

Solo agrega más nodos/unidades si **una** de estas se cumple:

- Seguridad pide ver explícitamente un control (DLP, CASB, WAF).
- Hay alta disponibilidad multi-región que cambia el SLA.
- Un equipo distinto opera ese componente.
- Existe un **RFC** o decisión específica que depende de ese detalle.

Si no, **menos es más.**
