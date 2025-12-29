# 🐍 HydraChain: The Ultimate ProxyChains Orchestrator

HydraChain is a high-performance, dynamic proxy orchestrator written in Rust. It manages free proxy lists (HTTP, SOCKS4, SOCKS5), validates them in real-time, and automatically updates your `proxychains.conf` to ensure maximum uptime and anonymity.

---

## 🚀 Guia de Instalação (Installation Guide)

Siga os passos abaixo para preparar seu ambiente e compilar o HydraChain do zero. **Não é necessário login ou autenticação para clonar o repositório público.**

### 1. Dependências do Sistema (System Dependencies)

O HydraChain requer o compilador Rust e bibliotecas de desenvolvimento de rede.

#### **Debian / Ubuntu / Kali Linux**
```bash
# Atualize os repositórios
sudo apt update

# Instale as ferramentas de compilação e dependências de rede
sudo apt install -y build-essential pkg-config libssl-dev git curl
```

#### **Fedora / RHEL / CentOS**
```bash
# Instale o grupo de ferramentas de desenvolvimento e dependências
sudo dnf groupinstall "Development Tools"
sudo dnf install -y pkg-config openssl-devel git curl
```

---

### 2. Instalando o Rust (Installing Rust Toolchain)

Independentemente da sua distro, recomendamos o uso do `rustup` para gerenciar a versão do Rust.

```bash
# Baixe e instale o Rustup (Instalação anônima e segura)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Configure o ambiente no shell atual
source $HOME/.cargo/env

# Verifique a instalação
rustc --version
```

---

### 3. Clonando o Projeto (Public Git Clone)

Obtenha o código fonte do HydraChain diretamente via HTTPS (sem necessidade de chaves SSH ou tokens).

```bash
# Clone o repositório público
git clone https://github.com/project-hydra/hydrachain.git

# Entre no diretório
cd hydrachain
```

---

### 4. Compilação e Produto Final (Build & Deployment)

Compile o binário otimizado para produção.

```bash
# Compilar em modo Release (máxima performance)
cargo build --release

# O binário final será gerado em: target/release/hydrachain
```

#### **Configuração Inicial**
Antes de rodar, prepare o arquivo de configuração e certifique-se de que o ProxyChains está instalado.

```bash
# Crie o diretório de configuração local
mkdir -p ~/.config/hydrachain

# Copie o exemplo de configuração
cp config.example.yml ~/.config/hydrachain/config.yml

# (Opcional) Mova o binário para o seu PATH para acesso global
sudo cp target/release/hydrachain /usr/local/bin/
```

---

### 5. Execução (Usage)

Inicie a Hydra e deixe-a orquestrar seus proxies:

```bash
# Rodar o assistente de diagnóstico inicial
hydrachain doctor

# Iniciar o daemon de atualização dinâmica
hydrachain update --daemon
```

---

## 🛠️ Tecnologias Utilizadas
- **Rust 2021 Edition**
- **Tokio** (Runtime assíncrono para alta concorrência)
- **Reqwest** (Validação de proxies com suporte a SOCKS)
- **Serde** (Gerenciamento de configurações YAML)

---

## 🛡️ Aviso Legal
Esta ferramenta foi criada para fins educacionais e de pesquisa em segurança. O uso indevido para atividades ilegais é de total responsabilidade do usuário. *Cut one proxy, three more replace it.*