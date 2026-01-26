<?php

declare(strict_types=1);

namespace Drupal\omnipedia_site_theme\Hook;

use Drupal\Core\DependencyInjection\AutowireTrait;
use Drupal\Core\DependencyInjection\ClassResolverInterface;
use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\Core\Hook\Attribute\Hook;
use Drupal\omnipedia_site_theme\Hook\OmnipediaRegionPlaceholderHooks;
use Drupal\omnipedia_site_theme\Hook\WikiSearchHooks;

/**
 * Page hooks.
 */
class PageHooks implements ContainerInjectionInterface {

  use AutowireTrait;

  /**
   * Constructor; saves dependencies.
   *
   * @param \Drupal\Core\DependencyInjection\ClassResolverInterface $classResolver
   *   The class resolver service.
   */
  public function __construct(
    protected readonly ClassResolverInterface $classResolver,
  ) {}

  /**
   * Prepares variables for the page template.
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
   */
  #[Hook('preprocess_page')]
  public function preprocessPage(array &$variables): void {

    $this->classResolver->getInstanceFromDefinition(
      OmnipediaRegionPlaceholderHooks::class,
    )->preprocessPage($variables);

    $this->classResolver->getInstanceFromDefinition(
      WikiSearchHooks::class,
    )->preprocessPage($variables);

  }

}
