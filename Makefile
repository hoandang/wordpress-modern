up:
	docker-compose up

test:
	docker exec ${CONTAINER_ID} vendor/bin/phpunit ${FILE}

composer:
	docker run --rm --interactive --tty --volume $(PWD):/app composer ${COMMAND}

