<?php

namespace TreknParcel\Service;

use Symfony\Component\Process\Exception\ProcessFailedException;
use Symfony\Component\Process\Process;

readonly class DOMPurifier
{
    private const float TIMEOUT = 2.0;

    public function sanitize(string $html): string
    {
        $process = new Process([
            'node',
            '-e',
            $this->getScriptCode()
        ]);

        $process->setInput($html);
        $process->setTimeout(self::TIMEOUT);

        $process->run();

        if (!$process->isSuccessful()) {
            throw new ProcessFailedException($process);
        }

        return $process->getOutput();
    }

    private function getScriptCode(): string
    {
        return <<<CODE
const DOMPurify = require("isomorphic-dompurify");
const fs = require("fs");
const data = fs.readFileSync(0, "utf-8");
const clean = DOMPurify.sanitize(data, { USE_PROFILES: {html: true, svg: true, svgFilters: true} });
process.stdout.write(clean);
CODE;
    }
}
