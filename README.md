# Modern wordpress structure
This will make wordpress development less suck. The theme is loaded with vue

## TODO
- Add nightwatch for e2e testing
- Make a realworld example based on this structure

### SETUP (for mac only)
- `cp .env.sample .env`. Edit `.env`
- `make up` to spin up the server
- `make composer-install` to install all dependencies
- `npm install` to install all build-tool dependencies
- `npm run build` to build all assets
- `npm run serve` to watch build
- `npm run build -- --plugins` to build including plugins 
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
- External scripts in `scripts.php`. Try to use CDN. Including internal js files with care, only load them if the page needs them.
- Create plugin if there is a need of using hook or filter.
- Put helpers and utilized functions in `helpers.php`. The benefit of using global functions is that we can use those in twig view and closures easily.
