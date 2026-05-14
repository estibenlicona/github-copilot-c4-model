:::mermaid
sequenceDiagram

participant A as PCO
participant B as venta Online
participant C as Homini
participant D as Desmaterialización Formato Físico
participant E as Desmaterialización Formato Online
participant F as Desmaterializar formato Anexo garantías
participant G as Imagine
participant H as Servicio LogAnexoGarantías
participant I as Programa LogAnexoGarantías
participant J as Archivo LogAnexoGarantías

A->>C: Execute
C->>D: POST INFO
B->>E: POST INFO
D->>F: POST INFO 
E->>F: POST INFO
F->>G: POST INFO
G->>F: Response
F->>H: POST 
H->>I: POST
I->>J: POST
I->>H: Response
H->>F: Response 
F->>D: Response 
F->>E: Response 
D->>C: Response 
C->>A: Response 
E->>B: Response 

:::
