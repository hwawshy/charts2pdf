<?php declare(strict_types=1);

namespace TreknParcel\DTO;

use Symfony\Component\Validator\Constraints as Assert;

readonly class PDFRequest
{
    public function __construct(
        #[Assert\NotBlank]
        public string $html
    ) {
    }
}
