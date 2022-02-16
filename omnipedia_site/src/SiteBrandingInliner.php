<?php

namespace Drupal\omnipedia_site;

use Drupal\ambientimpact_core\Utility\Html;
use Drupal\Component\Utility\UrlHelper;
use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\Core\DrupalKernelInterface;
use Drupal\Core\File\FileSystemInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\DomCrawler\Crawler;

/**
 * Omnipedia site branding SVG inliner.
 */
class SiteBrandingInliner implements ContainerInjectionInterface {

  /**
   * The HTML class of the logo <svg> element.
   */
  protected const LOGO_SVG_CLASS = 'site-logo__svg';

  /**
   * The Drupal file system service.
   *
   * @var \Drupal\Core\File\FileSystemInterface
   */
  protected FileSystemInterface $fileSystem;

  /**
   * The Drupal kernel.
   *
   * @var \Drupal\Core\DrupalKernelInterface
   */
  protected DrupalKernelInterface $kernel;

  /**
   * Constructor; saves dependencies.
   *
   * @param \Drupal\Core\File\FileSystemInterface $fileSystem
   *   The Drupal file system service.
   *
   * @param \Drupal\Core\DrupalKernelInterface $kernel
   *   The Drupal kernel.
   */
  public function __construct(
    FileSystemInterface   $fileSystem,
    DrupalKernelInterface $kernel
  ) {

    $this->fileSystem = $fileSystem;
    $this->kernel     = $kernel;

  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('file_system'),
      $container->get('kernel')
    );
  }

  /**
   * Attempt to load the file contents of the referenced SVG file.
   *
   * @param array $element
   *   A render array containing a '#uri' property to resolve to a filesystem
   *   path.
   *
   * @return string|false
   *   Either the string contents of the referenced SVG file or false if it
   *   could not be loaded.
   */
  protected function getFileContents(array $element): string|bool {

    /** @var array The element URL path, query, and fragment components. */
    $parsedUrl = UrlHelper::parse($element['#uri']);

    if (empty($parsedUrl['path'])) {
      return false;
    }

    /** @var string|false */
    $absoluteFilePath = $this->fileSystem->realpath(
      $this->kernel->getAppRoot() . $parsedUrl['path']
    );

    // Bail if the absolute path couldn't be resolved.
    if (!\is_string($absoluteFilePath)) {
      return false;
    }

    /** @var string|false */
    $fileContents = \file_get_contents($absoluteFilePath);

    // Bail if the file contents couldn't be loaded or it doesn't seem to
    // contain an <svg> element.
    if (
      !\is_string($fileContents) ||
      \strpos($fileContents, '<svg ') === false
    ) {
      return false;
    }

    return $fileContents;

  }

  /**
   * Convert the provided '#type' => 'image' to '#type' => 'inline_template'
   *
   * @param array $element
   *   The element render array to convert.
   *
   * @return array|false
   *   Either the converted render array or false if it could not be converted.
   */
  protected function convertElement(array $element): array|bool {

    // Bail if the element is hidden.
    if ($element['#access'] !== true) {
      return false;
    }

    /** @var string|bool */
    $fileContents = $this->getFileContents($element);

    // Bail if we couldn't load the file contents.
    if (!\is_string($fileContents)) {
      return false;
    }

    /** @var array */
    $renderArray = [
      // Don't use '#markup' as that'll strip out the <svg>, but an inline Twig
      // template seems to allow it.
      //
      // @see https://drupal.stackexchange.com/a/194722
      '#type'     => 'inline_template',
      '#template' => $fileContents,
      '#access'   => true,
    ];

    return $renderArray;

  }

  /**
   * Clean up the inline logo contents.
   *
   * The logo exported from Adobe Illustrator has the following changes made by
   * this method in the following order:
   *
   * - The <svg> is given a BEM element class.
   *
   * - The <svg> 'width' and 'height' attributes are replaced with those from
   *   the <img> render array.
   *
   * - The <svg> is given an 'aria-label' attribute with the contents of the
   *   'alt' attribute the <img> would have had.
   *
   * - All direct children of the <svg> that aren't the expanded globe group are
   *   removed.
   *
   * - The expanded globe group is unwrapped.
   *
   * - All groups (<g>) that have an 'id' attribute starting with 'row' have
   *   that transliterated into a BEM class and the 'id' removed.
   *
   * - All <path> elements that have an 'id' attribute starting with 'row' have
   *   the row and column number transliterated to a BEM class attribute and the
   *   'id' removed.
   *
   * @param array &$newElement
   *   Render array of '#type' => 'inline_template' with the contents of the
   *   logo SVG file.
   *
   * @param array $oldElement
   *   Render array of the old '#type' => 'image' to pull attribute values from.
   *
   * @todo Cache this so that it doesn't need to be done again unless caches are
   *   cleared or the file is updated - the latter can probably be done by
   *   storing the last modified date of the file and invalidating the tag if
   *   it changes.
   */
  protected function cleanUpLogo(array &$newElement, array $oldElement): void {

    /** @var \Symfony\Component\DomCrawler\Crawler */
    $crawler = new Crawler();

    // Add the SVG contents explicitly as HTML so that it strips out the <?xml
    // and so on.
    $crawler->addHtmlContent($newElement['#template']);

    /** @var \Symfony\Component\DomCrawler\Crawler */
    $svgCrawler = $crawler->filter('svg');

    /** @var \DOMElement */
    $svgElement = $svgCrawler->getNode(0);

    Html::setElementClassAttribute(
      $svgElement,
      Html::getElementClassAttribute($svgElement)
        ->addClass(self::LOGO_SVG_CLASS)
    );

    // Transfer the <img> width and height to the <svg> element.
    foreach (['width', 'height'] as $key) {
      $svgElement->setAttribute($key, $oldElement['#' . $key] . 'px');
    }

    $svgElement->setAttribute('aria-label', $oldElement['#alt']);

    $globeGroup = $crawler->filter('#globe_x5F_expanded')->getNode(0);

    $svgElement->appendChild($globeGroup);

    // Detach all children of the <svg> that aren't the expanded globe group.
    foreach ($svgCrawler->children('*:not(#globe_x5F_expanded)') as $node) {
      $svgElement->removeChild($node);
    }

    // Unwrap the expanded globe group.
    Html::unwrapNode($globeGroup);

    // Replace all group element IDs
    foreach ($svgCrawler->filter('g[id^="row"]') as $node) {

      Html::setElementClassAttribute(
        $node,
        Html::getElementClassAttribute($node)->addClass(
          \preg_replace(
            '/row(\d)/', self::LOGO_SVG_CLASS . '-row${1}',
            $node->getAttribute('id'))
        )
      );

      $node->removeAttribute('id');

    }

    foreach ($svgCrawler->filter('path[id^="row"]') as $node) {

      Html::setElementClassAttribute(
        $node,
        Html::getElementClassAttribute($node)->addClass(
          \preg_replace(
            '/row(\d)_x5F__x5F_column(\d)/',
            self::LOGO_SVG_CLASS . '-row${1}-column${2}',
            $node->getAttribute('id'))
        )
      );

      $node->removeAttribute('id');

    }

    $newElement['#template'] = $svgCrawler->outerHtml();

  }

  /**
   * Alter the site logo.
   *
   * This attempts to inline the site logo SVG file.
   *
   * @param array &$variables
   *   Variables from the 'system_branding_block' block template.
   */
  public function alterLogo(array &$variables): void {

    // Bail if the element is hidden.
    if ($variables['content']['site_logo']['#access'] !== true) {
      return;
    }

    $renderArray = $this->convertElement($variables['content']['site_logo']);

    // Bail if the file was not converted to an inline template.
    if (!\is_array($renderArray)) {
      return;
    }

    // Try to clean up the logo contents, and bail while catching any error
    // thrown by the Symfony DomCrawler if one is thrown.
    try {
      $this->cleanUpLogo(
        $renderArray, $variables['content']['site_logo']
      );

    } catch (\Exception $exception) {
      return;
    }

    $variables['content']['site_logo'] = $renderArray;

    // Add a class to the logo link so that we can target styles when the inline
    // SVG is present.
    $variables['site_logo_link_attributes']->addClass(
      'site-logo__link--has-inline-svg'
    );

  }

  /**
   * Alter site branding elements.
   *
   * @param array &$variables
   *   Variables from the 'system_branding_block' block template.
   */
  public function alter(array &$variables): void {
    $this->alterLogo($variables);
  }

}
