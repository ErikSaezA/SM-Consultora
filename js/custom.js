/* HTML document is loaded. DOM is ready.
-------------------------------------------*/
$(function(){

    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    var cursorEnabled = $('body').hasClass('cursor-enabled');
    var $body = $('body');

    if (!prefersReducedMotion && hasFinePointer && cursorEnabled) {
        var $cursorDot = $('.cursor-dot');
        var $cursorRing = $('.cursor-ring');

        if ($cursorDot.length && $cursorRing.length) {
            var ringX = window.innerWidth / 2;
            var ringY = window.innerHeight / 2;
            var targetX = ringX;
            var targetY = ringY;
            var isVisible = false;
            var $contactSection = $('#contact');
            var $headerSection = $('header');

            var renderCursor = function() {
                ringX += (targetX - ringX) * 0.2;
                ringY += (targetY - ringY) * 0.2;
                $cursorRing.css('transform', 'translate(' + ringX + 'px, ' + ringY + 'px) translate(-50%, -50%)');
                requestAnimationFrame(renderCursor);
            };

            $(window).on('mousemove', function(event) {
                targetX = event.clientX;
                targetY = event.clientY;

                $cursorDot.css('transform', 'translate(' + targetX + 'px, ' + targetY + 'px) translate(-50%, -50%)');

                if (!isVisible) {
                    $cursorDot.add($cursorRing).css('opacity', 1);
                    isVisible = true;
                }
            });

            $(window).on('mouseout', function(event) {
                if (!event.relatedTarget && !event.toElement) {
                    $cursorDot.add($cursorRing).css('opacity', 0);
                    isVisible = false;
                }
            });

            if ($contactSection.length) {
                $contactSection.on('mouseenter', function() {
                    $body.addClass('cursor-contact');
                });

                $contactSection.on('mouseleave', function() {
                    $body.removeClass('cursor-contact');
                });
            }

            if ($headerSection.length) {
                $headerSection.on('mouseenter', function() {
                    $body.addClass('cursor-header');
                });

                $headerSection.on('mouseleave', function() {
                    $body.removeClass('cursor-header');
                });
            }

            $(document).on('mouseenter', 'a, button, input, textarea, select, label, .navbar-toggle, [role="button"]', function() {
                $body.addClass('cursor-active');
            });

            $(document).on('mouseleave', 'a, button, input, textarea, select, label, .navbar-toggle, [role="button"]', function() {
                $body.removeClass('cursor-active');
            });

            renderCursor();
        }
    }

    /* start typed element */
    //http://stackoverflow.com/questions/24874797/select-div-title-text-and-make-array-with-jquery
    var subElementArray = $.map($('.sub-element'), function(el) { return $(el).text(); });
    if (!prefersReducedMotion) {
        $(".element").typed({
            strings: subElementArray,
            typeSpeed: 30,
            contentType: 'html',
            showCursor: false,
            loop: true,
            loopCount: true,
        });
    }
    /* end typed element */

    var clamp = function(value, min, max) {
        return Math.min(max, Math.max(min, value));
    };

    var scheduleFrame = window.requestAnimationFrame || function(callback) {
        return window.setTimeout(callback, 16);
    };

    var $nav = $('.templatemo-nav');
    var $hero = $('#home');
    var heroElement = $hero.get(0);
    var heroLayers = [];
    var scrollTicking = false;
    var sectionElements = $('section[id]').toArray();
    var revealTargets = [];

    if (heroElement) {
        heroLayers = [
            { element: $hero.find('.hero-orb-left').get(0), factorY: -0.18, factorX: -0.05, clamp: 48 },
            { element: $hero.find('.hero-orb-right').get(0), factorY: 0.14, factorX: 0.06, clamp: 42 },
            { element: $hero.find('.hero-grid').get(0), factorY: -0.08, factorX: -0.02, clamp: 22 },
            { element: $hero.find('.hero-beam').get(0), factorY: 0.2, factorX: 0.04, clamp: 58 },
            { element: $hero.find('.hero-orbit').get(0), factorY: 0.16, factorX: 0.09, clamp: 64 },
            { element: $hero.find('.hero-pulse').get(0), factorY: -0.12, factorX: -0.03, clamp: 52 }
        ].filter(function(layer) {
            return !!layer.element;
        });
    }

    if (!prefersReducedMotion) {
        $body.addClass('motion-enhanced');

        [
            { selector: '#about .quienes-somos-row', className: 'reveal-stage' },
            { selector: '#team .row > .col-md-12, #service .row > .col-md-12, #improvement-lines .row > .col-md-12, #contact .row > .col-md-12', className: 'reveal-stage reveal-title' },
            { selector: '#team .team-wrapper, #service .row > .col-md-4, #improvement-lines .improvement-card, #contact .row > .col-md-6', className: 'reveal-stage' }
        ].forEach(function(group) {
            $(group.selector).each(function(index) {
                $(this).addClass(group.className);
                this.style.setProperty('--reveal-delay', ((index % 4) * 55) + 'ms');
                revealTargets.push(this);
            });
        });
    }

    var updateScrollEffects = function() {
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
        var maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);

        if (scrollTop > 58) {
            $nav.addClass('sticky');
        } else {
            $nav.removeClass('sticky');
        }

        $nav.toggleClass('nav-scrolled', scrollTop > 12);
        document.body.style.setProperty('--page-scroll-progress', (scrollTop / maxScroll).toFixed(4));

        if (!prefersReducedMotion && heroElement && heroLayers.length) {
            var heroRect = heroElement.getBoundingClientRect();

            if (heroRect.bottom > -20 && heroRect.top < window.innerHeight + 20) {
                var heroCenterOffset = heroRect.top + (heroRect.height / 2) - (window.innerHeight / 2);
                var heroTravel = clamp(heroCenterOffset * -0.18, -72, 118);

                heroElement.style.setProperty('--hero-content-shift', (heroTravel * -0.12).toFixed(2) + 'px');

                heroLayers.forEach(function(layer) {
                    var shiftY = clamp(heroTravel * layer.factorY, -layer.clamp, layer.clamp);
                    var shiftX = clamp(heroTravel * layer.factorX, -(layer.clamp * 0.7), layer.clamp * 0.7);

                    layer.element.style.setProperty('--scroll-shift-y', shiftY.toFixed(2) + 'px');
                    layer.element.style.setProperty('--scroll-shift-x', shiftX.toFixed(2) + 'px');
                });
            }
        }
    };

    var requestScrollEffects = function() {
        if (scrollTicking) {
            return;
        }

        scrollTicking = true;
        scheduleFrame(function() {
            updateScrollEffects();
            scrollTicking = false;
        });
    };

    if (!prefersReducedMotion && heroElement && hasFinePointer) {
        $hero.on('mousemove', function(event) {
            var rect = heroElement.getBoundingClientRect();
            var pointerX = ((event.clientX - rect.left) / rect.width) - 0.5;
            var pointerY = ((event.clientY - rect.top) / rect.height) - 0.5;

            heroElement.style.setProperty('--hero-pointer-x', (pointerX * 28).toFixed(2) + 'px');
            heroElement.style.setProperty('--hero-pointer-y', (pointerY * 24).toFixed(2) + 'px');
            heroElement.style.setProperty('--hero-content-pointer-x', (pointerX * -12).toFixed(2) + 'px');
            heroElement.style.setProperty('--hero-content-pointer-y', (pointerY * -10).toFixed(2) + 'px');
        });

        $hero.on('mouseleave', function() {
            heroElement.style.setProperty('--hero-pointer-x', '0px');
            heroElement.style.setProperty('--hero-pointer-y', '0px');
            heroElement.style.setProperty('--hero-content-pointer-x', '0px');
            heroElement.style.setProperty('--hero-content-pointer-y', '0px');
        });
    }

    if (!prefersReducedMotion && 'IntersectionObserver' in window) {
        var activeSectionObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    $(entry.target).addClass('section-current');
                } else {
                    $(entry.target).removeClass('section-current');
                }
            });
        }, {
            threshold: 0.35,
            rootMargin: '-12% 0px -42% 0px'
        });

        sectionElements.forEach(function(section) {
            activeSectionObserver.observe(section);
        });

        if (revealTargets.length) {
            var revealObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        $(entry.target).addClass('is-visible');
                        revealObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.18,
                rootMargin: '0px 0px -10% 0px'
            });

            revealTargets.forEach(function(target) {
                revealObserver.observe(target);
            });
        }
    } else if (revealTargets.length) {
        $(revealTargets).addClass('is-visible');
    }

    /* Smooth scroll and Scroll spy (https://github.com/ChrisWojcik/single-page-nav)    
    ---------------------------------------------------------------------------------*/ 
    $('.templatemo-nav').singlePageNav({
        offset: $(".templatemo-nav").height(),
        filter: ':not(.external)',
        updateHash: false
    });

    /* start navigation top js */
    $(window).on('scroll resize', requestScrollEffects);
    updateScrollEffects();
    
    /* Hide mobile menu after clicking on a link
    -----------------------------------------------*/
    $('.navbar-collapse a').click(function(){
        $(".navbar-collapse").collapse('hide');
    });
    /* end navigation top js */

    /* start contact form async submit */
    $('#contact-form').on('submit', function(event){
        event.preventDefault();

        var $form = $('#contact-form');
        var $submit = $('#contact-form input[type="submit"]');
        var $status = $('#form-status');
        var $success = $('#form-success-message');

        var nombre = $('#fullname').val().trim() || 'Sin nombre';
        var correo = $('#email').val().trim() || 'Sin correo';
        var asuntoIngresado = $('#subject').val().trim() || 'Sin asunto';
        var mejora = $('#message').val().trim() || 'Sin detalle';

        var cuerpo = '[Nombre] ' + nombre + '\n' +
            '[Correo] ' + correo + '\n\n' +
            '[Que quieres mejorar]\n' + mejora;

        var payload = {
            _subject: '[Asunto] ' + asuntoIngresado,
            _captcha: 'false',
            name: nombre,
            email: correo,
            message: cuerpo
        };

        $submit.prop('disabled', true).val('Enviando...');
        $status.text('Enviando consulta...');

        fetch('https://formsubmit.co/ajax/contacto@sm-consultora.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        .then(function(response) {
            return response.json().then(function(data) {
                return {
                    ok: response.ok,
                    data: data
                };
            });
        })
        .then(function(result) {
            var apiSuccess = String(result.data && result.data.success).toLowerCase() === 'true';
            if (!result.ok || !apiSuccess) {
                var apiMessage = (result.data && result.data.message) ? result.data.message : 'No fue posible enviar la consulta.';
                throw new Error(apiMessage);
            }

            $status.text('');
            $form.fadeOut(260, function() {
                $success
                    .html('Gracias por tu consulta.<br>Te contactaremos a la brevedad.')
                    .fadeIn(420);
            });
        })
        .catch(function(error) {
            var msg = error.message || 'No fue posible enviar la consulta.';

            if (msg.toLowerCase().indexOf('needs activation') !== -1) {
                msg = 'El formulario necesita activación inicial. Revisa la casilla contacto@sm-consultora.com y haz clic en el enlace "Activate Form" (solo una vez).';
            } else if (msg.toLowerCase().indexOf('open this page through a web server') !== -1) {
                msg = 'El envío no funciona abriendo el archivo HTML directamente. Ejecuta el sitio desde un servidor local (por ejemplo Live Server).';
            }

            $status.text('No fue posible enviar la consulta: ' + msg);
        })
        .finally(function() {
            $submit.prop('disabled', false).val('Enviar consulta');
        });
    });
    /* end contact form mailto */

    $('body').bind('touchstart', function() {});

    /* wow
    -----------------*/
    if (!prefersReducedMotion) {
        $('.wow[data-wow-delay]').each(function() {
            var rawDelay = String($(this).attr('data-wow-delay') || '').trim();
            var parsedDelay = parseFloat(rawDelay);

            if (!isNaN(parsedDelay) && rawDelay.indexOf('s') !== -1) {
                var fasterDelay = Math.max(0.02, parsedDelay * 0.12);
                $(this).attr('data-wow-delay', fasterDelay.toFixed(2) + 's');
            }
        });

        new WOW({
            offset: 12,
            mobile: true
        }).init();
    }
});

/* start preloader */
$(window).load(function(){
	$('.preloader').fadeOut(1000); // set duration in brackets    
});
/* end preloader */
