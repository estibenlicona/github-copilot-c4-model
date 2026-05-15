workspace "GitHub Copilot — Despliegue" "C2 Deployment de la plataforma GitHub Copilot en Tuya" {

    !identifiers hierarchical

    model {
        // ------------------------ Personas ------------------------
        developer = person "Developer Tuya" "Usa Copilot desde su workstation."

        // ------------------------ Software Systems ------------------------
        copilot = softwareSystem "GitHub Copilot" "Plataforma de asistencia de IA para desarrolladores." {
            ide          = container "VS Code + Extension"     "Cliente IDE Copilot."             "VS Code Extension"
            cli          = container "Copilot CLI"             "Cliente de línea de comandos."     "Node.js CLI"
            mcpsLocal    = container "MCPs locales"            "Servidores MCP en workstation."    "MCP"
            proxy        = container "Copilot Proxy"           "Recibe prompts y enruta al modelo." "SaaS"
            llm          = container "LLM (GPT/Claude)"        "Modelo de lenguaje."               "Model"
            licenseSvc   = container "License Service"         "Valida asientos."                  "SaaS"
            consoleAdmin = container "Consola Admin"           "Gestión de políticas y asientos."  "Web"
            auditApi     = container "Audit API"               "Expone eventos de uso."            "REST API"
            metricsApi   = container "Metrics API"             "Métricas agregadas."               "REST API"
            auditStore   = container "Audit Store"             "Almacén de auditoría."             "Datastore"

            apimSonar    = container "APIM — API Sonar"        "Frontera norte para SonarCloud MCP." "Azure APIM"
            acrSonarImg  = container "Imagen MCP Sonar"        "Imagen OCI del MCP server."        "Container Image"
            ingress      = container "Ingress (AKS)"           "Ingress namespace MCP."            "K8s Ingress"
            mcpServer    = container "MCP Server SonarCloud"   "Servidor MCP corporativo."         "Pod"
            mcpToken     = container "Token Sonar **"          "EnvVar con token Sonar (modificado)." "Secret"
            mcpCsi       = container "CSI Secret Provider ++"  "Secret CSI driver (nuevo)."        "K8s CSI"
            mcpLogs      = container "Logs MCP"                "Stream de logs."                   "Logs"
            helmTemplate = container "Helm template ++"        "Template Helm (nuevo)."            "Helm"
        }

        // Sistemas externos
        netskope = softwareSystem "Netskope" "Secure Web Gateway corporativo." "External"
        entra    = softwareSystem "Entra ID" "Identity provider corporativo." "Core"
        sonar    = softwareSystem "SonarCloud" "SaaS de calidad de código." "External"
        azdo     = softwareSystem "Azure DevOps Repos" "Repositorios y pipelines." "External"
        keyVault = softwareSystem "Azure Key Vault ++" "Bóveda de secretos (a integrar)." "Future"
        siem     = softwareSystem "SIEM" "Plataforma de seguridad (a integrar)." "Future"
        bi       = softwareSystem "BI Platform" "BI corporativo (a integrar)." "Future"

        // ------------------------ Relaciones ------------------------
        developer -> copilot.ide "Programa con asistencia" "VS Code UI"
        developer -> copilot.cli "Ejecuta comandos" "CLI"
        copilot.ide -> copilot.mcpsLocal "Invoca tools locales" "stdio/MCP"
        copilot.cli -> copilot.mcpsLocal "Invoca tools locales" "stdio/MCP"
        copilot.ide -> netskope "Egress HTTPS" "HTTPS"
        copilot.cli -> netskope "Egress HTTPS" "HTTPS"
        copilot.cli -> azdo "Clones / pushes" "Git/HTTPS"

        netskope -> copilot.proxy "Egress permitido" "HTTPS"
        copilot.proxy -> copilot.llm "Solicita completions" "HTTPS"
        copilot.proxy -> copilot.licenseSvc "Valida asiento" "HTTPS"
        copilot.licenseSvc -> entra "OIDC SSO" "OIDC"
        copilot.consoleAdmin -> entra "OIDC SSO" "OIDC"
        copilot.auditApi -> copilot.auditStore "Persiste eventos" "JDBC"
        copilot.auditApi -> siem "Exporta eventos" "HTTPS"
        copilot.metricsApi -> bi "Exporta métricas" "HTTPS"

        netskope -> copilot.apimSonar "MCP requests" "HTTPS"
        copilot.apimSonar -> copilot.ingress "Reenvía" "HTTPS"
        copilot.ingress -> copilot.mcpServer "Enruta" "HTTP"
        copilot.mcpServer -> copilot.mcpToken "Lee token" "env"
        copilot.mcpServer -> sonar "Consume API" "REST/HTTPS"
        copilot.mcpServer -> copilot.mcpLogs "Emite logs" "stdout"
        copilot.acrSonarImg -> copilot.mcpServer "Provee imagen" "OCI pull"
        copilot.mcpServer -> copilot.mcpCsi "Monta secret" "CSI mount"
        copilot.mcpCsi -> keyVault "Resuelve secret" "HTTPS"

        // ------------------------ Deployment Environment ------------------------
        production = deploymentEnvironment "Production" {

            tuyaOnPrem = deploymentNode "Tuya Endpoints (on-prem)" "Estaciones de trabajo internas." "Windows/macOS" {
                ws = deploymentNode "Workstation" "Estación del developer." "OS" {
                    containerInstance copilot.ide
                    containerInstance copilot.cli
                    containerInstance copilot.mcpsLocal
                }
            }

            githubCloud = deploymentNode "GitHub Cloud (SaaS)" "Plataforma SaaS Copilot." "SaaS" {
                copilotSaas = deploymentNode "Copilot SaaS" "Servicios gestionados por GitHub." "Multi-region" {
                    containerInstance copilot.proxy
                    containerInstance copilot.llm
                    containerInstance copilot.licenseSvc
                    containerInstance copilot.consoleAdmin
                    containerInstance copilot.auditApi
                    containerInstance copilot.metricsApi
                    containerInstance copilot.auditStore
                }
            }

            azure = deploymentNode "Azure dev" "Suscripción Azure de Tuya." "Azure" {
                apim = deploymentNode "APIM" "API Management." "Azure APIM" {
                    containerInstance copilot.apimSonar
                }
                acr = deploymentNode "ACR" "Container Registry." "Azure ACR" {
                    containerInstance copilot.acrSonarImg
                }
                aks = deploymentNode "AKS Cluster" "Kubernetes managed." "AKS 1.29" {
                    nsMcp = deploymentNode "namespace: mcp" "Namespace MCP." "Kubernetes namespace" {
                        containerInstance copilot.ingress
                        containerInstance copilot.mcpServer
                        containerInstance copilot.mcpToken
                        containerInstance copilot.mcpCsi
                        containerInstance copilot.mcpLogs
                        containerInstance copilot.helmTemplate
                    }
                }
            }
        }
    }

    views {
        // ----------- Deployment view -----------
        deployment copilot "Production" "Deployment-Production" {
            include *
            autolayout lr
            description "Vista de despliegue de Copilot en Tuya (workstation + GitHub SaaS + Azure)."
        }

        // ----------- Container view (apoyo) -----------
        container copilot "Containers" {
            include *
            autoLayout lr
            description "Vista lógica de contenedores."
        }

        // ----------- Estilos C4 corporativos Tuya -----------
        styles {
            element "Person" {
                background "#08427B"
                color      "#ffffff"
                shape      Person
            }
            element "Software System" {
                background "#1168BD"
                color      "#ffffff"
            }
            element "Container" {
                background "#438DD5"
                color      "#ffffff"
            }
            element "External" {
                background "#8C8496"
                color      "#ffffff"
            }
            element "Core" {
                background "#5E4E6E"
                color      "#ffffff"
            }
            element "Future" {
                background "#B59CC9"
                color      "#ffffff"
                border     Dashed
            }
            element "Datastore" {
                shape Cylinder
            }
            relationship "Relationship" {
                color "#828282"
                style Solid
            }
        }

        theme default
    }

    configuration {
        scope softwaresystem
    }
}
