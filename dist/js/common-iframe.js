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
        var _this = this;

        _this.tableClass     = options.tableClass;
        _this.selectAllClass = options.selectAllClass;
        _this.checkboxClass  = options.checkboxClass;

        _this.$selectAll = $(_this.selectAllClass);
        _this.$checkbox  = $(_this.checkboxClass);
        _this.$table     = _this.tableClass ? $(_this.tableClass) : _this.$selectAll.closest('table');

        _this.checkbox();
    }

    Table.DEFAULTS = {
        tableClass: '.table',
        selectAllClass: '.js-select-all',
        checkboxClass: '.js-checkbox'
    };

    Table.prototype.checkbox = function () {
        var $table     = this.$table,
            $selectAll = this.$selectAll,
            $checkbox  = this.$checkbox;

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
            $this.find('input[type="checkbox"]').prop('checked', false);
        }
        else {
            $this.prop('checked', true);
            $this.find('input[type="checkbox"]').prop('checked', true);
        }

        // 判断是否被全选中
        $checkBoxDomAll.each(function () {
            !$(this).prop('checked') && (isSelectAll = false);
        });

        if (isSelectAll) {
            $selectAllDom.prop('checked', true);
            $selectAllDom.find('input[type="checkbox"]').prop('checked', true);
        }
        else {
            $selectAllDom.prop('checked', false);
            $selectAllDom.find('input[type="checkbox"]').prop('checked', false);
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
            $this.find('input[type="checkbox"]').prop('checked', false);
            $checkBoxDomAll.prop('checked', false);
            $checkBoxDomAll.find('input[type="checkbox"]').prop('checked', false);
        }
        else {
            $this.prop('checked', true);
            $this.find('input[type="checkbox"]').prop('checked', true);
            $checkBoxDomAll.prop('checked', true);
            $checkBoxDomAll.find('input[type="checkbox"]').prop('checked', true);
        }
    }

    $.fn.tableSelect = function (options) {
        return new Table(this, options);
    };

    // 扩展到jQuery上
    function Plugin(option) {
        return this.each(function () {
            var $this   = $(this),
                data    = $this.data('bs.table'),
                options = $.extend({}, Table.DEFAULTS, $this.data(), typeof option == 'object' && option);

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
        $('.table').each(function () {
            var $table = $(this);

            Plugin.call($table, $table.data());
        })
    })


})(jQuery);

