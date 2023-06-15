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

* [Drupal 10.0](https://www.drupal.org/download)

* PHP 8

* [Composer](https://getcomposer.org/)

## Drupal dependencies

Before attempting to install this, you must add the Composer repositories as
described in the installation instructions for these dependencies:

* The [`ambientimpact_base` theme](https://github.com/Ambient-Impact/drupal-ambientimpact-base).

* The [`ambientimpact_core`](https://github.com/Ambient-Impact/drupal-ambientimpact-core), [`ambientimpact_icon`](https://github.com/Ambient-Impact/drupal-ambientimpact-icon), and [`ambientimpact_ux`](https://github.com/Ambient-Impact/drupal-ambientimpact-ux) modules.

* The [`omnipedia_block`](https://github.com/neurocracy/drupal-omnipedia-block), [`omnipedia_content`](https://github.com/neurocracy/drupal-omnipedia-content), and [`omnipedia_media`](https://github.com/neurocracy/drupal-omnipedia-media) modules.

## Front-end dependencies

To build front-end assets for this project, [Node.js](https://nodejs.org/) and
[Yarn](https://yarnpkg.com/) are required.

----

# Installation

## Composer

### Set up

Ensure that you have your Drupal installation set up with the correct Composer
installer types such as those provided by [the `drupal/recommended-project`
template](https://www.drupal.org/docs/develop/using-composer/starting-a-site-using-drupal-composer-project-templates#s-drupalrecommended-project).
If you're starting from scratch, simply requiring that template and following
[the Drupal.org Composer
documentation](https://www.drupal.org/docs/develop/using-composer/starting-a-site-using-drupal-composer-project-templates)
should get you up and running.

### Repository

In your root `composer.json`, add the following to the `"repositories"` section:

```json
"drupal/omnipedia_site_theme": {
  "type": "vcs",
  "url": "https://github.com/neurocracy/drupal-omnipedia-site-theme.git"
}
```

### Installing

Once you've completed all of the above, run `composer require
"drupal/omnipedia_site_theme:6.x-dev@dev"` in the root of your project to have
Composer install this and its required dependencies for you.

## Front-end assets

To build front-end assets for this project, you'll need to install
[Node.js](https://nodejs.org/) and [Yarn](https://yarnpkg.com/).

This package makes use of [Yarn
Workspaces](https://yarnpkg.com/features/workspaces) and references other local
workspace dependencies. In the `package.json` in the root of your Drupal
project, you'll need to add the following:

```json
"workspaces": [
  "<web directory>/themes/custom/*"
],
```

where `<web directory>` is your public Drupal directory name, `web` by default.
Once those are defined, add the following to the `"dependencies"` section of
your top-level `package.json`:

```json
"drupal-omnipedia-site-theme": "workspace:^6"
```

Then run `yarn install` and let Yarn do the rest.

### Optional: install yarn.BUILD

While not required, [yarn.BUILD](https://yarn.build/) is recommended to make
building all of the front-end assets even easier.

### Optional: use `nvm`

If you want to be sure you're using the same Node.js version we're using, we
support using [Node Version Manager (`nvm`)](https://github.com/nvm-sh/nvm)
([Windows port](https://github.com/coreybutler/nvm-windows)). Once `nvm` is
installed, you can simply navigate to the project root and run `nvm install` to
install the appropriate version contained in the `.nvmrc` file.

Note that if you're using the [Windows
port](https://github.com/coreybutler/nvm-windows), it [does not support `.nvmrc`
files](https://github.com/coreybutler/nvm-windows/wiki/Common-Issues#why-isnt-nvmrc-supported-why-arent-some-nvm-for-macoslinux-features-supported),
so you'll have to provide the version contained in the `.nvmrc` as a parameter:
`nvm install <version>` (without the `<` and `>`).

This step is not required, and may be dropped in the future as Node.js is fairly
mature and stable at this point.

----

# Building front-end assets

This uses [Webpack](https://webpack.js.org/) and [Symfony Webpack
Encore](https://symfony.com/doc/current/frontend.html) to automate most of the
build process. These will have been installed for you if you followed the Yarn
installation instructions above.

If you have [yarn.BUILD](https://yarn.build/) installed, you can run:

```
yarn build
```

from the root of your Drupal site. If you want to build just this package, run:

```
yarn workspace drupal-omnipedia-site-theme run build
```

-----------------

# Planned improvements

* Port `src/MediaSubtitleTracks.php` to the [`ambientimpact_media` module](https://github.com/Ambient-Impact/drupal-modules).

* Refactor most of the stylesheets and JavaScript as [component plug-ins/libraries](https://github.com/Ambient-Impact/drupal-modules/blob/4.x/component_explainer.md).

-----------------

# Breaking changes

The following major version bumps indicate breaking changes:

* 3.x - Changed Composer installer type to `drupal-custom-theme`; moved theme contents into root directory; renamed theme from `omnipedia_site` to `omnipedia_site_theme` for clarity.

* 4.x - Front-end dependencies now installed via [Yarn](https://yarnpkg.com/), removing all use of [Asset Packagist](https://asset-packagist.org/); front-end build process ported to [Webpack](https://webpack.js.org/).

* 5.x - Requires Drupal 9.5 or [Drupal 10](https://www.drupal.org/project/drupal/releases/10.0.0).

* 6.x:

  * Requires [Drupal 10.0](https://www.drupal.org/project/drupal/releases/10.0.0).

  * Requires [`drupal/omnipedia_media` 6.x](https://github.com/neurocracy/drupal-omnipedia-media/tree/6.x), which requires [`drupal/ambientimpact_media` 2.x](https://github.com/Ambient-Impact/drupal-ambientimpact-media/tree/2.x), which in turn requires Drupal 10.0.

  * Increases minimum version of `symfony/css-selector` and `symfony/dom-crawler` to ^6.2 as that's what's supported by Drupal 10.
