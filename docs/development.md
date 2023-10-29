## 💻 Development

1. Clone the repository

```bash
$ git clone https://github.com/wajeht/capdb.git
```

2. Go to the project directory

```bash
$ cd capdb
```

3. Install dependencies

```bash
$ npm install
```

4. Prepare `capdb` cli

```bash
$ npm run cli
```

5. Spin up the database

```bash
$ docker compose up -d
```

## 🗄️ Database URLs/Clients

If you want to connect to the database using a client, you can use the following URLs. All the credentials are inside the `docker-compose.yml` file.

- PostgreSQL: `postgresql://username:password@127.0.0.1:5432/database`
- MongoDB: `mongodb://username:password@127.0.0.1:27017/database`

If not, you can use the following clients:

- MongoDB: `$ open localhost:8081`
- PostgreSQL: `$ open localhost:8082`

## 👨‍🍳 Recepie

Once you have prepared the `capdb` cli, and have the database running, you can start developing the project.

Before you start doing antying with `capdb` you need to set a `capdb` default folder by running the following command:

```bash
$ capdb config -h # for help
```

```
Usage: capdb config [options]

Configuration needed for capdb functionality

Options:
  -d, --default        Initialize default configuration
  -u, --update         Update capdb configurations
  -p, --path <string>  capdb config folder path
  -a, --access_key     s3 access key
  -s, --secret_key     s3 secret key
  -b, --backet_name    s3 backet name
  -r, --region         s3 region
  -rm, --remove-all    remove all capdb configuration
  -h, --help
```

You can also use the `--default` flag to set the default configuration.

```bash
$ capdb config -d
```

```
┌─────────┬────┬──────────────────────────┬───────────────┬───────────────┬────────────────┬───────────┐
│ (index) │ id │ capdb_config_folder_path │ s3_access_key │ s3_secret_key │ s3_bucket_name │ s3_region │
├─────────┼────┼──────────────────────────┼───────────────┼───────────────┼────────────────┼───────────┤
│    0    │ 1  │    '/Users/jaw/capdb'    │     null      │     null      │      null      │   null    │
└─────────┴────┴──────────────────────────┴───────────────┴───────────────┴────────────────┴───────────┘
```

Or you can specify the path to the folder you want to use.

```bash
$ capdb config -p /path/to/capdb
```
