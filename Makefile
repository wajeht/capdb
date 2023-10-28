.PHONY: up down clean wipe restart mongo psql

up:
	docker-compose up -d

down:
	docker-compose down

clean:
	docker-compose down --rmi all

wipe:
	docker-compose down -v
	docker system prune -a --volumes

restart:
	make down
	make up

mongo:
	open http://localhost:8081

psql:
	open http://localhost:8082
