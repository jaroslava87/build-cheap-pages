  // SWIPER
  import Swiper, { Navigation, Pagination } from 'swiper';
  import 'swiper/css';
  import 'swiper/css/navigation';
  import 'swiper/css/pagination';

  const swiper1 = new Swiper('.swiper1', {
    modules: [Navigation, Pagination],
      navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
      grabCursor: true,
      keyboard: {
      enabled: true,
      onlyInViewport: true,
      pageUpDown: true,
    },
    mousewheel: {
      sensitivity: 1,
    },
  });

  const swiper2 = new Swiper('.swiper2', {
    modules: [Navigation, Pagination],
    navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        grabCursor: true,
        keyboard: {
          enabled: true,
          onlyInViewport: true,
          pageUpDown: true,
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        mousewheel: {
          sensitivity: 1,
        },
        autoHeight: true,
        slidesPerView: 'auto',
        breakpoints: {
          320: {
            slidesPerView: 1,
          },
          640: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 2,
          },
        }
  });
  


  //menu

let open = document.querySelector('.header__nav-btn'); 
let menu = document.querySelector('.header__nav__bottom-container');
let menuLinks = menu.querySelectorAll('.header__nav__bottom-container-item');

    open.addEventListener('click',
        function () {
            menu.classList.toggle('header__nav--active');
            document.body.classList.toggle('stop-scroll');
        })

    menuLinks.forEach(function (el) {
          el.addEventListener('click', function () {
              menu.classList.remove('header__nav--active');
              document.body.classList.remove('stop-scroll');
          })
      })