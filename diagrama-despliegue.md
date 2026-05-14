[[_TOC_]]

# Propósito

El diagrama de despliegue comunica como las unidades de despliegue de un sistema interactúan para solucionar un problema de negocio, y va mas allá de un diagrama de componentes al ilustrar las plataformas donde son desplegadas. 

Es un diagrama estático de nivel 2 de acuerdo a C4 Model: [Deployment Diagram](https://c4model.com/#DeploymentDiagram).

# Notación

## Unidades de despliegue

Representa una unidad de software que es empaquetada y ejecutada dentro de una plataforma, pueden ser aplicaciones servidor, instancias de BD, APIs asíncronas o aplicaciones standalone. Toman alguna de las siguientes formas y color:

![deployment_unit.png](/.attachments/deployment_unit-b083fe72-3cc5-402e-8893-7b458f9d19fc.png =900x)

- Color: se estandariza en color azul, con código hexadecimal \#23A2D9
- Nombramiento: las unidades de despliegue se nombran de acuerdo a su responsabilidad y en negrita, se adiciona el sufijo _++_ cuando es una nueva unidad de despliegue o el sufijo _**_ cuando se debe modificar
- Tipo: se incluye la clasificación _[Deployment unit: tipo estandarizado]_ en corchetes, de acuerdo a los tipos definidos en el [Inventario de Aplicaciones](https://tuyacrm.sharepoint.com/:x:/s/TecnologiaTeam-COEArquitectura/ESjNV3AaYn5BuZvuBlK5ZE8BUdGQMsn-MXPzczX56yZADg?e=md6VfD) en la pestaña "Tipos"
- Descripción: se incluye la responsabilidad de la unidad de despliegue en modo resumen

## Sistemas

Representa un servicio o dependencia externa al sistema que esta en desarrollo, usualmente un servicio que fue desarrollado para otra aplicación o un servicio de terceros. Toma la siguiente forma y color:

![system.png](/.attachments/system-a15035ee-218c-414a-bc11-17aab85e63f8.png =250x)

- Color: se estandariza en color gris, con código hexadecimal \#8C8496
- Nombramiento: los sitemas externos se nombran en negrita, debe coincidir con el nombre y aparecer en el [Inventario de Aplicaciones](https://tuyacrm.sharepoint.com/:x:/s/TecnologiaTeam-COEArquitectura/ESjNV3AaYn5BuZvuBlK5ZE8BUdGQMsn-MXPzczX56yZADg?e=md6VfD)
- Tipo: se incluye la clasificación _[Software System]_ o _[Core System]_ en corchetes
- Descripción: se incluye la responsabilidad del sistema en modo resumen.

REGLA: Siempre se deben incluir los componentes de _bóveda de secretos_ como sistema externo, así como cualquier otra dependencia en tiempo de ejecución.

## Nodo

Representa la plataforma o la infraestructura donde se ejecuta el software, el cual tiene relación directa con la tecnología que soporta, este puede o no estar anidado con otros nodos. Toma las siguientes formas y color:

![deployment_node.png](/.attachments/deployment_node-4c6e699c-cd23-483f-a40e-75cbc3ac0c92.png =500x)

- Color: se estandariza en color transparente para los nodos principales, y en gris para los nodos pasivos con código hexadecimal \#F5F5F5
- Nombramiento: los nodos se nombran de acuerdo a la infraestructura subyacente y en negrita, se adiciona el sufijo con el _(%)_ de disponiblidad
- Tipo: se incluye la clasificación _[Deployment node: tipo estandarizado]_ en corchetes, de acuerdo a los tipos definidos en el [Inventario de Aplicaciones](https://tuyacrm.sharepoint.com/:x:/s/TecnologiaTeam-COEArquitectura/ESjNV3AaYn5BuZvuBlK5ZE8BUdGQMsn-MXPzczX56yZADg?e=md6VfD) en la pestaña "Tipos"

REGLA: Las unidades de despliegue de tipo _front web_ y _front mobile_ que se implementan con tecnologías stand-alone se requiere aparezcan dos veces en el diagrama, la primera vez dentro del nodo que aloja el contenido/instalador y la segunda vez en el nodo que representa el dispositivo donde se ejecuta.

## Entorno

Representa la ubicación donde se encuentran los nodos aprovisionados, la compañía actualmente cuenta con dos datacenter en tierra y dos en nube. Toma la siguiente forma y color:

![environment.png](/.attachments/environment-d9e8a611-a438-4b9e-b7e0-5b33af29eb40.png =250x)

- Color: se estandariza en color transparente
- Nombramiento: los ambientes usan el nombre del datacenter y en negrita
- Tipo: se incluye la clasificación _[Environment: tipo entorno]_ en corchetes, tomando únicamente  valores "on premise" o "cloud"

## Relaciones

Representa una relación de dependencia entre dos unidades de despliegue, con la flecha apuntando al destino de la dependencia. Toma la siguiente forma y color:

![relation_net.png](/.attachments/relation_net-78057730-c748-4e2c-9d2f-436ae897ce19.png =300x)

- Color: se estandariza en color gris, con código hexadecimal \#828282
- Nombramiento: las relaciones se nombran en negrita, usualmente son de  "consumo"
- Protocolo: se incluye la definición del protocolo de capa 7 en corchetes. Así: [contenido/protocolo] 

# Herramienta

Se puede usar Draw\.io instalado desde Software Center o como una [extensión](https://marketplace.visualstudio.com/items?itemName=hediet.vscode-drawio) dentro de VS Code, también se puede usar PlantUML como una [extensión](https://marketplace.visualstudio.com/items?itemName=jebbs.plantuml) dentro de VS Code. En un futuro Mermaid habilitará las construcción de [Diagramas C4](https://mermaid.js.org/syntax/c4.html) directamente en Wiki.

# Ejemplo

![example.png](/.attachments/example-d941fbb5-f538-4967-a73c-f4d12e5933c7.png =1000x)

# Referencias

- C4 Model: https://c4model.com/
- Mermaid C4: https://mermaid.js.org/syntax/c4.html
- Plant UML C4: https://github.com/plantuml-stdlib/C4-PlantUML
- VS Code Marketplace: https://marketplace.visualstudio.com/ 