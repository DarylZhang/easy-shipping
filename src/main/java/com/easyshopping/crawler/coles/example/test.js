if (typeof (jsfDone) == 'undefined') {
    var jsfDone = false;
}
if (typeof (jsfScript) == 'undefined') {
    var jsfScript = document.createElement("script");
    (function() {
            var jsLink = '//embed.salefinder.com.au/library/desktop/?ts=202109230943';
            head = document.getElementsByTagName("head")[0] || document.documentElement;
            jsfScript.src = jsLink;
            jsfScript.type = 'text/javascript';
            jsfScript.async = true;
            jsfScript.onload = jsfScript.onreadystatechange = function() {
                if (!jsfDone && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
                    console.log('calling scripts has loaded. preloading');
                    jsfDone = true;
                    sfCatalogue.preLoad();
                }
            }
            ;
            head.insertBefore(jsfScript, head.firstChild);
        }
    )();
} else {
    var scriptCheck = setInterval(function() {
        if (jsfDone == true) {
            console.log('scripts not called. preloading');
            clearInterval(scriptCheck);
            sfCatalogue.preLoad();
        }
    }, 200);
}
var Salefinder = {
    data: {
        previousView: "",
        previousSaleId: "",
        saleId: 0,
        view: "",
        page: 1,
        cdn: 'https://dduhxx0oznf63.cloudfront.net',
        locationView: 2,
        saleDescription: '',
        retailerId: 148,
        apiKey: 'c0l8sDE5683419EEF6',
        postcode: "",
        state: "",
        offers: [],
        offersLoaded: false,
        region: "",
        iframeCheckOutTimeout: "",
        cookieExpireTime: "",
        firstloadNavbar: false,
        tooltipParent: {}
    },
    options: {
        sensitivity: 5,
        scriptTag: 'script[src*="embed.salefinder.com.au/148"]',
        contentDiv: '#sf-content',
        parentDirectory: '/catalogues-and-specials' + window.location.search,
        urlCheck: 'view-all',
        rowsPerPage: 28,
        salePageFolder: '/images/salepages/iphone/',
        checkOutUrl: 'https://shop.coles.com.au/a/a-national/everything/browse?cid=Coles.com.au_catalogue_Coles.com.au_widget_checkout&source=',
        searchExtraUrl: '&extraProducts=1',
        cataloguesExtraUrl: '',
        customDirectionNav: '.sf-flex-nav a',
        customControlsContainer: '.sf-flex-nav .sf-controls-container',
        containerWidth: 960
    },
    callback: {
        afterInit: function() {
            if (window.location.pathname.endsWith(Salefinder.options.urlCheck)) {
                var saleId = sfCatalogue.getHashValue('saleId') || 0;
                if (saleId == 0) {
                    window.location.href = Salefinder.options.parentDirectory;
                } else {}
            } else {}
            Salefinder.data.cookieExpireTime = Salefinder.callback.getNextWeekTime();
            jsf(document).keypress(function(e) {
                if (e.which == 13) {
                    if (jsf('#message').length > 0) {
                        jsf.fancybox.close();
                    }
                }
            });
            jsf(document).on('click', '#sf-catalogue-howto-button', function() {
                var button = jsf('#sf-catalogue-howto-button');
                var container = jsf('#main');
                var tooltip = jsf('#sf-howto-tooltip');
                if (button.length == 1 && container.length == 1 && tooltip.length == 1) {
                    var bos = button.offset();
                    var cos = container.offset();
                    var top = bos.top - (cos.top + 360);
                    var left = bos.left - (cos.left + 263);
                    tooltip.css("top", top + 'px');
                    tooltip.css("left", left + 'px');
                    tooltip.toggle();
                    digitalData.event.push({
                        "eventInfo": {
                            "eventAction": "hot to use coles catalogue"
                        }
                    });
                }
            });
            jsf(document).on('click', '.sf-tooltip-close', function() {
                jsf('#sf-howto-tooltip').hide();
            });
            jsf(document).on('click', 'a.sf-item-image, a.sf-item-heading,a.sf-viewmore, .sf-slname a', function(e) {
                e.preventDefault();
                Salefinder.callback.customMapClickHandler(jsf(this));
            });
            jsf('a[href="#main"]').click(function(e) {
                e.preventDefault();
                jsf('#sf-main-content').focus();
            });
        },
        beforeLoadPage: function() {
            jsf('#sf-navcategories .rocket__navbar__item').removeClass('rocket__navbar__item--active');
        },
        afterLoadListUrl: function(url) {
            Salefinder.callback.setNavbar(Salefinder.data.view);
            if (Salefinder.data.offersLoaded == true) {
                Salefinder.callback.processMboxes();
            } else {
                var mboxParameters = {
                    "view": Salefinder.data.view,
                    "saledId": Salefinder.data.saleId,
                    "areaName": Salefinder.data.region,
                    "page": 1
                }
                loadCatalogueMbox(mboxParameters);
            }
            sfCatalogue.checkForItemId();
            if (Salefinder.data.view == 'shoppinglist') {
                var shoppinglistcookie = jsf.parseJSON(jsf.cookie('sf-shoppinglist'));
                if (shoppinglistcookie) {
                    for (var j = 0; j < shoppinglistcookie.length; j++) {
                        if (shoppinglistcookie[j].SKU) {
                            if (shoppinglistcookie[j].quantity) {
                                jsf('.sf-slqty [data-sku="' + shoppinglistcookie[j].SKU + '"]').val(shoppinglistcookie[j].quantity);
                            } else {
                                jsf('.sf-slqty [data-sku="' + shoppinglistcookie[j].SKU + '"]').val(1);
                            }
                        } else {
                            if (shoppinglistcookie[j].quantity) {
                                jsf('.sf-slqty #' + shoppinglistcookie[j].itemId + '[data-sku=""]').val(shoppinglistcookie[j].quantity);
                            } else {
                                jsf('.sf-slqty #' + shoppinglistcookie[j].itemId + '[data-sku=""]').val(1);
                            }
                        }
                    }
                }
                jsf('.sf-slremove a').click(function(e) {
                    e.preventDefault();
                    var parent = jsf(this).closest('tr');
                    var qtyfield = parent.find('.sf-slqty input');
                    sfCatalogue.removeFromShortlist(qtyfield.attr("id"), qtyfield.data('sku'));
                    parent.next().remove();
                    parent.fadeOut();
                });
                jsf('.sf-slqty').on('click', 'a', function(e) {
                    e.preventDefault();
                    var parent = jsf(this).closest('.sf-slqty');
                    var qtyfield = parent.find('input');
                    if (qtyfield && parseInt(qtyfield.val()) > 0) {
                        sfCatalogue.addToShortlist(qtyfield.attr('id'), qtyfield.val(), qtyfield.data('sku'), true);
                        jsf(this).fadeOut();
                    } else {
                        alert('Please enter a valid quantity');
                    }
                });
                jsf('.sf-slqty').focusin(function() {
                    jsf('.sf-slqty a').hide();
                    jsf(this).find('a').show();
                });
            } else if (Salefinder.data.view == 'cart') {
                var totalItems = 0;
                var shoppinglistcookie = jsf.parseJSON(jsf.cookie('sf-cart'));
                if (shoppinglistcookie) {
                    for (var j = 0; j < shoppinglistcookie.length; j++) {
                        if (shoppinglistcookie[j].quantity) {
                            jsf('.sf-slqty [data-sku="' + shoppinglistcookie[j].SKU + '"]').val(shoppinglistcookie[j].quantity);
                            totalItems += parseInt(shoppinglistcookie[j].quantity);
                        } else {
                            jsf('.sf-slqty [data-sku="' + shoppinglistcookie[j].SKU + '"]').val(1);
                            totalItems++;
                        }
                    }
                }
                var cartNum = Salefinder.callback.refreshCartQty();
                jsf('.sf-slremove a').click(function(e) {
                    e.preventDefault();
                    var parent = jsf(this).closest('tr');
                    var qtyfield = parent.find('.sf-slqty input');
                    var removeItem = Salefinder.callback.removeFromCart(qtyfield.attr("id"), qtyfield.data('sku'));
                    parent.next().remove();
                    var cartNum = Salefinder.callback.refreshCartQty();
                    parent.fadeOut('fast', function() {
                        if (cartNum == 0) {
                            jsf('#sf-trolley-container').closest('tr').hide();
                            jsf('#sf-notfound').fadeIn();
                        }
                    });
                    Salefinder.callback.pushPageview('remove-from-cart', removeItem);
                });
                jsf('.sf-slqty').on('click', 'a', function(e) {
                    e.preventDefault();
                    var parent = jsf(this).closest('.sf-slqty');
                    var qtyfield = parent.find('input');
                    if (qtyfield && parseInt(qtyfield.val()) > 0) {
                        if (qtyfield.val() > 99) {
                            qtyfield.val(99);
                        }
                        Salefinder.callback.addToCart(qtyfield.attr('id'), qtyfield.val(), qtyfield.data('sku'), true);
                        jsf(this).fadeOut();
                    } else {
                        alert('Please enter a valid quantity');
                    }
                });
                jsf('.sf-slqty').focusin(function() {
                    jsf('.sf-slqty a').hide();
                    jsf(this).find('a').show();
                });
                jsf('#sf-deletelist-button').click(function(e) {
                    e.preventDefault();
                    var cart = jsf.parseJSON(jsf.cookie('sf-cart'));
                    if (cart.length > 0) {
                        var isGood = confirm('Are you sure you would like to empty your shopping list?');
                        if (isGood) {
                            jsf.cookie('sf-cart', null);
                            sfCatalogue.loadCart(Salefinder.data.saleId);
                        }
                    }
                    digitalData.event.push({
                        "eventInfo": {
                            "eventAction": "deleteList"
                        }
                    });
                });
                jsf('#sf-printlist-button').click(function(e) {
                    e.preventDefault();
                    var cart = jsf.parseJSON(jsf.cookie('sf-cart'));
                    if (cart.length > 0) {
                        var itemlist = jsf.cookie('sf-cart');
                        if (itemlist == undefined) {
                            itemlist = '';
                        }
                        var currentlink = sfCatalogue.embedHost + "/productlist/shoppinglistprint/" + Salefinder.data.saleId + "/?format=json&ids=" + encodeURIComponent(itemlist) + "";
                        window.open(currentlink, 'myWindow', 'status = 1, height = 600, width = 800, resizable = 0, scrollbars = 1');
                    }
                    digitalData.event.push({
                        "eventInfo": {
                            "eventAction": "printList"
                        }
                    });
                });
                jsf('#sf-sharelist-button').click(function(e) {
                    e.preventDefault();
                    var cart = jsf.parseJSON(jsf.cookie('sf-cart'));
                    digitalData.event.push({
                        "eventInfo": {
                            "eventAction": "shareList"
                        }
                    });
                    if (cart.length > 0) {
                        Salefinder.callback.pushPageview('shortlist-email');
                        var currentlink = sfCatalogue.embedHost + "/productlist/shoppinglistemail/" + Salefinder.data.saleId + "/";
                        jsf.getJSON(currentlink + "?callback=?", function(data) {
                            if (data.content) {
                                jsf.fancybox({
                                    scrolling: 'no',
                                    content: data.content,
                                    afterShow: function() {
                                        jsf('.emailform').focus();
                                        jsf("#frmEmail").validate({
                                            errorContainer: jsf('#errormessage'),
                                            errorLabelContainer: jsf("#errormessage"),
                                            wrapper: "div",
                                            submitHandler: function(form) {
                                                var itemlist = jsf.cookie('sf-cart');
                                                jsf.getJSON(sfCatalogue.embedHost + "/productlist/shoppinglistsend/" + Salefinder.data.saleId + "/?callback=?&ids=" + encodeURIComponent(itemlist) + "&" + jsf('#frmEmail').serialize(), function(data) {
                                                    if (data.result) {
                                                        jsf.fancybox({
                                                            content: '<div id="message">' + data.result + '</div>',
                                                            beforeShow: function() {
                                                                jsf('#frmMain').addClass('sf-blur');
                                                            },
                                                            afterClose: function() {
                                                                jsf('#frmMain').removeClass('sf-blur');
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    },
                                    beforeShow: function() {
                                        jsf('#frmMain').addClass('sf-blur');
                                    },
                                    afterClose: function() {
                                        jsf('#frmMain').removeClass('sf-blur');
                                    }
                                });
                            }
                        });
                    }
                });
            } else if (Salefinder.data.view == 'list') {
                Salefinder.callback.pushPageview('catalogue-load', sfCatalogue.areaName);
            } else if (Salefinder.data.view == 'category') {
                var categoryLink = jsf('#sf-navcategories a[href="' + window.location.hash + '"]');
                if (categoryLink.length > 0) {
                    categoryLink.closest('.rocket__navbar__item').addClass('rocket__navbar__item--active');
                }
            }
            var productCount = jsf('#sf-items-table').data('count');
            Salefinder.data.pageNo = 2;
            jsf('#show-more').click(function(e) {
                jsf.fancybox.showLoading();
                var position = jsf(window).scrollTop();
                if (Salefinder.data.pageNo > 1) {
                    pUrl = url + "&page=" + Salefinder.data.pageNo;
                }
                jsf.getJSON(pUrl + "&callback=?", function(data) {
                    if (data.content) {
                        var newRows = jsf(data.content).find('#sf-items-table .sf-item');
                        jsf('#sf-items-table').append(newRows);
                        jsf(window).scrollTop(position);
                        Salefinder.data.pageNo++;
                        jsf.fancybox.hideLoading();
                        var items = jsf('#sf-items-table .sf-item');
                        if (items.length == productCount) {
                            jsf('#show-more').hide();
                        }
                    }
                });
            });
            var items = jsf('#sf-items-table .sf-item');
            if (items.length < productCount) {
                jsf('#show-more').show();
            }
        },
        afterRemoveFromShortlist: function() {
            var itemlist = jsf.cookie('sf-shoppinglist');
            if (itemlist) {
                var shortlist = jsf.parseJSON(itemlist);
                if (shortlist.length == 0) {
                    jsf('#sf-notfound').show();
                    jsf('#sf-addseltrolley').attr('disabled', 'disabled');
                    jsf('#sf-addalltrolley').attr('disabled', 'disabled');
                    jsf('#sf-delshoppinglist').attr('disabled', 'disabled');
                }
            }
        },
        afterLoadProductPopup: function() {
            jsf('#sf-product-varieties-list li').each(function(index) {
                var sku = jsf(this).find('.add-to-trolley-button').data('sku');
                var itemlist = jsf.cookie('sf-cart');
                var cart = jsf.parseJSON(itemlist);
                if (cart) {
                    for (var j = 0; j < cart.length; j++) {
                        if (cart[j].SKU == sku) {
                            jsf(this).find('.sf-variety-addtocart-flag').show();
                        }
                    }
                }
            });
            jsf('.add-to-trolley-button').click(function(e) {
                e.preventDefault();
                var itemQty = jsf(this).closest('.sf-variety-addtocart-container').find('.quantity-input').val();
                if (parseInt(itemQty) > 99) {
                    itemQty = 99;
                    jsf(this).closest('.sf-variety-addtocart-container').find('.quantity-input').val(99);
                }
                if (Salefinder.callback.validateQuantity(itemQty) == true) {
                    var itemSku = jsf(this).data('sku');
                    var itemId = jsf('#sf-product-varieties-list').data('itemid');
                    var itemPrice = jsf(this).data('itemprice');
                    var itemName = jsf(this).data('itemname');
                    Salefinder.callback.addToCart(itemId, itemQty, itemSku, false, itemPrice, itemName);
                    jsf(this).closest('li').find('.sf-variety-addtocart-flag').show();
                    Salefinder.callback.refreshCartQty();
                }
            });
            jsf('#sf-shortlist-qty').click(function(e) {
                e.preventDefault();
                if (Salefinder.callback.validateItemList() == true) {
                    sfCatalogue.addToShortlist(jsf(this).attr("rel"), jsf('#sf-quantity').val(), jsf('#sf-stockcode').val(), false, jsf('#sf-stockcode').data('itemprice'));
                    jsf('.sf-product-addedlist').animate({
                        marginLeft: 0
                    }, 500).focus().delay(2000).fadeOut('slow', function() {
                        jsf(this).css({
                            'margin-left': '-200px'
                        }).show();
                    });
                }
            });
            if (jsf('#sf-stockcode').length > 0) {
                jsf('#sf-stockcode, #sf-item-tooltip-container, ').keydown(function(e) {
                    var keyCode = e.keyCode || e.which;
                    if (keyCode == 9) {
                        if (e.shiftKey) {
                            e.preventDefault();
                            jsf('.fancybox-close').focus();
                        }
                    }
                });
            } else {
                jsf('#sf-quantity, #sf-item-tooltip-container, ').keydown(function(e) {
                    var keyCode = e.keyCode || e.which;
                    if (keyCode == 9) {
                        if (e.shiftKey) {
                            e.preventDefault();
                            jsf('.fancybox-close').focus();
                        }
                    }
                });
            }
            jsf('#sf-scroll-variety-btn').click(function() {
                var position = jsf('#sf-product-varieties-list').scrollTop();
                jsf('#sf-product-varieties-list').animate({
                    scrollTop: (position + 100) + "px"
                });
            });
            var totalVisibleVarieties = jsf('.sf-variety-addtocart-container').length;
            if (totalVisibleVarieties > 5) {
                jsf('#sf-scroll-variety-btn').css('display', 'block');
            } else {
                if (totalVisibleVarieties == 0) {
                    jsf('#sf-item-tooltip .sf-instore-button').show();
                    jsf('#sf-product-varieties-list').hide();
                }
            }
            Salefinder.callback.checkVarietiesScroll();
        },
        afterLoadProduct: function() {
            jsf('html,body').animate({
                scrollTop: 0
            }, 0);
            Salefinder.callback.setNavbar(Salefinder.data.view);
            sfCatalogue._setNavbarHandler();
            Salefinder.callback.extraNavbarHandler();
        },
        checkVarietiesScroll: function() {
            jsf('#sf-product-varieties-list').scroll(function() {
                var height = jsf(this).height();
                var limit = jsf(this)[0].scrollHeight;
                var position = jsf(this).scrollTop();
                if (position + height == limit) {
                    jsf('#sf-scroll-variety-btn').hide();
                } else {
                    jsf('#sf-scroll-variety-btn').show();
                }
            });
        },
        beforeLoadList: function() {
            this.beforeLoadCatalogue();
        },
        afterLoadList: function() {
            Salefinder.callback.checkSaleMessage(Salefinder.data.saleDescription);
        },
        beforeLoadCatalogue: function() {
            this.showPopupMessage(Salefinder.data.saleId);
        },
        afterLoadCatalogue: function() {
            Salefinder.callback.checkSaleMessage(Salefinder.data.saleDescription);
            jsf('html,body').animate({
                scrollTop: 0
            }, 0);
            jsf('#sf-catalogue-header-contents li').removeClass('rocket__navbar__item--active');
            jsf('#sf-catalogue-header-contents li>a').removeAttr('aria-current');
            jsf('#sf-catalogue-header-contents li[data-saleid="' + Salefinder.data.saleId + '"]').addClass('rocket__navbar__item--active');
            jsf('#sf-catalogue-header-contents li[data-saleid="' + Salefinder.data.saleId + '"]>a').attr('aria-current', 'page');
            Salefinder.callback.loadWarningText();
        },
        updateTitle: function() {
            if (Salefinder.data.saleName.startsWith('Coles Cat')) {
                var now = new Date();
                var startDate = new Date(Salefinder.data.startDate);
                if (startDate > now) {
                    var saleName = "Next week&#39;s catalogue";
                } else {
                    var saleName = "This week&#39;s catalogue";
                }
            } else {
                var saleName = Salefinder.data.saleName;
            }
            jsf('#sf-catalogue-name').html(saleName);
            jsf('#sf-catalogue-offertext').html(Salefinder.data.offerText);
        },
        afterLoadPage: function() {
            var selector = jsf('#main>.catalogue-location-selector');
            if (selector.length == 1) {
                selector.appendTo(jsf('#sf-postcode-selector-container'));
            }
        },
        afterLoadEachPage: function(el, index) {
            if (Salefinder.data.view == 'catalogue') {
                var currentIndex = index;
                var folder = '/salepagesanimated/ipad';
            } else {
                var currentIndex = index;
                var folder = '/salepagesanimated/iphone';
            }
            var slide = sfCatalogue.carouselList[currentIndex];
            if (slide.animatedimagefile) {
                var preloadDiv = jsf('#preload');
                var imagelink = sfCatalogue.imageServer + '/images' + folder + '/' + slide.animatedimagefile;
                var imageCheck = preloadDiv.find('img[src="' + imagelink + '"]');
                if (imageCheck.length == 0) {
                    preloadDiv.append('<img src="' + imagelink + '" />');
                }
            }
            if (Salefinder.data.view == 'catalogue2' && !el.hasClass('page0')) {
                el.click(function(evt) {
                    if (parseInt(Salefinder.data.saleId) > 0) {
                        sfCatalogue.pauseAllVideos();
                        digitalData.event.push({
                            "eventInfo": {
                                "eventAction": "magnify",
                                "zoom": "in"
                            }
                        });
                        var zoomOverlay = jsf('<div class="fancybox-overlay fancybox-overlay-fixed" style="cursor:pointer"></div>');
                        zoomOverlay.appendTo('body');
                        zoomOverlay.fadeIn('slow');
                        var zoomContainer = jsf('<div class="zoom-container"></div>');
                        var smallImg = jsf(this).find('img');
                        zoomContainer.html('<div class="zoom-inner"><div class="zoom-image"><div class="zoom-links-container"></div><img src="' + smallImg.attr('src') + '" /></div></div>');
                        var currentSlideWidth = jsf('.slides li').width();
                        currentImgHeight = sfCatalogue.carouselList[index].image_height * currentSlideWidth / 518;
                        var carouselWidth = jsf('#sf-catalogue').width();
                        var carouselOffset = jsf('#sf-catalogue').offset();
                        var carouselTop = carouselOffset.top;
                        var carouselLeft = carouselOffset.left;
                        var zoomImageHeight = parseInt((currentImgHeight * (960 / currentSlideWidth)));
                        var zoomMaxTop = currentImgHeight - zoomImageHeight;
                        if (index % 2 == 0) {
                            zoomContainer.css('left', carouselLeft);
                        } else {
                            zoomContainer.css('right', jsf(window).width() - (carouselWidth + carouselLeft));
                        }
                        var zoomLinks = zoomContainer.find('.zoom-links-container');
                        zoomLinks.height(zoomImageHeight);
                        zoomContainer.css({
                            'width': '640px',
                            'height': currentImgHeight,
                            'top': carouselTop
                        });
                        zoomContainer.appendTo('body').animate({
                            width: 960,
                            height: currentImgHeight
                        }, 400, function() {});
                        if (Salefinder.data.hideIntroPage) {
                            var pageNo = index + 1;
                        } else {
                            var pageNo = index;
                        }
                        zoomContainer.find('img').attr('src', Salefinder.data.cdn + '/images/salepages/ipad/' + Salefinder.data.saleId + '_' + pageNo + '.jpg');
                        var top = zoomContainer.offset().top + 50;
                        var bottom = zoomContainer.offset().top + currentImgHeight - 50;
                        var distance = bottom - top;
                        var img = zoomContainer.find('.zoom-image');
                        nTop = ((top - evt.pageY) / distance) * (zoomImageHeight - currentImgHeight);
                        if (nTop > 0) {
                            nTop = 0;
                        }
                        img.css('top', nTop);
                        zoomContainer.on('mousemove', function(e) {
                            if (e.pageY > top && e.pageY < bottom) {
                                nTop = ((top - e.pageY) / distance) * (zoomImageHeight - currentImgHeight);
                                img.css('top', nTop);
                            }
                        });
                        if (!slide.firstpage) {
                            var content = '';
                            jsf.each(slide, function(i, item) {
                                content += sfCatalogue.getPageObject(item, i);
                            });
                            zoomLinks.html(content);
                            jsf('.zoom-container .sf-maparea').click(function(e) {
                                e.stopPropagation();
                                e.preventDefault();
                                jsf('.fancybox-overlay').fadeOut('fast', function() {
                                    jsf(this).remove();
                                });
                                jsf('.zoom-container').fadeOut('fast', function() {
                                    jsf(this).remove();
                                });
                                Salefinder.callback.customMapClickHandler(jsf(this));
                            });
                        }
                        jsf('.fancybox-overlay, .zoom-container').click(function() {
                            digitalData.event.push({
                                "eventInfo": {
                                    "eventAction": "magnify",
                                    "zoom": "out"
                                }
                            });
                            jsf('.fancybox-overlay').fadeOut('fast', function() {
                                jsf(this).remove();
                            });
                            jsf('.zoom-container').fadeOut('fast', function() {
                                jsf(this).remove();
                            });
                        });
                    }
                });
                if (Salefinder.data.hideIntroPage == 1) {
                    var page0 = jsf('#sf-catalogue .page0');
                    if (page0.length > 0 && page0.find('.sf-page-image').length > 0) {
                        if (page0.find('#sf-catalogue-howto-container').length == 0) {
                            jsf('#sf-catalogue-howto-container').detach().appendTo('#sf-catalogue .page0');
                        }
                    }
                }
            }
        },
        afterPageSlide: function() {
            var page = parseInt(sfCatalogue.getHashValue('page'));
            if (!page || page == 0) {
                page = 1;
            }
            Salefinder.callback.afterCarouselStart();
            if (Salefinder.data.view == 'catalogue2') {
                var changePage = jsf('#sf-singlepage');
            } else {
                if (page % 2 == 0) {
                    page += 1;
                }
                var changePage = jsf('#sf-twopage');
            }
            var newUrl = sfCatalogue.replaceHashValue('page', page, changePage.attr('href'));
            changePage.attr('href', newUrl);
            Salefinder.callback._checkCatalogueHomeButton();
        },
        afterCarouselStart: function() {
            if (typeof (sfCatalogue.carouselList[Salefinder.data.page].products) != 'undefined') {
                Salefinder.callback.showCatalogueListItems(Salefinder.data.page);
            }
            var url = sfCatalogue.embedHost + "/productlist/salepage/" + Salefinder.data.saleId + "/?callback=?&preview=" + sfCatalogue.preview + "&pageNo=" + Salefinder.data.page + "&view=" + Salefinder.data.view + "&saleGroup=" + sfCatalogue.saleGroup + "";
            jsf.getJSON(url, function(data) {
                var showProducts = true;
                console.log('current page ' + Salefinder.data.page);
                if (typeof (sfCatalogue.carouselList[Salefinder.data.page].products) != 'undefined') {
                    showProducts = false;
                }
                if (data.products) {
                    jsf.each(data.products, function(i, value) {
                        if (typeof (sfCatalogue.carouselList[i]) != 'undefined') {
                            sfCatalogue.carouselList[i].products = value;
                        }
                    });
                    if (showProducts) {
                        Salefinder.callback.showCatalogueListItems(Salefinder.data.page);
                    }
                }
            });
        },
        showCatalogueListItems: function(page) {
            jsf('#sf-catalogue-listitems').html(sfCatalogue.carouselList[page].products);
        },
        _checkCatalogueHomeButton: function() {},
        _setAnimatedPages: function() {
            var pageNo = parseInt(sfCatalogue.getHashValue('page'));
            var index = pageNo;
            if (Salefinder.data.view == 'catalogue') {
                var folder = '/salepagesanimated/ipad';
                var slide = sfCatalogue.carouselList[index - 1];
            } else {
                var folder = '/salepagesanimated/iphone';
                var slide = sfCatalogue.carouselList[index];
            }
            if (slide.animatedimagefile && typeof (slide.offerImageFile) == 'undefined') {
                var page = jsf('.page' + index + ' .sf-page-image img');
                var imagelink = sfCatalogue.imageServer + '/images' + folder + '/' + slide.animatedimagefile;
                page.attr('src', imagelink);
            }
            if (Salefinder.data.view == 'catalogue2') {
                index = pageNo - 1;
                slide = sfCatalogue.carouselList[index];
                if (typeof (slide.offerImageFile) == 'undefined') {
                    if (slide && slide.animatedimagefile) {
                        var page = jsf('.page' + index + ' .sf-page-image img');
                        var imagelink = sfCatalogue.imageServer + '/images' + folder + '/' + slide.animatedimagefile;
                        page.attr('src', imagelink);
                    }
                }
            }
        },
        afterLoadLocation: function() {
            jsf("#sf-location-search").keypress(function(evt) {
                var charCode = evt.charCode || evt.keyCode;
                if (charCode == 13) {
                    alert('Please select a store from the drop down list.');
                }
            });
        },
        afterLoadThumbs: function() {
            Salefinder.callback.setNavbar(Salefinder.data.view);
        },
        loadWarningText: function() {
            var warningText = '';
            switch (Salefinder.data.state) {
                case 'VIC':
                    warningText = "Prices may vary state to state. Promotional prices not available at <b>Coles Express (unless otherwise indicated) or Coles Melbourne CBD</b>. Some promotional prices may not be available at <b>coles.com.au, Coles Coburg North or Coles Clyde North</b>. Refer to catalogue for full terms and conditions.";
                    break;
                case 'WA':
                    warningText = "Prices may vary state to state. Promotional prices not available at <b>Coles Raine Square and Coles Seaview</b>. Some promotional prices may not be available at <b>coles.com.au or Coles Cockburn Gateway</b>. Refer to catalogue for full terms and conditions.";
                    break;
                case 'QLD':
                    warningText = "Prices may vary state to state. Promotional prices not available at <b>Coles Express (unless otherwise indicated), Coles Express Myer and Coles Brisbane CBD</b>. Some promotional prices may not be available at <b>coles.com.au and Coles Casuarina</b>. Refer to catalogue for full terms and conditions.";
                    break;
                case 'NSW':
                    warningText = "Prices may vary state to state. Promotional prices not available at <b>Coles Express (unless otherwise indicated) or Coles Wynyard</b>. Some promotional prices may not be available at <b>coles.com.au, Coles Casuarina, Coles Banora Central, Coles Banora Point, Coles Tweed City, Coles Tweed Heads, Coles Broken Hill, Coles Albury or Coles Lavington</b>. Refer to catalogue for full terms and conditions.";
                    break;
                case 'TAS':
                    warningText = "Prices may vary state to state. Promotional prices not available at <b>Coles Express (unless otherwise indicated)</b>. Some promotional prices may not be available at <b>coles.com.au</b>. Refer to catalogue for full terms and conditions.";
                    break;
                case 'SA':
                    warningText = "Prices may vary state to state. Promotional prices not available at <b>Coles Express (unless otherwise indicated)</b>. Some promotional prices may not be available at <b>coles.com.au</b>. Refer to catalogue for full terms and conditions.";
                    break;
                case 'NT':
                    warningText = "Prices may vary state to state. Promotional prices not available at <b>Coles Express (unless otherwise indicated)</b>. Some promotional prices may not be available at <b>coles.com.au</b>. Refer to catalogue for full terms and conditions.";
                    break;
                case 'ACT':
                    warningText = "Prices may vary state to state. Promotional prices not available at <b>Coles Express (unless otherwise indicated)</b>. Some promotional prices may not be available at <b>coles.com.au</b>. Refer to catalogue for full terms and conditions.";
            }
            jsf('#sf-terms-state').html(warningText);
        },
        afterLoadCatalogues: function() {
            Salefinder.callback.loadWarningText();
            Salefinder.data.timeInitial = Math.floor(Date.now() / 1000);
            Salefinder.data.timeLeftOffset = jsf('#sf-countdown-container').data('timeleft');
            if (Salefinder.data.timeLeftOffset > 0) {
                Salefinder.data.countdownFunc = Salefinder.callback.doCountDown();
            }
            jsf('.sf-countdownplay').click(function(e) {
                if (jsf(this).hasClass('play')) {
                    Salefinder.data.countdownFunc = Salefinder.callback.doCountDown();
                    jsf(this).removeClass('play');
                    jsf(this).addClass('pause');
                    jsf(this).attr('aria-label', 'pause catalogue countdown');
                } else {
                    clearInterval(Salefinder.data.countdownFunc);
                    jsf(this).removeClass('pause');
                    jsf(this).addClass('play');
                    jsf(this).attr('aria-label', 'play catalogue countdown');
                }
            });
            sfCatalogue.saleTermsLightbox();
        },
        doCountDown: function() {
            var x = false;
            Salefinder.data.timeLeft = Salefinder.data.timeLeftOffset - (Math.floor(Date.now() / 1000) - Salefinder.data.timeInitial);
            var calcTime;
            if (typeof (Salefinder.data.timeLeft) != 'undefined' && Salefinder.data.timeLeft > 0) {
                x = setInterval(function() {
                    if (Salefinder.data.timeLeft <= 0) {
                        window.location.reload();
                        clearInterval(x);
                    }
                    calcTime = Salefinder.data.timeLeft;
                    var days = "00" + Math.floor(calcTime / (60 * 60 * 24));
                    calcTime = calcTime % (60 * 60 * 24);
                    var hours = "00" + Math.floor(calcTime / (60 * 60));
                    calcTime = calcTime % (60 * 60);
                    var mins = "00" + Math.floor(calcTime / 60);
                    calcTime = calcTime % (60);
                    var secs = "00" + Math.floor(calcTime % 60);
                    jsf('#sf-countdown-days').html(days.substring(days.length - 2));
                    jsf('#sf-countdown-hours').html(hours.substring(hours.length - 2));
                    jsf('#sf-countdown-mins').html(mins.substring(mins.length - 2));
                    jsf('#sf-countdown-secs').html(secs.substring(secs.length - 2));
                    Salefinder.data.timeLeft = Salefinder.data.timeLeftOffset - (Math.floor(Date.now() / 1000) - Salefinder.data.timeInitial);
                }, 200);
            }
            return x;
        },
        setNavbar: function(type) {
            jsf('#sf-twopage,#sf-singlepage').removeClass('on');
            switch (type) {
                case 'catalogue2':
                    jsf('#sf-salepage-dropdown2').show();
                    jsf('#catalogue-top-prev').show();
                    jsf('#catalogue-top-next').show();
                    jsf('#sf-email-action').show();
                    jsf('#sf-print-action').show();
                    jsf('#sf-salepage-dropdown').hide();
                    jsf('#sf-salepage-sort').hide();
                    jsf('#sf-printshortlist-action').hide();
                    jsf('#sf-emailshortlist-action').hide();
                    jsf('#sf-salepage-sort-container').hide();
                    jsf('#sf-viewallcatalogues').show();
                    jsf('#sf-backtocatalogue').hide();
                    jsf('#sf-twopage').addClass('on');
                    break;
                case 'catalogue':
                    jsf('#sf-salepage-dropdown').show();
                    jsf('#catalogue-top-prev').show();
                    jsf('#catalogue-top-next').show();
                    jsf('#sf-email-action').show();
                    jsf('#sf-print-action').show();
                    jsf('#sf-salepage-dropdown2').hide();
                    jsf('#sf-salepage-sort').hide();
                    jsf('#sf-printshortlist-action').hide();
                    jsf('#sf-emailshortlist-action').hide();
                    jsf('#sf-salepage-sort-container').hide();
                    jsf('#sf-viewallcatalogues').show();
                    jsf('#sf-backtocatalogue').hide();
                    jsf('#sf-singlepage').addClass('on');
                    break;
                case 'product':
                case 'search':
                    jsf('#sf-email-action').hide();
                    jsf('#sf-salepage-sort-container').hide();
                    jsf('#sf-print-action').hide();
                    jsf('#sf-printshortlist-action').hide();
                    jsf('#sf-emailshortlist-action').hide();
                    jsf('#sf-salepage-dropdown').hide();
                    jsf('#sf-salepage-dropdown2').hide();
                    jsf('#catalogue-top-prev').hide();
                    jsf('#catalogue-top-next').hide();
                    jsf('#sf-backtocatalogue').attr('href', Salefinder.data.previousLink);
                    jsf('#sf-backtocatalogue').show();
                    jsf('#sf-viewallcatalogues').hide();
                    break;
                case 'cart':
                    jsf('#sf-email-action').hide();
                    jsf('#sf-salepage-sort-container').hide();
                    jsf('#sf-print-action').hide();
                    jsf('#sf-printshortlist-action').hide();
                    jsf('#sf-emailshortlist-action').hide();
                    jsf('#sf-salepage-dropdown').hide();
                    jsf('#sf-salepage-dropdown2').hide();
                    jsf('#catalogue-top-prev').hide();
                    jsf('#catalogue-top-next').hide();
                    jsf('#sf-navbarcart-container').hide();
                    break;
                case 'pagethumb':
                    jsf('#sf-email-action').show();
                    jsf('#sf-salepage-sort-container').hide();
                    jsf('#sf-print-action').hide();
                    jsf('#sf-printshortlist-action').hide();
                    jsf('#sf-emailshortlist-action').hide();
                    jsf('#sf-salepage-dropdown').hide();
                    jsf('#sf-salepage-dropdown2').hide();
                    jsf('#catalogue-top-prev').hide();
                    jsf('#catalogue-top-next').hide();
                    jsf('#sf-viewallcatalogues').show();
                    jsf('#sf-backtocatalogue').hide();
                    break;
                case 'category':
                    jsf('#sf-salepage-sort-container').show();
                    jsf('#sf-email-action').hide();
                    jsf('#sf-print-action').hide();
                    jsf('#sf-printshortlist-action').hide();
                    jsf('#sf-emailshortlist-action').hide();
                    jsf('#sf-salepage-dropdown').hide();
                    jsf('#sf-salepage-dropdown2').hide();
                    jsf('#catalogue-top-prev').hide();
                    jsf('#catalogue-top-next').hide();
                    jsf('#sf-backtocatalogue').attr('href', Salefinder.data.previousLink);
                    jsf('#sf-backtocatalogue').show();
                    jsf('#sf-viewallcatalogues').hide();
                    break;
                case 'list':
                    jsf('#sf-salepage-sort-container').show();
                    jsf('#sf-email-action').show();
                    jsf('#sf-print-action').hide();
                    jsf('#sf-printshortlist-action').hide();
                    jsf('#sf-emailshortlist-action').hide();
                    jsf('#sf-salepage-dropdown').hide();
                    jsf('#sf-salepage-dropdown2').hide();
                    jsf('#catalogue-top-prev').hide();
                    jsf('#catalogue-top-next').hide();
                    jsf('#sf-backtocatalogue').attr('href', Salefinder.data.previousLink);
                    jsf('#sf-backtocatalogue').show();
                    jsf('#sf-viewallcatalogues').hide();
                    break;
            }
        },
        replaceBreadCrumb: function(lastTitle, parent) {
            var breadcrumbDiv = '.breadcrumbs';
            var breadcrumb = '<li role="listitem"><a role="link" href="http://www.coles.com.au/">Home</a></li>';
            if (lastTitle.length > 0) {
                breadcrumb += '<li role="listitem"><a role="link" href="' + window.location.pathname + '">Catalogues &amp; Specials</a></li>';
                if (parent) {
                    breadcrumb += '<li role="listitem"><a role="link" href="' + parent.parentLink + '">Catalogues &amp; Specials</a></li>';
                }
                breadcrumb += '<li role="listitem" class="current">' + lastTitle + '</li>';
            } else {
                breadcrumb += '<li role="listitem" class="current">Catalogues</li>';
            }
            jsf(breadcrumbDiv).html(breadcrumb);
            Salefinder.callback.refreshCartQty();
        },
        emptyRedirect: function() {
            window.location.href = Salefinder.options.parentDirectory;
        },
        checkSaleMessage: function() {},
        pushPageview: function(type, link) {
            console.log('tracking called ' + type + ' ' + link);
            var type = type == undefined ? 'pageview' : type;
            switch (type) {
                case 'product-list':
                case 'catalogue-load':
                    digitalData.page.catalogue = {
                        "region": Salefinder.data.saleName,
                        "id": Salefinder.data.saleId,
                        "area": Salefinder.data.region,
                        "type": "weekly",
                        "edition": jsf('#sf-catalogue-offertext').text(),
                        "pageNo": Salefinder.data.page
                    }
                    break;
                case 'view-productbox':
                    var itemName = jsf('#sf-item-tooltip-details-container h1').html();
                    digitalData.event.push({
                        "eventInfo": {
                            "eventAction": "productOverlay",
                            "overlayName": itemName
                        }
                    });
                    break;
                case 'add-to-cart':
                    var itemName = link.itemName
                        , itemSku = link.SKU
                        , qty = link.quantity;
                    if (typeof (link.itemPrice) != 'undefined') {
                        var itemPrice = parseFloat(link.itemPrice).toFixed(2);
                    } else {
                        var itemPrice = 0;
                    }
                    digitalData.event.push({
                        "eventInfo": {
                            "eventAction": "addToCart",
                            "productName": itemName,
                            "sku": itemSku,
                            "price": itemPrice,
                            "quantity": "" + qty
                        }
                    });
                    break;
                case 'remove-from-cart':
                    var itemName = link.itemName
                        , itemSku = link.SKU
                        , qty = link.quantity;
                    digitalData.event.push({
                        "eventInfo": {
                            "eventAction": "removeFromCart",
                            "productName": itemName,
                            "sku": itemSku,
                            "price": itemPrice,
                            "quantity": "" + qty
                        }
                    });
                    break;
                case 'search':
                    digitalData.event.push({
                        "eventInfo": {
                            "eventAction": "search",
                            "searchTerm": link
                        }
                    })
                    break;
            }
        },
        showPopupMessage: function(saleId) {},
        customMapClickHandler: function(el) {
            var itemId = el.data("itemid");
            if (itemId != undefined) {
                Salefinder.data.itemName = el.attr("title");
                Salefinder.data.tooltipParent = el;
                jsf.getJSON(sfCatalogue.embedHost + '/item/tooltip/' + itemId + '?callback=?&preview=' + sfCatalogue.preview + (Salefinder.options.tooltipExtraUrl ? Salefinder.options.tooltipExtraUrl : '') + "&saleGroup=" + sfCatalogue.saleGroup + (Salefinder.data.includeSaleGroup ? '&includeSaleGroup=' + Salefinder.data.includeSaleGroup : '') + '', function(data2) {
                    jsf.fancybox({
                        content: data2,
                        beforeShow: function() {
                            jsf('#frmMain').addClass('sf-blur');
                        },
                        afterShow: function() {
                            sfCatalogue._setItemPopupHandler(itemId);
                            jsf('#sf-item-tooltip-container').focus();
                            jsf('.fancybox-close').keydown(function(e) {
                                var keyCode = e.keyCode || e.which;
                                if (keyCode == 9) {
                                    if (e.shiftKey) {} else {
                                        e.preventDefault();
                                        if (jsf('select#sf-stockcode').length > 0) {
                                            jsf('select#sf-stockcode').focus();
                                        } else {
                                            jsf('#sf-quantity').focus();
                                        }
                                    }
                                }
                            });
                        },
                        afterClose: function() {
                            Salefinder.data.tooltipParent.focus();
                            jsf('#frmMain').removeClass('sf-blur');
                        }
                    });
                    Salefinder.callback.pushPageview('view-productbox');
                });
            } else {
                var link = el.attr("href");
                if (link != undefined && link.substring(0, 4) == 'http') {
                    window.open(link, '_blank');
                    Salefinder.callback.pushPageview('campaign-link');
                } else {
                    window.location.href = link;
                }
                digitalData.event.push({
                    "eventInfo": {
                        "eventAction": "link",
                        "url": link
                    }
                });
            }
        },
        extraNavbarHandler: function() {
            jsf('#frmMain').bind("keyup keypress", function(e) {
                var code = e.keyCode || e.which;
                if (code == 13) {
                    e.preventDefault();
                    return false;
                }
            });
            jsf('#sf-navbar-checkout-text, #sf-checkout-btn').click(function(e) {
                e.preventDefault();
                if (!jsf(this).attr("disabled")) {
                    digitalData.event.push({
                        "eventInfo": {
                            "eventAction": "checkOut"
                        }
                    });
                    Salefinder.data.cartCookie = jsf.parseJSON(jsf.cookie('sf-cart'));
                    var cartString = '';
                    for (var j = 0; j < Salefinder.data.cartCookie.length; j++) {
                        var item = Salefinder.data.cartCookie[j];
                        if (item.SKU.length > 0 || item.quantity > 0) {
                            cartString += '&p=' + item.SKU + '_' + item.quantity;
                        }
                    }
                    if (cartString.length == 0) {
                        var data = {
                            'errorMessage': 'There is a problem with products in your trolley. Please clear your browser cookies and try again.'
                        };
                        Salefinder.callback.showErrorMessage(data);
                    } else {
                        var pageId = Salefinder.callback.generatePageId();
                        if (Salefinder.data.saleName.substring(0, 8) == 'Coles Ca') {
                            var source = 'shop-cat';
                        } else if (Salefinder.data.saleName.substring(0, 8) == 'Coles Be') {
                            var source = 'shop-cat_best_buys';
                        } else if (Salefinder.data.saleName.substring(0, 8) == 'coles&co') {
                            var source = 'shop-cat_colesco';
                        } else {
                            var source = encodeURIComponent(Salefinder.data.saleName.replaceAll(' ', '_'));
                        }
                        var redirectUrl = Salefinder.options.checkOutUrl + source + cartString + pageId;
                        Salefinder.callback.pushPageview('checkout');
                        jsf.cookie('sf-cart', null);
                        setTimeout(function() {
                            window.location.href = redirectUrl;
                        }, 1000);
                        setTimeout(function() {}, 10000);
                    }
                }
            });
            jsf('#sf-navbar-checkout-icon').click(function() {
                digitalData.event.push({
                    "eventInfo": {
                        "eventAction": "viewCart"
                    }
                });
            });
        },
        generatePageId: function() {
            switch (Salefinder.data.view) {
                case 'cart':
                case 'shoppinglist':
                    var pageId = Salefinder.data.region + '_' + Salefinder.data.view;
                    break;
                default:
                    var pageId = Salefinder.data.region + '_' + Salefinder.data.view + '_pg' + Salefinder.data.page;
            }
            return '&pageId=' + pageId;
        },
        iframeError: function() {
            var data = {
                'errorMessage': 'There is a problem checking out on Coles Online. Please try again later.'
            };
            Salefinder.callback.showErrorMessage(data);
        },
        addToCart: function(itemId, quantity, SKU, overwriteQty, itemPrice, itemName) {
            var itemlist = jsf.cookie('sf-cart');
            var exists = false;
            if (parseInt(quantity) < 1) {
                quantity = 1;
            } else {
                quantity = parseInt(quantity);
            }
            var item = {
                'itemId': itemId,
                'SKU': SKU,
                'quantity': quantity,
                'itemPrice': itemPrice,
                'itemName': itemName
            };
            if (itemlist == undefined || itemlist.length == 0) {
                var cart = [];
            } else {
                var cart = jsf.parseJSON(itemlist);
                for (var j = 0; j < cart.length; j++) {
                    if (cart[j].SKU == SKU) {
                        if (overwriteQty) {
                            cart[j].quantity = quantity;
                        } else {
                            cart[j].quantity = parseInt(cart[j].quantity) + parseInt(quantity);
                        }
                        exists = true;
                    }
                }
            }
            if (!exists) {
                cart.push(item)
            }
            var cartText = JSON.stringify(cart);
            jsf.cookie('sf-cart', cartText, {
                expires: Salefinder.data.cookieExpireTime
            });
            Salefinder.callback.pushPageview('add-to-cart', item);
        },
        removeFromCart: function(itemId, SKU) {
            var itemlist = jsf.cookie('sf-cart');
            var replacecart = [];
            var removeItem = '';
            if (itemlist != undefined && itemlist.length > 0) {
                var cart = jsf.parseJSON(itemlist);
                for (var j = 0; j < cart.length; j++) {
                    var sitem = cart[j];
                    if (sitem.itemId != itemId && sitem.SKU != SKU) {
                        replacecart.push(sitem);
                    } else {
                        if (SKU != undefined) {
                            if (SKU != sitem.SKU) {
                                replacecart.push(sitem);
                            } else {
                                removeItem = sitem;
                            }
                        }
                    }
                }
            }
            jsf.cookie('sf-cart', JSON.stringify(replacecart));
            return removeItem;
        },
        refreshCartQty: function() {
            var cartDisplay = jsf('.sf-navbar-checkout-items');
            if (cartDisplay.length > 0) {
                var cart = jsf.parseJSON(jsf.cookie('sf-cart'));
                var num = 0;
                if (cart) {
                    num = cart.length;
                }
                if (num == 0) {
                    cartDisplay.html('0 items');
                    jsf('#sf-navbar-checkout-text').attr('disabled', 'disabled');
                    jsf('#sf-navbar-checkout-count').html(num);
                } else {
                    if (num == 1) {
                        var numDisplay = num + ' item';
                    } else {
                        var numDisplay = num + ' items';
                    }
                    cartDisplay.html(numDisplay);
                    jsf('#sf-navbar-checkout-count').html(num);
                    jsf('#sf-navbar-checkout-text').removeAttr('disabled');
                }
                jsf('#sf-trolley-total').html(numDisplay);
                return num;
            } else {
                return;
            }
        },
        addMainContentAnchor: function() {
            if (jsf('#sf-main-content').length == 0) {
                jsf('#sf-root').prepend('<a id="sf-main-content" href="#" title="Main content">Main content</a>');
            }
        },
        validateQuantity: function(itemQty) {
            if (!itemQty || parseInt(itemQty) < 1) {
                alert('Please enter a valid quantity');
                return false;
            }
            return true;
        },
        validateItemList: function(el) {
            var itemQty = jsf('#sf-quantity').val();
            if (jsf('#sf-stockcode').length > 0) {
                var itemSku = jsf('#sf-stockcode').val();
                if (!itemSku || itemSku.length == 0) {
                    alert('Please select a product');
                    return false;
                }
            }
            if (!itemQty || parseInt(itemQty) < 1) {
                alert('Please enter a valid quantity');
                return false;
            }
            return true;
        },
        showErrorMessage: function(data) {
            var errorMessage = '<div id="sf-cart-errormessage"><p id="message" role="alert" tabindex="-1">' + data.errorMessage + '</p><div id="sf-message-line"><a id="sf-message-ok" class="button" href="javascript:jsf.fancybox.close()">OK</a></div></div>';
            jsf('#sf-checkoutframe').remove();
            jsf.fancybox({
                content: errorMessage,
                modal: true,
                beforeShow: function() {
                    jsf('#frmMain').addClass('sf-blur');
                },
                afterShow: function() {
                    jsf('#message').focus();
                },
                afterClose: function() {
                    jsf('#frmMain').removeClass('sf-blur');
                }
            });
        },
        processMboxes: function(slider) {
            if (typeof (Salefinder.data.offers[Salefinder.data.saleId]) != 'undefined') {
                Salefinder.data.offers[Salefinder.data.saleId].forEach(function(data) {
                    if (typeof (data) == "object") {
                        switch (data.name) {
                            case 'coles-catalogue-navbar':
                                var options = data.options || null;
                                if (options && options.length > 0) {
                                    var opts = options[0].content;
                                    opts.forEach(function(opt) {
                                        if (opt.optimisationAction == 'reorder') {
                                            var category = jsf('a[data-categoryid="' + opt.optimisationDetail.categoryId + '"]');
                                            var categoryContainer = jsf('#sf-navcategories a');
                                            var currentPosition = categoryContainer.index(category) + 1;
                                            if (currentPosition != opt.optimisationDetail.position) {
                                                var moveEl = jsf('#sf-navcategories a[data-categoryid="' + opt.optimisationDetail.categoryId + '"]').parent();
                                                if (typeof (opt.optimisationDetail.className) != 'undefined') {
                                                    moveEl.addClass(opt.optimisationDetail.className);
                                                }
                                                moveEl.insertBefore(jsf('#sf-navcategories li:nth-child(' + opt.optimisationDetail.position + ')'));
                                            }
                                        }
                                    });
                                }
                                break;
                            case 'coles-catalogue-pages':
                                var options = data.options || null;
                                if (options && options.length > 0) {
                                    var opts = options[0].content;
                                    opts.forEach(function(opt) {
                                        if (opt.optimisationAction == 'modify') {
                                            var changePg = opt.optimisationDetail.pageIndex;
                                            var changePgImage = opt.optimisationDetail.carouselList.imagefile || "";
                                            if (changePgImage.length > 0) {
                                                sfCatalogue.carouselList[changePg].offerImageFile = changePgImage;
                                            }
                                            if (typeof (opt.optimisationDetail.carouselList[0]) != 'undefined') {
                                                jsf.each(sfCatalogue.carouselList[changePg], function(i, item) {
                                                    if (typeof (item) == 'object') {
                                                        delete sfCatalogue.carouselList[changePg][i];
                                                    }
                                                });
                                            }
                                            jsf.each(opt.optimisationDetail.carouselList, function(i, item) {
                                                if (typeof (item) == 'object') {
                                                    sfCatalogue.carouselList[changePg][i] = item;
                                                }
                                            });
                                        }
                                    });
                                }
                                break;
                        }
                    }
                });
            }
            Salefinder.callback.processSliderAction();
        },
        processSliderAction: function() {
            var el = jsf('#sf-catalogue');
            if (el.length > 0) {
                var slider = el.data('flexslider');
                sfCatalogue.pageScrollHandler(slider);
                Salefinder.callback._setAnimatedPages();
            }
        },
        getNextWeekTime: function() {
            var nextWed = new Date();
            nextWed.setDate(nextWed.getDate() + (9 - nextWed.getDay()) % 7);
            nextWed.setHours(23);
            nextWed.setMinutes(59);
            nextWed.setSeconds(59);
            return new Date(nextWed);
        }
    }
};
loadCatalogueMbox = function(mboxParameters, slider) {
    try {
        adobe.target.getOffers({
            timeout: 2000,
            request: {
                execute: {
                    mboxes: [{
                        index: 0,
                        name: "coles-catalogue-navbar",
                        parameters: mboxParameters
                    }, {
                        index: 1,
                        name: "coles-catalogue-pages",
                        parameters: mboxParameters
                    }]
                }
            }
        }).then(function(response) {
            var mboxes = response.execute.mboxes;
            Salefinder.data.offers[mboxParameters.saledId] = mboxes;
            mboxes.forEach(function(el) {
                if (typeof el == "object" && typeof el.name == "string")
                    var mbox = el.name;
                if (typeof el == "object" && typeof el.options == "object")
                    var offer = el.options;
                if (typeof offer == "object" && typeof offer[0].content == "object") {
                    if (typeof digitalData.optimisationData == "undefined")
                        digitalData.optimisationData = [];
                    if (typeof digitalData.optimisationData.catalogueOptimisationData == "undefined")
                        digitalData.optimisationData.catalogueOptimisationData = [];
                    digitalData.optimisationData.catalogueOptimisationData.push(offer[0].content[0]);
                    console.log('[Target] Offer response', offer[0].content[0]);
                } else {
                    console.log('[Target] No targetted content to be shown for mbox', mbox);
                }
            });
        }).then(function() {
            Salefinder.callback.processMboxes(slider);
            Salefinder.data.offersLoaded = true;
            digitalData.event.push({
                "eventInfo": {
                    "eventAction": "catalogueTargetError",
                    "errorDetail": "[details of the error occurred]"
                }
            });
        }).catch(function(error) {
            console.log("[Target] Error occurred in getOffers |", error);
            digitalData.event.push({
                "eventInfo": {
                    "eventAction": "catalogueTargetError",
                    "errorDetail": error
                }
            });
            Salefinder.callback.processSliderAction();
        });
    } catch (err) {
        console.log('loadCatalogueMbox Error:', err);
        digitalData.event.push({
            "eventInfo": {
                "eventAction": "catalogueTargetError",
                "errorDetail": err
            }
        });
        Salefinder.callback.processSliderAction();
    }
}
;
window.twttr = (function(d, s, id) {
    var t, js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
        return
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "https://platform.twitter.com/widgets.js";
    fjs.parentNode.insertBefore(js, fjs);
    return window.twttr || (t = {
        _e: [],
        ready: function(f) {
            t._e.push(f)
        }
    })
}(document, "script", "twitter-wjs"));
if (typeof (digitalData) == 'undefined') {
    var digitalData = {
        "page": {
            "catalogue": {}
        },
        "event": {}
    };
}
var sfCatalogue = {
    rows_per_page: 12,
    salefinderUrl: window.location.protocol + '//manager.salefinder.com.au',
    imageServer: '',
    preview: '',
    locationId: 0,
    videos: [],
    pendingVideos: [],
    videoIndex: 1,
    carouselList: {},
    areaName: '',
    embedHost: '//embed.salefinder.com.au',
    saleGroup: 0,
    reloadCount: 0,
    url: '',
    reloadWidgets: false,
    initialized: false,
    init: function() {
        this.preview = this.getHashValue("preview");
        if (this.preview == undefined) {
            this.preview = "";
        }
        this.loadCss(sfCatalogue.embedHost + "/css/148/styles.css?v=20211222");
        this.loadCss(sfCatalogue.embedHost + "/css/jquery.fancybox.css");
        var ua = window.navigator.userAgent;
        window.browser.msie = ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1;
        if (window.browser.msie) {
            this.loadCss(sfCatalogue.embedHost + "/css/148/ie.css");
            if (!String.prototype.endsWith) {
                String.prototype.endsWith = function(search, this_len) {
                    if (this_len === undefined || this_len > this.length) {
                        this_len = this.length;
                    }
                    return this.substring(this_len - search.length, this_len) === search;
                }
                ;
            }
        }
        if (this.preview.length > 0) {
            this.imageServer = this.salefinderUrl;
        } else {
            this.imageServer = Salefinder.data.cdn;
        }
        var po = document.createElement('script');
        po.type = 'text/javascript';
        po.async = true;
        po.src = 'https://apis.google.com/js/plusone.js';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(po, s);
        if (Salefinder.callback && Salefinder.callback.afterInit) {
            Salefinder.callback.afterInit();
        }
        Salefinder.data.view = this.getHashValue("view");
        Salefinder.data.saleId = parseInt(this.getHashValue("saleId"));
        Salefinder.data.page = parseInt(this.getHashValue("page")) || 1;
        Salefinder.data.previousView = Salefinder.data.view;
        Salefinder.data.previousSaleId = parseInt(Salefinder.data.saleId);
        this.checkLocation();
        if (this.initialized == false) {
            jsf(document).on('userLocationChanged', function(e) {
                console.log('user location changed');
                sfCatalogue.reloadWidgets = true;
                sfCatalogue.preLoad();
            });
            this.loadJs('https://www.youtube.com/iframe_api');
            window.onYouTubeIframeAPIReady = function() {
                sfCatalogue.pendingVideos.forEach(function(video) {
                    sfCatalogue.doClip(video.el, video.youtubeId, video.popup);
                });
            }
            ;
            jsf(document).on('click', '#sf-navbarcart-container', function(e) {
                Salefinder.callback.pushPageview('viewCart');
            });
            jsf(document).on('click', '#sf-navbar-checkout-text,#sf-checkout-btn', function(e) {
                Salefinder.callback.pushPageview('checkOut');
            });
            jsf(document).on('click', '.flex-next', function(e) {
                if (!jsf(this).hasClass('flex-disabled')) {
                    var page = Salefinder.data.page + 1;
                    Salefinder.callback.pushPageview('page right', page);
                }
            });
            jsf(document).on('click', '.flex-prev', function(e) {
                if (!jsf(this).hasClass('flex-disabled')) {
                    var page = Salefinder.data.page - 1;
                    Salefinder.callback.pushPageview('page left', page);
                }
            });
            jsf(document).on('click', '#sf-catalogue-print-left', function(e) {
                Salefinder.callback.pushPageview('print left');
            });
            jsf(document).on('click', '#sf-catalogue-print-right', function(e) {
                Salefinder.callback.pushPageview('print right');
            });
            jsf(document).on('click', '#sf-catalogue-print-all', function(e) {
                Salefinder.callback.pushPageview('print all');
            });
            jsf(document).on('click', '#sf-deletelist-button', function(e) {
                Salefinder.callback.pushPageview('deleteList');
            });
            jsf(document).on('click', '#sf-sharelist-button', function(e) {
                Salefinder.callback.pushPageview('shareList');
            });
            jsf(document).on('click', '#sf-printlist-button', function(e) {
                Salefinder.callback.pushPageview('printList');
            });
            jsf(document).on('click', '.sf-maparea', function(e) {
                var link = jsf(this).attr("href");
                if (link.substring(0, 4) == 'http') {
                    Salefinder.callback.pushPageview('link', link);
                }
            });
            jsf(document).on('click', '#sf-twopage', function(e) {
                digitalData.event.push({
                    "eventInfo": {
                        "eventAction": "viewType",
                        "viewType": "pages:double",
                        "button": "pages"
                    }
                });
            });
            jsf(document).on('click', '#sf-singlepage', function(e) {
                digitalData.event.push({
                    "eventInfo": {
                        "eventAction": "viewType",
                        "viewType": "pages:single",
                        "button": "pages"
                    }
                });
            });
            jsf(document).on('click', '#sf-thumbpage', function(e) {
                digitalData.event.push({
                    "eventInfo": {
                        "eventAction": "viewType",
                        "viewType": "pages:thumbnail",
                        "button": "pages"
                    }
                });
            });
            jsf(document).on('click', '#sf-navlist', function(e) {
                digitalData.event.push({
                    "eventInfo": {
                        "eventAction": "viewType",
                        "viewType": "product-list",
                        "button": "pages"
                    }
                });
            });
            jsf(document).on('click', '.sf-navcategory-link', function(e) {
                digitalData.event.push({
                    "eventInfo": {
                        "eventAction": "viewType",
                        "viewType": "category:" + jsf(this).attr("title"),
                        "button": "pages"
                    }
                });
            });
            jsf(document).on('click', '.sf-pagination a[page]', function(e) {
                digitalData.event.push({
                    "eventInfo": {
                        "eventAction": "pagination",
                        "selectedPage": "" + jsf(this).data('page')
                    }
                })
                digitalData.page.catalogue.pageNo = "" + jsf(this).data('page');
            });
            this.initialized = true;
        }
    },
    checkLocation: function() {
        if (Salefinder.data.region && Salefinder.data.region.length > 0) {
            var locationId = jsf.cookie('sf-locationId');
            if (Salefinder.data.postcode) {
                Salefinder.data.includeSaleGroup = false;
                if (is_bestbuys(Salefinder.data.postcode)) {
                    Salefinder.data.includeSaleGroup = '79';
                } else {
                    Salefinder.data.includeSaleGroup = '90';
                }
            }
            if (typeof (locationId) == 'undefined' || locationId == null || locationId == "null" || !jsf.cookie('sf-postcode') || jsf.cookie('sf-postcode') != Salefinder.data.postcode) {
                jsf.getJSON("//webservice.salefinder.com.au/index.php/api/regions/areasearch/?apikey=c0l8sDE5683419EEF6&area=" + Salefinder.data.region + "&postcode=" + Salefinder.data.postcode + "&format=jsonp&callback=?", function(data) {
                    if (data) {
                        jsf.cookie('sf-locationId', data.storeId);
                        jsf.cookie('sf-locationName', data.displayName);
                        jsf.cookie('sf-postcode', Salefinder.data.postcode);
                        jsf.cookie('sf-region', Salefinder.data.region);
                        sfCatalogue.loadNavbar();
                    } else {}
                });
            } else {
                sfCatalogue.loadNavbar();
            }
        } else {}
    },
    loadNavbar: function() {
        Salefinder.data.view = this.getHashValue("view");
        Salefinder.data.saleId = parseInt(this.getHashValue("saleId"));
        Salefinder.data.page = parseInt(this.getHashValue("page")) || 1;
        if (Salefinder.data.localiseCookie) {
            if (jsf('#sf-salenavbar').length == 0 || Salefinder.data.saleId != Salefinder.data.previousSaleId) {
                Salefinder.data.firstloadNavbar = true;
                if (Salefinder.data.saleId > 0) {
                    jsf('.l-layout').prepend('<div id="sf-catalogues-container"></div>');
                    var selector = jsf('#sf-postcode-selector-container .catalogue-location-selector');
                    if (selector.length == 1) {
                        sfCatalogue.postcodeSelectorDiv = selector;
                    } else {
                        selector = jsf('#main>.catalogue-location-selector');
                        if (selector.length == 1) {
                            sfCatalogue.postcodeSelectorDiv = selector;
                        } else {
                            sfCatalogue.postcodeSelectorDiv = null;
                        }
                    }
                    var url = sfCatalogue.embedHost + "/catalogue/getNavbar/" + Salefinder.data.saleId + "/?format=json&retailerId=" + Salefinder.data.retailerId + "&preview=" + sfCatalogue.preview + "&locationId=" + jsf.cookie('sf-locationId') + (Salefinder.data.includeSaleGroup ? '&includeSaleGroup=' + Salefinder.data.includeSaleGroup : '');
                    jsf.getJSON(url + "&callback=?", function(data) {
                        if (typeof (data.redirect) != 'undefined' && data.redirect == true) {
                            window.location.href = Salefinder.options.parentDirectory;
                        } else {
                            Salefinder.options.rootDiv.html(data.content);
                            sfCatalogue._setSaleData(data);
                            jsf('#sf-catalogue-header-contents').appendTo('#sf-catalogues-container');
                            jsf('#sf-catalogue-header-contents li[data-saleid="' + Salefinder.data.saleId + '"]').addClass('rocket__navbar__item--active');
                            if (sfCatalogue.postcodeSelectorDiv != null) {
                                sfCatalogue.postcodeSelectorDiv.appendTo(jsf('#sf-postcode-selector-container'));
                            }
                            Salefinder.callback.updateTitle();
                            sfCatalogue.loadPage();
                        }
                    });
                } else {
                    sfCatalogue.loadPage();
                }
            } else if (this.reloadWidgets == true) {
                this._updateNavbarTiles();
                jsf(document).trigger('salefinderPageLoad');
                this.reloadWidgets = false;
            } else {
                sfCatalogue.loadPage();
            }
        }
        if (jsf('#sf-catalogues-container') && parseInt(Salefinder.data.saleId) == 0)
            jsf('#sf-catalogues-container').html('');
    },
    _updateNavbarTiles: function() {
        console.log('update tiles');
        var url = sfCatalogue.embedHost + "/catalogue/getNavbar/" + Salefinder.data.saleId + "/?format=json&retailerId=" + Salefinder.data.retailerId + "&preview=" + sfCatalogue.preview + "&locationId=" + jsf.cookie('sf-locationId') + (Salefinder.data.includeSaleGroup ? '&includeSaleGroup=' + Salefinder.data.includeSaleGroup : '');
        jsf.getJSON(url + "&callback=?", function(data) {
            jsf('#sf-catalogues-container').html('');
            jsf('#sf-catalogues-container').append(jsf(data.content).find(('#sf-catalogue-header-contents')));
            jsf('#sf-catalogue-header-contents li[data-saleid="' + Salefinder.data.saleId + '"]').addClass('rocket__navbar__item--active');
        });
    },
    _setSaleData: function(data) {
        if (data.saleDescription) {
            Salefinder.data.saleDescription = data.saleDescription.replace(/\n/gm, "<br />");
        }
        if (data.publishDate) {
            Salefinder.data.publishDate = new Date(data.publishDate);
        }
        if (data.startDate) {
            Salefinder.data.startDate = new Date(data.startDate);
        }
        if (data.endDate) {
            Salefinder.data.endDate = new Date(data.endDate);
        }
        if (data.youtubeId) {
            Salefinder.data.saleYoutubeId = data.youtubeId;
        }
        if (data.saleName) {
            Salefinder.data.saleName = jsf('<div>').html(data.saleName).text();
        }
        if (data.hideIntroPage) {
            Salefinder.data.hideIntroPage = parseInt(data.hideIntroPage);
        }
    },
    loadPage: function() {
        Salefinder.data.previousView = Salefinder.data.view;
        Salefinder.data.previousSaleId = parseInt(Salefinder.data.saleId);
        if (Salefinder.callback && Salefinder.callback.beforeLoadPage) {
            Salefinder.callback.beforeLoadPage();
        }
        if (Salefinder.data.locationView > 0) {
            if (jsf.cookie('sf-locationId') == null && this.preview == "") {
                Salefinder.data.view = 'location';
            }
        }
        if (Salefinder.data.view == undefined || Salefinder.data.view == "catalogues") {
            this.loadCatalogues();
        } else if (Salefinder.data.view == "location") {
            this.loadLocation();
        } else if (Salefinder.data.view == "search") {
            var keyword = this.getHashValue("keyword");
            this.loadSearch(keyword, Salefinder.data.saleId);
        } else if (Salefinder.data.view == "category") {
            var categoryId = this.getHashValue("categoryId");
            this.loadCategory(categoryId, Salefinder.data.saleId);
        } else {
            if (parseInt(Salefinder.data.saleId) > 0) {
                if (jsf('#sf-salenavbar').length == 0) {
                    setTimeout(sfCatalogue.loadAfterNavbar, 100);
                } else {
                    this.loadAfterNavbar();
                }
            } else {
                this.loadCatalogues();
            }
        }
        if (Salefinder.callback && Salefinder.callback.afterLoadPage) {
            Salefinder.callback.afterLoadPage();
        }
    },
    loadAfterNavbar: function() {
        if (jsf('#sf-salenavbar').length == 0) {
            setTimeout(sfCatalogue.loadAfterNavbar, 100);
        } else {
            if (Salefinder.data.view == "catalogue") {
                sfCatalogue.loadCatalogue(Salefinder.data.saleId, 1);
            } else if (Salefinder.data.view == "catalogue2") {
                sfCatalogue.loadCatalogue(Salefinder.data.saleId, 2);
            } else if (Salefinder.data.view == "list") {
                sfCatalogue.loadList(Salefinder.data.saleId);
            } else if (Salefinder.data.view == "pagethumb") {
                jsf('#sf-catalogue').remove();
                sfCatalogue.loadThumbs(Salefinder.data.saleId);
            } else if (Salefinder.data.view == "product") {
                var itemId = sfCatalogue.getHashValue("itemId");
                sfCatalogue.loadProduct(itemId, Salefinder.data.saleId);
            } else if (Salefinder.data.view == "shortlist") {
                sfCatalogue.loadShortlist(Salefinder.data.saleId);
            } else if (Salefinder.data.view == "shoppinglist") {
                sfCatalogue.loadShoppingList(Salefinder.data.saleId);
            } else if (Salefinder.data.view == "cart") {
                sfCatalogue.loadCart(Salefinder.data.saleId);
            } else if (Salefinder.data.view == "bookmark") {
                sfCatalogue.loadBookmarks(Salefinder.data.saleId);
            }
            Salefinder.callback.addMainContentAnchor();
        }
    },
    loadCss: function(location) {
        var fileref = document.createElement("link")
        fileref.setAttribute("rel", "stylesheet")
        fileref.setAttribute("type", "text/css")
        fileref.setAttribute("href", location)
        if (typeof fileref != "undefined")
            document.getElementsByTagName("head")[0].appendChild(fileref)
    },
    loadJs: function(location) {
        var fileref = document.createElement('script');
        fileref.setAttribute("type", "text/javascript");
        fileref.setAttribute("src", location);
        if (typeof fileref != "undefined")
            document.getElementsByTagName("head")[0].appendChild(fileref)
    },
    preloadLink: function(location, type) {
        var fileref = document.createElement('link');
        fileref.setAttribute("rel", "preload");
        fileref.setAttribute("href", location);
        if (type == 'script') {
            fileref.setAttribute("as", "script");
        } else {
            fileref.setAttribute("as", "style");
        }
        if (typeof fileref != "undefined")
            document.getElementsByTagName("head")[0].appendChild(fileref)
    },
    setHashValue: function(hashkey, value) {
        var hashstring = window.location.hash;
        var newHash = this.replaceHashValue(hashkey, value, hashstring);
        var urlName = window.location.href.split('#')[0];
        window.location.replace(urlName + newHash);
    },
    replaceHashValue: function(hashkey, value, urlhash) {
        var hashstring = urlhash;
        var inArray = false;
        var existingHash = "";
        if (hashstring != undefined) {
            if (hashstring.length > 0) {
                hashstring = hashstring.substring(1, hashstring.length);
            }
            var tempArray = hashstring.split('&');
            if (tempArray.length > 0) {
                var tempValue;
                for (var i = 0; i < tempArray.length; i++) {
                    tempValue = tempArray[i].split('=');
                    if (tempValue[0] == hashkey) {
                        tempArray[i] = tempValue[0] + "=" + value;
                        inArray = true;
                    } else {
                        tempArray[i] = tempValue[0] + "=" + tempValue[1];
                    }
                }
                existingHash = tempArray.join("&");
            }
            if (inArray) {
                hashstring = "#" + existingHash;
            } else {
                if (existingHash.length > 0) {
                    hashstring = "#" + existingHash + "&" + hashkey + "=" + value;
                } else {
                    hashstring = "#" + hashkey + "=" + value;
                }
            }
        } else {
            hashstring = "#" + hashkey + "=" + value;
        }
        return hashstring;
    },
    getHashValue: function(value) {
        var hashstring = window.location.hash;
        if (hashstring != undefined && hashstring.length > 0) {
            if (hashstring.substring(0, 3) == '#/?') {
                hashstring = hashstring.substring(3, hashstring.length);
            } else {
                hashstring = hashstring.substring(1, hashstring.length);
            }
            var tempArray = hashstring.split('&');
            if (tempArray.length > 0) {
                var tempValue;
                for (var i = 0; i < tempArray.length; i++) {
                    tempValue = tempArray[i].split('=');
                    if (tempValue[0] == value) {
                        if (tempValue[1].length > 0) {
                            var hashValue = decodeURIComponent(tempValue[1]);
                            return encodeURIComponent(hashValue);
                        } else {
                            return;
                        }
                    }
                }
            }
        }
        return;
    },
    loadCatalogue: function(saleId, pages) {
        sfCatalogue.videos = {};
        if (pages == 2) {
            var size = 518;
        } else {
            var size = 960;
        }
        this.url = sfCatalogue.embedHost + "/catalogue/svgData/" + saleId + "/?format=json&pagetype=" + Salefinder.data.view + "&retailerId=" + Salefinder.data.retailerId + "&locationId=" + jsf.cookie('sf-locationId') + (Salefinder.data.includeSaleGroup ? '&includeSaleGroup=' + Salefinder.data.includeSaleGroup : '') + "&size=" + size + "&preview=" + this.preview + "";
        if (Salefinder.callback && Salefinder.callback.beforeLoadCatalogue) {
            Salefinder.callback.beforeLoadCatalogue();
        }
        jsf.getJSON(this.url + "&callback=?", function(data) {
            if (data.redirect && data.redirect == true) {
                if (Salefinder.callback && Salefinder.callback.emptyRedirect) {
                    Salefinder.callback.emptyRedirect(data);
                } else {
                    window.location.hash = '#';
                    if (window.browser.msie) {
                        sfCatalogue.loadNavbar();
                    }
                }
                return;
            }
            if (data.content) {
                Salefinder.data.region = data.areaName;
                sfCatalogue.areaName = data.areaName;
                sfCatalogue.carouselList = data.catalogue;
                sfCatalogue._setSaleData(data);
                if (Salefinder.callback && Salefinder.callback.beforeShowCatalogue) {
                    Salefinder.callback.beforeShowCatalogue(data);
                }
                Salefinder.data.saleName = jsf('<div>').html(data.saleName).text();
                if (data.saleDescription) {
                    Salefinder.data.saleDescription = data.saleDescription.replace(/\n/gm, "<br />");
                }
                if (Salefinder.callback && Salefinder.callback.checkSaleMessage) {
                    Salefinder.callback.checkSaleMessage();
                }
                var start_page = 1;
                jsf(Salefinder.options.contentDiv).html(data.content);
                var containerWidth = 960;
                if (containerWidth < 960) {
                    containerWidth = 960;
                }
                if (Salefinder.callback && Salefinder.callback.replaceBreadCrumb) {
                    Salefinder.callback.replaceBreadCrumb(data.breadcrumb);
                }
                Salefinder.callback.pushPageview('catalogue-load', sfCatalogue.areaName);
                if (Salefinder.data.view == 'catalogue2') {
                    if (Salefinder.options.hideIntroPage == true || Salefinder.data.hideIntroPage == 1) {
                        sfCatalogue.carouselList.splice(0, 1);
                        if (sfCatalogue.carouselList.length > 0 && sfCatalogue.carouselList.length % 2 == 0) {
                            jsf('#sf-catalogue .page' + sfCatalogue.carouselList.length).remove();
                        }
                        var optionsHtml = '';
                        for (var i = 0; i < sfCatalogue.carouselList.length; i++) {
                            if (i % 2 == 1) {
                                optionsHtml += '<option value="' + i + '">Page ' + (i - 1) + ' & ' + (i) + '</option>';
                            }
                        }
                        if (sfCatalogue.carouselList.length % 2 == 1) {
                            optionsHtml += '<option value="' + sfCatalogue.carouselList.length + '">Page ' + (sfCatalogue.carouselList.length - 1) + '</option>';
                        }
                        jsf('#ddlPage2').html(optionsHtml);
                    } else {
                        if (sfCatalogue.carouselList.length % 2) {
                            jsf('.slides').append('<li class="page' + (sfCatalogue.carouselList.length) + '"></li>');
                            sfCatalogue.carouselList.push({
                                lastpage: true
                            });
                        }
                    }
                } else {
                    jsf('#sf-catalogue li').first().remove();
                }
                var itemWidth = parseInt(containerWidth / pages);
                console.log('slider init triggered');
                jsf('#sf-catalogue').flexslider({
                    slideshow: false,
                    controlNav: false,
                    animation: "slide",
                    animationLoop: false,
                    itemWidth: itemWidth,
                    keyboard: false,
                    prevText: "",
                    nextText: "",
                    directionNav: true,
                    customDirectionNav: (Salefinder.options.customDirectionNav ? jsf(Salefinder.options.customDirectionNav) : ''),
                    after: function(slider) {
                        sfCatalogue.pageScrollHandler(slider);
                        if (Salefinder.data.previousSlide != slider.currentSlide && Salefinder.data.saleId == Salefinder.data.previousSaleId) {
                            console.log('after page triggered');
                            Salefinder.data.page = sfCatalogue.setPageNo(Salefinder.data.view, null, slider.currentSlide);
                            if (jsf('#sf-catalogue .page' + Salefinder.data.page).find('.sf-bookmark-remove').is(':visible')) {
                                jsf('#sf-bookmark-action').addClass('on');
                            } else {
                                jsf('#sf-bookmark-action').removeClass('on');
                            }
                            jsf.cookie('previousPage', window.location.hash);
                            if (Salefinder.callback && Salefinder.callback.afterPageSlide) {
                                Salefinder.callback.afterPageSlide();
                            }
                            Salefinder.callback._setAnimatedPages();
                            if (Salefinder.data.view == 'catalogue2') {
                                var selector = '.page' + Salefinder.data.page + ', .page' + (Salefinder.data.page - 1);
                            } else {
                                var selector = '.page' + Salefinder.data.page;
                            }
                            jsf(selector).find('.sf-video-button').each(function() {
                                var videoContainer = jsf(this).closest('.sf-video');
                                if (typeof (sfCatalogue.videos[videoContainer.attr('id')]) == 'undefined') {
                                    var autoPlay = parseInt(jsf(this).data("autoplay"));
                                    var youtubeId = jsf(this).data("youtubeid");
                                    var popup = jsf(this).data("popup");
                                    if (autoPlay == 1) {
                                        var el = jsf(this);
                                        if (typeof (YT) == 'undefined' || typeof (YT.Player) == 'undefined') {
                                            sfCatalogue.pendingVideos.push({
                                                el: el,
                                                youtubeId: youtubeId,
                                                popup: popup
                                            });
                                        } else {
                                            sfCatalogue.doClip(el, youtubeId, popup);
                                        }
                                    }
                                }
                            });
                        }
                        Salefinder.data.previousSlide = slider.currentSlide;
                        Salefinder.data.previousLink = window.location.hash;
                    },
                    start: function(slider) {
                        if (typeof digitalData.optimisationData == "object" && digitalData.optimisationData.catalogueOptimisationEnabled === true) {
                            var mboxParameters = {
                                "view": Salefinder.data.view,
                                "saledId": Salefinder.data.saleId,
                                "areaName": Salefinder.data.region,
                                "page": 1
                            }
                            loadCatalogueMbox(mboxParameters, slider);
                        } else {
                            sfCatalogue.pageScrollHandler(slider);
                        }
                        sfCatalogue.scrollSliderTo(null, Salefinder.data.view, slider);
                        console.log('start page triggered');
                        Salefinder.data.previousSlide = slider.currentSlide;
                        var bmcookie = jsf.cookie('sf-bookmark-' + sfCatalogue.saleGroup);
                        if (bmcookie != undefined && bmcookie.length > 0) {
                            var bookmark;
                            var bookmarkobj = jsf.parseJSON(bmcookie);
                            for (var j = 0; j < bookmarkobj.length; j++) {
                                bookmark = bookmarkobj[j];
                                if (bookmark.pagetype == 1) {
                                    bookmark.view = 'catalogue';
                                } else {
                                    bookmark.view = 'catalogue2';
                                }
                                if (bookmark.saleId == Salefinder.data.saleId && bookmark.view == Salefinder.data.view) {
                                    jsf('#sf-catalogue .page' + bookmark.pageno).find('.sf-bookmark-remove').show();
                                    jsf('#sf-bookmark-action').addClass('on');
                                }
                            }
                        }
                        if (Salefinder.data.page == 1) {
                            Salefinder.callback.pushPageview();
                        }
                        if (typeof (sfCatalogue.carouselList[1]) != 'undefined') {
                            if (Salefinder.options.containerWidth) {
                                var actualHeight = parseInt((Salefinder.options.containerWidth / 1036) * sfCatalogue.carouselList[1].image_height);
                                jsf('#sf-catalogue .page0').height(actualHeight);
                            } else {
                                jsf('#sf-catalogue .page0').height(sfCatalogue.carouselList[1].image_height);
                            }
                        }
                        Salefinder.callback._setAnimatedPages();
                        Salefinder.callback._checkCatalogueHomeButton();
                        if (Salefinder.callback && Salefinder.callback.afterCarouselStart) {
                            Salefinder.callback.afterCarouselStart();
                        }
                        sfCatalogue.checkForItemId();
                        Salefinder.data.previousLink = window.location.hash;
                    }
                });
                jsf('#sf-twopage, #sf-singlepage').click(function(e) {
                    currentlink = jsf(this).attr('href');
                    pageno = jsf(this).attr('rel');
                    if (pageno > 0) {
                        jsf(this).attr('href', currentlink + '&page=' + pageno);
                    }
                });
                jsf('#sf-catalogue-print-left').click(function(e) {
                    e.preventDefault();
                    currentlink = jsf(this).data('href');
                    if (Salefinder.data.hideIntroPage && parseInt(Salefinder.data.hideIntroPage) == 1) {
                        pageno = parseInt(sfCatalogue.getHashValue('page'));
                    } else {
                        pageno = parseInt(sfCatalogue.getHashValue('page')) - 1;
                    }
                    if (pageno == 0)
                        pageno = 1;
                    var newlink = currentlink + pageno;
                    Salefinder.callback.pushPageview('catalogue-printpage');
                    digitalData.event.push({
                        "eventInfo": {
                            "eventAction": "print",
                            "printOptions": "left page"
                        }
                    });
                    window.open(newlink, 'myWindow', 'status = 1, height = 600, width = 800, resizable = 0, scrollbars = 1');
                });
                jsf('#sf-catalogue-print-right').click(function(e) {
                    e.preventDefault();
                    if (Salefinder.data.hideIntroPage && parseInt(Salefinder.data.hideIntroPage) == 1) {
                        pageno = sfCatalogue.getHashValue('page');
                    } else {
                        pageno = parseInt(sfCatalogue.getHashValue('page')) + 1;
                    }
                    currentlink = jsf(this).data('href') + pageno;
                    Salefinder.callback.pushPageview('catalogue-printpage');
                    digitalData.event.push({
                        "eventInfo": {
                            "eventAction": "print",
                            "printOptions": "right page"
                        }
                    });
                    window.open(currentlink, 'myWindow', 'status = 1, height = 600, width = 800, resizable = 0, scrollbars = 1');
                });
                jsf('#sf-catalogue-print-all').click(function(e) {
                    e.preventDefault();
                    Salefinder.callback.pushPageview('catalogue-printpage-all');
                    digitalData.event.push({
                        "eventInfo": {
                            "eventAction": "print",
                            "printOptions": "all pages"
                        }
                    });
                    window.open(jsf(this).attr('href'), 'myWindow', 'status = 1, height = 600, width = 800, resizable = 0, scrollbars = 1');
                });
                jsf('#sf-catalogue-print-container').hover(function() {
                    jsf('#sf-print-action').addClass('on');
                    jsf('#sf-print-action').addClass('rocket__nav__item--active');
                    jsf('#sf-catalogue-print-options').show();
                }, function() {
                    jsf('#sf-print-action').removeClass('on');
                    jsf('#sf-print-action').removeClass('rocket__nav__item--active');
                    jsf('#sf-catalogue-print-options').hide();
                });
                jsf('#sf-catalogue-print-container').focus(function() {
                    jsf('#sf-print-action').addClass('on');
                    jsf('#sf-print-action').addClass('rocket__nav__item--active');
                    jsf('#sf-catalogue-print-options').show();
                }, function() {
                    jsf('#sf-print-action').removeClass('on');
                    jsf('#sf-print-action').removeClass('rocket__nav__item--active');
                    jsf('#sf-catalogue-print-options').hide();
                });
                jsf('#sf-catalogue-print-container').focusin(function() {
                    jsf('#sf-print-action').addClass('on');
                    jsf('#sf-print-action').addClass('rocket__nav__item--active');
                    jsf('#sf-catalogue-print-options').show();
                });
                jsf('#sf-email-action.sf-catalogue-action').click(function(e) {
                    e.preventDefault();
                    Salefinder.callback.pushPageview('catalogue-email');
                    jsf.getJSON(jsf(this).data("href") + "?callback=?&saleGroup=" + sfCatalogue.saleGroup + "", function(data) {
                        if (data.content) {
                            jsf.fancybox({
                                content: data.content,
                                afterShow: function() {
                                    jsf('.emailform').focus();
                                    digitalData.event.push({
                                        "eventInfo": {
                                            "eventAction": "modal view",
                                            "model": "email to a friend"
                                        }
                                    });
                                    jsf("#frmEmail").validate({
                                        errorContainer: jsf('#errormessage'),
                                        errorLabelContainer: jsf("#errormessage"),
                                        wrapper: "div",
                                        submitHandler: function(form) {
                                            jsf.getJSON(sfCatalogue.embedHost + "/catalogue/cataloguesendget/" + saleId + "/?callback=?&" + jsf('#frmEmail').serialize(), function(data) {
                                                jsf.fancybox({
                                                    content: data,
                                                    beforeShow: function() {
                                                        jsf('#frmMain').addClass('sf-blur');
                                                    },
                                                    afterShow: function() {
                                                        digitalData.event.push({
                                                            "eventInfo": {
                                                                "eventAction": "email-sent"
                                                            }
                                                        });
                                                    },
                                                    afterClose: function() {
                                                        jsf('#frmMain').removeClass('sf-blur');
                                                    }
                                                });
                                            });
                                        }
                                    });
                                },
                                beforeShow: function() {
                                    jsf('#frmMain').addClass('sf-blur');
                                },
                                afterClose: function() {
                                    jsf('#frmMain').removeClass('sf-blur');
                                }
                            });
                        }
                    });
                });
                jsf('.flex-viewport').mouseover(function() {
                    jsf('.flex-next:not(.flex-disabled), .flex-prev:not(.flex-disabled)').css('opacity', '1');
                }).mouseleave(function() {
                    jsf('.flex-next, .flex-prev').css('opacity', '0.3');
                });
                jsf('.flex-next, .flex-prev').mouseover(function() {
                    jsf('.flex-next:not(.flex-disabled), .flex-prev:not(.flex-disabled)').css('opacity', '1');
                }).mouseleave(function() {
                    jsf('.flex-next, .flex-prev').css('opacity', '0.3');
                });
                jsf('.flex-direction-nav a').click(function() {
                    if (!jsf(this).hasClass('flex-disabled')) {
                        if (jsf(this).hasClass('flex-next')) {
                            var page = Salefinder.data.page + 1;
                            digitalData.event.push({
                                "eventInfo": {
                                    "eventAction": "page right",
                                    "selectedPage": page
                                }
                            })
                        } else {
                            var page = Salefinder.data.page - 1;
                            digitalData.event.push({
                                "eventInfo": {
                                    "eventAction": "page left",
                                    "selectedPage": page
                                }
                            })
                        }
                        digitalData.page.catalogue.pageNo = page;
                    }
                });
                jsf('#sf-bookmark-action').click(function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var pageno = parseInt(sfCatalogue.getHashValue("page"));
                    Salefinder.callback.pushPageview('catalogue-bookmark');
                    if (jsf('#sf-bookmark-action').hasClass('on')) {
                        sfCatalogue.removeFromBookmark(saleId, pageno, pages);
                        jsf('#sf-bookmark-action').removeClass('on');
                        jsf('#sf-catalogue .page' + pageno).find('.sf-bookmark-remove').hide();
                    } else {
                        sfCatalogue.addToBookmark(saleId, pageno, pages);
                        jsf('#sf-bookmark-action').addClass('on');
                        jsf('#sf-catalogue .page' + pageno).find('.sf-bookmark-remove').show();
                    }
                });
                if (Salefinder.callback && Salefinder.callback.afterLoadCatalogue) {
                    Salefinder.callback.afterLoadCatalogue(data);
                }
                sfCatalogue._setNavbarHandler();
                if (pages == 2) {
                    Salefinder.callback.setNavbar('catalogue2');
                } else {
                    Salefinder.callback.setNavbar('catalogue');
                }
                sfCatalogue._setSaleFooterHandler();
            } else {}
        });
    },
    pageScrollHandler: function(slider) {
        sfCatalogue.fillSlider(slider.currentSlide);
        topPrev = jsf('#catalogue-top-prev');
        topNext = jsf('#catalogue-top-next');
        if (slider.currentSlide === 0) {
            topPrev.addClass('flex-disabled');
            if (Salefinder.data.view == 'catalogue2') {
                var videoContainer = jsf('#sf-first-page-video');
                if (videoContainer.length > 0) {
                    var youtubeId = Salefinder.data.saleYoutubeId;
                    if (typeof (YT) == 'undefined' || typeof (YT.Player) == 'undefined') {
                        window.onYouTubeIframeAPIReady = function() {
                            sfCatalogue._playFirstPageVideo(youtubeId, slider);
                        }
                        ;
                    } else {
                        sfCatalogue._playFirstPageVideo(youtubeId, slider);
                    }
                }
            }
        } else {
            topPrev.removeClass('flex-disabled');
            topNext.removeClass('flex-disabled');
        }
        if (slider.currentSlide === slider.last) {
            topNext.addClass('flex-disabled');
        }
    },
    _playFirstPageVideo: function(youtubeId) {
        if (typeof (this.videos['sf-firstpage-video']) === 'undefined') {
            this.videos['sf-firstpage-video'] = new YT.Player('sf-firstpage-video',{
                playerVars: {
                    modestbranding: 1,
                    autoplay: 1,
                    rel: 0,
                    showinfo: 0,
                    enablejsapi: 1
                },
                width: 390,
                height: 220,
                videoId: youtubeId,
                events: {
                    'onStateChange': function(e) {
                        "function" == typeof onPlayerStateChange && onPlayerStateChange(e);
                        if (e.data == YT.PlayerState.PLAYING) {
                            sfCatalogue.pauseAllVideos(e.target);
                        }
                    }
                }
            });
            if (autoPlay) {
                this.videos['sf-firstpage-video'].firstplayed = true;
            }
        } else {
            if (Salefinder.data.page == 1 && typeof (this.videos['sf-firstpage-video'].firstplayed) === 'undefined') {
                if (Salefinder.options.autoPlaySaleVideo == false) {} else {
                    this.videos['sf-firstpage-video'].playVideo();
                }
                this.videos['sf-firstpage-video'].firstplayed = true;
            }
        }
    },
    scrollSliderTo: function(pageNo, pageType, slider) {
        if (pageNo) {
            sfCatalogue.setPageNo(pageType, pageNo);
        } else {
            pageNo = sfCatalogue.getHashValue('page');
            if (!pageNo) {
                sfCatalogue.setPageNo();
                return;
            } else {
                if (pageType == 'catalogue2') {
                    jsf('#ddlPage2').val(pageNo);
                } else {
                    jsf('#ddlPage').val(pageNo);
                }
            }
        }
        if (pageType == 'catalogue2') {
            if (pageNo % 2 == 0) {
                scrollNo = parseInt(pageNo / 2);
            } else {
                scrollNo = parseInt((parseInt(pageNo) - 1) / 2);
            }
        } else {
            scrollNo = parseInt(pageNo) - 1;
        }
        if (!slider) {
            slider = jsf('#sf-catalogue').data('flexslider');
        }
        if (slider.currentSlide != scrollNo) {
            slider.flexAnimate(scrollNo, false, true);
        }
    },
    setPageNo: function(pageType, pageNo, slideNo) {
        if (!pageNo) {
            if (slideNo) {
                if (pageType == 'catalogue2') {
                    pageNo = (parseInt(slideNo) * 2) + 1;
                } else {
                    pageNo = parseInt(slideNo) + 1;
                }
            } else {
                pageNo = 1;
            }
        }
        if (pageType == 'catalogue2') {
            jsf('#ddlPage2').val(pageNo);
        } else {
            jsf('#ddlPage').val(pageNo);
        }
        sfCatalogue.setHashValue('page', pageNo);
        return pageNo;
    },
    fillSlider: function(currentIdx) {
        var preload = 3;
        if (Salefinder.data.view == 'catalogue2') {
            currentIdx *= 2;
            preload *= 2;
            if (Salefinder.options.salePageFolder) {
                var image_folder = sfCatalogue.imageServer + Salefinder.options.salePageFolder;
            } else {
                var image_folder = sfCatalogue.imageServer + '/images/salepages/';
            }
        } else {
            var image_folder = sfCatalogue.imageServer + '/images/salepages/ipad/';
            jsf('.slides .page0').remove();
        }
        sfCatalogue.pauseAllVideos();
        var carouselList = this.carouselList;
        var slidesNum = this.carouselList.length;
        var startIdx = currentIdx - (preload / 2);
        if (startIdx < 0)
            startIdx = 0;
        var endIdx = startIdx + preload;
        if (endIdx > slidesNum)
            endIdx = slidesNum;
        jsf('#sf-catalogue .slide-content').each(function(index) {
            if (jsf(this).html().length == 0) {
                if (index >= startIdx && index < endIdx && !jsf(this).hasClass('objloaded')) {
                    var slide = carouselList[index];
                    if (slide.firstpage) {
                        jsf(this).html(slide.firstpage);
                        jsf(window).resize(function() {
                            if (jsf('#sf-help-overlay')) {
                                var bodyWidth = jsf('body').width();
                                var bodyHeight = jsf('body').height();
                                jsf('#sf-help-overlay').width(bodyWidth);
                                jsf('#sf-help-overlay').height(bodyHeight);
                                jsf('#sf-help-image-overlay').width(bodyWidth);
                                jsf('#sf-help-image-overlay').height(bodyHeight);
                            }
                        }).resize();
                    } else {
                        var filename = (typeof (slide.offerImageFile) != 'undefined' ? slide.offerImageFile : image_folder + slide.imagefile);
                        var content = '<div class="sf-page-image"><img src="' + filename + '" /></div>';
                        jsf.each(slide, function(i, item) {
                            content += sfCatalogue.getPageObject(item, i);
                        });
                        jsf(this).html(content);
                        jsf(this).addClass('objloaded');
                        if (Salefinder.callback && Salefinder.callback.afterLoadEachPage) {
                            Salefinder.callback.afterLoadEachPage(jsf(this), index);
                        }
                    }
                    jsf(this).find('.sf-maparea').click(function(e) {
                        e.stopPropagation();
                        e.preventDefault();
                        Salefinder.data.tooltipParent = jsf(this);
                        if (Salefinder.callback && Salefinder.callback.customMapClickHandler) {
                            Salefinder.callback.customMapClickHandler(jsf(this));
                        } else {
                            var itemId = jsf(this).data("itemid");
                            if (itemId != undefined) {
                                if (isNaN(parseInt(itemId))) {
                                    itemId = itemId.split('/').pop();
                                }
                                jsf.getJSON(sfCatalogue.embedHost + "/item/tooltip/" + itemId + "?callback=?&preview=" + sfCatalogue.preview + "&saleGroup=" + sfCatalogue.saleGroup + (Salefinder.data.includeSaleGroup ? '&includeSaleGroup=' + Salefinder.data.includeSaleGroup : '') + (Salefinder.options.tooltipExtraUrl ? Salefinder.options.tooltipExtraUrl : "") + "", function(data2) {
                                    jsf.fancybox({
                                        content: data2,
                                        afterShow: function() {
                                            sfCatalogue._setItemPopupHandler(itemId);
                                        },
                                        beforeShow: function() {
                                            jsf('#frmMain').addClass('sf-blur');
                                        },
                                        afterClose: function() {
                                            jsf('#frmMain').removeClass('sf-blur');
                                        }
                                    });
                                    Salefinder.callback.pushPageview('view-productbox');
                                });
                            } else {
                                var link = jsf(this).attr("href");
                                if (link != undefined && link.substring(0, 4) == 'http') {
                                    window.open(link, '_blank');
                                } else {
                                    window.location.href = link;
                                }
                            }
                        }
                    });
                    jsf(this).find('.sf-video-button').each(function() {
                        var autoPlay = parseInt(jsf(this).data("autoplay"));
                        var youtubeId = jsf(this).data("youtubeid");
                        var popup = jsf(this).data("popup");
                        if (autoPlay == 1) {
                            if (typeof (YT) == 'undefined' || typeof (YT.Player) == 'undefined') {
                                sfCatalogue.pendingVideos.push({
                                    el: jsf(this),
                                    youtubeId: youtubeId,
                                    popup: popup
                                });
                            } else {
                                sfCatalogue.doClip(jsf(this), youtubeId, popup);
                            }
                        } else {
                            jsf(this).click(function(e) {
                                e.stopPropagation();
                                sfCatalogue.doClip(jsf(this), youtubeId, popup);
                            });
                        }
                    });
                }
            }
        });
    },
    loadCatalogues: function() {
        var extraUrl = (parseInt(jsf.cookie('sf-locationId')) > 0 ? "&locationId=" + jsf.cookie('sf-locationId') : "");
        extraUrl += (Salefinder.options.cataloguesExtraUrl ? Salefinder.options.cataloguesExtraUrl : "");
        this.processUrl = sfCatalogue.embedHost + "/catalogues/view/" + Salefinder.data.retailerId + "/?order=oldestfirst&saleGroup=" + sfCatalogue.saleGroup + (Salefinder.data.includeSaleGroup ? '&includeSaleGroup=' + Salefinder.data.includeSaleGroup : '') + extraUrl + "";
        if (Salefinder.callback && Salefinder.callback.beforeLoadCatalogues) {
            Salefinder.callback.beforeLoadCatalogues();
        }
        jsf.getJSON(this.processUrl + "&callback=?", function(data) {
            if (data.redirect) {
                window.location.replace(window.location.pathname + window.location.search + data.redirect);
            } else {
                if (data.content) {
                    Salefinder.options.rootDiv.html(data.content);
                    if (Salefinder.callback && Salefinder.callback.replaceBreadCrumb) {
                        Salefinder.callback.replaceBreadCrumb(data.breadcrumb);
                    }
                    if (Salefinder.callback && Salefinder.callback.afterLoadCatalogues) {
                        Salefinder.callback.afterLoadCatalogues();
                    }
                    jsf.cookie('previousPage', window.location.hash);
                } else {}
            }
        });
    },
    loadLocation: function() {
        if (Salefinder.callback && Salefinder.callback.beforeLoadLocation) {
            Salefinder.callback.beforeLoadLocation();
        }
        var url = sfCatalogue.embedHost + "/location/prompt/" + Salefinder.data.retailerId + "/?format=json";
        jsf.getJSON(url + "&callback=?", function(data) {
            if (data.content) {
                jsf(Salefinder.options.contentDiv).html(data.content);
                if (Salefinder.callback && Salefinder.callback.replaceBreadCrumb) {
                    Salefinder.callback.replaceBreadCrumb(data.breadcrumb);
                }
                jsf('#sf-location-search').autocomplete({
                    serviceUrl: sfCatalogue.embedHost + "/location/search/" + Salefinder.data.retailerId + "/?sensitivity=" + Salefinder.options.sensitivity,
                    dataType: 'jsonp',
                    minChars: 3,
                    deferRequestBy: 200,
                    onSelect: function(suggestion) {
                        jsf.cookie('sf-locationId', suggestion.data);
                        jsf.cookie('sf-locationName', suggestion.value);
                        window.location = window.location.href.split('#')[0];
                    },
                    onSearchStart: function() {
                        jsf('#sf-locationselect-container img').show();
                    },
                    onSearchComplete: function() {
                        jsf('#sf-locationselect-container img').hide();
                    }
                });
                if (Salefinder.callback && Salefinder.callback.afterLoadLocation) {
                    Salefinder.callback.afterLoadLocation();
                }
            }
        });
    },
    loadProduct: function(itemId, saleId) {
        var url = sfCatalogue.embedHost + "/item/view/" + itemId + "/?format=json&preview=" + this.preview + "&saleGroup=" + sfCatalogue.saleGroup + (Salefinder.data.includeSaleGroup ? '&includeSaleGroup=' + Salefinder.data.includeSaleGroup : '') + "&locationId=" + jsf.cookie('sf-locationId') + (Salefinder.options.itemExtraUrl ? Salefinder.options.itemExtraUrl : '');
        jsf.getJSON(url + "&callback=?", function(data) {
            if (data.content) {
                jsf(Salefinder.options.contentDiv).html(data.content);
                if (Salefinder.callback && Salefinder.callback.replaceBreadCrumb) {
                    Salefinder.callback.replaceBreadCrumb(data.breadcrumb.lastTitle, data.breadcrumb);
                }
                if (Salefinder.callback && Salefinder.callback.afterLoadProduct) {
                    Salefinder.callback.afterLoadProduct();
                }
                jsf('#sf-item-page-image').click(function(e) {
                    e.preventDefault();
                    jsf.fancybox({
                        content: jsf('#sf-item-page-popup').html(),
                        type: 'image',
                        aspectRatio: true,
                        autoCenter: true,
                        scrolling: 'no',
                        beforeShow: function() {
                            jsf('#frmMain').addClass('sf-blur');
                        },
                        afterClose: function() {
                            jsf('#frmMain').removeClass('sf-blur');
                        }
                    });
                });
                sfCatalogue._setItemPopupHandler(itemId);
                if (jsf.cookie('previousPage')) {
                    jsf('.sf-backcatalogue').attr('href', jsf.cookie('previousPage'));
                }
                sfCatalogue.areaName = data.areaName;
            }
        });
    },
    loadBookmarks: function(saleId) {
        var size = 180;
        var bookmarks = jsf.cookie('sf-bookmark-' + sfCatalogue.saleGroup);
        if (bookmarks == undefined) {
            bookmarks = '';
        }
        var url = sfCatalogue.embedHost + "/catalogue/bookmarks/" + saleId + "/?format=json&ids=" + encodeURIComponent(bookmarks) + "&saleGroup=" + sfCatalogue.saleGroup + (Salefinder.data.includeSaleGroup ? '&includeSaleGroup=' + Salefinder.data.includeSaleGroup : '') + "&locationId=" + jsf.cookie('sf-locationId') + "&size=" + size + "&preview=" + this.preview + "";
        if (Salefinder.options.hideIntroPage == true) {
            url += '&hideIntroPage=1';
        }
        jsf.getJSON(url + "&callback=?", function(data) {
            if (data.content) {
                jsf(Salefinder.options.contentDiv).html(data.content);
                if (Salefinder.callback && Salefinder.callback.replaceBreadCrumb) {
                    Salefinder.callback.replaceBreadCrumb(data.breadcrumb);
                }
                var bmRemoveBtns = jsf('.sf-bookmark-remove-action');
                bmRemoveBtns.hover(function() {
                    jsf(this).find('.sf-bookmark-remove-icon').addClass('on');
                }, function() {
                    jsf(this).find('.sf-bookmark-remove-icon').removeClass('on');
                });
                bmRemoveBtns.click(function() {
                    var params = jsf(this).attr("rel").split("_");
                    var parentUl = jsf(this).closest("ul");
                    sfCatalogue.removeFromBookmark(params[0], params[1], params[2]);
                    jsf(this).closest("li").fadeOut(function() {
                        if (parentUl.find("li:visible").length == 0) {
                            jsf('#notfound').show();
                        }
                    });
                });
                if (jsf.cookie('previousPage')) {
                    jsf('.sf-backcatalogue').attr("href", jsf.cookie('previousPage'));
                } else {
                    jsf('.sf-backcatalogue').attr("href", "#view=catalogue2&saleId=" + saleId + "areaName=" + sfCatalogue.areaName);
                }
            } else {}
        });
    },
    loadThumbs: function(saleId) {
        if (Salefinder.callback && Salefinder.callback.beforeLoadThumbs) {
            Salefinder.callback.beforeLoadThumbs();
        }
        var url = sfCatalogue.embedHost + "/catalogue/thumbs/" + saleId + "/?format=json&pagetype=pagethumb&retailerId=" + Salefinder.data.retailerId + "&saleGroup=" + sfCatalogue.saleGroup + (Salefinder.data.includeSaleGroup ? '&includeSaleGroup=' + Salefinder.data.includeSaleGroup : '') + "&locationId=" + jsf.cookie('sf-locationId') + "&rpp=999&size=" + 180 + "&preview=" + this.preview + "";
        var pageno = parseInt(this.getHashValue("page"));
        if (pageno > 1) {
            url = url + "&page=" + pageno;
        }
        jsf.getJSON(url + "&callback=?", function(data) {
            if (data.redirect && data.redirect == true) {
                if (Salefinder.callback && Salefinder.callback.emptyRedirect) {
                    Salefinder.callback.emptyRedirect();
                    return;
                }
            }
            if (data.content) {
                jsf(Salefinder.options.contentDiv).html(data.content);
                sfCatalogue._setSaleData(data);
                if (Salefinder.callback && Salefinder.callback.replaceBreadCrumb) {
                    Salefinder.callback.replaceBreadCrumb(data.breadcrumb);
                }
                if (Salefinder.callback && Salefinder.callback.afterLoadThumbs) {
                    Salefinder.callback.afterLoadThumbs();
                }
                sfCatalogue._setNavbarHandler();
                sfCatalogue._setSaleFooterHandler();
                Salefinder.data.saleName = jsf('<div>').html(data.breadcrumb).text();
                Salefinder.callback.pushPageview('pagethumb');
            }
        });
    },
    loadList: function(saleId) {
        if (Salefinder.callback && Salefinder.callback.beforeLoadList) {
            Salefinder.callback.beforeLoadList();
        }
        if (Salefinder.callback && Salefinder.callback.checkSaleMessage) {
            Salefinder.callback.checkSaleMessage();
        }
        var url = sfCatalogue.embedHost + "/productlist/view/" + saleId + "/?preview=" + this.preview + "&saleGroup=" + sfCatalogue.saleGroup + (Salefinder.data.includeSaleGroup ? '&includeSaleGroup=' + Salefinder.data.includeSaleGroup : '') + "";
        this.loadListUrl(url);
        if (Salefinder.callback && Salefinder.callback.afterLoadList) {
            Salefinder.callback.afterLoadList();
        }
        Salefinder.callback.pushPageview('product-list');
    },
    loadShortlist: function(saleId) {
        if (Salefinder.callback && Salefinder.callback.beforeLoadShortlist) {
            Salefinder.callback.beforeLoadShortlist();
        }
        var itemlist = jsf.cookie('sf-shoppinglist');
        if (itemlist == undefined) {
            itemlist = '';
        }
        var url = sfCatalogue.embedHost + "/productlist/shortlist/" + saleId + "/?format=json&preview=" + this.preview + "&saleGroup=" + sfCatalogue.saleGroup + (Salefinder.data.includeSaleGroup ? '&includeSaleGroup=' + Salefinder.data.includeSaleGroup : '') + "&ids=" + encodeURIComponent(itemlist) + "";
        this.loadListUrl(url);
        Salefinder.callback.pushPageview('shopping-list');
    },
    loadShoppingList: function(saleId) {
        if (Salefinder.callback && Salefinder.callback.beforeLoadShoppingList) {
            Salefinder.callback.beforeLoadShoppingList();
        }
        var itemlist = jsf.cookie('sf-shoppinglist');
        if (itemlist == undefined) {
            itemlist = '';
        }
        var url = sfCatalogue.embedHost + "/productlist/shoppinglist/" + saleId + "/?format=json&preview=" + this.preview + "&saleGroup=" + sfCatalogue.saleGroup + (Salefinder.data.includeSaleGroup ? '&includeSaleGroup=' + Salefinder.data.includeSaleGroup : '') + "&ids=" + encodeURIComponent(itemlist) + "";
        this.loadListUrl(url);
        Salefinder.callback.pushPageview('shopping-list');
    },
    loadCart: function(saleId) {
        var itemlist = jsf.cookie('sf-cart');
        if (typeof (itemlist) == 'undefined' || itemlist == null || itemlist == "null" || itemlist.length == 0) {
            itemlist = '';
        } else {
            if (itemlist.length > 0) {
                var cart = jsf.parseJSON(itemlist);
                var itemlist = [];
                for (var j = 0; j < cart.length; j++) {
                    var item = {
                        'itemId': cart[j].itemId,
                        'SKU': cart[j].SKU,
                        'quantity': cart[j].quantity
                    };
                    itemlist.push(item);
                }
                itemlist = JSON.stringify(itemlist);
            } else {
                itemlist = '';
            }
        }
        var url = sfCatalogue.embedHost + "/productlist/cart/" + saleId + "/?format=json&preview=" + this.preview + "&saleGroup=" + sfCatalogue.saleGroup + (Salefinder.data.includeSaleGroup ? '&includeSaleGroup=' + Salefinder.data.includeSaleGroup : '') + "&ids=" + encodeURIComponent(itemlist) + "";
        this.loadListUrl(url);
    },
    loadSearch: function(keyword, saleId) {
        console.log('load search');
        if (Salefinder.callback && Salefinder.callback.beforeLoadSearch) {
            Salefinder.callback.beforeLoadSearch();
        }
        if (saleId == undefined) {
            var retailerId = Salefinder.data.retailerId;
        } else {
            var retailerId = 0;
        }
        if (Salefinder.callback && Salefinder.callback.customSearch) {
            Salefinder.callback.customSearch(keyword, saleId);
        } else {
            var url = sfCatalogue.embedHost + "/productlist/search/" + saleId + "/?preview=" + this.preview + (Salefinder.options.searchExtraUrl ? Salefinder.options.searchExtraUrl : '') + (retailerId > 0 ? "&retailerId=" + retailerId : "") + "&saleGroup=" + sfCatalogue.saleGroup + "&keyword=" + encodeURIComponent(keyword);
            this.loadListUrl(url);
        }
        Salefinder.callback.pushPageview('search', keyword);
    },
    loadCategory: function(categoryId, saleId) {
        if (Salefinder.callback && Salefinder.callback.beforeLoadCategory) {
            Salefinder.callback.beforeLoadCategory();
        }
        if (saleId == undefined) {
            var retailerId = Salefinder.data.retailerId;
        } else {
            var retailerId = 0;
        }
        var url = sfCatalogue.embedHost + "/productlist/category/" + saleId + "/?preview=" + this.preview + (retailerId > 0 ? "&retailerId=" + retailerId : "") + "&saleGroup=" + sfCatalogue.saleGroup + (Salefinder.data.includeSaleGroup ? '&includeSaleGroup=' + Salefinder.data.includeSaleGroup : '') + "&categoryId=" + encodeURIComponent(categoryId);
        this.loadListUrl(url);
        Salefinder.callback.pushPageview('categories');
    },
    loadListUrl: function(url) {
        url = url + "&locationId=" + jsf.cookie('sf-locationId');
        var sort = this.getHashValue("sort");
        if (sort != undefined && sort.length > 0) {
            url = url + "&sort=" + sort;
        }
        if (Salefinder.options && Salefinder.options.rowsPerPage) {
            url = url + "&rows_per_page=" + Salefinder.options.rowsPerPage;
        }
        var pageno = parseInt(this.getHashValue("page"));
        if (pageno > 1) {
            url = url + "&page=" + pageno;
        }
        if (Salefinder.callback && Salefinder.callback.beforeLoadListUrl) {
            Salefinder.callback.beforeLoadListUrl();
        }
        jsf.getJSON(url + "&callback=?", function(data) {
            var view = sfCatalogue.getHashValue("view");
            if (data.content) {
                if (data.redirect && data.redirect == true) {
                    if (Salefinder.callback && Salefinder.callback.emptyRedirect) {
                        Salefinder.callback.emptyRedirect();
                        return;
                    }
                }
                sfCatalogue._setSaleData(data);
                if (jsf(Salefinder.options.contentDiv).length > 0) {
                    jsf(Salefinder.options.contentDiv).html(data.content);
                    jsf(Salefinder.options.contentDiv).focus();
                } else {
                    jsf(Salefinder.options.rootDiv).html(data.content);
                    jsf(Salefinder.options.contentDiv).focus();
                }
                if (Salefinder.callback && Salefinder.callback.replaceBreadCrumb) {
                    Salefinder.callback.replaceBreadCrumb(data.breadcrumb);
                }
                var position = jsf('#sf-root').offset();
                if (position) {
                    var top = position.top;
                } else {
                    var top = 0;
                }
                jsf('#sf-navbar-sort').val(sort);
                this.areaName = data.areaName;
                jsf('.ajax_item').click(function(e) {
                    e.preventDefault();
                    jsf.getJSON(jsf(this).attr("href") + "?callback=?&preview=" + preview + "", function(data) {
                        if (data) {
                            jsf.fancybox({
                                scrolling: 'no',
                                content: data,
                                beforeShow: function() {
                                    jsf('#frmMain').addClass('sf-blur');
                                },
                                afterClose: function() {
                                    jsf('#frmMain').removeClass('sf-blur');
                                }
                            });
                        } else {}
                    });
                });
                jsf('.sf-shortlist-action').each(function() {
                    if (sfCatalogue.inShortList(jsf(this).attr("rel"))) {
                        jsf(this).addClass('on');
                    }
                });
                jsf.cookie('previousPage', window.location.hash);
                jsf('.product-terms').fancybox();
                sfCatalogue._setNavbarHandler();
                sfCatalogue._setSaleFooterHandler();
                if (Salefinder.callback && Salefinder.callback.afterLoadListUrl) {
                    Salefinder.callback.afterLoadListUrl(url);
                }
            } else {}
        });
    },
    addToShortlist: function(itemId, quantity, SKU, overwriteQty, itemPrice) {
        var itemlist = jsf.cookie('sf-shoppinglist');
        var exists = false;
        var item = {
            'itemId': itemId,
            'SKU': SKU,
            'quantity': quantity,
            'itemPrice': itemPrice
        };
        if (itemlist == undefined || itemlist.length == 0) {
            var shortlist = [];
        } else {
            var shortlist = jsf.parseJSON(itemlist);
            for (var j = 0; j < shortlist.length; j++) {
                if (shortlist[j].SKU == SKU && SKU.length > 0) {
                    if (overwriteQty) {
                        shortlist[j].quantity = parseInt(quantity);
                    } else {
                        shortlist[j].quantity = parseInt(shortlist[j].quantity) + parseInt(quantity);
                    }
                    exists = true;
                }
            }
        }
        if (!exists) {
            shortlist.push(item);
        }
        jsf.cookie('sf-shoppinglist', JSON.stringify(shortlist), {
            expires: Salefinder.data.cookieExpireTime
        });
    },
    getPageObject: function(item, index) {
        var returnHtml = '';
        if (typeof (item) == 'object') {
            if (item.href && item.href.length > 0) {
                var areaHref = item.href;
            } else if (item.extraURL && item.extraURL.length > 0) {
                var areaHref = item.extraURL;
            } else {
                var areaHref = item.itemURL;
            }
            var videoHtml = '';
            if (item.youtubeId && item.youtubeId.length > 0) {
                videoHtml = '<div class="sf-video-container"><div class="sf-video-button" data-youtubeid="' + item.youtubeId + '" data-popup="' + item.popup + '" data-autoplay="' + item.autoPlay + '"></div></div>';
            }
            if (areaHref) {
                if (item.itemId && item.itemId > 0) {
                    returnHtml += '<a class="sf-maparea" href="' + areaHref + '" title="' + (item.itemName ? item.itemName : '') + '" data-mapindex="' + index + '" style="z-index:' + (888 - index) + ';left:' + item.x + '%;top:' + item.y + '%;width:' + item.width + '%;height:' + item.height + '%"' + (item.itemId ? ' data-itemid="' + item.itemId + '" ' : '') + (item.SKU ? ' data-sku="' + item.SKU + '" ' : '') + (item.systemId ? ' data-systemid="' + item.systemId + '" ' : '') + (item.extraId ? ' data-extraid="' + item.extraId + '" ' : '') + (item.extra2Id ? ' data-extra2id="' + item.extra2Id + '" ' : '') + '></a>';
                } else {
                    returnHtml += '<a class="sf-maparea" data-mapindex="' + index + '" style="z-index:' + (888 - index) + ';left:' + item.x + '%;top:' + item.y + '%;width:' + item.width + '%;height:' + item.height + '%" title="' + (item.itemText ? item.itemText : '') + '" target="_blank" href="' + areaHref + '"></a>';
                }
            }
            if (videoHtml && videoHtml.length > 0) {
                returnHtml += '<div id="ytplayer' + sfCatalogue.videoIndex + '" class="sf-video" style="top:' + item.y + '%;left:' + item.x + '%;width:' + item.width + '%;height:' + item.height + '%">' + videoHtml + '</div>';
                sfCatalogue.videoIndex++;
            }
        }
        return returnHtml;
    },
    removeFromShortlist: function(itemId, SKU) {
        var itemlist = jsf.cookie('sf-shoppinglist');
        var replaceshortlist = [];
        if (itemlist != undefined && itemlist.length > 0) {
            var shortlist = jsf.parseJSON(itemlist);
            for (var j = 0; j < shortlist.length; j++) {
                var sitem = shortlist[j];
                if (sitem.itemId != itemId) {
                    replaceshortlist.push(sitem);
                } else {
                    if (SKU != undefined && SKU.length > 0) {
                        if (SKU != sitem.SKU) {
                            replaceshortlist.push(sitem);
                        }
                    }
                }
            }
        }
        jsf.cookie('sf-shoppinglist', JSON.stringify(replaceshortlist), {
            expires: Salefinder.data.cookieExpireTime
        });
        if (Salefinder.callback && Salefinder.callback.afterRemoveFromShortlist) {
            Salefinder.callback.afterRemoveFromShortlist();
        }
    },
    inShortList: function(itemId) {
        var itemlist = jsf.cookie('sf-shoppinglist');
        if (itemlist) {
            var shortlist = jsf.parseJSON(itemlist);
            for (var j = 0; j < shortlist.length; j++) {
                var item = shortlist[j];
                if (item.itemId == itemId) {
                    return true;
                }
            }
        }
        return false;
    },
    addToBookmark: function(saleId, pageno, pagetype) {
        var bmcookie = jsf.cookie('sf-bookmark-' + sfCatalogue.saleGroup);
        if (bmcookie == undefined || bmcookie.length == 0) {
            var bmobj = [];
        } else {
            var bmobj = jsf.parseJSON(bmcookie);
        }
        var bm = {};
        bm.saleId = saleId;
        bm.pageno = pageno;
        bm.pagetype = pagetype;
        bmobj.push(bm);
        jsf.cookie('sf-bookmark-' + sfCatalogue.saleGroup, JSON.stringify(bmobj));
        jsf('#sf-bookmark-view').show();
    },
    removeFromBookmark: function(saleId, pageno, pagetype) {
        var bmreplace = [];
        var bmcookie = jsf.cookie('sf-bookmark-' + sfCatalogue.saleGroup);
        if (bmcookie != undefined && bmcookie.length > 0) {
            var bmobj = jsf.parseJSON(bmcookie);
            for (var j = 0; j < bmobj.length; j++) {
                var bookmark = bmobj[j];
                if (bookmark.saleId == saleId && bookmark.pageno == pageno && bookmark.pagetype == pagetype) {} else {
                    bmreplace.push(bookmark);
                }
            }
        }
        jsf.cookie('sf-bookmark-' + sfCatalogue.saleGroup, JSON.stringify(bmreplace));
    },
    playClip: function(youtubeId) {
        jsf.fancybox({
            'padding': 0,
            'autoScale': false,
            'transitionIn': 'none',
            'transitionOut': 'none',
            'width': 680,
            'height': 383,
            'href': '//www.youtube.com/v/' + youtubeId + '?autoplay=1&rel=0&modestbranding=1&showinfo=0&enablejsapi=1',
            'type': 'swf',
            'swf': {
                'wmode': 'transparent',
                'allowfullscreen': 'true'
            },
            beforeShow: function() {
                jsf('#frmMain').addClass('sf-blur');
            },
            afterClose: function() {
                jsf('#frmMain').removeClass('sf-blur');
            }
        });
        Salefinder.callback.pushPageview('play-video');
    },
    doClip: function(el, youtubeId, popup) {
        sfCatalogue.pauseAllVideos();
        if (popup == 1) {
            jsf.fancybox({
                'padding': 0,
                'autoScale': false,
                'transitionIn': 'none',
                'transitionOut': 'none',
                'width': 680,
                'height': 383,
                'href': '//www.youtube.com/embed/' + youtubeId + '?autoplay=1&rel=0&modestbranding=1&showinfo=0&enablejsapi=1',
                'type': 'iframe',
                beforeShow: function() {
                    jsf('#frmMain').addClass('sf-blur');
                    var id = jsf.fancybox.inner.find('iframe').attr('id');
                    var player = new YT.Player(id,{
                        events: {
                            'onStateChange': function(e) {
                                console.log(e);
                                "function" == typeof onPlayerStateChange && onPlayerStateChange(e);
                            }
                        }
                    });
                },
                afterClose: function() {
                    jsf('#frmMain').removeClass('sf-blur');
                }
            });
        } else {
            var ytel = el.closest(".sf-video");
            var id = ytel.attr("id");
            this.videos[id] = new YT.Player(id,{
                playerVars: {
                    modestbranding: 1,
                    autoplay: 1,
                    rel: 0,
                    showinfo: 0,
                    enablejsapi: 1
                },
                width: el.width(),
                height: el.height(),
                videoId: youtubeId,
                events: {
                    'onStateChange': function(e) {
                        "function" == typeof onPlayerStateChange && onPlayerStateChange(e);
                        if (e.data == YT.PlayerState.PLAYING) {
                            sfCatalogue.pauseAllVideos(e.target);
                        }
                    }
                }
            });
        }
    },
    showSubcategory: function() {
        var parentWidth = jsf('#sf-navcategories').width();
        jsf('.sf-navsubcategories').css("left", (parentWidth - 1) + "px");
        jsf('#sf-navcategory-button').addClass("on");
        jsf('#sf-navcategories').fadeIn("fast");
    },
    hideSubcategory: function() {
        if (sfCatalogue.getHashValue("view") != 'category') {
            jsf('#sf-navcategory-button').removeClass("on");
            jsf('.sf-navsubcategories').hide();
        }
        jsf('#sf-navcategories').hide()
    },
    pauseAllVideos: function(target) {
        var videos = sfCatalogue.videos;
        for (var key in videos) {
            try {
                if (videos[key] !== undefined && videos[key] != target)
                    videos[key].pauseVideo();
            } catch (err) {}
        }
    },
    checkForItemId: function() {
        var itemId = sfCatalogue.getHashValue("itemId");
        var currentView = sfCatalogue.getHashValue("view");
        if (itemId) {
            switch (currentView) {
                case 'catalogue2':
                case 'catalogue':
                    var currentPage = 1;
                    jsf.each(sfCatalogue.carouselList, function(index, page) {
                        jsf.each(page, function(i, itemMap) {
                            if (itemMap.itemId == itemId) {
                                currentPage = index;
                            }
                        });
                    });
                    var slider = jsf('#sf-catalogue').data('flexslider');
                    var item = jsf('.sf-maparea[data-itemid="' + itemId + '"]');
                    if (typeof (slider) !== 'undefined' && item.length > 0) {
                        if (currentPage % 2 == 0 && currentView == 'catalogue2') {
                            var scrollTo = parseInt(currentPage) + 1;
                        } else {
                            var scrollTo = currentPage;
                        }
                        sfCatalogue.scrollSliderTo(scrollTo, currentView, slider);
                        jsf('.sf-maparea[data-itemid="' + itemId + '"]')[0].click();
                    } else {
                        setTimeout(sfCatalogue.checkForItemId, 200);
                    }
                    break;
                case 'category':
                    jsf('.sf-viewmore[data-itemid="' + itemId + '"]')[0].click();
                    console.log(jsf('.sf-viewmore[data-itemid="' + itemId + '"]'));
                    break;
            }
        }
    },
    _setItemPopupHandler: function(itemId) {
        if (Salefinder.callback && Salefinder.callback.afterLoadProductPopup) {
            Salefinder.callback.afterLoadProductPopup();
        }
        jsf('#sf-item-tooltip-image').click(function(e) {
            e.preventDefault();
            jsf.fancybox({
                content: jsf('#sf-item-tooltip-popup').html(),
                aspectRatio: true,
                closeBtn: false,
                autoCenter: true,
                afterShow: function() {
                    jsf('#backtopopup').click(function(e) {
                        e.preventDefault();
                        jsf.getJSON(jsf(this).attr("href") + "?callback=?&preview=" + sfCatalogue.preview + (Salefinder.options.tooltipExtraUrl ? Salefinder.options.tooltipExtraUrl : '') + "&saleGroup=" + sfCatalogue.saleGroup + (Salefinder.data.includeSaleGroup ? '&includeSaleGroup=' + Salefinder.data.includeSaleGroup : '') + "", function(data) {
                            if (data) {
                                jsf.fancybox({
                                    content: data,
                                    afterShow: function() {
                                        sfCatalogue._setItemPopupHandler(itemId);
                                    },
                                    beforeShow: function() {
                                        jsf('#frmMain').addClass('sf-blur');
                                    },
                                    afterClose: function() {
                                        Salefinder.data.tooltipParent.focus();
                                        jsf('#frmMain').removeClass('sf-blur');
                                    }
                                });
                            }
                        });
                    });
                },
                beforeShow: function() {
                    jsf('#frmMain').addClass('sf-blur');
                },
                afterClose: function() {
                    jsf('#frmMain').removeClass('sf-blur');
                }
            });
        });
        jsf('#sf-item-tooltip-details-container h1 a, .sf-more-info-link').click(function() {
            jsf.fancybox.close();
        });
        jsf('#sf-email-action.sf-item-action').click(function(e) {
            e.preventDefault();
            var linkArray = jsf(this).attr("href").split('/');
            jsf.getJSON(jsf(this).attr("href") + "?callback=?", function(data) {
                if (data.content) {
                    jsf.fancybox({
                        content: data.content,
                        afterShow: function() {
                            jsf("#frmEmail").validate({
                                errorContainer: jsf('#errormessage'),
                                errorLabelContainer: jsf("#errormessage"),
                                wrapper: "div",
                                submitHandler: function(form) {
                                    var itemId = linkArray.pop();
                                    if (itemId.length == 0)
                                        itemId = linkArray.pop();
                                    digitalData.event.push({
                                        "eventInfo": {
                                            "eventAction": "modal view",
                                            "model": "email to a friend"
                                        }
                                    });
                                    jsf.getJSON(sfCatalogue.embedHost + "/item/itemsendget/" + itemId + "/?callback=?&" + jsf('#frmEmail').serialize(), function(data) {
                                        jsf.fancybox(data);
                                        digitalData.event.push({
                                            "eventInfo": {
                                                "eventAction": "email-sent"
                                            }
                                        });
                                    });
                                }
                            });
                            jsf('.emailform').focus();
                        },
                        beforeShow: function() {
                            jsf('#frmMain').addClass('sf-blur');
                        },
                        afterClose: function() {
                            jsf('#frmMain').removeClass('sf-blur');
                        }
                    });
                    Salefinder.callback.pushPageview('email-product');
                }
            });
        });
        jsf('#sf-shortlist-action.sf-item-action').click(function(e) {
            e.preventDefault();
            if (jsf(this).hasClass('on')) {
                sfCatalogue.removeFromShortlist(jsf(this).attr("rel"));
                jsf(this).removeClass('on');
            } else {
                sfCatalogue.addToShortlist(jsf(this).attr("rel"));
                Salefinder.callback.pushPageview('shopping-list');
                jsf(this).addClass('on');
            }
        });
        jsf('#sf-print-action.sf-item-action').click(function(e) {
            e.preventDefault();
            Salefinder.callback.pushPageview('print-product');
            window.open(jsf(this).attr('href'), 'myWindow', 'status = 1, height = 600, width = 800, resizable = 0, scrollbars = 1');
        });
    },
    _setSaleFooterHandler: function() {
        this.saleTermsLightbox();
        jsf('#sf-catalogue-download').click(function(e) {
            Salefinder.callback.pushPageview('pdf-download');
        });
    },
    _setNavbarHandler: function() {
        var view = this.getHashValue("view");
        jsf('#sf-salenavbar>li>a').removeClass('on');
        jsf('#sf-salenavbar>li').removeClass('rocket__navbar__item--active');
        switch (view) {
            case 'pagethumb':
            case 'catalogue2':
            case 'catalogue':
                jsf('#sf-navpages').parent().addClass('rocket__navbar__item--active');
                jsf('#sf-keyword').val('');
                break;
            case 'category':
            case 'list':
                jsf('#sf-navlist').parent().addClass('rocket__navbar__item--active');
                jsf('#sf-keyword').val('');
                break;
        }
        if (jsf.cookie('sf-locationId') != null) {
            jsf('#sf-location-text').html(jsf.cookie('sf-locationName'));
        }
        if (view == 'shoppinglist') {
            jsf('#sf-printshortlist-action').click(function(e) {
                e.preventDefault();
                var itemlist = jsf.cookie('sf-shoppinglist');
                if (itemlist == undefined) {
                    itemlist = '';
                }
                var currentlink = sfCatalogue.embedHost + "/productlist/shoppinglistprint/" + Salefinder.data.saleId + "/?format=json&ids=" + encodeURIComponent(itemlist) + "";
                window.open(currentlink, 'myWindow', 'status = 1, height = 600, width = 800, resizable = 0, scrollbars = 1');
            });
            jsf('#sf-emailshortlist-action').click(function(e) {
                e.preventDefault();
                Salefinder.callback.pushPageview('shortlist-email');
                var currentlink = sfCatalogue.embedHost + "/productlist/shoppinglistemail/" + Salefinder.data.saleId + "/";
                jsf.getJSON(currentlink + "?callback=?", function(data) {
                    if (data.content) {
                        jsf.fancybox({
                            scrolling: 'no',
                            content: data.content,
                            afterShow: function() {
                                jsf('.emailform').focus();
                                jsf("#frmEmail").validate({
                                    errorContainer: jsf('#errormessage'),
                                    errorLabelContainer: jsf("#errormessage"),
                                    wrapper: "div",
                                    submitHandler: function(form) {
                                        var itemlist = jsf.cookie('sf-shoppinglist');
                                        jsf.getJSON(sfCatalogue.embedHost + "/productlist/shoppinglistsend/" + Salefinder.data.saleId + "/?callback=?&ids=" + encodeURIComponent(itemlist) + "&" + jsf('#frmEmail').serialize(), function(data) {
                                            if (data.result) {
                                                jsf.fancybox('<div id="message">' + data.result + '</div>');
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            });
            jsf('#sf-printshortlist-action').hover(function() {
                $(this).addClass('on');
                $('#sf-printshortlist-ico').addClass('on');
            }, function() {
                jsf(this).removeClass('on');
                jsf('#sf-printshortlist-ico').removeClass('on');
            });
        }
        if (jsf.cookie('sf-bookmark-' + sfCatalogue.saleGroup)) {
            jsf('#sf-bookmark-view').show();
        }
        if (Salefinder.callback && Salefinder.callback.extraNavbarHandler) {
            Salefinder.callback.extraNavbarHandler();
        }
        if (jsf('#sf-navcategories').width() > 899) {
            jsf('#sf-category-more').show();
        } else {
            jsf('#sf-category-more').hide();
        }
        if (!jsf('#sf-salenavbar').hasClass('sf-loaded')) {
            jsf('#sf-navcategory-button').focusin(function() {
                jsf('#sf-navcategories').show();
            });
            jsf('#sf-navcategory-button, #sf-print-action').click(function(e) {
                e.preventDefault();
            });
            jsf('.sf-navcategory').hover(function() {
                jsf(this).find('.sf-navsubcategories').fadeIn();
            }, function() {
                jsf(this).find('.sf-navsubcategories').fadeOut();
            });
            jsf('#sf-navsearch').click(function(e) {
                e.preventDefault();
                var keyword = jsf('#sf-keyword').val();
                if (keyword.length > 0) {
                    var saleId = sfCatalogue.getHashValue('saleId');
                    window.location.href = '#view=search&saleId=' + saleId + '&keyword=' + jsf('#sf-keyword').val();
                } else {
                    jsf('#sf-keyword').focus();
                }
            });
            jsf("#sf-keyword").keydown(function(e) {
                if (e.keyCode == 13) {
                    jsf('#sf-navsearch').click();
                    e.preventDefault();
                }
            });
            if (view == 'category' || view == 'search' || view == 'list') {
                jsf('#sf-navbar-sort').change(function() {
                    switch (jsf(this).val()) {
                        case 'lowestPrice':
                            var sortName = 'Lowest Price';
                            break;
                        case 'highestPrice':
                            var sortName = 'Highest Price';
                            break;
                        default:
                            var sortName = 'item Name';
                            break;
                    }
                    digitalData.event.push({
                        "eventInfo": {
                            "eventAction": "sort-by",
                            "sortBy": sortName
                        }
                    });
                    sfCatalogue.setHashValue('sort', jsf(this).val());
                });
            }
            if (view == 'catalogue' || view == 'catalogue2') {
                if (Salefinder.data.firstloadNavbar) {
                    jsf('#catalogue-top-prev').click(function() {
                        jsf('#sf-catalogue').flexslider("previous");
                    });
                    jsf('#catalogue-top-next').click(function() {
                        jsf('#sf-catalogue').flexslider("next");
                    });
                    Salefinder.data.firstloadNavbar = false;
                }
            }
            jsf('#ddlPage, #ddlPage2').change(function() {
                sfCatalogue.scrollSliderTo(jsf(this).val(), Salefinder.data.view);
            });
            jsf('#sf-salenavbar a').click(function(e) {
                var id = jsf(this).attr('id');
                switch (id) {
                    case 'sf-navpages':
                    case 'sf-twopage':
                        digitalData.event.push({
                            "eventInfo": {
                                "eventAction": "viewType",
                                "viewType": "pages:double",
                                "button": "pages"
                            }
                        });
                        break;
                    case 'sf-singlepage':
                        digitalData.event.push({
                            "eventInfo": {
                                "eventAction": "viewType",
                                "viewType": "pages:single",
                                "button": "pages"
                            }
                        });
                        break;
                    case 'sf-thumbpage':
                        digitalData.event.push({
                            "eventInfo": {
                                "eventAction": "viewType",
                                "viewType": "pages:thumbnail",
                                "button": "pages"
                            }
                        });
                        break;
                    case 'sf-navlist':
                        digitalData.event.push({
                            "eventInfo": {
                                "eventAction": "viewType",
                                "viewType": "product-list",
                                "button": "pages"
                            }
                        });
                        break;
                    default:
                        var isCategory = jsf(this).hasClass('sf-navcategory-link');
                        if (isCategory) {
                            var categoryName = jsf(this).attr('title');
                            digitalData.event.push({
                                "eventInfo": {
                                    "eventAction": "viewType",
                                    "viewType": "category:" + categoryName,
                                    "button": "pages"
                                }
                            });
                        }
                        break;
                }
            });
            jsf('#sf-email-action').click(function(e) {
                digitalData.event.push({
                    "eventInfo": {
                        "eventAction": "email",
                        "button": "email"
                    }
                });
            });
            jsf('#sf-category-more').click(function(e) {
                var position = jsf('#sf-navcategories-container').scrollLeft();
                var width = jsf('#sf-navcategories-container').innerWidth();
                var maxWidth = jsf('#sf-navcategories-container')[0].scrollWidth;
                if (maxWidth - width - position < 101) {
                    jsf('#sf-category-more').hide();
                } else {
                    jsf('#sf-category-less').show();
                }
                jsf('#sf-navcategories-container').animate({
                    scrollLeft: (position + 100) + "px"
                });
            });
            jsf('#sf-category-less').click(function(e) {
                var position = jsf('#sf-navcategories-container').scrollLeft();
                var width = jsf('#sf-navcategories-container').innerWidth();
                var maxWidth = jsf('#sf-navcategories-container')[0].scrollWidth;
                jsf('#sf-category-more').show();
                if (position < 101) {
                    jsf('#sf-category-less').hide();
                }
                jsf('#sf-navcategories-container').animate({
                    scrollLeft: (position - 100) + "px"
                });
            });
            var navbarSlider = jsf("#sf-navcategories-container");
            Salefinder.data.navbarIsDown = false;
            navbarSlider.mousedown(function(e) {
                Salefinder.data.navbarIsDown = true;
                navbarSlider.addClass("active");
                var offset = navbarSlider.offset()
                Salefinder.data.navbarStartX = e.pageX - offset.left;
                Salefinder.data.navbarScrollLeft = navbarSlider.scrollLeft();
            });
            navbarSlider.mouseleave(function(e) {
                Salefinder.data.navbarIsDown = false;
                navbarSlider.removeClass("active");
            });
            navbarSlider.mouseup(function(e) {
                Salefinder.data.navbarIsDown = false;
                navbarSlider.removeClass("active");
            });
            navbarSlider.mousemove(function(e) {
                if (!Salefinder.data.navbarIsDown)
                    return;
                e.preventDefault();
                var offset = navbarSlider.offset()
                const x = e.pageX - offset.left;
                const walk = x - Salefinder.data.navbarStartX;
                var newPosition = Salefinder.data.navbarScrollLeft - walk;
                navbarSlider.scrollLeft(newPosition);
                var width = jsf('#sf-navcategories-container').innerWidth();
                var maxWidth = jsf('#sf-navcategories-container')[0].scrollWidth - width;
                if (newPosition <= 0) {
                    jsf('#sf-category-less').hide();
                } else if (newPosition >= maxWidth) {
                    jsf('#sf-category-more').hide();
                } else {
                    jsf('#sf-category-less').show();
                    jsf('#sf-category-more').show();
                }
            });
            jsf('#sf-salenavbar').addClass('sf-loaded');
        }
    },
    saleTermsLightbox: function() {
        jsf('.sale').fancybox({
            afterShow: function() {
                jsf('#maincover').focus();
            }
        });
        jsf('.description').click(function(e) {
            e.preventDefault();
            var content = jsf(this).siblings('.sf-hide').find('.sf-description').html();
            jsf.fancybox({
                content: content
            });
        });
    },
    initialLoad: function() {
        console.log('running initial load');
        if (Salefinder.data.postcode.length > 0) {
            var ie = window.browser;
            if (ie.msie && parseInt(ie.version) < 8) {
                t();
            }
            if (!this.initialized) {
                jsf(window).hashchange(function() {
                    var currentView = sfCatalogue.getHashValue("view");
                    var currentPage = parseInt(sfCatalogue.getHashValue("page"));
                    var saleId = parseInt(sfCatalogue.getHashValue("saleId"));
                    var load = false;
                    if (jsf('#sf-catalogue').length == 0 || (currentView != 'catalogue' && currentView != 'catalogue2')) {
                        load = true;
                    } else {
                        if (currentView != Salefinder.data.previousView || saleId != Salefinder.data.previousSaleId) {
                            load = true;
                            jsf(document).trigger('salefinderPageLoad');
                        } else {
                            slider = jsf('#sf-catalogue').data('flexslider');
                            if (typeof (slider) !== 'undefined') {
                                if (currentPage % 2 == 0 && currentView == 'catalogue2') {
                                    if (Salefinder.options.hideIntroPage == true || Salefinder.data.hideIntroPage == 1) {
                                        var scrollTo = parseInt(currentPage) - 1;
                                    } else {
                                        var scrollTo = parseInt(currentPage) + 1;
                                    }
                                } else {
                                    var scrollTo = currentPage;
                                }
                                sfCatalogue.scrollSliderTo(scrollTo, currentView, slider);
                            }
                        }
                    }
                    if (load) {
                        sfCatalogue.loadNavbar();
                    }
                });
            }
            sfCatalogue.init();
        } else {
            console.log('error: cookie value not valid ' + Salefinder.data.localiseCookie);
        }
    },
    preLoad: function() {
        console.log('running preload');
        window.sc_dataLayer = window.sc_dataLayer || [];
        Salefinder.data.localiseCookie = jsf.cookie('___LOCATION');
        var doInitialLoad = true;
        console.log('location cookie value : ' + Salefinder.data.localiseCookie);
        if (Salefinder.data.localiseCookie && Salefinder.data.localiseCookie.length > 0) {
            var locationCookie = Salefinder.data.localiseCookie.split("&");
            Salefinder.data.regionCheck = locationCookie[2].split("=")[1];
            if (Salefinder.data.region.length > 0 && Salefinder.data.regionCheck != Salefinder.data.region && window.location.pathname.endsWith(Salefinder.options.urlCheck)) {
                window.location.href = Salefinder.options.parentDirectory;
            } else {
                Salefinder.data.state = locationCookie[0].split("=")[1];
                Salefinder.data.postcode = locationCookie[1].split("=")[1];
                Salefinder.data.region = locationCookie[2].split("=")[1];
            }
        } else {
            doInitialLoad = false;
            if (this.reloadCount < 20) {
                console.log('error: location cookie not found. retrying.. ' + this.reloadCount);
                setTimeout(function() {
                    sfCatalogue.preLoad();
                    sfCatalogue.reloadCount++;
                }, 200);
            } else {
                console.log('error: location cookie not valid');
                if (window.location.pathname.endsWith(Salefinder.options.urlCheck)) {
                    window.location.href = Salefinder.options.parentDirectory;
                } else {
                    jsf('.catalogue-location-selector').before('<div id="sf-catalogue-topheader-contents" style="text-align:center"></div>');
                    jsf('#sf-catalogue-topheader-contents').html('<div class="sf-locationnotfound-icon" style="background: transparent url(//embed.salefinder.com.au/css/148/images/locationnotfound.png) no-repeat 0 0;background-size:contain;width:200px;height:230px;display:inline-block"></div><div class="sf-locationnotfound-text"><p class="rocket__h4">It seems we can&#39;t detect your location!</p><p style="padding:0 0 20px;max-width:400px;display:inline-block">Please enter your postcode below so we can load the most relevant catalogue specials for you.</div></div>');
                    jsf('.rocket__catalogue-location-selector>p>button').click();
                    jsf('.rocket__catalogue-location-selector>p.rocket__h4').hide();
                    jsf('.rocket__catalogue-location-selector__state').bind('DOMSubtreeModified', function() {
                        window.location.reload();
                    });
                }
            }
        }
        var scriptTag = jsf(Salefinder.options.scriptTag);
        if (scriptTag.length > 0) {
            Salefinder.options.rootDiv = jsf(scriptTag.parent().find('div')[0]);
        } else {
            console.log('error: script tag value not set');
        }
        sfCatalogue.locationId = parseInt(sfCatalogue.getHashValue("locationId"));
        if (sfCatalogue.locationId > 0) {
            if (parseInt(jsf.cookie('sf-locationId')) != sfCatalogue.locationId || Salefinder.data.localiseCookie.length == 0) {
                doInitialLoad = false;
                jsf.getJSON(sfCatalogue.embedHost + "/location/data/" + Salefinder.data.retailerId + "?locationId=" + sfCatalogue.locationId + "&callback=?", function(data) {
                    Salefinder.data.postcode = ("0" + data.postcode).slice(-4);
                    Salefinder.data.state = data.state;
                    Salefinder.data.region = data.areaName;
                    jsf.cookie('___LOCATION', 'State=' + Salefinder.data.state + '&Postcode=' + Salefinder.data.postcode + '&Region=' + Salefinder.data.region, {
                        path: '/',
                        raw: true
                    });
                    jsf.cookie('sf-locationId', sfCatalogue.locationId);
                    jsf.cookie('sf-locationName', Salefinder.data.region);
                    jsf.cookie('sf-postcode', Salefinder.data.postcode);
                    jsf.cookie('sf-region', Salefinder.data.region);
                    window.location.reload(true);
                });
            }
        }
        if (doInitialLoad) {
            if (Salefinder.data.region && Salefinder.data.region.length > 0 && jsf.cookie('locationPrompt') == null) {
                if (window.browser.mobile || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
                    if (window.location.pathname.endsWith(Salefinder.options.urlCheck)) {
                        var saleId = sfCatalogue.getHashValue('saleId') || 0;
                        if (saleId == 0) {
                            window.location.href = Salefinder.options.parentDirectory;
                        } else {
                            document.getElementsByTagName('head')[0].innerHTML = '<link rel="icon" type="image/vnd.microsoft.icon" href="/content/dam/coles/global/icons/favicon.ico"><link rel="shortcut icon" type="image/vnd.microsoft.icon" href="/content/dam/coles/global/icons/favicon.ico">';
                            var pageBody = document.getElementsByTagName('body')[0];
                            var width = document.documentElement.clientWidth;
                            var height = document.documentElement.clientHeight;
                            pageBody.innerHTML = '<div style="position:fixed;top:0;left:0;width:' + width + 'px;height:' + height + 'px;background-color:#fff"><div style="position:relative"><div style="position:absolute;top:' + ((height / 2) - 105) + 'px;left:' + ((width / 2) - 75) + 'px;background-color:#474747;border-radius:7px"><div style="width:150px;height:210px;position:relative"><div style="background-image:url(\'//embed.salefinder.co.nz/css/5/images/loading.gif\');width:45px;height:45px;position:absolute;top:45px;left:53px"></div><div style="width:150px;text-align:center;position:absolute;bottom:5px;left:0;color:#fff;font-family:Arial;font-weight:bold;font-size:0.95em">Loading Page</div></div></div></div></div>';
                            var cssLink = '//embed.salefinder.com.au/css/148/theme/mobile.css?ts=202010281433';
                            var jsLink = '//embed.salefinder.com.au/js/148/app.js?ts=202010281433';
                            sfCatalogue.loadCss(cssLink);
                            sfCatalogue.loadJs(jsLink);
                        }
                    } else {
                        sfCatalogue.initialLoad();
                    }
                } else {
                    if (!jsf.cookie('sf-postcode') || jsf.cookie('sf-postcode') != Salefinder.data.postcode) {
                        jsf.cookie('sf-locationId', null, {
                            path: '/'
                        });
                        jsf.cookie('sf-locationName', null, {
                            path: '/'
                        });
                        jsf.cookie('sf-postcode', null, {
                            path: '/'
                        });
                        jsf.cookie('sf-region', null, {
                            path: '/'
                        });
                        jsf.cookie('sf-locationId', null, {
                            path: '/catalogues-and-specials/view-all-available-catalogues'
                        });
                        jsf.cookie('sf-locationName', null, {
                            path: '/catalogues-and-specials/view-all-available-catalogues'
                        });
                        jsf.cookie('sf-postcode', null, {
                            path: '/catalogues-and-specials/view-all-available-catalogues'
                        });
                        jsf.cookie('sf-region', null, {
                            path: '/catalogues-and-specials/view-all-available-catalogues'
                        });
                        jsf.cookie('sf-locationId', null, {
                            path: location.pathname
                        });
                        jsf.cookie('sf-locationName', null, {
                            path: location.pathname
                        });
                        jsf.cookie('sf-postcode', null, {
                            path: location.pathname
                        });
                        jsf.cookie('sf-region', null, {
                            path: location.pathname
                        });
                    }
                    sfCatalogue.initialLoad();
                }
            } else {
                if (jsf.cookie('locationPrompt') != null && jsf.cookie('saveLocation') != null) {
                    jsf.cookie('locationPrompt', null);
                    jsf.cookie('___LOCATION', jsf.cookie('saveLocation'), {
                        path: '/',
                        raw: true
                    });
                    jsf.cookie('saveLocation', null);
                }
            }
        }
    }
};
(function(a) {
        (window.browser = window.browser || {}).mobile = /(bb\d+|meego).+mobile|android|avantgo|bada\/|blackberry|playbook|silk|nexus|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))
    }
)(navigator.userAgent || navigator.vendor || window.opera);
function is_affluent(postcode) {
    return false;
}
function is_bestbuys(postcode) {
    var postcodes = '6059,6112,6056,6018,6108,6061,6169,6109,6230,6063,6110,6076,6054,6025,2641,3166,3429,3175,3752,3844,3630,6180,3064,3023,3064,3630,3216,3977,6233,5112,5015,3806,3083,4500,4740,4570,4211,4120,4807,4103,4035,4020,4558,4814,4300,4109,5086,3070,3037,4218,2280,2155,2428,2450,2160,2350,5021,3030,3151,3079,3148,3802,3910,3975,2259,2830,2753,4020,4207,4127,4301,4157,4212,3029,2300,2287,2168,2283,2153,2285,2780,2155,2360,2444,3217,2768,2576,5092,5606,3820,3192,3133,4218,4178,4032,4034,5116,5045,3212,5211,3032,2756,2529,2614,2912,5343,3764,3023,3024,3840,3140,3178,2620,4860,4352,4214,7010,7249,7030,2290,2444,2190,2340,3030,3131,3039,4744,3500,3922,4510,2325,2190,2790,2795,6530,6330,6021,3058,3136,4072,4343,4118,4818,4305,4817,4650,5600,5253,3977,3555,3810,3977,3076,3250,3083,3465,2151,2440,2212,2650,2550,2536,6055,6714,6725,6058,5075,5074,5700,3132,3280,2710,2640,2148,4740,4405,4870,4350,5115,5098,4165,3995,2480,2194,2450,2113,3064,3066,2147,3660,3047,3335,2760,2539,6024,6258,5045,5046,5092,3025,3175,2560,4305,4510,4285,4655,4101,4122,2264,2564,2480,2264,2720,2250,2077,6210,6208,5118,5039,3214,3016,4122,4125,4163,4868,5171,5011,2460,2770,2261,6031,830,839,6164,3690,3915,4814,4740,4802,4810,3029,3690,3029,4811,2290,2317,2102,2103,2261,6122,6743,6025,6722,3109,3038,3076,4870,4870,4869,4350,4655,4034,4670,3931,3338,3042,2560,2251,2914,2250,2580,2502,2036,2287,2486,2485,2484,4031,4221,4129,4560,4070,4306,2452,3126,3109,2800,2170,2330,2204,2400,2460,2333,4217,4509,4567,4509,4068,3199,3046,3340,7172,7018,3805,6171,6062,6280,2567,2250,2747,4500,4505,4069,4061,4078,5173,5046,5097,5082,7248,7310,3199,3030,3912,3752,3072,3754,3228,6027,6030,2340,2680,3197,3138,4556,4551,4209,6173,4575,4132,4700,4301,4226,3186,4053,4051,4018,4030,4000,4109,4350,4370,4350,4074,3939,6322,6069,6401,2040,4151,4220,4680,3034,3116,4123,4390,4304,3029,';
    var found = postcodes.indexOf(postcode + ',');
    if (found > -1) {
        return true;
    } else {
        return false;
    }
}
var msg1 = "Did you know that your Internet Explorer is out of date?";
var msg2 = "To get the best possible experience using our website we recommend that you upgrade to a newer version or other web browser. A list of the most popular web browsers can be found below.";
var msg3 = "Just click on the icons to get to the download page";
var br1 = "Internet Explorer 8+";
var br2 = "Firefox 3+";
var br3 = "Safari 3+";
var br4 = "Opera 9.5+";
var br5 = "Chrome 2.0+";
var url1 = "http://www.microsoft.com/windows/Internet-explorer/default.aspx";
var url2 = "http://www.mozilla.com/firefox/";
var url3 = "http://www.apple.com/safari/download/";
var url4 = "http://www.opera.com/download/";
var url5 = "http://www.google.com/chrome";
function e() {
    var imgPath = "//embed.salefinder.co.nz/css/images/";
    var _body = jsf('body');
    var _d = jsf('<div>');
    var _l = jsf('<div>');
    var _h = jsf('<h1>');
    var _p1 = jsf('<p>');
    var _p2 = jsf('<p>');
    var _ul = jsf('<ul>');
    var _li1 = jsf('<li>');
    var _li2 = jsf('<li>');
    var _li3 = jsf('<li>');
    var _li4 = jsf('<li>');
    var _li5 = jsf('<li>');
    var _ico1 = jsf('<div>');
    var _ico2 = jsf('<div>');
    var _ico3 = jsf('<div>');
    var _ico4 = jsf('<div>');
    var _ico5 = jsf('<div>');
    var _lit1 = jsf('<div>');
    var _lit2 = jsf('<div>');
    var _lit3 = jsf('<div>');
    var _lit4 = jsf('<div>');
    var _lit5 = jsf('<div>');
    _body.append(_l);
    _body.append(_d);
    _d.append(_h);
    _d.append(_p1);
    _d.append(_p2);
    _d.append(_ul);
    _ul.append(_li1);
    _ul.append(_li2);
    _ul.append(_li3);
    _ul.append(_li4);
    _ul.append(_li5);
    _li1.append(_ico1);
    _li2.append(_ico2);
    _li3.append(_ico3);
    _li4.append(_ico4);
    _li5.append(_ico5);
    _li1.append(_lit1);
    _li2.append(_lit2);
    _li3.append(_lit3);
    _li4.append(_lit4);
    _li5.append(_lit5);
    _d.attr('id', '_d');
    _l.attr('id', '_l');
    _h.attr('id', '_h');
    _p1.attr('id', '_p1');
    _p2.attr('id', '_p2');
    _ul.attr('id', '_ul');
    _li1.attr('id', '_li1');
    _li2.attr('id', '_li2');
    _li3.attr('id', '_li3');
    _li4.attr('id', '_li4');
    _li5.attr('id', '_li5');
    _ico1.attr('id', '_ico1');
    _ico2.attr('id', '_ico2');
    _ico3.attr('id', '_ico3');
    _ico4.attr('id', '_ico4');
    _ico5.attr('id', '_ico5');
    _lit1.attr('id', '_lit1');
    _lit2.attr('id', '_lit2');
    _lit3.attr('id', '_lit3');
    _lit4.attr('id', '_lit4');
    _lit5.attr('id', '_lit5');
    var _width = document.documentElement.clientWidth;
    var _height = document.documentElement.clientHeight;
    var _dl = _l;
    _dl.css({
        width: _width + "px",
        height: _height + "px",
        position: "fixed",
        top: "0px",
        left: "0px",
        filter: "alpha(opacity=70)",
        "z-index": 50,
        background: "#fff"
    });
    var _ddw = 650
        , _ddh = 260;
    _d.css({
        width: _ddw + "px",
        height: _ddh + "px",
        position: "absolute",
        top: ((_height - _ddh) / 2.5) + "px",
        left: ((_width - _ddw) / 2) + "px",
        padding: "20px",
        background: "#fff",
        border: "1px solid #ccc",
        "font-family": "'Lucida Grande','Lucida Sans Unicode',Arial,Verdana,sans-serif",
        "list-style-type": "none",
        color: "#4F4F4F",
        "font-size": "12px",
        "z-index": 51
    });
    _h.append(document.createTextNode(msg1));
    _h.css({
        display: "block",
        "font-size": "1.3em",
        "margin-bottom": "0.5em",
        color: "#333",
        "font-family": "Helvetica,Arial,sans-serif",
        "font-weight": "bold"
    });
    _p1.append(document.createTextNode(msg2));
    _p1.css({
        "margin-bottom": "1em"
    });
    _p2.append(document.createTextNode(msg3));
    _p2.css({
        "margin-bottom": "1em"
    });
    _ul.css({
        "list-style-image": "none",
        "list-style-position": "outside",
        "list-style-type": "none",
        "margin": "0 auto",
        padding: "0"
    });
    var _li = jsf('#_li1,#_li2,#_li3,#_li4,#_li5');
    _li.css({
        background: "transparent url('" + imgPath + "background_browser.gif') no-repeat scroll left top",
        cursor: "pointer",
        float: "left",
        width: "120px",
        height: "122px",
        margin: "0 10px 10px 0"
    });
    _li1.click(function() {
        window.location = url1
    });
    _li2.click(function() {
        window.location = url2
    });
    _li3.click(function() {
        window.location = url3
    });
    _li4.click(function() {
        window.location = url4
    });
    _li5.click(function() {
        window.location = url5
    });
    var _ico = jsf('#_ico1,#_ico2,#_ico3,#_ico4,#_ico5');
    _ico.css({
        width: "100px",
        height: "100px",
        margin: "1px auto"
    });
    _ico1.css("background", "transparent url('" + imgPath + "browser_ie.gif') no-repeat scroll left top");
    _ico2.css("background", "transparent url('" + imgPath + "browser_firefox.gif') no-repeat scroll left top");
    _ico3.css("background", "transparent url('" + imgPath + "browser_safari.gif') no-repeat scroll left top");
    _ico4.css("background", "transparent url('" + imgPath + "browser_opera.gif') no-repeat scroll left top");
    _ico5.css("background", "transparent url('" + imgPath + "browser_chrome.gif') no-repeat scroll left top");
    _lit1.append(document.createTextNode(br1));
    _lit2.append(document.createTextNode(br2));
    _lit3.append(document.createTextNode(br3));
    _lit4.append(document.createTextNode(br4));
    _lit5.append(document.createTextNode(br5));
    var _lit = jsf("#_lit1,#_lit2,#_lit3,#_lit4,#_lit5");
    _lit.css({
        color: "#808080",
        "font-size": "0.8em",
        width: "118px",
        height: "18px",
        "line-height": "17px",
        margin: "1px auto",
        "text-align": "center"
    });
}
