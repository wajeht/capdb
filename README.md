# 💾 capdb

database management cli for caprover

# 📝 Todo

- [x] back up to disk
- [x] log to file
- [ ] email alert
- [x] cli ?
- [ ] publish it to npm
- [x] support for mysql # sorry, we dont' support msyql, this is not democracy, it's dictatorship
- [ ] back up to s3
- [ ] restore cmd
- [x] script to setup node and typescript
- [x] config via env

# 💻 Commands

```bash
# bare metal
$ pg_dump -U your_postgres_user -d your_database_name -f dump.sql
$ psql -U your_postgres_user -d your_database_name -f dump.sql
$ mysqldump -u your_mysql_user -p your_database_name > dump.sql
$ mysql -u your_mysql_user -p your_database_name < dump.sql
$ mongodump --db your_database_name --out /path/to/dump_directory
$ mongorestore --db your_database_name /path/to/dump_directory/your_database_name

# docker
$ docker exec -i your_postgres_container_name pg_dump -U your_postgres_user -d your_database_name > dump.sql
$ docker exec -i your_postgres_container_name psql -U your_postgres_user -d your_database_name < dump.sql
$ docker exec -i your_mysql_container_name mysqldump -u your_mysql_user -p your_database_name > dump.sql
$ docker exec -i your_mysql_container_name mysqldump -u your_mysql_user -p your_database_name > dump.sql
$ docker exec -i your_mysql_container_name mysql -u your_mysql_user -p your_database_name < dump.sql
$ docker exec -i your_mongo_container_name mongodump --db your_mongodb_database_name --out /dump
$ docker exec -i your_mongo_container_name mongorestore --db your_mongodb_database_name /dump/your_mongodb_database_name
$ docker exec -i your_redis_container_name redis-cli SAVE
$ docker cp your_redis_container_name:/data/dump.rdb redis_dump.rdb
$ docker cp redis_dump.rdb your_redis_container_name:/data/dump.rdb
$ docker exec -i your_redis_container_name redis-cli BGREWRITEAOF
```

# © License

Distributed under the MIT License © wajeht. See LICENSE for more information.
