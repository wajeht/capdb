.PHONY: up down clean wipe

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
