<?php declare(strict_types=1);

namespace TreknParcel\Controller;

use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use TreknParcel\DTO\PDFRequest;
use TreknParcel\Service\DOMPurifier;
use TreknParcel\Service\PdfGenerator;
use TreknParcel\Service\SsrService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class IndexController extends AbstractController
{
    public function __construct(
        private readonly SsrService             $ssrService,
        private readonly PdfGenerator           $pdfGenerator,
        private readonly DOMPurifier $DOMPurifier,
        private readonly LoggerInterface        $logger
    ) {
    }

    #[Route('/', name: 'index', methods: ['GET'])]
    public function index(): Response
    {
        $props = [
            'pdfGenerateUrl' => $this->generateUrl('generate')
        ];

        $ssrResult = $this->ssrService->render('/assets/entrypoint/app-server.tsx', $props);

        return $this->render('base.html.twig', ['props' => $props, 'appHtml' => $ssrResult]);
    }

    #[Route('/generate', name: 'generate', methods: ['POST'], format: 'json')]
    public function generate(#[MapRequestPayload] PDFRequest $pdfRequest): JsonResponse
    {
        try {
            $safeHTML = $this->DOMPurifier->sanitize($pdfRequest->html);

            $result = $this->pdfGenerator->generate($safeHTML);

            return new JsonResponse(['content' => $result]);
        } catch (\Throwable $e) {
            $this->logger->error('An error occurred while generating PDF files: ' . $e->getMessage(), ['exception' => $e]);

            return new JsonResponse('An error occurred while generating PDF files', Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
