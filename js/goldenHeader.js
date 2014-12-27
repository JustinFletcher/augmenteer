/**
 * Created by Justin Fletcher on 12/27/2014.
 */

function makeGoldenHeader($goldenHeader) {


    var $brandLine = $goldenHeader.children('.brand-line');
    var $tagLine = $goldenHeader.children('.tag-line');

    var phi = (1 + Math.sqrt(5)) / 2;

    var headerWidth = 350;
    var headerHeight = $goldenHeader.parent().height() - 1;
    var brandLineHeight = headerHeight / phi;
    var tagLineHeight = (brandLineHeight * phi) - brandLineHeight;

    $brandLine.css('height', Math.floor(brandLineHeight) + "px");
    $tagLine.css('height', Math.floor(tagLineHeight) + "px");

    $brandLine.css('font-size', Math.floor(brandLineHeight) + "px");
    $tagLine.css('font-size', Math.floor(tagLineHeight) + "px");

    $brandLine.css('line-height', 1);
    $tagLine.css('line-height', 0.8);

    var spacingIndex = 0;
    while ($brandLine.width() < headerWidth) {
        spacingIndex = spacingIndex + 0.1;
        $brandLine.css('letter-spacing', (spacingIndex + "px"));
    }

    var tagSpacingIndex = 0;
    while ($tagLine.width() < (headerWidth - spacingIndex / 2)) {
        tagSpacingIndex = tagSpacingIndex + 0.1;
        $tagLine.css('letter-spacing', (tagSpacingIndex + "px"));
    }
    $tagLine.css('padding-right', (tagSpacingIndex + "px"));
}