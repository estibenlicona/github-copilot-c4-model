[[_TOC_]]

# Propósito

Este documento contiene los elementos que deben ser entregados para comunicar las decisiones tomadas al construir una arquitectura de solución, respondiendo a _"que"_ componentes y _"cuál"_ es la relación entre esos componentes, para resolver un proceso de negocio desde el punto de vista funcional y no-funcional. Hace parte de los ejercicios de arquitectura de soluciones y arquitectura de integración, y se enmarca en la práctica ágil de arquitecturas emergentes.

# Publicación

Se entrega en formato Wiki, y publica junto a la documentación de la iniciativa siguiendo el [Estándar Documentación Aplicaciones](/Gobierno/Ingeniería-de-Software/Estándar-documentación-Aplicaciones).

La página Wiki se nombra así: Arquitectura de Solución. Se adiciona el sufijo (MVP) para las arquitecturas evolutivas o el sufijo (draft) mientras el documento se encuentre en construcción.

# Plantilla entregable

## Objetivo

{ Describe a _que_ responde el entregable de arquitectura de solución, también se puede redactar en términos de alcance. }


## Diagrama de contexto

{ Permite entender en términos generales el sistema en construcción y sus interacciones con los diferentes actores (sistemas, procesos o humanos). Este diagrama esta alineado con el estándar de documentación C4 Model: System Context Diagram de nivel 1, detallado en [Diagrama de Contexto](/Gobierno/Arquitectura/Estándar-Entregables/Diagrama-de-contexto-v2). }

## Requerimientos no-funcionales

{ También conocidos como atributos de calidad, describen en forma de requerimiento aquellas características técnicas a las cuales debe responder esta arquitectura. Debe contener, pero no se limita a, los siguientes requerimientos acordados con el _Product Owner_. }

- { Disponibilidad de la solución requerida, expresada en % y horas/mes. }
- { Tiempo de respuesta promedio y máximo requeridos. }
- { Cantidad máxima de usuarios o transacciones a soportar. }
- { Requiere autenticación?, autorización?, cifrado tránsito?, cifrado reposo?, auditoría?. }
- { Requiere DRP?, es BIA?, es misional?, circular 005?. }
- { Usará de canales de comunicación? requieren crecimiento?. }

## Definiciones para repositorios

{ Se entiende como repositorio cualquier componente relacional, llave valor, colas o archivos, y se debe documentar para cada uno de los definidos en la arquitectura.  }

| Repositorio   | Volumetría                                 | Política de depuración                                         | Mecanismo de depuración                                                                        |
|---------------|--------------------------------------------|----------------------------------------------------------------|------------------------------------------------------------------------------------------------|
| Repositorio X | Tamaño de los datos y crecimiento esperado | Reglas de negocio que establecen que datos se depuran y cuándo | Tecnología responsable por ejecutar la depuración, define si es por configuración o por código |

## Diagrama de despliegue

{ Diagrama estático que describe la solución con unidades de despliegue y las relaciones entre estos. Este diagrama facilita el entendimiento de la complejidad de la solución y el cálculo teórico de la disponiblidad. Este diagrama esta alineado con el estándar de documentación C4 Model: Deployment Diagram de nivel 2, detallado en [Diagrama de despliegue](/Gobierno/Arquitectura/Estándar-Entregables/Diagrama-de-despliegue-v3). }

## Diagrama de secuencia

{ Diagrama dinámico que describe la solución con unidades de despliegue y la secuencia de invocaciones entre estos. Este diagrama facilita las explicaciones de comportamiento de la solución y el cálculo teórico de tiempos de respuesta. Este diagrama esta alineado con el estándar de documentación C4 Model: Dynamic Diagram de nivel 2, detallado en [Diagrama de secuencia](/Gobierno/Arquitectura/Estándar-Entregables/Diagrama-de-secuencia-v2). }

## Especificaciones

{ Lista las unidades de despliegue diagramadas anteriormente describiendo en detalle las restricciones y tecnologías para su implementación, también documenta el código de cada unidad reflejada en el [Inventario de Aplicaciones](https://tuyacrm.sharepoint.com/:x:/s/TecnologiaTeam-COEArquitectura/ESjNV3AaYn5BuZvuBlK5ZE8BUdGQMsn-MXPzczX56yZADg?e=md6VfD) como componentes de aplicación. Esta documentación habilita los equipos de infraestructura y DevOps para hacer los aprovisionamientos de acuerdo a lo definido en [Taxonomía de tecnología](https://tuyacrm.sharepoint.com/:p:/s/TecnologiaTeam-COEArquitectura/EY49SlK0uqNPpNpAAJfFtFoBoJnPSiJFggcEJveo5JOVYw?e=ncPIjI) }

- { Unidad de despliegue 1: restricciones, tecnologías y codificación AP###-##. }
- { Unidad de despliegue 2: restricciones, tecnologías y codificación AP###-##. }
- { Unidad de despliegue 3: restricciones, tecnologías y codificación AP###-##. }

## Diagrama de módulos (opcional)

{ Diagrama estático que describe la solución a partir de sus módulos y las relaciones entre estos. Este diagrama aplica para arquitecturas de estilo monolito modular en donde la separación de responsabilidades se define dentro de la unidad de despliegue con módulos. Este diagrama esta alineado con el estándar de documentación C4 Model: Component Diagram de nivel 3, detallado en [Diagrama de módulos](/Gobierno/Arquitectura/Estándar-Entregables/Diagrama-de-módulos-v2). }


## Exposición de servicios

{ Define las URL del ambiente productivo por la cual se expondrán los servicios planteados en esta arquitectura, la URL está conformada por 3 secciones, protocolo (siempre bajo TLS) seguido del dominio seguido del contexto. Para el caso de API's abiertas se adiciona la versión Mayor antes del contexto/recurso. }

| URL                                   | Exposición |
|---------------------------------------|------------|
| https://xxxx.tuya.corp/contextoA/     | Privada    |
| https://yyyy.tuya.com.co/contextoB/   | Internet   |
| https://api.tuya.com.co/v1/contextoC/ | Internet   |

## Deuda técnica

{ Lista las historias deuda técnica encontradas durante la construcción de esta arquitectura y las encontradas durante las verificaciones de adherencia. Aún cuando no exista deuda esta sección debe aparecer. }

- { Link a la historia de deuda técnica 1. }
- { Link a la historia de deuda técnica 2. }
- { Link a la historia de deuda técnica 3. }

{ REGLA: Todas las arquitecturas MVP deben ser declaradas como deuda técnica. }

{ REGLA: Todas las arquitecturas que incumplan algún [mandamiento de arquitectura](/Gobierno/Arquitectura/Mandamientos) son deuda técnica y deben ser aprobadas por el líder de arquitectura. }

## Anexos

{ En esta sección se relacionan como links todos los documentos que fueron tenidos en cuenta o fueron insumo al elaborar esta arquitectura. }

- { Cálculo de disponibilidad y tiempos de respuesta. }
- { Visiones que fueron alineadas y honradas. }
- { Proceso de negocio (opcional). }
- { Diseño de APIs y AsyncAPI (opcional). }
- { Arquitecturas de referencia (opcional). }
- { Arquitectura de Infraestructura (opcional). }

## Control

{ Tabla de control de cambios y aprobaciones, entendiendo que toda arquitectura debe ser aprobada en modalidad Peer Review por 1 arquitecto de solución senior. }

{ REGLA: toda arquitectura cuenta con plazo de 6 meses para implementarse, plazo que inicia a partir de la fecha de documentación, luego de ese plazo de debe re-evaluar si aún es vigente o si se debe modificar. }

| Quien                           | Cuando             | Actividad                    |
|---------------------------------|--------------------|------------------------------|
| @<Johann Mauricio Medina Plaza> | Octubre 6 de 2023  | Documentación                |
| @<Isabel Cristina Arias Argaez> | Octubre 9 de 2023  | Aprobación                   |
| @<Johann Mauricio Medina Plaza> | Octubre 30 de 2023 | Incluye mecanismo depuración |
| @<Johann Mauricio Medina Plaza> | Julio 18 de 2024   | Incluye URL's de servicio    |
| @<Johann Mauricio Medina Plaza> | Agosto 14 de 2024  | Refina no-funcionales        |