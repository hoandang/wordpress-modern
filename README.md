# PLEASE INSTALL DOCKER FOR LOCAL DEV
- `brew cask virtualbox`
- `brew install docker docker-machine docker-compose docker-swarm`
- `docker-machine start`
- `docker-machine ip` (retrieve IP for local dev)

## GETTING STARTED
- `make up` to spin up the server
- `make composer install` to install all dependencies
- `npm install` to install all build-tool dependencies
- `npm run build` to build all assets
- `npm run watch` to watch build
- `cp .env.sample .env`. Edit `.env`
- `npm run build -- --plugins` to build including plugins 
- `npm run build -- --images` to build including images 

## FRONT END STRUCTURE (PLEASE USE ES6 SYNTAX)
- all sass files in `src/themes/__/resources/styles`. 
- all scripts in `src/themes/__/resources/scripts`.
- for simple component, create a single js file and wrap the targeted DOM inside Vue. See `src/themes/__/resources/scripts/get-share-count.js` for quick ref.
- for complex component, create a folder with the name of the component (all files must be .vue). See `src/themes/__/resources/scripts/home/` for quick ref.

## BACKEND STRUCTURE
- `functions.php` is full. DOT NOT ADD ANYTHING INSIDE.
- treat page template as controller and put it in `Controllers/`.
- business logic in `Models/`.
- views in `Views/`.
- ajax calls in `ajax.php`.
- external script in `scripts.php` Try to use CDN. Including internal js files with care, only load them if the page needs them.
- create plugin if there is a need of using hook or filter.
- put helpers and utilized functions in `helpers.php`. The benefit of using global functions is that we can use those in twig view and closures easily.
