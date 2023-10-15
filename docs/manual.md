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

### `capdb export`

**Description**:
Export all the capdb config as json to desktop.

**Example**:

```bash
$ capdb export
```

---

## `capdb import [options]`

**Description**:
Import all the capdb config from a json file.

**Options**:

- `-f, --file <string>` File path to import from.

**Example**:

```bash
$ capdb import -f /path/to/file.json
```

```json
{
	"containers": [
		{
			"id": 1,
			"container_name": "postgres",
			"database_type": "postgres",
			"database_name": "database",
			"database_username": "username",
			"database_password": "password",
			"status": 0,
			"back_up_to_s3": 0,
			"back_up_frequency": 1,
			"last_backed_up_at": null,
			"last_backed_up_file": null
		}
	],
	"config": [
		{
			"id": 1,
			"capdb_config_folder_path": "/Users/wajeht/capdb",
			"s3_access_key": null,
			"s3_secret_key": null,
			"s3_bucket_name": null,
			"s3_region": null
		}
	]
}
```

To use any command, run `capdb [command] [options]` in the terminal.
