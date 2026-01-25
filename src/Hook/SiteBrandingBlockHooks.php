<?php

declare(strict_types=1);

namespace Drupal\omnipedia_site_theme\Hook;

use Drupal\Core\DependencyInjection\AutowireTrait;
use Drupal\Core\DependencyInjection\ClassResolverInterface;
use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\Core\Extension\ModuleHandlerInterface;
use Drupal\Core\Hook\Attribute\Hook;
use Drupal\omnipedia_site_theme\Hook\SiteBrandingInliner;
use Drupal\omnipedia_site_theme\Hook\SiteBrandingMainPageLinks;

/**
 * Site branding block hooks.
 */
class SiteBrandingBlockHooks implements ContainerInjectionInterface {

  use AutowireTrait;

  /**
   * Constructor; saves dependencies.
   *
   * @param \Drupal\Core\DependencyInjection\ClassResolverInterface $classResolver
   *   The class resolver service.
   *
   * @param \Drupal\Core\Extension\ModuleHandlerInterface $moduleHandler
   *   The module handler.
   */
  public function __construct(
    protected readonly ClassResolverInterface $classResolver,
    protected readonly ModuleHandlerInterface $moduleHandler,
  ) {}

  /**
   * Prepares variables for the 'system_branding_block' block template.
   *
   * Drupal core currently only supports one implementation of an OOP
   * preprocess hook per extension (module, theme, profile) and will throw a
   * fatal error if we try to provide more than one. This method currently
   * exists to work around that.
   *
   * @see https://www.drupal.org/project/drupal/issues/3558998
   *   Drupal core issue regarding this problem and why it's not intuitive.
   *
   * @todo Remove this and uncomment the attributes on the called methods
   *   if/when that's fixed.
   *
   * Attaches the 'omnipedia_site_theme/site_branding' library.
   *
   * @see \Drupal\omnipedia_site_theme\Hook\SiteBrandingInliner
   *   Attempts to inline the branding SVG elements so that their parts can be
   *   animated.
   *
   * @see \Drupal\omnipedia_site_theme\Hook\SiteBrandingMainPageLinks
   *   Alters the branding main page links.
   */
  #[Hook('preprocess_block__system_branding_block')]
  public function preprocess(array &$variables): void {

    $variables['#attached']['library'][] = 'omnipedia_site_theme/site_branding';

    $this->classResolver->getInstanceFromDefinition(
      SiteBrandingInliner::class,
    )->preprocess($variables);

    if ($this->moduleHandler->moduleExists('omnipedia_main_page') === true) {

      $this->classResolver->getInstanceFromDefinition(
        SiteBrandingMainPageLinks::class,
      )->preprocess($variables);

    }

  }

}
