include .env

composer-install:
	docker exec ${WEB_CONTAINER_NAME} composer install

composer-update:
	docker exec ${WEB_CONTAINER_NAME} composer update

composer-require:
	docker exec ${WEB_CONTAINER_NAME} require ${PACKAGE}

up:
	docker-compose up --build -d
