# 🐍 HydraChain: The Ultimate ProxyChains Orchestrator

HydraChain é um orquestrador de proxies dinâmico de alta performance escrito em Rust. Ele gerencia listas de proxies (HTTP, SOCKS4, SOCKS5), valida-os em tempo real e atualiza automaticamente o `proxychains.conf`.

---

## 🚀 Guia de Instalação (Installation Guide)

Siga os passos abaixo para preparar seu ambiente. 

> **Nota sobre o Git:** O erro "Authentication failed" ocorre porque a URL `github.com/project-hydra/hydrachain.git` é um placeholder. Se você está criando o projeto agora, siga o fluxo de **Inicialização Local** abaixo.

### 1. Dependências do Sistema

#### **Debian / Ubuntu / Kali Linux**
```bash
sudo apt update
sudo apt install -y build-essential pkg-config libssl-dev git curl
```

#### **Fedora / Bazzite / RHEL**
```bash
sudo dnf groupinstall "Development Tools"
sudo dnf install -y pkg-config openssl-devel git curl
```

---

### 2. Instalando o Rust

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

---

### 3. Inicializando o Projeto Localmente

Como este é um novo projeto desenvolvido por você, em vez de clonar um repositório inexistente, crie a estrutura manualmente:

```bash
# 1. Crie a pasta do projeto
mkdir hydrachain && cd hydrachain

# 2. Inicie um novo repositório Git local
git init

# 3. Crie um novo projeto Rust
cargo init

# 4. (Opcional) Adicione seu repositório remoto real depois de criá-lo no GitHub
# git remote add origin https://github.com/SEU_USUARIO/hydrachain.git
```

---

### 4. Configuração e Compilação

Adicione as dependências ao seu `Cargo.toml`:

```toml
[dependencies]
tokio = { version = "1", features = ["full"] }
reqwest = { version = "0.11", features = ["socks"] }
serde = { version = "1.0", features = ["derive"] }
serde_yaml = "0.9"
clap = { version = "4.0", features = ["derive"] }
tracing = "0.1"
anyhow = "1.0"
```

Compile o binário:

```bash
cargo build --release
```

O binário final estará em `target/release/hydrachain`.

---

### 5. Por que o erro de autenticação ocorreu?

O Git solicita usuário e senha (ou Token) quando:
1. O repositório é **privado**.
2. O repositório **não existe** (o GitHub assume que pode ser um repo privado que você não tem acesso).
3. **Senhas não são mais aceitas**: O GitHub exige **Personal Access Tokens (PAT)** em vez de senhas comuns para operações via HTTPS.

**Solução:** Sempre use `git init` para projetos novos locais ou use um PAT se for clonar um repositório privado seu.

---

## 🛡️ Aviso Legal
Esta ferramenta foi criada para fins educacionais. O uso indevido é de total responsabilidade do usuário. *Cut one proxy, three more replace it.*