/*
 Import all product specific js
 */
import PageManager from './page-manager';
import collapsibleFactory from './common/collapsible';
import ProductDetails from './common/product-details';
import videoGallery from './product/video-gallery';
import { classifyForm } from './common/form-utils';

export default class Product extends PageManager {
    constructor(context) {
        super(context);
        this.url = window.location.href;
        this.$bulkPricingLink = $('[data-reveal-id="modal-bulk-pricing"]');
    }

    onReady() {
        let validator;

        // Init collapsible
        collapsibleFactory();

        this.productDetails = new ProductDetails($('.productView'), this.context, window.BCData.product_attributes);
        this.productDetails.setProductVariant();

        videoGallery();

        this.bulkPricingHandler();

        // Auto select the first wood and size option
        $('[data-name="Size"] input:first').trigger( "click" ).change();
        $('[data-name="Wood"] input:first').trigger( "click" ).change();
        $('[data-name="Colors"] input:first').trigger( "click" ).change();

        // Show the help link only if it's a stick or cane and display the right modal respectively
        if ($('.radio-option-help').length) {
            const breadcrumbs = $('.breadcrumbs').text();
            if (breadcrumbs.includes("Walking Canes")) {
                $('.radio-option-help').data('reveal-id', 'cane-sizing-modal');
            } else if (breadcrumbs.includes("Walking Sticks")) {
                $('.radio-option-help').data('reveal-id', 'stick-sizing-modal');
            } else {
                $('.radio-option-help').css('display', 'none');
            }
        }

        // Only show the customily canvas if the "Add Engraving" option is present and set to "Yes"
        if ($('[data-name="Add Engraving"]').length) {
            window.addEventListener('load', function() {
                var engravingInputYes = document.querySelectorAll('[data-name="Add Engraving"] input')[0];
                var engravingInputNo = document.querySelectorAll('[data-name="Add Engraving"] input')[1];

                var displayCustomilyFunction = window.displayCustomilyCanvas;
                function displayCustomilyCanvasCustom() {
                    if(!engravingInputYes.checked) return;
                    displayCustomilyFunction();
                }

                window.displayCustomilyCanvas = displayCustomilyCanvasCustom;

                engravingInputYes.addEventListener('click', function() {
                    $('.productView-thumbnails').hide();
                    $('[data-name="Choose font"] input:first').trigger( "click" ).change();
                    window.displayCustomilyCanvas();
                });

                engravingInputNo.addEventListener('click', function() {
                    $('.productView-thumbnails').show();
                    window.hideCustomilyCanvas();
                });
            });
        }
    }

    bulkPricingHandler() {
        if (this.url.indexOf('#bulk_pricing') !== -1) {
            this.$bulkPricingLink.trigger('click');
        }
    }
}
