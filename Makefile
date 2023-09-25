.PHONY: up down clean wipe

up:
	docker-compose up -d

down:
	docker-compose down

clean:
	docker-compose down --rmi all  # Stop and remove containers and associated images

wipe:
	docker-compose down -v          # Stop and remove containers and associated volumes
	docker system prune -a --volumes # Clean up all Docker resources

# Additional convenience targets
restart:
	make down
	make up
