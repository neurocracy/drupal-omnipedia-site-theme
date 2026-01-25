<?php

declare(strict_types=1);

namespace Drupal\omnipedia_site_theme\Hook;

use Drupal\Core\DependencyInjection\AutowireTrait;
use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\Core\Hook\Attribute\Hook;
use Symfony\Component\DependencyInjection\ContainerInterface;


/**
 * Main page hooks.
 */
class MainPageHooks implements ContainerInjectionInterface {

  use AutowireTrait;

  /**
   * Constructor; saves dependencies.
   *
   * @param \Symfony\Component\DependencyInjection\ContainerInterface $container
   *   The service container.
   */
  public function __construct(
    protected readonly ContainerInterface $container,
  ) {}

  /**
   * Prepares variables for HTML document templates.
   *
   * This adds the 'omnipedia_is_main_page' variable.
   *
   * @see \Drupal\omnipedia_main_page\Service\MainPageRouteInterface::isCurrent()
   */
  // #[Hook('preprocess_html')]
  public function preprocessHtml(array &$variables): void {

    if ($this->container->has('omnipedia_main_page.route') === true) {

      /** @var bool */
      $variables['omnipedia_is_main_page'] = $this->container->get(
        'omnipedia_main_page.route',
      )->isCurrent();

    }

  }

}
