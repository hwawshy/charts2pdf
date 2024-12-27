<?php

namespace TreknParcel\Service;

use HeadlessChromium\BrowserFactory;
use Pentatrion\ViteBundle\Service\EntrypointsLookupCollection;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Twig\Environment;

readonly class PdfGenerator
{
    private const string ENTRY = 'pdf';
    private const string DEV = 'dev';
    private const int TIMEOUT = 20 * 1000; // in milliseconds

    public function __construct(
        private Environment                 $templating,
        private EntrypointsLookupCollection $lookupCollection,
        private LoggerInterface             $logger,
        #[Autowire('%kernel.environment%')]
        private string                      $env,
    ) {
    }

    public function generate(string $resultHtml): string
    {
        $html = $this->templating->render('pdf/result.html.twig',
            [
                'resultHtml' => $resultHtml,
                'env' => $this->env,
                'cssFiles' => $this->getCSSFiles()
            ]
        );

        return $this->generatePdf($html);
    }

    private function generatePdf(string $html): string
    {
        $browserFactory = new BrowserFactory('chromium');
        $browser        = $browserFactory->createBrowser([
            'sendSyncDefaultTimeout' => self::TIMEOUT,
            'noSandbox' => true,
            'debugLogger' => $this->logger,
        ]);

        try {
            $page = $browser->createPage();
            $page->setScriptExecution($this->env === self::DEV);
            $page->setHtml($html, self::TIMEOUT);

            // wait for external fonts to be loaded
            $page->evaluate('document.fonts.ready')->waitForResponse();

            $pdf = $page->pdf([
                'printBackground'   => true,
                'preferCSSPageSize' => true,
                'marginTop'         => 0.0,
                'marginBottom'      => 0.0,
                'marginLeft'        => 0.0,
                'marginRight'       => 0.0,
            ]);

            return $pdf->getBase64();
        } finally {
            $browser->close();
        }
    }

    private function getCSSFiles(): array
    {
        if ($this->env === self::DEV) {
            // vite dev server handles this

            return [];
        }

        $lookup = $this->lookupCollection->getEntrypointsLookup();

        return array_map(fn (string $file): string => sprintf('http://local.chartspdf.com%s', $file), $lookup->getCSSFiles(self::ENTRY));
    }
}
