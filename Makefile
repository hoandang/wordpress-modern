composer-install:
	docker exec ${CONTAINER_ID} composer install

composer-update:
	docker exec ${CONTAINER_ID} composer update

test:
	docker exec ${CONTAINER_ID} vendor/bin/phpunit ${FILE}

up:
	docker-compose up --build -d
