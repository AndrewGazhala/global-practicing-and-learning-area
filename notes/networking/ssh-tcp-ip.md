# SSH and the TCP/IP Model

Short reference on **SSH (Secure Shell)** — what it is, how it works, and where it sits in the network stack.

## What is SSH?

SSH is an **application-layer protocol** for secure remote access over an untrusted network. It replaces older tools like Telnet and rlogin, which sent credentials and data in plain text.

Typical uses:

- Remote shell (`ssh user@host`)
- File transfer (`scp`, `sftp`)
- Port forwarding / tunneling
- Git over SSH, CI/CD, server administration

Default port: **22** (TCP).

## TCP/IP model — where SSH lives

SSH runs at the **Application** layer. It does not replace TCP or IP; it uses them for delivery.

| Layer        | Role                          | SSH example                          |
| ------------ | ----------------------------- | ------------------------------------ |
| Application  | End-user services & protocols | **SSH** (session, auth, encryption)  |
| Transport    | Reliable end-to-end delivery  | **TCP** (port 22, connection-oriented) |
| Internet     | Host-to-host routing          | **IP** (IPv4 / IPv6)                 |
| Network access | Frames on the physical link | Ethernet, Wi‑Fi, etc.                |

### Stack diagram

VS Code’s built-in Markdown preview does not render Mermaid; this ASCII diagram works everywhere (VS Code, GitHub, plain text).

```
┌─────────────────────────────────────────────────────────┐
│  Application          SSH (port 22), HTTP, DNS, …       │
├─────────────────────────────────────────────────────────┤
│  Transport            TCP — reliable, connection-oriented│
├─────────────────────────────────────────────────────────┤
│  Internet             IP — routing between hosts         │
├─────────────────────────────────────────────────────────┤
│  Network access       Ethernet, Wi‑Fi, …                 │
└─────────────────────────────────────────────────────────┘

  SSH session
       │
       ▼
     TCP :22
       │
       ▼
      IP
       │
       ▼
   Link layer
```

### Data path (simplified)

Client → server flow (each layer wraps the layer above):

```
  Client                                              Server
  ──────                                              ──────

  ┌──────────────┐                              ┌──────────────┐
  │  SSH client  │  encrypted payload           │  SSH server  │
  │  (shell,     │ ───────────────────────────► │  (decrypt,   │
  │   sftp, …)   │                              │   execute)   │
  └──────┬───────┘                              └──────▲───────┘
         │                                             │
         ▼                                             │
  ┌──────────────┐                              ┌──────┴───────┐
  │     TCP      │  segments, port 22           │     TCP      │
  └──────┬───────┘ ───────────────────────────► └──────────────┘
         │
         ▼
  ┌──────────────┐
  │      IP      │  src/dst addresses, routing
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │    Link      │  frames on the wire (Ethernet, Wi‑Fi, …)
  └──────────────┘
```

Each layer adds its own header; the receiver strips headers bottom-up (Link → IP → TCP → SSH).

## How an SSH session works

1. **TCP handshake** — Client opens a TCP connection to the server (usually port 22).
2. **SSH version exchange** — Both sides agree on protocol version.
3. **Key exchange & algorithms** — Negotiate encryption, integrity (MAC), and compression.
4. **Server authentication** — Client verifies the server (host key / known_hosts).
5. **User authentication** — Password, public key, or other method.
6. **Encrypted channel** — Shell, SFTP, SCP, and port forwards run inside the secure tunnel.

## SSH vs OSI (quick map)

Two ways to describe the same stack: **TCP/IP** (4 layers, used in practice) and **OSI** (7 layers, used for teaching). SSH always runs over TCP/IP; OSI helps explain *what* SSH does internally.

### Side-by-side (top → bottom)

```
  OSI (7 layers)              TCP/IP (4 layers)        SSH example
  ──────────────              ─────────────────        ───────────

  7  Application    ──┐
  6  Presentation   ──┼──►  Application              SSH: auth, encryption,
  5  Session        ──┘                             shell, SFTP, port forward

  4  Transport      ────►  Transport                 TCP (port 22)

  3  Network        ────►  Internet                  IP (IPv4 / IPv6)

  2  Data link      ──┐
  1  Physical       ──┴──►  Network access           Ethernet, Wi‑Fi, …
```

### What each model layer does for SSH

| OSI layer | Name | TCP/IP layer | Role in an SSH connection |
| --------- | ---- | ------------ | ------------------------- |
| 7 | Application | Application | Remote commands, file transfer, tunnels |
| 6 | Presentation | ↑ same | Encryption, data format inside SSH |
| 5 | Session | ↑ same | Login, session setup, keep-alive |
| 4 | Transport | Transport | TCP delivers bytes reliably (port 22) |
| 3 | Network | Internet | IP routes packets client ↔ server |
| 2 | Data link | Network access | Frames on the local network |
| 1 | Physical | ↑ same | Actual cable / radio signal |

### Key takeaway

In OSI, encryption (6), session (5), and app logic (7) are separate layers. **SSH bundles all three into one application protocol** on top of TCP. You do not configure OSI layers separately — you run `ssh`, and SSH + TCP + IP handle the rest.

## Related protocols (same layer)

| Protocol | Port (typical) | Encrypted? | Notes                    |
| -------- | -------------- | ---------- | ------------------------ |
| SSH      | 22             | Yes        | Remote access, SFTP/SCP  |
| Telnet   | 23             | No         | Legacy; avoid in production |
| HTTPS    | 443            | Yes        | Web over TLS             |
| FTP      | 21             | No         | Plain file transfer      |

## One-line summary

**SSH is an encrypted application protocol that runs over TCP/IP** — TCP provides reliable transport, IP provides routing, and SSH adds authentication and confidentiality on top.
