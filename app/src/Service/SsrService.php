<?php declare(strict_types=1);

namespace TreknParcel\Service;

use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Throwable;
use TreknParcel\Exception\SsrException;

readonly class SsrService
{
    public function __construct(
        private HttpClientInterface $client,
        #[Autowire('%env(string:SSR_URL)%')]
        private string              $ssrUrl
    ) {
    }

    /**
     * @param array<string, mixed> $props
     * @throws SsrException
     */
    public function render(string $component, array $props): string
    {
        try {
            $response = $this->client->request('POST', $this->ssrUrl, [
                'json' => ['component' => $component, 'props' => $props],
            ]);

            /**
             * @var array{'appHtml': string} $data
             */
            $data = json_decode($response->getContent(), true, 512, JSON_THROW_ON_ERROR);

            return $data['appHtml'];
        } catch (Throwable $e) {
            throw new SsrException('Error while doing server side rendering', previous: $e);
        }
    }
}
