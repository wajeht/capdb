# 💾 capdb

`capdb` is a command-line interface for managing databases in Docker environments.

## Installation

```bash
$ npm install -g capdb
```

## Commands

### `capdb add [options]`

**Description**:
Add database credentials for container backup.

**Options**:

- `-c, --container <string>`: Container name.
- `-t, --type <string>`: Database type.
- `-n, --name <string>`: Database name.
- `-u, --username <string>`: Username.
- `-p, --password <string>`: Password.
- `-f, --frequency <number>`: Backup frequency.

**Example**:

```bash
$ capdb add -c my_container -t mysql -n my_db -u root -p secret -f 30
```

---

### `capdb remove [options]`

**Description**:
Remove database credentials.

**Options**:

- `-id, --id <string>`: Credential ID.
- `-a, --all`: Remove all credentials.

**Example**:

```bash
$ capdb remove -id 1234
```

---

### `capdb update [options]`

**Description**:
Update container information.

**Options**:

- `-id, --id <string>`: Credential ID.

**Example**:

```bash
$ capdb update -id 1234
```

---

### `capdb start`

**Description**:
Start scheduled backups.

**Example**:

```bash
$ capdb start
```

---

### `capdb restore [options]`

**Description**:
Restore database backup.

**Options**:

- `-idx, --index <number>`: Container index.

**Example**:

```bash
$ capdb restore -idx 2
```

---

### `capdb config [options]`

**Description**:
Configure capdb.

**Options**:

- Various S3 options.

**Example**:

```bash
$ capdb config -d
```

---

### `capdb status`

**Description**:
List scheduled databases.

**Example**:

```bash
$ capdb status
```

---

### `capdb list`

**Description**:
Alias to status.

**Example**:

```bash
$ capdb list
```

---

### `capdb log`

**Description**:
View backup logs.

**Example**:

```bash
$ capdb log
```

---

### `capdb stop`

**Description**:
Stop the backup scheduler.

**Example**:

```bash
$ capdb stop
```

---

### `capdb scan`

**Description**:
List all running containers.

**Example**:

```bash
$ capdb scan
```

---

To use any command, run `capdb [command] [options]` in the terminal.

# © License

Distributed under the MIT License © wajeht. See LICENSE for more information.
