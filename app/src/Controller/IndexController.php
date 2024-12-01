<?php declare(strict_types=1);

namespace TreknParcel\Controller;

use TreknParcel\Service\SsrService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class IndexController extends AbstractController
{
    public function __construct(
        private readonly SsrService $ssrService,
        private readonly HttpClientInterface $client
    ) {
    }

    #[Route('/', name: 'index', methods: ['GET'])]
    public function index(): Response
    {
        $response = $this->client->request('GET', 'https://dummyjson.com/products');

        $json = json_decode($response->getContent(), true, 512, JSON_THROW_ON_ERROR);

        $ssrResult = $this->ssrService->render('/assets/entrypoint/app-server.tsx', ['products' => [$json['products'][0]]]);

        return $this->render('base.html.twig', ['props' => ['products' => [$json['products'][0]]], 'appHtml' => $ssrResult]);
    }
}
