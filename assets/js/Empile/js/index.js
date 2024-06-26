(function (doc) {
	var $ = function (el) {
		try {
			var item = doc.querySelectorAll(el);
			return item.length == 1 ? item[0] : item;
		} catch (err) {
			console.log(err)
		}
	}
	var screenWidth = window.screen.width;
	console.log('screenWidth', screenWidth)
	window.addEventListener('resize', function (event) {
		// 在此处编写窗口变化后的需要执行的代码
		// 窗口大小发生变化时执行的代码
		screenWidth = window.screen.width;
		console.log('窗口大小发生变化', screenWidth)
		if (screenWidth > 576) {
			empile5.init()
		}
		// empile5.init()
		// empile5 = new Empile($('.demo5>.container1'), {
		// 	autoplay: true,
		// 	waitForTransition: true,
		// 	isClickSlide: true,
		// 	navigation: {
		// 		nextEl: $('.demo5 .btn-right'),
		// 		prevEl: $('.demo5 .btn-left'),
		// 	},
		// 	css: function (coord, absCoord) {
		// 		if (screenWidth < 575) {
		// 			translateX = 'translateX(' + 100 * coord + 'px)';
		// 		} else {
		// 			translateX = 'translateX(' + 300 * coord + 'px)';
		// 		}
		// 		var zIndex = 100 - absCoord,
		// 			opacity = Math.pow(.9, absCoord).toFixed(3),
		// 			scale = 'scale(' + Math.pow(.6, absCoord).toFixed(2) + ')';
		// 		var transform = [translateX, scale].join(' ');
		// 		return {
		// 			'z-index': zIndex,
		// 			opacity: opacity,
		// 			transform: transform,
		// 		}
		// 	},
		// });
	});
	// var activeIndexEle = $('.active-index');
	// var empile1 = new Empile($('.demo1>.container'), {
	//     autoplay: {
	//         delay: 8000,
	//         docHiddenOff: true,
	//     },
	//     waitForTransition: true,
	//     isClickSlide: true,
	//     navigation: {
	//         nextEl: $('.demo1 .btn-right'),
	//         prevEl: $('.demo1 .btn-left'),
	//     },
	//     on: {
	//         //卡片切换时执行
	//         slideChange: function () {
	//             //设置'当前显示的是第[xxx]张'元素的文本内容
	//             activeIndexEle.textContent = this.activeIndex + 1;
	//         },
	//         transitionEnd: function (empile) {
	//             console.info('end')
	//         },
	//         transitionStart: function (empile) {
	//             console.info('start')
	//         },
	//         clickPrevBtn: function (ev) {
	//             console.info(ev.target);
	//         },
	//         clickNextBtn: function (ev) {
	//             console.info(ev)
	//         },
	//         clickSlideBtn: function (ev) {
	//             console.info(ev);
	//         },
	//         clickPaginationBullet: function (ev) {
	//             console.info(ev.target);
	//         },
	//         toEdge: function (empile) {
	//             console.info(empile.activeIndex);
	//         },
	//         pageHidden: function (empile) {
	//             console.info('hidden');
	//         },
	//         pageVisible: function (empile) {
	//             console.info('visible');   
	//         }
	//     },
	//     pagination: {
	//         el: document.querySelector('.navigation'),
	//         clickable: true,
	//         bulletClass: 'dot',
	//         bulletActiveClass: 'active',
	//     },
	//     css: function (coord, absCoord) {
	//         var zIndex = 100 - absCoord,
	//             opacity = Math.pow(.92, absCoord).toFixed(3),
	//             scale = 'scale(' + Math.pow(.9, absCoord).toFixed(2) + ')',
	//             translateX = 'translateX(' + 100 * coord + 'px)';
	//         var transform = [translateX, scale].join(' ');
	//         return {
	//             zIndex: zIndex,
	//             opacity: opacity,
	//             transform: transform,
	//         }
	//     },
	// });
	// console.info(empile1);
	// var empile2 = new Empile($('.demo2>.container'), {
	//     autoplay: {
	//         delay: 7000,
	//     },
	//     isClickSlide: true,
	//     navigation: {
	//         nextEl: $('.demo2 .btn-right'),
	//         prevEl: $('.demo2 .btn-left'),
	//     },
	//     css: function (coord, absCoord, index) {
	//         var zIndex = 100 - absCoord,
	//             opacity = Math.pow(.92, absCoord).toFixed(3),
	//             scale = 'scale(' + Math.pow(.9, absCoord).toFixed(2) + ')',
	//             translateX = 'translateY(' + 35 * coord + 'px)';
	//         var transform = [translateX, scale].join(' ');
	//         return {
	//             zIndex: zIndex,
	//             opacity: opacity,
	//             transform: transform,
	//         }
	//     },
	// });
	// var empile3 = new Empile($('.demo3 > .container'), {
	//     autoplay: false,
	//     isClickSlide: true,
	//     waitForTransition: true,
	//     navigation: {
	//         nextEl: $('.demo3 .btn-right'),
	//         prevEl: $('.demo3 .btn-left'),
	//     },
	//     css: function (coord, absCoord) {
	//         var zIndex = 100 - absCoord,
	//             opacity = Math.pow(.9 , absCoord).toFixed(3),
	//             translateX = 'translateX(' + 130 * coord + 'px)',
	//             translateY = 'translateY(' + -200 * Math.sin(coord * Math.PI / 4).toFixed(3) + 'px)',
	//             scale = 'scale(.7)';
	//         var transform = [scale, translateX, translateY].join(' ');
	//         return {
	//             'z-index': zIndex,
	//             opacity: opacity,
	//             transform: transform,
	//         }
	//     },
	// });
	// var empile4 = new Empile($('.demo4>.container'), {
	//     autoplay: true,
	//     waitForTransition: false,
	//     isClickSlide: true,
	//     navigation: {
	//         nextEl: $('.demo4 .btn-right'),
	//         prevEl: $('.demo4 .btn-left'),
	//     },
	//     css: function (coord, absCoord) {
	//         var zIndex = 100 - absCoord,
	//             opacity = Math.pow(.6, absCoord).toFixed(3),
	//             scale = 'scale(' + Math.pow(.9, absCoord).toFixed(2) + ')',
	//             translateX = 'translateX(' + 95 * coord + 'px)',
	//             transformOrigin = 'center bottom';
	//         var transform = [translateX, scale].join(' ');
	//         return {
	//             'z-index': zIndex,
	//             opacity: opacity,
	//             'transform-origin': transformOrigin,
	//             transform: transform,
	//         }
	//     },
	// });
	var empile5 = new Empile($('.demo5>.container1'), {
		autoplay: true,
		waitForTransition: true,
		isClickSlide: true,
		navigation: {
			nextEl: $('.demo5 .btn-right'),
			prevEl: $('.demo5 .btn-left'),
		},
		// css: function (coord, absCoord) {
		
		//             var zIndex = 100 - absCoord,
		//                 opacity = Math.pow(.9, absCoord).toFixed(3),
		//                 scale = 'scale(' + Math.pow(.8, absCoord).toFixed(2) + ')',
		//                 translateX = 'translateX(' + 180 * coord + 'px)';
		
		//             var transform = [translateX, scale].join(' ');
		//             return {
		//                 'z-index': zIndex,
		//                 opacity: opacity,
		//                 transform: transform,
		//             }
		
		//         },
		css: function (coord, absCoord) {
			var translateX;
			if (screenWidth < 575) {
				translateX = 'translateX(' + 100 * coord + 'px)';
			} else {
				translateX = 'translateX(' + 360 * coord + 'px)';
			}
			var zIndex = 100 - absCoord,
				opacity = Math.pow(.9, absCoord).toFixed(3),
				scale = 'scale(' + Math.pow(.6, absCoord).toFixed(2) + ')';
			var transform = [translateX, scale].join(' ');
			return {
				'z-index': zIndex,
				opacity: opacity,
				transform: transform,
			}
		},
	});
	// var demo6Container = $('.demo6 >.container'),
	//     demo6FirstSlideW = demo6Container.children[0].offsetWidth;
	// var empile6 = new Empile(demo6Container, {
	//     autoplay: {
	//         delay: 6000,
	//     },
	//     waitForTransition: true,
	//     navigation: {
	//         nextEl: $('.demo6 .btn-right'),
	//         prevEl: $('.demo6 .btn-left'),
	//     },
	//     css: function (coord, absCoord) {
	//         var zIndex = 100 - absCoord,
	//             translateX = 'translateX(' + (demo6FirstSlideW + 20) * coord + 'px)';
	//         var transform = translateX;
	//         return {
	//             'z-index': zIndex,
	//             transform: transform,
	//         }
	//     },
	// });
	// var demo7Container = $('.demo7 > .container'),
	//     demo7FirstSlideW = demo7Container.children[0].offsetWidth;
	// var empile7 = new Empile(demo7Container, {
	//     autoplay: false,
	//     waitForTransition: true,
	//     isClickSlide: true,
	//     navigation: {
	//         nextEl: $('.demo7 .btn-right'),
	//         prevEl: $('.demo7 .btn-left'),
	//     },
	//     css: function (coord, absCoord) {
	//         var zIndex = 100 - absCoord,
	//             translateX = 'translateX(' + demo7FirstSlideW * coord + 'px)';
	//         var transform = translateX;
	//         return {
	//             'z-index': zIndex,
	//             transform: transform,
	//         }
	//     },
	// });
})(document);