# Key Keeper - OpenAPI Generator Usage Guide

Este guia descreve como configurar e gerar o código do OpenAPI no seu projeto Angular **key-keeper-ui** a partir do seu backend **key-keeper** (Micronaut), utilizando o **OpenAPI Generator**.

## Pré-requisitos

Antes de começar, verifique que você tenha as seguintes dependências instaladas:

1. **Node.js** - Certifique-se de que o Node.js está instalado em sua máquina.
2. **npm** - O npm (Node Package Manager) vem instalado automaticamente com o Node.js.

### Instalar Dependências

No projeto **key-keeper-ui**, as dependências do OpenAPI Generator já estão configuradas no arquivo `package.json`. Para garantir que todas as dependências estejam instaladas, execute o seguinte comando na raiz do projeto:

```bash
npm install
```

---

### 2. Copiar o Arquivo OpenAPI do Backend (Key Keeper)

Copiar o Arquivo OpenAPI do Backend (Key Keeper)

1. No seu projeto **key-keeper** (Micronaut), o Swagger já está configurado para gerar o arquivo OpenAPI.
2. O arquivo YML gerado estará localizado no seguinte caminho: build/classes/java/main/META-INF/swagger/key-keeper-0.0.yml
3. **Copie todo o conteúdo desse arquivo YML.**


### 3. Adicionar o Arquivo ao Projeto Frontend (Key Keeper UI)
Adicionar o Arquivo ao Projeto Frontend (Key Keeper UI)

1. Navegue até o projeto **key-keeper-ui** (Angular).

2. Crie a pasta `src/libs/openapi-generator/configuration/` caso ainda não exista.

3. Dentro dessa pasta, crie um arquivo chamado `api.spec.yml` e cole o conteúdo do arquivo YML copiado do projeto **key-keeper**.

### 4. Gerar o Código com o OpenAPI Generator

O script que configura a geração do código OpenAPI já está configurado no projeto. Para gerar os **services** e **models** a partir do arquivo `api.spec.yml`, execute o comando a seguir na raiz do projeto **key-keeper-ui**:

```bash
npm run openapi-generator
```

Saída Esperada
Se a execução for bem-sucedida, você verá a seguinte saída no terminal:

```bash
key-keeper-ui@0.0.0 openapi-generator
ts-node src/libs/openapi-generator/configuration/openapi-generator-cli.mjs
Generating OpenAPI code...
OpenAPI code generation completed successfully.
```


---

### 5. Estrutura Gerada

Estrutura Gerada

Após a execução do script, você encontrará os arquivos gerados nas seguintes pastas:

- **Services**: Localizados dentro de `/api`. Cada arquivo corresponde a um serviço gerado a partir das definições do OpenAPI.
- **Models**: Localizados dentro de `/models`. Cada arquivo representa um modelo de dados gerado a partir das definições do OpenAPI.

### Importante

- **Não edite diretamente** esses arquivos gerados, pois eles serão sobrescritos toda vez que o comando `npm run openapi-generator` for executado.
- O arquivo `api.spec.yml` é a fonte de verdade. Caso ocorram alterações no backend, basta atualizar esse arquivo e rodar o script novamente.

### Considerações Finais

- Sempre que houver mudanças de **controller** no backend, atualize o arquivo `api.spec.yml` e execute o comando `npm run openapi-generator` para garantir que os arquivos gerados no frontend estejam atualizados.
- A geração automática facilita a integração entre o backend e o frontend, além de manter os arquivos sincronizados com a API definida.
