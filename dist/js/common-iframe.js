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

        _this.$table = _this.tableClass ? $(_this.tableClass) : _this.$selectAll.closest('table');

        // 表格头部固定 两个表格 头部 js-table-header
        if( _this.$table.hasClass('js-table-header')) {
            _this.$tableHeader = _this.$selectAll.closest('table');
            _this.$table       = _this.$tableHeader.next();
        }
        else {
            _this.$tableHeader = _this.$table;
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
        tableClass    : '.table',
        select: {
            selectAllClass: '.js-select-all',
            checkboxClass : '.js-checkbox'
        },
        sort: {
            sortItemClass : '.js-sort-item',
            sortUpClass   : '.js-sort-up',
            sortDownClass : '.js-sort-down',
            sortUpFun     : function () {console.log('up1');},
            sortDownFun   : function () {console.log('down2');}
        }
    };

    Table.prototype.checkbox = function () {
        var $table       = this.$table,
            $tableHeader = this.$tableHeader,
            $selectAll   = this.$selectAll,
            $checkbox    = this.$checkbox;

        // 复选框选中
        $tableHeader.on('click', this.checkboxClass, function (e) {
            e.stopPropagation();
            e.preventDefault();

             var $this = $(this);

             // selectCheckBox($selectAllDom, $checkBoxDom, $checkBoxDomAll)
             selectCheckBox($selectAll, $this, $checkbox);

         });

        //  全选 与选择一行发生冲突 暂时不用
        $table.on('click', this.selectAllClass, function (e) {
            e.stopPropagation();
            e.preventDefault();

             var $this = $(this);

             // selectCheckBoxAll($selectAllDom, $checkBoxDomAll)
             selectCheckBoxAll($this, $checkbox);
         });

        // 点击一行选中复选框
        $table.on('click', 'tr', function (e) {
            e.stopPropagation();
            e.preventDefault();

            var $this            = $(this),
                $checkboxCurrent = $this.find('.js-checkbox');

            if($checkboxCurrent.length == 0) {
                $checkboxCurrent =  $this.find('.js-select-all');

                // selectCheckBoxAll($selectAllDom, $checkBoxDomAll)
                selectCheckBoxAll($checkboxCurrent, $checkbox);
            }
            else {

                // selectCheckBox($selectAllDom, $checkBoxDom, $checkBoxDomAll)
                selectCheckBox($selectAll, $checkboxCurrent, $checkbox);
            }
        })
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

