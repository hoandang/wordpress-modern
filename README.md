## GETTING STARTED
- download vagrant from https://www.vagrantup.com/downloads.html
- Run `vagrant up`
- access vagrant machine by issuing `vagrant ssh`
- run these commands when you are in ssh 
```
source ~/.bashrc
nvm install 6.10
npm install -g yarn
yarn global add gulp
```
- cd to `/var/www/html`
- run `gulp` to build all assets
- `cp .env.sample .env`. Edit `.env`
- open site with the IP in Vagrantfile

## FRONT END STRUCTURE
- All js files should be written in ES6
- all sass files in `src/themes/s1t2/resources/styles`. 
- all scripts in `src/themes/s1t2/resources/scripts`.
- for simple component, create a single js file and wrap the target DOM inside Vue. See `src/themes/s1t2/resources/scripts/home.js` for quick ref.
- for complex component, create a folder with the name of the component. See `src/themes/s1t2/resources/scripts/home/` for quick ref.
- add external scripts in `scripts.php` Try to use CDN as much as possible. Include internal js files with care, only load them if the page needs them.

## BACKEND STRUCTURE
- `functions.php` is full. DOT NOT ADD ANYTHING INSIDE.
- treat page template as controller. Put it in `Controllers/`.
- business logic in `Models/`.
- views in `Views/`.
- ajax calls in `ajax.php`.
- helper and utility functions in `helpers.php`.
- create plugin if there is a need of using hook or filter.
