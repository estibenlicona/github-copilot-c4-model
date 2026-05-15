---
name: drawio-deployment
description: Use whenever the user asks to create, generate, edit, review, or export deployment diagrams with draw.io, C4 deployment diagrams, infraestructura, nodos, entornos, unidades de despliegue, deployment units, runtime dependencies, or diagramas de despliegue Tuya.
---

# Skill: Diagramas de despliegue C4/Tuya con draw.io

Esta skill genera diagramas de despliegue en draw.io XML nativo siguiendo el estandar Tuya basado en C4 Deployment Diagrams. Usala para modelar como las unidades de despliegue de un sistema interactuan, donde se ejecutan y que dependencias runtime consumen.

El resultado esperado es un archivo `.drawio` editable. Si el usuario pide exportar, generar tambien `.drawio.svg`, `.drawio.png` o `.drawio.pdf` con XML embebido.

## Fuentes del estandar

- `diagrama-despliegue.md`
- `Diagrama de despliegue v3 - Overview.pdf`
- C4 Model Deployment Diagram: instancias de sistemas/contenedores desplegadas sobre infraestructura dentro de un deployment environment.
- C4-PlantUML: patrones conceptuales `Deployment_Node`, `Container`, `ContainerDb` y `Rel`.

## Principios de modelado

1. Modela un solo ambiente de despliegue por diagrama cuando sea posible: produccion, desarrollo, QA, nube, on premise, etc.
2. Muestra solo infraestructura que explique ejecucion, red, seguridad, disponibilidad o dependencias runtime.
3. Anida nodos cuando represente ubicacion real: entorno -> region/datacenter -> cluster/red -> namespace/VM/runtime -> unidad de despliegue.
4. La flecha de relacion siempre apunta al destino de la dependencia.
5. Toda relacion debe tener verbo de consumo y protocolo de capa 7 en corchetes.
6. Toda dependencia runtime externa debe aparecer como sistema externo.
7. La boveda de secretos debe aparecer siempre como sistema externo cuando exista consumo de secretos.
8. Si una unidad front web/mobile standalone se aloja en un servidor/CDN/store y se ejecuta en un dispositivo, representala dos veces: una en el nodo que aloja contenido/instalador y otra en el nodo del dispositivo donde corre.
9. Si usas iconos de proveedor cloud o formas no estandar, agrega leyenda.

## Paleta oficial para despliegue

| Elemento | Fill | Stroke | Texto | Uso |
|---|---:|---:|---:|---|
| Unidad de despliegue | `#23A2D9` | `#0B7FAB` | `#FFFFFF` | Software empaquetado y ejecutado en una plataforma |
| Sistema externo/Core System | `#8C8496` | `#6F6878` | `#FFFFFF` | Dependencias runtime externas al sistema en desarrollo |
| Nodo principal/activo | `none` | `#6B6B6B` | `#333333` | Infraestructura activa, transparente |
| Nodo pasivo/failover | `#F5F5F5` | `#CCCCCC` | `#333333` | Infraestructura standby o pasiva |
| Entorno | `none` | `#444444` | `#333333` | Boundary de datacenter/cloud/on premise |
| Relacion | `none` | `#828282` | `#333333` | Dependencia o consumo |
| Nota/Leyenda | `#FFF4C2` | `#D6B656` | `#333333` | Aclaraciones, convenciones e iconos |

No inventes colores para elementos estandar. Si debes resaltar riesgo, cambio o estado, usa notas o leyenda.

## Catalogo de elementos

### Entorno

Representa la ubicacion donde estan aprovisionados los nodos.

- Label: `<b>Nombre datacenter/cloud</b><br><i>[Environment: cloud]</i>` o `<i>[Environment: on premise]</i>`.
- Forma: `swimlane` transparente.
- Puede contener nodos de despliegue.
- Usa nombres de datacenter o nube reconocibles por la organizacion.

Style:

```text
swimlane;startSize=30;fillColor=none;strokeColor=#444444;fontColor=#333333;fontStyle=1;dashed=1;html=1;rounded=0;whiteSpace=wrap;
```

### Nodo de despliegue

Representa infraestructura o plataforma donde corre software: servidor fisico, VM, cluster, namespace, runtime, contenedor, dispositivo, CDN, PaaS, base de datos administrada, etc.

- Label: `<b>Infraestructura (99.9%)</b><br><i>[Deployment node: tipo estandarizado]</i>`.
- Nodos activos: fill transparente.
- Nodos pasivos/failover: fill `#F5F5F5`.
- Puede anidar otros nodos o unidades de despliegue.
- Incluye disponibilidad en el nombre cuando el estandar o la arquitectura la provean.

Style nodo activo:

```text
swimlane;startSize=26;fillColor=none;strokeColor=#6B6B6B;fontColor=#333333;fontStyle=1;html=1;rounded=0;whiteSpace=wrap;
```

Style nodo pasivo:

```text
swimlane;startSize=26;fillColor=#F5F5F5;strokeColor=#CCCCCC;fontColor=#333333;fontStyle=1;html=1;rounded=0;whiteSpace=wrap;
```

### Unidad de despliegue

Representa una unidad de software empaquetada y ejecutada dentro de una plataforma.

- Label obligatorio:

```html
<b>Nombre++</b><br><i>[Deployment unit: API]</i><br><br>Responsabilidad en una linea.
```

- Nombre en negrita y basado en responsabilidad.
- Sufijo `++` para unidad nueva.
- Sufijo `**` para unidad modificada.
- Tipo en formato `[Deployment unit: tipo estandarizado]`.
- Descripcion breve de responsabilidad.

Tipos frecuentes: API, BFF, Microservice, Worker, Integration Service, App Service, Web App, Front Web, Front Mobile, AsyncAPI, Event Consumer, Event Publisher, Database, NoSQL, Cache, Queue, Topic, Blob Storage.

### Sistema externo o Core System

Representa un servicio o dependencia externa al sistema en desarrollo.

- Label:

```html
<b>Nombre inventario</b><br><i>[Software System]</i><br><br>Responsabilidad en una linea.
```

- Usa `[Software System]` o `[Core System]`.
- El nombre debe coincidir con el Inventario de Aplicaciones cuando aplique.
- Incluye boveda de secretos y cualquier dependencia runtime.

Style:

```text
rounded=1;whiteSpace=wrap;html=1;fillColor=#8C8496;strokeColor=#6F6878;fontColor=#FFFFFF;align=center;verticalAlign=top;spacingTop=8;spacingLeft=10;spacingRight=10;arcSize=16;
```

### Relacion

Representa dependencia entre unidades, nodos o sistemas.

- Flecha hacia el destino de la dependencia.
- Label:

```html
<b>Consulta secretos</b><br>[JSON/HTTPS]
```

- Nombre en negrita, normalmente verbo de consumo.
- Protocolo en formato `[contenido/protocolo]`, por ejemplo `[JSON/HTTPS]`, `[HTML/HTTPS]`, `[AMQP/TLS]`, `[SQL/TDS]`, `[gRPC/HTTP2]`.

Style:

```text
edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=classic;strokeColor=#828282;fontColor=#333333;strokeWidth=1.5;
```

## Matriz de formas para unidades de despliegue

| Tipo de unidad | Forma draw.io | Style base |
|---|---|---|
| API, BFF, microservicio, worker, servicio de integracion | Rectangulo redondeado | `rounded=1;whiteSpace=wrap;html=1;fillColor=#23A2D9;strokeColor=#0B7FAB;fontColor=#FFFFFF;align=center;verticalAlign=top;spacingTop=8;spacingLeft=10;spacingRight=10;arcSize=12;` |
| DB, NoSQL, cache, storage persistente | Cilindro | `shape=cylinder3;whiteSpace=wrap;html=1;boundedLbl=1;backgroundOutline=1;size=15;fillColor=#23A2D9;strokeColor=#0B7FAB;fontColor=#FFFFFF;align=center;verticalAlign=top;spacingTop=8;spacingLeft=10;spacingRight=10;` |
| Cola, topico, broker, event stream | Cilindro o hexagono si es interfaz/evento | `shape=hexagon;perimeter=hexagonPerimeter2;whiteSpace=wrap;html=1;fillColor=#23A2D9;strokeColor=#0B7FAB;fontColor=#FFFFFF;align=center;verticalAlign=top;spacingTop=8;spacingLeft=10;spacingRight=10;` |
| AsyncAPI, publisher, subscriber, contrato de eventos | Hexagono | `shape=hexagon;perimeter=hexagonPerimeter2;whiteSpace=wrap;html=1;fillColor=#23A2D9;strokeColor=#0B7FAB;fontColor=#FFFFFF;align=center;verticalAlign=top;spacingTop=8;spacingLeft=10;spacingRight=10;` |
| Front web/mobile standalone, instalador, artefacto descargable | Rectangulo con marco | `shape=process;whiteSpace=wrap;html=1;fillColor=#23A2D9;strokeColor=#0B7FAB;fontColor=#FFFFFF;align=center;verticalAlign=top;spacingTop=8;spacingLeft=10;spacingRight=10;` |
| Funcion serverless o job batch | Rectangulo redondeado con borde punteado | `rounded=1;whiteSpace=wrap;html=1;fillColor=#23A2D9;strokeColor=#0B7FAB;fontColor=#FFFFFF;align=center;verticalAlign=top;spacingTop=8;spacingLeft=10;spacingRight=10;dashed=1;arcSize=12;` |

## Layout recomendado

Usa draw.io XML directo. Evita Mermaid para diagramas de despliegue porque los boundaries anidados y estilos corporativos requieren control preciso.

### Grid

- Canvas sugerido: `pageWidth="1800" pageHeight="1100"`.
- Margen minimo: 40 px.
- Contenedores principales: ancho suficiente para sus hijos, con padding interno visual de 30-40 px.
- Unidades de despliegue: `220x110` o `240x120`.
- Sistemas externos: `220x110`.
- Nodos: `swimlane` con `startSize=26`; el contenido empieza aprox. en `y=40`.

### Orden visual

1. Entornos de izquierda a derecha o arriba a abajo.
2. Entrada de trafico a la izquierda o arriba: DNS, CDN, WAF, gateway, balanceador.
3. Compute/plataforma en el centro: cluster, namespace, VM, runtime.
4. Datos y dependencias a la derecha o abajo.
5. Sistemas externos fuera del entorno del sistema en desarrollo, salvo que sean parte del mismo datacenter/nube y se quiera mostrar ubicacion.

### Anidamiento

Patron recomendado:

```text
Environment
  Deployment node: Region/Datacenter
    Deployment node: Cluster/VM/Runtime
      Deployment unit
      Deployment unit DB/Cache
External Software System
```

Las relaciones entre elementos en distintos contenedores deben tener `parent="1"` para evitar clipping.

## Plantillas XML copiables

### Label de unidad de despliegue

```xml
value="&lt;b&gt;API Clientes++&lt;/b&gt;&lt;br&gt;&lt;i&gt;[Deployment unit: API]&lt;/i&gt;&lt;br&gt;&lt;br&gt;Expone operaciones de clientes."
```

### Edge valido

```xml
<mxCell id="e_api_vault" edge="1" parent="1" source="du_api" target="sys_vault" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=classic;strokeColor=#828282;fontColor=#333333;strokeWidth=1.5;" value="&lt;b&gt;Consulta secretos&lt;/b&gt;&lt;br&gt;[JSON/HTTPS]">
  <mxGeometry relative="1" as="geometry"/>
</mxCell>
```

## Ejemplo completo

Este ejemplo muestra entorno cloud, nodo activo, nodo pasivo, API, base de datos, boveda de secretos y sistema externo.

```xml
<mxGraphModel dx="1400" dy="900" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1800" pageHeight="1100" math="0" shadow="0" adaptiveColors="auto">
  <root>
    <mxCell id="0"/>
    <mxCell id="1" parent="0"/>
    <mxCell id="title" value="Sistema X - Diagrama de despliegue" style="text;html=1;align=center;verticalAlign=middle;fontSize=20;fontStyle=1;fontColor=#333333;" vertex="1" parent="1">
      <mxGeometry x="40" y="20" width="720" height="40" as="geometry"/>
    </mxCell>
    <mxCell id="env_cloud" value="&lt;b&gt;Azure Colombia&lt;/b&gt;&lt;br&gt;&lt;i&gt;[Environment: cloud]&lt;/i&gt;" style="swimlane;startSize=30;fillColor=none;strokeColor=#444444;fontColor=#333333;fontStyle=1;dashed=1;html=1;rounded=0;whiteSpace=wrap;" vertex="1" parent="1">
      <mxGeometry x="40" y="90" width="1040" height="620" as="geometry"/>
    </mxCell>
    <mxCell id="node_aks" value="&lt;b&gt;AKS Productivo (99.9%)&lt;/b&gt;&lt;br&gt;&lt;i&gt;[Deployment node: Kubernetes Cluster]&lt;/i&gt;" style="swimlane;startSize=26;fillColor=none;strokeColor=#6B6B6B;fontColor=#333333;fontStyle=1;html=1;rounded=0;whiteSpace=wrap;" vertex="1" parent="env_cloud">
      <mxGeometry x="40" y="60" width="620" height="360" as="geometry"/>
    </mxCell>
    <mxCell id="node_ns" value="&lt;b&gt;Namespace negocio&lt;/b&gt;&lt;br&gt;&lt;i&gt;[Deployment node: Kubernetes Namespace]&lt;/i&gt;" style="swimlane;startSize=26;fillColor=none;strokeColor=#6B6B6B;fontColor=#333333;fontStyle=1;html=1;rounded=0;whiteSpace=wrap;" vertex="1" parent="node_aks">
      <mxGeometry x="30" y="50" width="560" height="260" as="geometry"/>
    </mxCell>
    <mxCell id="du_api" value="&lt;b&gt;API Clientes++&lt;/b&gt;&lt;br&gt;&lt;i&gt;[Deployment unit: API]&lt;/i&gt;&lt;br&gt;&lt;br&gt;Expone operaciones de clientes." style="rounded=1;whiteSpace=wrap;html=1;fillColor=#23A2D9;strokeColor=#0B7FAB;fontColor=#FFFFFF;align=center;verticalAlign=top;spacingTop=8;spacingLeft=10;spacingRight=10;arcSize=12;" vertex="1" parent="node_ns">
      <mxGeometry x="40" y="60" width="230" height="120" as="geometry"/>
    </mxCell>
    <mxCell id="du_db" value="&lt;b&gt;Clientes DB&lt;/b&gt;&lt;br&gt;&lt;i&gt;[Deployment unit: NoSQL]&lt;/i&gt;&lt;br&gt;&lt;br&gt;Persiste documentos de clientes." style="shape=cylinder3;whiteSpace=wrap;html=1;boundedLbl=1;backgroundOutline=1;size=15;fillColor=#23A2D9;strokeColor=#0B7FAB;fontColor=#FFFFFF;align=center;verticalAlign=top;spacingTop=8;spacingLeft=10;spacingRight=10;" vertex="1" parent="node_ns">
      <mxGeometry x="310" y="60" width="220" height="120" as="geometry"/>
    </mxCell>
    <mxCell id="node_passive" value="&lt;b&gt;Replica pasiva (99.5%)&lt;/b&gt;&lt;br&gt;&lt;i&gt;[Deployment node: Standby Region]&lt;/i&gt;" style="swimlane;startSize=26;fillColor=#F5F5F5;strokeColor=#CCCCCC;fontColor=#333333;fontStyle=1;html=1;rounded=0;whiteSpace=wrap;" vertex="1" parent="env_cloud">
      <mxGeometry x="700" y="60" width="300" height="200" as="geometry"/>
    </mxCell>
    <mxCell id="du_db_replica" value="&lt;b&gt;Clientes DB Replica&lt;/b&gt;&lt;br&gt;&lt;i&gt;[Deployment unit: NoSQL]&lt;/i&gt;&lt;br&gt;&lt;br&gt;Replica pasiva de datos." style="shape=cylinder3;whiteSpace=wrap;html=1;boundedLbl=1;backgroundOutline=1;size=15;fillColor=#23A2D9;strokeColor=#0B7FAB;fontColor=#FFFFFF;align=center;verticalAlign=top;spacingTop=8;spacingLeft=10;spacingRight=10;" vertex="1" parent="node_passive">
      <mxGeometry x="40" y="60" width="220" height="110" as="geometry"/>
    </mxCell>
    <mxCell id="sys_vault" value="&lt;b&gt;Azure Key Vault&lt;/b&gt;&lt;br&gt;&lt;i&gt;[Software System]&lt;/i&gt;&lt;br&gt;&lt;br&gt;Boveda de secretos runtime." style="rounded=1;whiteSpace=wrap;html=1;fillColor=#8C8496;strokeColor=#6F6878;fontColor=#FFFFFF;align=center;verticalAlign=top;spacingTop=8;spacingLeft=10;spacingRight=10;arcSize=16;" vertex="1" parent="1">
      <mxGeometry x="1160" y="180" width="230" height="120" as="geometry"/>
    </mxCell>
    <mxCell id="sys_core" value="&lt;b&gt;Core Clientes&lt;/b&gt;&lt;br&gt;&lt;i&gt;[Core System]&lt;/i&gt;&lt;br&gt;&lt;br&gt;Sistema maestro de clientes." style="rounded=1;whiteSpace=wrap;html=1;fillColor=#8C8496;strokeColor=#6F6878;fontColor=#FFFFFF;align=center;verticalAlign=top;spacingTop=8;spacingLeft=10;spacingRight=10;arcSize=16;" vertex="1" parent="1">
      <mxGeometry x="1160" y="350" width="230" height="120" as="geometry"/>
    </mxCell>
    <mxCell id="e_api_db" edge="1" parent="1" source="du_api" target="du_db" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=classic;strokeColor=#828282;fontColor=#333333;strokeWidth=1.5;" value="&lt;b&gt;Persiste datos&lt;/b&gt;&lt;br&gt;[JSON/HTTPS]">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>
    <mxCell id="e_api_vault" edge="1" parent="1" source="du_api" target="sys_vault" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=classic;strokeColor=#828282;fontColor=#333333;strokeWidth=1.5;" value="&lt;b&gt;Consulta secretos&lt;/b&gt;&lt;br&gt;[JSON/HTTPS]">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>
    <mxCell id="e_api_core" edge="1" parent="1" source="du_api" target="sys_core" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=classic;strokeColor=#828282;fontColor=#333333;strokeWidth=1.5;" value="&lt;b&gt;Consulta cliente&lt;/b&gt;&lt;br&gt;[JSON/HTTPS]">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>
    <mxCell id="e_db_replica" edge="1" parent="1" source="du_db" target="du_db_replica" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=classic;strokeColor=#828282;fontColor=#333333;strokeWidth=1.5;dashed=1;" value="&lt;b&gt;Replica datos&lt;/b&gt;&lt;br&gt;[CDC/TLS]">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>
    <mxCell id="legend" value="&lt;b&gt;Leyenda&lt;/b&gt;&lt;br&gt;&lt;font color=&quot;#23A2D9&quot;&gt;■&lt;/font&gt; Unidad de despliegue  &lt;font color=&quot;#8C8496&quot;&gt;■&lt;/font&gt; Sistema externo/Core  &lt;font color=&quot;#F5F5F5&quot;&gt;■&lt;/font&gt; Nodo pasivo" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFF4C2;strokeColor=#D6B656;fontColor=#333333;align=left;verticalAlign=top;spacingTop=8;spacingLeft=10;spacingRight=10;" vertex="1" parent="1">
      <mxGeometry x="40" y="740" width="760" height="70" as="geometry"/>
    </mxCell>
  </root>
</mxGraphModel>
```

## Workflow para crear un diagrama

1. Identifica el sistema, ambiente y alcance.
2. Lista entornos, nodos, unidades de despliegue, sistemas externos y relaciones.
3. Verifica dependencias runtime: secretos, identidad, mensajeria, datos, observabilidad, proveedores externos.
4. Elige formas segun la matriz de unidades.
5. Genera XML `mxGraphModel` nativo, no Mermaid.
6. Garantiza que todo edge tenga `<mxGeometry relative="1" as="geometry"/>`.
7. Guarda como `.drawio`.
8. Abre o previsualiza con draw.io.
9. Si el usuario pidio export, usa draw.io CLI con `-e` para embeber XML.

## draw.io CLI en Windows

Ubicaciones comunes:

```powershell
C:\Program Files\draw.io\draw.io.exe
$env:LOCALAPPDATA\Programs\draw.io\draw.io.exe
```

Exportar PNG editable:

```powershell
& "C:\Program Files\draw.io\draw.io.exe" -x -f png -e -b 10 -o diagram.drawio.png diagram.drawio
```

Abrir archivo:

```powershell
Invoke-Item .\diagram.drawio
```

## Checklist de calidad

- [ ] El diagrama tiene un ambiente claro (`[Environment: cloud]` u `[Environment: on premise]`).
- [ ] Los nodos estan anidados segun infraestructura real.
- [ ] Los nodos activos son transparentes y los pasivos usan `#F5F5F5`.
- [ ] Las unidades usan `#23A2D9` y el tipo `[Deployment unit: ...]`.
- [ ] Los sistemas externos/core usan `#8C8496`.
- [ ] La boveda de secretos aparece si hay consumo de secretos.
- [ ] Toda dependencia runtime externa esta modelada.
- [ ] Front web/mobile standalone aparece en hosting/installer y dispositivo de ejecucion si aplica.
- [ ] Las relaciones apuntan a la dependencia.
- [ ] Cada relacion tiene verbo y protocolo `[contenido/protocolo]`.
- [ ] No hay comentarios XML.
- [ ] Todos los labels HTML estan escapados.
- [ ] Cada edge tiene `mxGeometry`.
- [ ] Si hay iconos cloud/vendor, existe leyenda.

## Errores comunes

| Error | Correccion |
|---|---|
| Usar el azul C2 generico `#438DD5` | Usar `#23A2D9` para unidades de despliegue |
| Ocultar la boveda de secretos dentro de un nodo | Mostrarla como sistema externo si es dependencia runtime |
| Flechas desde dependencia hacia consumidor | Invertir: consumidor -> dependencia |
| Relacion sin protocolo | Agregar `[contenido/protocolo]` |
| Nodo pasivo transparente | Usar fill `#F5F5F5` |
| Front standalone solo en CDN/store | Duplicar en el dispositivo donde ejecuta |
| Edge autocerrado | Agregar `<mxGeometry relative="1" as="geometry"/>` |

