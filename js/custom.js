/* HTML document is loaded. DOM is ready.
-------------------------------------------*/
$(function(){

    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

    /* start contact form mailto */
    $('#contact-form').on('submit', function(event){
        event.preventDefault();

        var $submit = $('#contact-form input[type="submit"]');
        var $status = $('#form-status');

        var nombre = $('#fullname').val().trim() || 'Sin nombre';
        var correo = $('#email').val().trim() || 'Sin correo';
        var asuntoIngresado = $('#subject').val().trim() || 'Sin asunto';
        var mejora = $('#message').val().trim() || 'Sin detalle';

        var cuerpo = '[Nombre] ' + nombre + '\n' +
            '[Correo] ' + correo + '\n\n' +
            '[Que quieres mejorar]\n' + mejora;

        var payload = {
            _subject: '[Asunto] ' + asuntoIngresado,
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
            if (!response.ok) {
                throw new Error('No se pudo enviar el formulario.');
            }
            return response.json();
        })
        .then(function() {
            $status.text('Consulta enviada correctamente. Te responderemos pronto.');
            $('#contact-form')[0].reset();
        })
        .catch(function() {
            $status.text('No fue posible enviar la consulta. Intenta nuevamente en unos minutos.');
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
        new WOW().init();
    }
});

/* start preloader */
$(window).load(function(){
	$('.preloader').fadeOut(1000); // set duration in brackets    
});
/* end preloader */
