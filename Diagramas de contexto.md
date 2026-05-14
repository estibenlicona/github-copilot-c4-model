[[_TOC_]]

#Proposito
Un diagrama de contexto es una vista de alto nivel de un sistema. Es un medio básico para definir una entidad basándose en sus límites de alcance y en su relación con los componentes externos como las partes interesadas.

**Ventajas de un Diagrama de Contexto**

**- Definición del alcance:** Un diagrama de contexto ayuda a los interesados en el proyecto a entender todo un sistema de software de un solo vistazo.

**- Ayuda a detectar errores:** Un diagrama de contexto es adecuado para señalar las omisiones y los errores en los requisitos del proyecto. Esto ayuda a mitigar los riesgos y reducir los costos antes de su implementación.

**- Ayuda a identificar al usuario objetivo:** Dado que un diagrama de contexto esboza los grupos de usuarios de una aplicación y cómo interactúan con ella, los desarrolladores pueden identificar su grupo de usuarios principal.

**- Facilidad de uso:** Los diagramas de contexto son fáciles de modificar a medida que se aporta nueva información. Se puede editar, añadir y eliminar cada elemento del diagrama cuando hay un cambio en el sistema o un factor externo. 

**No es necesario tener conocimientos técnicos ni experiencia en codificación para crear un diagrama de contexto**

	
#Elementos, notación y colores

## Componentes
Un diagrama de contexto comprende tres características claves:

**- Sistema o Producto:** Cualquier sistema, proceso o entidad comercial responsable de procesar y enviar información a cada entidad. **Se simboliza con un cuadro.**

**- Entidades externas:** Las personas, los sistemas y las organizaciones que funcionan por fuera pero que interactúan de alguna manera con el producto. **Se representan con cuadros si es sistema o con la forma de persona**

**- Líneas de flujo:** Simbolizan los datos que fluyen entre los agentes o las formas específicas en que las entidades externas interactúan con el producto. **Cada flujo de datos está representado por una flecha anotada con texto que detalla el tipo de datos que fluye entre el producto y cada entidad.** 

## Colores
**Azul:** Sistema o software principal que resuelve la necesidad de negocio
**Gris:** Personas y Sistemas de software con los que interactúa el Sistema principal

![diagrama contexto-Página-2.jpg](/.attachments/diagrama%20contexto-Página-2-246266e3-aa02-47b2-8765-fada4726fd4d.jpg)

**Recomendación:** La etiqueta en sí debe ser un sustantivo que proporcione una descripción muy general del flujo de datos.

# Herramientas

Para la documentación del Diagrama de Contexto, usamos la notación **C4** y la herramienta **Draw.io**

# Diagrama de Referencia

## Pasos para crear Diagrama de Contexto

**1. Establece un límite inicial:** Empieza por identificar el producto o proyecto que deseas contextualizar. Coloca esto en un cuadro en el centro de tu diagrama. En este punto, deberás determinar los roles o procesos que deberían ir dentro de este límite.

**2. Identifica y enumera todas las entidades externas:** Cuando pienses sobre los agentes externos, enumera cada uno de ellos en torno a tu límite inicial. Colócalos alrededor del sistema.


**3. Determina el flujo de datos:** Recorre tu sistema y determina para cada entidad externa, qué servicio o proceso de datos se espera del producto principal y viceversa. Haz esto con cada entidad externa hasta que hayas asignado un flujo de datos a cada una.

![diagrama contexto-Página-1.jpg](/.attachments/diagrama%20contexto-Página-1-e7555c16-ce77-48be-ac28-5fc955332672.jpg)

## Consejos finales
- Describe la relación de los componentes externos, como una unidad, integrándolos en un sistema. Explica el tipo de información que el grupo necesitará del sistema y las interacciones significativas con el mismo.
- La información sólo puede fluír en una dirección
- Asegúrate de que tu diagrama muestre todas las entidades relevantes.
- Utiliza un lenguaje sencillo en tus etiquetas y descripciones. Principalmente, esto se logra mediante la asignación de descripciones muy generales basadas en sustantivos al flujo de datos.

# Referencias

https://c4model.com/#SystemContextDiagram

https://mermaid.js.org/syntax/c4c.html


