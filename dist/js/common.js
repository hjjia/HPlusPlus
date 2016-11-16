/**
 * Created by huangjiajia on 2016/10/11.
 * 父页面的公共函数
 */

/**
 * @Author huangjiajia
 * @Description 新开Tab方法
 * @param href  iframe 链接
 * @param $dom 第几个 iframe
 * @param text  Tab名称
 * @returns {boolean}
 */
function newTab($dom, href, text) {
    var htmlTab     = '',
        htmlIframe  = '',
        isShow      = true,
        indexID     = +new Date(),
        index       = $dom.attr('data-index'),
        iframeIndex = 'iframe' + index;

    // 判断链接是否存在
    if(href == undefined || $.trim(href).length == 0) {
        return false;
    }

    // 判断当前选项卡是否已经添加
    $('#page-content .js-tab-item').each(function () {
        var $that = $(this);

        // 如果存在，判断是否为active状态
        if($that.data('name') == iframeIndex) {

            if(!$that.hasClass('active')) {
                $that.addClass('active').siblings('.js-tab-item').removeClass('active');

                // 判断当前的是否在可视区域
                showActiveTabItem();

                // 显示相应页面
                showExistIframe(iframeIndex);
            } // end if

            // 当前选项卡为active状态
            isShow = false;
            return false;
        }
    });

    // 如果当前选项卡不存在，则新开一个选项卡
    if(isShow) {
        htmlTab += '<li class="tab-item active js-tab-item"  data-href="' + href + '" data-name="iframe' + indexID + '">';
        htmlTab += '<a class="link" href="javascript:;">' + text + '<span class="glyphicon glyphicon-remove-sign js-close-btn"></span></a>';
        htmlTab += '</li>';

        $('#page-content .js-tab-item').removeClass('active');
        $('.js-tab-list').append(htmlTab);

        htmlIframe += '<iframe class="js-iframe" id="iframe' + indexID + '" name="iframe' + indexID + '" width="100%" height="100%" src="' + href + '" frameborder="0" data-href="' + href + '" seamless=""></iframe>';
        $('#page-main').find('.js-iframe').hide();
        $('#page-main').append(htmlIframe);

        // 判断当前选项卡是否在可视区域
        showActiveTabItem();

        // 更新左边导航的data-index值
        $dom.attr('data-index', indexID);
    }
}

/**
 * @Author huangjiajia
 * @Description 保证当前被激活的tab在可视区域内
 */
function showActiveTabItem() {
    var $tabActive = $('.js-tab-list .js-tab-item.active'),
        $tabRight  = $('.js-tab-menu .js-right'),
        $tabList   = $('.js-tab-list'),
        originLeft = $tabList.css('margin-left').split('px')[0] * 1,
        diffLeft   = $tabRight.position().left - $tabActive.position().left - $tabActive.width() + originLeft;

    /*
     * 判断是否在可视区域内： offset().left + width > $tabRight.offset().left
     * 设置$tabList的margin-left: - ($tabRight.offset().left - offset().left - width)
    */
    if(diffLeft < 0) {
        $tabList.css('margin-left', diffLeft + 'px');
    }
}

/**
 * @Author huangjiajia
 * @Description 显示iframe
 * @param href
 */
function showExistIframe(name) {
    $('#page-main .js-iframe').each(function () {
        var $self = $(this);

        if($self.attr('id') == name) {
            $self.show().siblings('.js-iframe').hide();
            return false;
        }
    }); // end each
}

// 新开Tab
$('.js-nav-item').on('click', function (e) {
    e.preventDefault();
    e.stopPropagation();

    var $this   = $(this),
        href    = $this.data('target'),
        text    = $this.text(),
        //index   = $this.data('index'),
        $subnav = $this.find('.js-subnav'),
        $parentNav;

    newTab($this, href, text);

    if(!$this.hasClass('active')) {

        if($this.closest('.js-subnav').length == 0) {
            if($subnav.length > 0) {
                $subnav.slideDown(300);
                $this.siblings('.js-nav-item').find('.js-subnav').fadeOut(300)
            }

            $this.addClass('active').siblings('.js-nav-item').removeClass('active');
        }
        else {
            $parentNav = $this.closest('.js-subnav').closest('.js-nav-item');

            if(!$parentNav.hasClass('active')) {
                $parentNav.addClass('active');
                $parentNav.siblings('.js-nav-item').removeClass('active');
            }
        }
    }
    else {
        $subnav.slideUp(300);
        $this.removeClass('active');
    }

});

function selectTabItem() {
    var $this = $(this),
        name;

    // 判断当前选项卡是否为active
    if(!$(this).hasClass('active')) {
        name = $this.data('name');

        // 显示相应的iframe
        showExistIframe(name);

        // 当前选项卡更新为active
        $this.addClass('active').siblings('.js-tab-item').removeClass('active');

        // 判断当前选项卡是否在可视区域
        showActiveTabItem();
    }
}

// 选择选项卡
$('.js-tab-list').on('click', '.js-tab-item', selectTabItem);

function closeCurrentTab() {
    //e.preventDefault();
    var $this    = $(this),
        $tabItem = $this.closest('.js-tab-item'),
        $lastTab;

    // 关闭当前Tab
    $('.js-iframe[id="' + $tabItem.data('name') + '"]').remove();
    $tabItem.remove();

    /*
     * 更新选项卡
     * 定位到最后一个js-tab-item
     */
    $lastTab = $(".js-tab-list .js-tab-item").last();

    $lastTab.addClass('active');
    $('.js-iframe[id="' + $lastTab.data('name') + '"]').show();
}

// 点击选项卡后面的关闭图标，关闭当前选项卡和iframe
$('.js-tab-list').on('click', '.js-close-btn', closeCurrentTab);

// 刷新当前Tab 只能刷新当前相同域下面的页面
$('.js-refresh').on('click', function () {

    // 获取当前iframe .js-tab-item.active
    var iframeName = $('.js-tab-item.active').data('name');

    document.getElementById(iframeName).contentWindow.location.reload(true);
});

/* 关闭选项卡面板 */
// 定位到当前选项卡、#js-fix-tab-item
$('#js-fix-tab-item').on('click', function () {
    showActiveTabItem();
});

// 关闭全部选项卡 #js-close-all-tab .js-tab-list -> .js-tab-item
$('#js-close-all-tab').on('click', function () {

    //var $tabItem = $('.js-tab-list .js-tab-item');
    // 遍历$tabItem 删除与之对应的iframe
    $('.js-iframe:not(:first-child)').remove();
    $('.js-tab-list .js-tab-item:not(:first-child)').remove();
    $('.js-tab-list .js-tab-item:first-child').addClass('active');

});

// 关闭其他选项卡 #js-close-other-tab .js-tab-list -> .js-tab-item
$('#js-close-other-tab').on('click', function () {
    var $tabActive = $('.js-tab-list .js-tab-item.active'),
        iframeName = $tabActive.data('name');

    $tabActive.siblings('.js-tab-item:not(:first-child)').remove();
    $('.js-iframe[id="' + iframeName + '"]').siblings('.js-frame:not(:first-child)').remove();
});
/* 关闭选项卡面板 END */

/* tab-list 向前和向后操作 */
// 向前 #js-tab-prev js-tab-list -> margin-left: 0;
$('#js-tab-prev').on('click', function () {
    $('.js-tab-list').css('margin-left',0);
});

// 向后 #js-tab-next .js-tab-list -> margin-left: width() - right.width
$('#js-tab-next').on('click', function () {
    var $tabMenu   = $('.js-tab-menu'),
        $tabList   = $tabMenu.find('.js-tab-list'),
        $tabItem   = $tabList.find('.js-tab-item'),
        $tabRight  = $('.js-tab-menu .js-right'),
        prevWidth  = $('#js-tab-prev').outerWidth(),
        diffLeft   = 0,
        offsetLeft = 0;

    diffLeft = $tabMenu.width() - $tabRight.outerWidth() - prevWidth;
    $tabItem.each(function(){

        offsetLeft = $(this).position().left;
        offsetLeft = offsetLeft - 40;

        if(offsetLeft > diffLeft) {
            $tabList.css('margin-left', -(offsetLeft) + 'px');
            return;
        }
    });
});

/* tab-list 向前和向后操作 END */

// 收起菜单 #js-menu-control
$('#js-menu-control').on('click', function () {
    var $this    = $(this),
        $leftBar = $('#page-navbar-left'),
        $header  = $('#page-header'),
        $pages   = $('#page-content');

    if($this.hasClass('folder')) {
        $this.removeClass('folder');
        $leftBar.removeClass('folder');
        $header.removeClass('folder');
        $pages.removeClass('folder');
    }
    else {
        $this.addClass('folder');
        $leftBar.addClass('folder');
        $header.addClass('folder');
        $pages.addClass('folder');
    }
});



//头部下拉颜色变白固定效果
window.onscroll=function(){
    var t = document.documentElement.scrollTop || document.body.scrollTop;
    if ( t > 0 ) {
        $('.container-header').css({'background-color':'#fff','border-bottom-color':'#f8ac59'});
    } else {
        $('.container-header').css({'background-color':'transparent','border-bottom-color':'transparent'});
    }
}

