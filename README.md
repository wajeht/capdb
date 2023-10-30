<img src="https://raw.githubusercontent.com/wajeht/capdb/main/.github/image.png" />

# 💾 capdb

[![Node.js CI](https://github.com/wajeht/capdb/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/wajeht/capdb/actions/workflows/ci.yml) ![npm](https://img.shields.io/npm/dw/%40wajeht%2Fcapdb)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/wajeht/type/blob/main/LICENSE) [![Open Source Love svg1](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/wajeht/capdb) [![npm](https://img.shields.io/npm/v/%40wajeht%2Fcapdb)](https://www.npmjs.com/package/@wajeht/capdb)

`capdb` is a CLI tool specialized for database management in Dockerized environments.

## 🤦‍♂️ Why Use capdb?

If you operate multiple Docker containers running databases on a VPS, `capdb` serves as a robust and efficient tool for managing scheduled backups and restores, all with a minimal memory footprint.

## 📦 Supported Databases

- mogodb v7.0.2
- postgresql v16.0

## 🛠️ Installation
> [!WARNING]
> Before installing **capdb**, please ensure that you have Node.js version 20 or higher installed on your system.

```bash
$ npm install -g @wajeht/capdb
```

## 📖 Documentation

- **Commands**: Comprehensive documentation is available by running `capdb --help`. You can also find examples in [commands documentation](./docs/manual.md).

- **Development**: If you want to contribute to this project, please read [development documentation](./docs/development.md).

# © License

Distributed under the MIT License © wajeht. See [LICENSE](./LICENSE) for more information.
