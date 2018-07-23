# Prerequisites
- Docker 17+
- Node 8+

# Modern wordpress structure
This will make wordpress development less suck. Clone the repo, edit .env and make up, that's all you need to do. 

## TODO
- Make a realworld example based on this structure

### SETUP (for mac only)
- `cp .env.sample .env`. Edit `.env`
- `make up` to spin up the server
- `make composer-install` to install all dependencies
- `make composer-update` to update all dependencies
- `make composer-require PACKAGE=<package_name>` to install a specific package
- `npm install` to install all build-tool dependencies
- `npm run build` to build all assets
- `npm run watch` to watch build
- Enable plugins
- Activate __ theme

### FRONT END STRUCTURE (PLEASE USE ES6 SYNTAX)
- all sass files in `src/themes/__/resources/styles`. 
- all scripts in `src/themes/__/resources/scripts`.

### BACKEND STRUCTURE
- `functions.php` is full. DOT NOT ADD ANYTHING INSIDE.
- Treat page template as controller and put it in `Controllers/`.
- Business logic in `Models/`.
- Views in `Views/`.
- Ajax calls in `ajax.php`.
- External scripts in `scripts.php`.
- Create plugin if there is a need of using hook or filter.
- Put helpers and utilized functions in `helpers.php`. The benefit of using global functions is that we can use those in twig view and closures easily.
