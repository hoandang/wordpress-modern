init:
	docker-compose up --build
	wget -r -np -k --no-check-certificate https://develop.svn.wordpress.org/trunk/tests/phpunit/includes/ && mv develop.svn.wordpress.org/trunk/tests/phpunit/includes ./ && rm -rf develop.svn.wordpress.org 

composer:
	docker run --rm --interactive --tty --volume $(PWD):/app composer ${COMMAND}

up:
	docker-compose up

phpunit:
	docker exec -it ${CONTAINER_ID} vendor/bin/phpunit ${FILE}
