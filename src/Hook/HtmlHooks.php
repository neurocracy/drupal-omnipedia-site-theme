<?php

declare(strict_types=1);

namespace Drupal\omnipedia_site_theme\Hook;

use Drupal\Core\DependencyInjection\AutowireTrait;
use Drupal\Core\DependencyInjection\ClassResolverInterface;
use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\Core\Hook\Attribute\Hook;
use Drupal\omnipedia_site_theme\Hook\MainPageHooks;
use Drupal\omnipedia_site_theme\Hook\MaintenancePageHooks;
use Drupal\omnipedia_site_theme\SiteBrandingCustomProperties;

/**
 * HTML document element hooks.
 */
class HtmlHooks implements ContainerInjectionInterface {

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
   * Alter 'html' template suggestions.
   *
   * This adds 'html__extended' as a template suggestion so that we can extend
   * html.html.twig without re-implementing the whole template.
   */
  #[Hook('theme_suggestions_html_alter')]
  public function themeSuggestionsHtmlAlter(
    array &$suggestions, array $variables
  ): void {

    $suggestions[] = 'html__extended';

  }

  /**
   * Prepares variables for HTML document templates.
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
  #[Hook('preprocess_html')]
  public function preprocessHtml(array &$variables): void {

    $this->classResolver->getInstanceFromDefinition(
      MainPageHooks::class,
    )->preprocessHtml($variables);

    $this->classResolver->getInstanceFromDefinition(
      MaintenancePageHooks::class,
    )->preprocessHtml($variables);

    $this->classResolver->getInstanceFromDefinition(
      SiteBrandingCustomProperties::class,
    )->preprocessHtml($variables);

  }

}
