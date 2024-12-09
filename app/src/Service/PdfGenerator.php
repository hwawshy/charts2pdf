<?php

namespace TreknParcel\Service;

use HeadlessChromium\BrowserFactory;
use Twig\Environment;

readonly class PdfGenerator
{
    public function __construct(
        private Environment $templating,
    ) {
    }

    private const int TIMEOUT = 20 * 1000; // in milliseconds

    public function generate(string $resultHtml): string
    {
        $html = $this->templating->render('pdf/result.html.twig', ['resultHtml' => $resultHtml]);

        return $this->generatePdf($html);
    }

    private function generatePdf(string $html): string
    {
        $browserFactory = new BrowserFactory('chromium');
        $browser        = $browserFactory->createBrowser([
            'sendSyncDefaultTimeout' => self::TIMEOUT,
            'noSandbox' => true
        ]);

        try {
            $page = $browser->createPage();
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

            return base64_decode($pdf->getBase64());
        } finally {
            $browser->close();
        }
    }
}
