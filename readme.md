This contains the source files for the [Omnipedia](https://omnipedia.app/)
Drupal theme.

⚠️⚠️⚠️ ***Here be potential spoilers. Proceed at your own risk.*** ⚠️⚠️⚠️

----

# Why open source?

We're dismayed by how much knowledge and technology is kept under lock and key
in the videogame industry, with years of work often never seeing the light of
day when projects are cancelled. We've gotten to where we are by building upon
the work of countless others, and we want to keep that going. We hope that some
part of this codebase is useful or will inspire someone out there.

----

# Requirements

* [Drupal 9](https://www.drupal.org/download) ([Drupal 8 is end-of-life](https://www.drupal.org/psa-2021-11-30))

* PHP 8

* [Composer](https://getcomposer.org/)

## Drupal dependencies

* The [```ambientimpact_base```](https://github.com/Ambient-Impact/drupal-themes) theme must be present in your Drupal installation.

* Several [```ambientimpact_*``` modules](https://github.com/Ambient-Impact/drupal-modules) must be present.

* Several of the [```omnipedia_*``` modules](https://github.com/neurocracy) are required.

# Installation

## Composer

Ensure that you have your Drupal installation set up with the correct Composer
installer types such as those provided by [the ```drupal\recommended-project```
template](https://www.drupal.org/docs/develop/using-composer/starting-a-site-using-drupal-composer-project-templates#s-drupalrecommended-project).
If you're starting from scratch, simply requiring that template and following
[the Drupal.org Composer
documentation](https://www.drupal.org/docs/develop/using-composer/starting-a-site-using-drupal-composer-project-templates)
should get you up and running.

You'll also need to have the repository and installer types set up in your root
```composer.json``` for [Asset Packagist](https://asset-packagist.org/) as
detailed by the [Drupal.org Composer
documentation](https://www.drupal.org/docs/develop/using-composer/using-composer-to-install-drupal-and-manage-dependencies#third-party-libraries).

Then, in your root ```composer.json```, add the following to the
```"repositories"``` section:

```
{
  "type": "vcs",
  "url": "https://github.com/neurocracy/drupal-omnipedia-site-theme.git"
}
```

Then, in your project's root, run ```composer require
"drupal/omnipedia_site_theme:3.x-dev@dev"``` to have Composer install the theme
and its required dependencies for you.

## Building assets

To build assets for this project, you'll need to have
[Node.js](https://nodejs.org/) installed.

### Using ```nvm```

We recommend using [Node Version Manager
(```nvm```)](https://github.com/nvm-sh/nvm) ([Windows
port](https://github.com/coreybutler/nvm-windows)) to ensure you're using the
same version used to develop this codebase. Once ```nvm``` is installed, you can
simply navigate to the project root and run ```nvm install``` to install the
appropriate version contained in the ```.nvmrc``` file.

Note that if you're using the [Windows
port](https://github.com/coreybutler/nvm-windows), it [does not support
```.nvmrc```
files](https://github.com/coreybutler/nvm-windows/wiki/Common-Issues#why-isnt-nvmrc-supported-why-arent-some-nvm-for-macoslinux-features-supported),
so you'll have to provide the version contained in the ```.nvmrc``` as a
parameter: ```nvm install <version>``` (without the ```<``` and ```>```).

### Dependencies

Once Node.js is installed, run ```npm install``` in the project root to install
all dependencies.

### Grunt CLI

We also recommend installing the [Grunt
CLI](https://gruntjs.com/getting-started) globally from the commandline:
```npm install -g grunt-cli```

Note that if you use ```nvm```, this must be done for each Node.js version that
you plan to use it for.

# Building

To build everything, you can run ```grunt all``` in the commandline in the
project root.

To build specific things:

* ```grunt css``` - compiles CSS files from Sass; applies [Autoprefixer](https://github.com/postcss/autoprefixer).

* ```grunt favicons``` - builds all the shortcut/browser icons for the theme, using [japrescott/grunt-favicons](https://github.com/japrescott/grunt-favicons); requires [ImageMagick](https://imagemagick.org/) to be installed.

-----------------

# Planned improvements

* Port ```src/MediaSubtitleTracks.php``` to the [```ambientimpact_media``` module](https://github.com/Ambient-Impact/drupal-modules).

* Refactor most of the stylesheets and JavaScript as [component plug-ins/libraries](https://github.com/Ambient-Impact/drupal-modules/blob/4.x/component_explainer.md).

-----------------

# Breaking changes

The following major version bumps indicate breaking changes:

* 3.x - Changed Composer installer type to `drupal-custom-theme`; moved theme contents into root directory; renamed theme from `omnipedia_site` to `omnipedia_site_theme` for clarity.
