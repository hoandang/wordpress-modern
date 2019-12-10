include .env

composer:
	docker exec ${WEB_CONTAINER_NAME} composer ${CMD}

composer-install:
	docker exec ${WEB_CONTAINER_NAME} composer install

composer-update:
	docker exec ${WEB_CONTAINER_NAME} composer update

composer-require:
	docker exec ${WEB_CONTAINER_NAME} composer require ${PACKAGE}

up:
	docker-compose up --build -d

wp-cli:
	docker exec -it ${WEB_CONTAINER_NAME} vendor/bin/./wp --allow-root ${CMD}
