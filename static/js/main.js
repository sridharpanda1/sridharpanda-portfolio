(function ($) {
    "use strict"

    // Navbar on scrolling
    $(window).scroll(function () {
        if ($(this).scrollTop() > 200) {
            $('.navbar').fadeIn('slow').css('display', 'flex');
        } else {
            $('.navbar').fadeOut('slow').css('display', 'none');
        }
    });
    

    // Typed Initiate
    var typingElement = document.querySelector(".typing-text");
    var typeArray = ["Junior Software Developer", "Frontend Developer", "C#.Net Developer", "PowerApps", "SharePoint", "PowerAutomate"];
    var index = 0,
      isAdding = true,
      typeIndex = 0;
    
    function playAnim() {
      setTimeout(
        function () {
          typingElement.innerText = typeArray[typeIndex].slice(0, index);
    
          // If typing
          if (isAdding) {
            if (index >= typeArray[typeIndex].length) {
              isAdding = false;
              // If text typed completely, wait 2s before starting to remove it.
              setTimeout(function () {
                playAnim();
              }, 2000);
              return;
            } else {
              // Continue to typing text by increasing index
              index++;
            }
          } else {
            // If removing
            if (index === 0) {
              isAdding = true;
              //If text removed completely, move on to next text by increasing typeIndex
              typeIndex++;
              if (typeIndex >= typeArray.length) {
                // Turn to beginning when reached to last text
                typeIndex = 0;
              }
            } else {
              // Continue to removing text by decreasing index
              index--;
            }
          }
          // Call the function always
          playAnim();
        },
    
        /* 
          If typing text, call it every 120ms
          If removing text, call it every 60ms
          Type slower, remove faster
        */
        isAdding ? 120 : 60
      );
    }
    
    // Start typing text
    playAnim();
    
    let options = {
      startAngle: -1.55,
      size: 150,
      value: 0.85,
      fill: {
        gradient: ['#a445b2', '#fa4299']
      }
    }
    $(".circle .bar").circleProgress(options).on('circle-animation-progress',
      function(event, progress, stepValue) {
        $(this).parent().find("span").text(String(stepValue.toFixed(2).substr(2)) + "%");
      });
    $(".js .bar").circleProgress({
      value: 0.70
    });
    $(".react .bar").circleProgress({
      value: 0.60
    });

    let activeIndex = 0
    let limit = 0
    let disabled = false
    let $stage
    let $controls
    let canvas = false
    
    const SPIN_FORWARD_CLASS = 'js-spin-fwd'
    const SPIN_BACKWARD_CLASS = 'js-spin-bwd'
    const DISABLE_TRANSITIONS_CLASS = 'js-transitions-disabled'
    const SPIN_DUR = 1000
    
    const appendControls = () => {
      for (let i = 0; i < limit; i++) {
        $('.carousel__control').append(`<a href="#" data-index="${i}"></a>`)
      }
      let height = $('.carousel__control').children().last().outerHeight()
      
      $('.carousel__control').css('height', (30 + (limit * height)))
      $controls = $('.carousel__control').children()
      $controls.eq(activeIndex).addClass('active')
    }
    
    const setIndexes = () => {
        $('.spinner').children().each((i, el) => {
            $(el).attr('data-index', i)
            limit++
        })
    }
    
    const duplicateSpinner = () => {
        const $el = $('.spinner').parent()
        const html = $('.spinner').parent().html()
        $el.append(html)
        $('.spinner').last().addClass('spinner--right')
        $('.spinner--right').removeClass('spinner--left')
    }
    
    const paintFaces = () => {
        $('.spinner__face').each((i, el) => {
            const $el = $(el)
            let color = $(el).attr('data-bg')
            $el.children().css('backgroundImage', `url(${getBase64PixelByColor(color)})`)
        })
    }
    
    const getBase64PixelByColor = (hex) => {
        if (!canvas) {
            canvas = document.createElement('canvas')
            canvas.height = 1
            canvas.width = 1
        }
        if (canvas.getContext) {
            const ctx = canvas.getContext('2d')
            ctx.fillStyle = hex
            ctx.fillRect (0, 0, 1, 1)
            return canvas.toDataURL()
        }
        return false
    }
    
    const prepareDom = () => {
        setIndexes()
        paintFaces()
        duplicateSpinner()
        appendControls()
    }
    
    const spin = (inc = 1) => {
        if (disabled) return
        if (!inc) return
        activeIndex += inc
        disabled = true
    
        if (activeIndex >= limit) {
            activeIndex = 0
        }
      
        if (activeIndex < 0) {
            activeIndex = (limit - 1)
        }
    
        const $activeEls = $('.spinner__face.js-active')
        const $nextEls = $(`.spinner__face[data-index=${activeIndex}]`)
        $nextEls.addClass('js-next')
      
        if (inc > 0) {
          $stage.addClass(SPIN_FORWARD_CLASS)
        } else {
          $stage.addClass(SPIN_BACKWARD_CLASS)
        }
        
        $controls.removeClass('active')
        $controls.eq(activeIndex).addClass('active')
      
        setTimeout(() => {
            spinCallback(inc)
        }, SPIN_DUR, inc)
    }
    
    const spinCallback = (inc) => {
        
        $('.js-active').removeClass('js-active')
        $('.js-next').removeClass('js-next').addClass('js-active')
        $stage
            .addClass(DISABLE_TRANSITIONS_CLASS)
            .removeClass(SPIN_FORWARD_CLASS)
            .removeClass(SPIN_BACKWARD_CLASS)
      
        $('.js-active').each((i, el) => {
            const $el = $(el)
            $el.prependTo($el.parent())
        })
        setTimeout(() => {
            $stage.removeClass(DISABLE_TRANSITIONS_CLASS)
            disabled = false
        }, 100)
    
    }
    
    const attachListeners = () => {
      
        document.onkeyup = (e) => {
            switch (e.keyCode) {
                case 38:
                    spin(-1)
                    break
                case 40:
                    spin(1)
                    break
                }
        }
     
        $controls.on('click', (e) => {
          e.preventDefault()
          if (disabled) return
          const $el = $(e.target)
          const toIndex = parseInt($el.attr('data-index'), 10)
          spin(toIndex - activeIndex)
          
        })
    }
    
    const assignEls = () => {
        $stage = $('.carousel__stage')
    }
    
    const init = () => {
        assignEls()
        prepareDom()
        attachListeners()
    }
    
    
    $(() => {
        init();
    });


    
})(jQuery);