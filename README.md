<img src="https://raw.githubusercontent.com/wajeht/capdb/main/.github/image.png" />

# 💾 capdb

[![Node.js CI](https://github.com/wajeht/capdb/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/wajeht/capdb/actions/workflows/ci.yml) ![npm](https://img.shields.io/npm/dw/%40wajeht%2Fcapdb)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/wajeht/type/blob/main/LICENSE) [![Open Source Love svg1](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/wajeht/capdb)

`capdb` is a CLI tool specialized for database management in Dockerized environments.

## 🤦‍♂️ Why Use capdb?

If you operate multiple Docker containers running databases on a VPS, `capdb` serves as a robust and efficient tool for managing scheduled backups and restores, all with a minimal memory footprint.

## 📦 Supported Databases

- mogodb v7.0.2
- postgresql v16.0

## 🛠️ Installation

```bash
npm install -g @wajeht/capdb
```

## 💻 Development

```bash
$ git clone https://github.com/wajeht/capdb.git
$ cd capdb
$ npm install
$ npm run cli
$ docker compose up -d
```

## 🗄️ Database URLs

Example URLs for client connections:

- PostgreSQL: `postgresql://username:password@127.0.0.1:5432/database`
- MongoDB: `mongodb://username:password@127.0.0.1:27017/database`

Web Clients

- MongoDB: `$ open localhost:8081`
- PostgreSQL: `$ open localhost:8082`

## ⚙️ Commands

Comprehensive documentation is available by running `capdb --help`. You can also find examples in [commands documentation](./docs/manual.md).

# © License

Distributed under the MIT License © wajeht. See [LICENSE](./LICENSE) for more information.
