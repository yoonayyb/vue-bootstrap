// 定义节流函数
function throttle(callback, limit) {
	var waiting = false; // 初始时，我们不处于等待状态
	return function() { // 返回一个被节流的函数
		if (!waiting) { // 如果我们不处于等待状态
			callback.call(); // 执行用户的函数
			waiting = true; // 防止未来的调用
			setTimeout(function() { // 一段时间后
				waiting = false; // 允许未来的调用
			}, limit);
		}
	}
}
// 定义防抖函数
function debounce(callback, delay) {
	var timer;
	return function() {
		clearTimeout(timer); // 每次触发事件时先清除上一次的定时器
		timer = setTimeout(function() {
			callback.call(); // 延迟一段时间后执行用户的函数
		}, delay);
	}
}
var scrllTop = -1
jQuery(document).ready(function() {
	const $ScrollWrap = $(document)
	// 监听滚动停止
	let t1 = 0;
	let t2 = 0;
	let timer = null; // 定时器
	function isScrollEnd() {
		t2 = $ScrollWrap.scrollTop();
		// console.log('isScrollEnd')
		if (t2 == t1) {
			// $('.buy').show();
			$('.topnav').slideDown("fast");
			clearTimeout(timer)
		}
	}

	$(window).scroll(function() {
		$('.topnav').toggleClass('shadow-sm scrollednav py-0 ', $(this).scrollTop() > 50);
		$('.topnav').slideUp("fast");
		// 滚动
		clearTimeout(timer)
		timer = setTimeout(isScrollEnd, 500)
		t1 = $ScrollWrap.scrollTop()
		// $('.topnav').slideToggle("slow");
		// console.log('banner的高度', $('#example-carousel').height())
		if ($(this).scrollTop() > $('#example-carousel').height()) {
			console.log('切换深色')

			$('.home-topnav').addClass('bg-nav-primary');
			$('.home-topnav').removeClass('bg-nav-primary-trigger');
		} else {
			console.log('切换透明色')
			$('.home-topnav').addClass('bg-nav-primary-trigger');
			$('.home-topnav').removeClass('bg-nav-primary');
		}
	});
	$('#modal_newsletter').on('show.bs.modal', function() {
		$('.downloadzip')[0].click();
	});
	$('.navbar-nav .nav-item').on('click', function() {
		$('.navbar-nav .nav-item').removeClass('yactive');
		$(this).addClass('yactive');
	});

	$('.bottom-tabs').click(function() {
		// 首先移除所有的bottom-tabs上的active类
		$('.bottom-tabs').removeClass('yactive');
		// 然后给当前点击的bottom-tabs添加active类
		$(this).addClass('yactive');
	});
});