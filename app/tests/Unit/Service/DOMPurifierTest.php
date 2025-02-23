<?php

namespace TreknParcel\Tests\Unit\Service;

use Generator;
use PHPUnit\Framework\TestCase;
use TreknParcel\Service\DOMPurifier;

class DOMPurifierTest extends TestCase
{
    /**
     * @dataProvider dirtyHTMLDataProvider
     */
    public function testCanSanitizeHTML(string $dirty, string $expected): void
    {
        $domPurifier = new DOMPurifier();

        $this->assertSame($expected, $domPurifier->sanitize($dirty));
    }

    public function dirtyHTMLDataProvider(): Generator
    {
        // dirty, expected
        yield ['<img src=x onerror=alert(1)//>', '<img src="x">'];
        yield ['<svg><g/onload=alert(2)//<p>', '<svg><g></g></svg>'];
        yield ['<p>abc<iframe//src=jAva&Tab;script:alert(3)>def</p>', '<p>abc</p>'];
        yield ['<math><mi//xlink:href="data:x,<script>alert(4)</script>">', '']; // we do not allow MathML
        yield ['<TABLE><tr><td>HELLO</tr></TABL>', '<table><tbody><tr><td>HELLO</td></tr></tbody></table>'];
        yield ['<UL><li><A HREF=//google.com>click</UL>', '<ul><li><a href="//google.com">click</a></li></ul>'];
    }
}
