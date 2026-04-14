/* HTML document is loaded. DOM is ready.
-------------------------------------------*/
$(function(){

    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    var cursorEnabled = $('body').hasClass('cursor-enabled');

    if (!prefersReducedMotion && hasFinePointer && cursorEnabled) {
        var $body = $('body');
        var $cursorDot = $('.cursor-dot');
        var $cursorRing = $('.cursor-ring');

        if ($cursorDot.length && $cursorRing.length) {
            var ringX = window.innerWidth / 2;
            var ringY = window.innerHeight / 2;
            var targetX = ringX;
            var targetY = ringY;
            var isVisible = false;

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

    /* Smooth scroll and Scroll spy (https://github.com/ChrisWojcik/single-page-nav)    
    ---------------------------------------------------------------------------------*/ 
    $('.templatemo-nav').singlePageNav({
        offset: $(".templatemo-nav").height(),
        filter: ':not(.external)',
        updateHash: false
    });

    /* start navigation top js */
    $(window).scroll(function(){
        if($(this).scrollTop()>58){
            $(".templatemo-nav").addClass("sticky");
        }
        else{
            $(".templatemo-nav").removeClass("sticky");
        }
    });
    
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
                var fasterDelay = Math.max(0.03, parsedDelay * 0.18);
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
