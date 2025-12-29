# 🐍 HydraChain: The Ultimate ProxyChains Orchestrator

HydraChain é um orquestrador de proxies dinâmico de alta performance escrito em Rust.

---

## 📦 Releases (AppImage)

Para usuários que desejam portabilidade sem instalar dependências de compilação, oferecemos suporte ao formato **AppImage**.

### Como Gerar o AppImage Localmente:

1. Dê permissão ao script de packaging:
   ```bash
   chmod +x scripts/package-appimage.sh
   ```

2. Execute o builder:
   ```bash
   ./scripts/package-appimage.sh
   ```

3. O arquivo final estará na pasta `releases/`.

### Como Usar o AppImage:

```bash
chmod +x releases/HydraChain-v0.1.0-x86_64.AppImage
./releases/HydraChain-v0.1.0-x86_64.AppImage update --daemon
```

---

## 🛠️ Tecnologias Utilizadas
- **Rust 2021 Edition**
- **AppImageKit** (Distribuição Linux Universal)
- **Tokio** (Async Runtime)

---

## 🛡️ Aviso Legal
Esta ferramenta foi criada para fins educacionais. O uso indevido é de total responsabilidade do usuário. *Cut one proxy, three more replace it.*