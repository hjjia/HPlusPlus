/**
 * Created by huangjiajia on 2016/10/12.
 * Description: 子页面的公共函数
 */
// 新开Tab
$('.js-nav-item').on('click', function () {
    var $this  = $(this),
        href   = $this.data('target'),
        text   = $this.text(),
        index  = $this.data('index');

    parent.newTab($this, href, text);

    //$this.addClass('active').siblings('.js-nav-item').removeClass('active');
});

/*
* 模糊查询
*/
(function($) {

    var blurSelect = function (element, options) {
        var _this = this;

        _this.options = options;
        _this.$panel  = $(_this.options.panelClass);

        _this.selectArr = [];

        _this.focusSelect();
        _this.select();
        _this.hideWrap();
    };

    blurSelect.DEFAULTS = {
        multiSelect: false,
        panelClass : '.js-blur-panel',
        inputClass : '.js-blur-input',
        wrapClass  : '.js-blur-wrap',
        ajax       : {
            type    : 'GET',
            url     : '',
            dataType: 'json',
            data    : ''
        },
        enterKeyFun : function ($input) {
            console.log('enter')
        }
    };

    /**
     * Description: 输入框获得焦点
     * Functions  : 1. panel add active class; 2. send ajax
     */
    blurSelect.prototype.focusSelect = function () {
        var _this  = this,
            $panel = _this.$panel,
            $input = $(_this.options.inputClass);

        /*
         * 输入框获得焦点
         * 1. panel add active class
         * 2. 模糊查询
         */
        $input.on('focus', function () {
            $panel.addClass('active');
            _this.createResultHtml();
            _this.sendAjax();
        })
    };

    /**
     * 隐藏wrap
     */
    blurSelect.prototype.hideWrap = function () {
        var _this = this;

        $('body').on('click', function (e) {
            if($(e.target).closest(_this.options.panelClass).length == 0) {
                _this.$panel.removeClass('active');
            }
        })
    };

    /**
     * 查询入口方法
     */
    blurSelect.prototype.select = function () {

        // 创建HTML 和 发送ajax
        this.selectCommon();

        /*
         * 1. 判断是否为多选模糊查询  option -> multiSelect 默认为单模糊查询
         */
        if(this.options.multiSelect) { // 多选模糊查询
            this.multiSelect();
        }
        else {  // 单选模糊查询
            this.singleSelect();
        }
    };

    /**
     * 多选查询和单选查询 公共方法 -- 创建HTML和ajax发送
     */
    blurSelect.prototype.selectCommon = function () {
        var _this  = this,
            $panel = _this.$panel;

        /*
         * 1. 创建查询结果面板
         * 2. 监听input keyup事件
         * 3. 遍历结果
         */
        _this.createResultHtml();

        // 模糊查询
        $panel.on('keyup', _this.options.inputClass, function (e) {
            var e          = e || event,
                currentKey = e.keyCode || e.which || e.charCode;  //支持IE,FireFox;

            if(currentKey == 13){
                _this.options.enterKeyFun($(this));
                $panel.removeClass('active');
            }
            else {
                _this.sendAjax();
            }
        });

        // 禁止输入框回车自动刷新页面
        $panel.on('keydown', _this.options.inputClass, function (e) {
            var e          = e || event,
                currentKey = e.keyCode || e.which || e.charCode;  //支持IE,FireFox;

            if(currentKey == 13){
                return false;
            }
        });


    };

    /**
     *
     */
    blurSelect.prototype.sendAjax = function () {
        var _this     = this,
            $panel    = _this.$panel,
            $input    = $(_this.options.inputClass),
            value     = $input.val(),
            $wrap     = $panel.find(_this.options.wrapClass),
            ajaxType  = _this.options.ajax,
            html      = '',
            result    = '',
            selectArr = _this.selectArr;

        $.ajax({
            type: ajaxType.type,
            dataType: ajaxType.dataType,
            url: ajaxType.url,
            data: {keyword: value},
            success: function (data) {
                result = data.data;

                // 添加数据 data.data
                for(var i = 0,len = result.length; i < len; i ++) {
                    if($.inArray(result[i].id.toString(), selectArr) == -1) {
                        html += '<li class="list-item js-list-item" data-id="' + result[i].id + '">';
                    }
                    else {
                        html += '<li class="list-item js-list-item active" data-id="' + result[i].id + '">';
                    }
                    html += '<div class="item-content">';
                    html += '<span class="text">' + result[i].text + '</span>';
                    html += '<span class="glyphicon glyphicon-remove"></span>';
                    html += '</div>';
                    html += '</li>';
                }

                $wrap.find('.list-block').html(html);
            }
        })
    };

    /**
     * 多选模糊查询
     */
    blurSelect.prototype.multiSelect = function () {
        var _this  = this,
            $panel = _this.$panel;

        /*
         * 选择列表数据
         * 1. 判断是否被选中 如果没有被选中 -> 更新当前状态，并且数据更新到查询面板上
         */
        $panel.on('click', '.js-list-item', function () {
            var $this     = $(this),
                id        = $this.attr('data-id'),
                html      = '',
                selectArr = _this.selectArr;

            if($this.hasClass('active')) { // 如果已经被选中
                $this.removeClass('active');
                $panel.find('.js-select-list .js-selected-item[data-id="' + id + '"]').remove();

                selectArr.splice($.inArray(id, selectArr),1);
            }
            else { // 如果没有被选中
                if($panel.find('.js-select-list').length == 0) {
                    html += '<div class="selected-list js-select-list">';
                    html += '</div>';

                    $panel.find(_this.options.inputClass).before(html);
                }

                html = '';
                html += '<span class="selected-item js-selected-item" data-id="' + id + '">' + $this.text();
                html += '<span class="glyphicon glyphicon-remove js-selected-remove"></span></span>';
                $panel.find('.js-select-list').append(html);

                // 更新当前状态
                $this.addClass('active');

                selectArr.push(id);
            }
        });

        // 面板选中移除按钮 删除当前选中信息
        $panel.on('click', '.js-selected-remove', function (e) {
            e.stopImmediatePropagation();  // 阻止其他绑定在该元素上的事件运行，如果不加，会跟hideWrap()方法冲突

            var $selectedItem = $(this).closest('.js-selected-item'),
                id            = $selectedItem.attr('data-id'),
                selectArr     = _this.selectArr;

            selectArr.splice($.inArray(id, selectArr),1);
            $('.js-blur-wrap .js-list-item[data-id="' + id + '"]').removeClass('active');
            $selectedItem.remove();

            $(_this.options.inputClass).focus();
        });
    };

    /**
     * 单选模糊查询
     */
    blurSelect.prototype.singleSelect = function () {
        var _this  = this,
            $panel = _this.$panel;

        /*
         * 选择信息 .js-list-item
         * 1. 隐藏wrap面板
         * 2. 更新select-list
         */
        $panel.on('click', '.js-list-item', function () {
            var $this  = $(this),
                $wrap  = $this.closest(_this.options.wrapClass),
                $input = $(_this.options.inputClass);

            $input.val($this.text()).attr('data-id', $this.attr('data-id'));
            $panel.removeClass('active');
        })
    };

    blurSelect.prototype.createResultHtml = function () {
        var html   = '',
            $panel = this.$panel;

        $panel.find(this.options.wrapClass).remove();

        html += '<div class="blur-wrap ' + this.options.wrapClass.substring(1) + '">';
        html += '<ul class="list-block">';
        html += '</ul>';
        html += '</div>';

        $panel.append(html);
    };

    /**
     * Description: 扩展到jquery上
     * @param option
     * @returns {blurSelect}
     */
    $.fn.blurSelect = function (option) {
        var options = null;

        option.ajax = $.extend({}, blurSelect.DEFAULTS.ajax, option.ajax);
        options     = $.extend({}, blurSelect.DEFAULTS, option);
        return new blurSelect(this, options);
    };

})(jQuery);


/*
 * 表格操作 全选和排序
 */
(function ($) {
    // 全选 .js-table .js-select-all .js-checkbox
    function Table(element, options) {
        var _this         = this;

        _this.options = options;


        // 复选框选中和全选
        _this.tableClass     = options.tableClass;

        _this.selectAllClass = options.select.selectAllClass;
        _this.checkboxClass  = options.select.checkboxClass;

        _this.$selectAll = $(_this.selectAllClass);
        _this.$checkbox  = $(_this.checkboxClass);

        _this.$tableHeader = _this.tableHeaderClass ? $(_this.tableHeaderClass) : _this.$selectAll.closest('table');

        // 表格头部固定 两个表格 头部 js-table-header
        if( _this.$tableHeader.length > 0) {
            _this.$table = _this.$tableHeader.closest('.js-table-header-wrap').next().find('.js-table');
        }
        else {
            _this.$tableHeader = _this.$table = $(_this.tableClass);
        }


        _this.checkbox();

        // 排序
        _this.sortItemClass = options.sort.sortItemClass;
        _this.sortUpClass   = options.sort.sortUpClass;
        _this.sortDownClass = options.sort.sortDownClass;
        _this.sortUpFun     = options.sort.sortUpFun;
        _this.sortDownFun   = options.sort.sortDownFun;

        _this.$sortItem   = $(_this.sortItemClass);
        _this.$sortUp     = $(_this.sortUpClass);
        _this.$sortDown   = $(_this.sortDownClass);

        _this.$table.length == 0 && (_this.$table = _this.$sortItem.closest('table'));

        _this.sort();
    }

    /*
     *   th: .js-sort-item
     *   up: .js-sort-up
     * down: .js-sort-down
     */
    Table.DEFAULTS = {
        tableHeaderClass  : '.js-table-header',
        tableClass        : '.js-table',
        select: {
            selectAllClass: '.js-select-all',
            checkboxClass : '.js-checkbox'
        },
        sort: {
            sortItemClass : '.js-sort-item',
            sortUpClass   : '.js-sort-up',
            sortDownClass : '.js-sort-down',
            sortUpFun     : function () {},
            sortDownFun   : function () {}
        }
    };

    Table.prototype.checkbox = function () {
        var _this        = this,
            $table       = this.$table,
            $tableHeader = this.$tableHeader,
            $selectAll   = this.$selectAll,
            $checkbox    = this.$checkbox;

        // 复选框选中
        $table.on('click', this.checkboxClass, function (e) {
            e.stopPropagation();
            e.preventDefault();

             var $this = $(this);

             // selectCheckBox($selectAllDom, $checkBoxDom, $checkBoxDomAll)
             selectCheckBox($selectAll, $this, $checkbox);

         });

        //  全选 与选择一行发生冲突 暂时不用
        $tableHeader.on('click', this.selectAllClass, function (e) {
            e.stopPropagation();
            e.preventDefault();

             var $this = $(this);

             // selectCheckBoxAll($selectAllDom, $checkBoxDomAll)
             selectCheckBoxAll($this, $checkbox);
         });

        // 点击一行选中复选框 table-body
        $table.on('click', 'tr', function (e) {
            e.stopPropagation();
            e.preventDefault();

            var $this            = $(this),
                $checkboxCurrent = $this.find('.js-checkbox');

            // selectCheckBox($selectAllDom, $checkBoxDom, $checkBoxDomAll)
            selectCheckBox($selectAll, $checkboxCurrent, $checkbox);
        });

        // 点击一行选中复选框 table-header
        $tableHeader.on('click', 'tr', function (e) {
            e.stopPropagation();
            e.preventDefault();

            var $this            = $(this),
                $checkboxCurrent = $this.find(_this.selectAllClass);

            // selectCheckBoxAll($selectAllDom, $checkBoxDomAll)
            selectCheckBoxAll($checkboxCurrent, $checkbox);
        });

    };

    /**
     * Description: 选择复选框
     * @param $selectAllDom: 全选DOM
     * @param $checkBoxDom: 当前点击的复选框DOM
     * @param $checkBoxDomAll: 复选框所有DOM
     */
    function selectCheckBox($selectAllDom, $checkBoxDom, $checkBoxDomAll) {
        var $this       = $checkBoxDom,
            isSelectAll = true;

        if($this.prop('checked')) {
            $this.prop('checked', false);
            $this.find('input[type="checkbox"]').prop('checked', false).removeAttr('checked');
        }
        else {
            $this.prop('checked', true);
            $this.find('input[type="checkbox"]').prop('checked', true).attr('checked','checked');
        }

        // 判断是否被全选中
        $checkBoxDomAll.each(function () {
            !$(this).prop('checked') && (isSelectAll = false);
        });

        if (isSelectAll) {
            $selectAllDom.prop('checked', true);
            $selectAllDom.find('input[type="checkbox"]').prop('checked', true).attr('checked','checked');
        }
        else {
            $selectAllDom.prop('checked', false);
            $selectAllDom.find('input[type="checkbox"]').prop('checked', false).removeAttr('checked');
        }
    }

    /**
     * Description: 表格全选
     * @param $selectAllDom: 全选DOM
     * @param $checkBoxDomAll: 复选框所有DOM
     */
    function selectCheckBoxAll($selectAllDom, $checkBoxDomAll) {
        var $this = $selectAllDom;

        if($this.prop('checked')) {
            $this.prop('checked', false);
            $this.find('input[type="checkbox"]').prop('checked', false).removeAttr('checked');
            $checkBoxDomAll.prop('checked', false);
            $checkBoxDomAll.find('input[type="checkbox"]').prop('checked', false).removeAttr('checked');
        }
        else {
            $this.prop('checked', true);
            $this.find('input[type="checkbox"]').prop('checked', true).attr('checked','checked');
            $checkBoxDomAll.prop('checked', true);
            $checkBoxDomAll.find('input[type="checkbox"]').prop('checked', true).attr('checked','checked');
        }
    }

    //
    Table.prototype.sort = function () {
        var _this        = this,
            $table       = _this.$table,
            $tableHeader = _this.$tableHeader,
            $sortItem    = _this.$sortItem;

        /*
         *   th: sortItemClass
         *   up: sortUp
         * down: sortDown
         */
        $tableHeader.on('click', _this.sortItemClass, function (e) {
            e.stopPropagation();
            e.preventDefault();

            var $this    = $(this),
                sortType = _this.getSortType($this);

            /*
             * 1. 判断当前状态 如果sortUp 则降序，如果为sortDown 则升序
             * 2. 改变当前$sortItem的class
             */
            switch (sortType) {
                case 'sortUp':

                    /*
                     * 1. 改变排序图标 -> sortDown
                     * 2. 改变sortItem Class
                     */
                    $this.find(_this.sortUpClass).hide();
                    $this.find(_this.sortDownClass).addClass('active').show();
                    $this.removeClass(_this.sortUpClass.substring(1)).addClass(_this.sortDownClass.substring(1));
                    _this.sortDownFun($this);
                    break;
                case 'sortDown':

                    /*
                     * 1. 改变排序图标 -> sortUpown
                     * 2. 改变sortItem Class
                     */
                    $this.find(_this.sortDownClass).hide();
                    $this.find(_this.sortUpClass).addClass('active').show();
                    $this.removeClass(_this.sortDownClass.substring(1)).addClass(_this.sortUpClass.substring(1));
                    _this.sortUpFun($this);
                    break;
            }

            // 重置其他排序样式
            $this.siblings(_this.sortItemClass).removeClass(_this.sortDownClass.substring(1))
                     .removeClass(_this.sortUpClass.substring(1));
            $this.siblings(_this.sortItemClass).find(_this.sortUpClass).removeClass('active').show();
            $this.siblings(_this.sortItemClass).find(_this.sortDownClass).removeClass('active').show();
        });
    };

    /**
     * Description: 判断当前状态
     * @param $dom
     * @returns {string}
     */
    Table.prototype.getSortType = function ($dom) {
        var _this    = this,
            sortType = 'sortUp';

        if($dom.hasClass(_this.sortDownClass.substring(1))) {
            sortType = 'sortDown';
        }
        else {
            sortType = 'sortUp';
        }

        return sortType;
    };


    // 扩展到jQuery上
    function Plugin(option) {
        return this.each(function () {
            var $this   = $(this),
                data    = $this.data('bs.table'),
                options = null;

            option.select = $.extend({}, Table.DEFAULTS.select, typeof option == 'object' && option.select);
            option.sort   = $.extend({}, Table.DEFAULTS.sort, typeof option == 'object' && option.sort);
            options       = $.extend({}, Table.DEFAULTS, $this.data(), typeof option == 'object' && option);

            !data && ($this.data('bs.table', new Table(this, options)));
        })
    }
    var old = $.fn.table;

    $.fn.table             = Plugin;
    $.fn.table.Constructor = Table;

    $.fn.table.noConflict = function () {
        $.fn.table = old;
        return this;
    };

    // 事件处理程序 暂时没有用
    var clickHandler = function (e) {
        var $this = $(this);

    };

    $(window).on('load', function () {
        $('.js-table').each(function () {
            var $table = $(this);

            Plugin.call($table, $table.data());
        })
    })

})(jQuery);

