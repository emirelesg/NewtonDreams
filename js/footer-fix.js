/**
 * This function makes sure that the footer is sticky or fixed at the bottom of the page.
 * It adds a padding to the body element to achieve this.
 */

 $(function(){
    function fixFooter() {
        var height = $('.footer').outerHeight();
        $('body').css('paddingBottom', height+'px');
    }
    window.addEventListener("resize", fixFooter, false);
    fixFooter();
});