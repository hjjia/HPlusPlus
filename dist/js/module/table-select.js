/**
 * Created by huangjiajia on 2016/11/14.
 * Description: 表格全操作
 */
(function ($) {
    // 全选 .js-table .js-select-all .js-checkbox
    function tableSelect(element, options) {
        var _this = this;

        _this.tableClass     = options.tableClass;
        _this.selectAllClass = options.selectAllClass;
        _this.checkboxClass  = options.checkboxClass;

        _this.$selectAll = $(_this.selectAllClass);
        _this.$checkbox  = $(_this.checkboxClass);
        _this.$table     = _this.tableClass ? $(_this.tableClass) : _this.$selectAll.closest('table');

        _this.checkbox();
    }

    tableSelect.prototype.checkbox = function () {
        var $table     = this.$table,
            $selectAll = this.$selectAll,
            $checkbox  = this.$checkbox;

        // 复选框选中 与选择一行发生冲突 暂时不用
        /*   $table.on('click', this.checkboxClass, function (e) {
         var $this = $(this);

         // selectCheckBox($selectAllDom, $checkBoxDom, $checkBoxDomAll)
         selectCheckBox($selectAll, $this, $checkbox);

         });*/

        //  全选 与选择一行发生冲突 暂时不用
        /*  $table.on('click', this.selectAllClass, function (e) {
         var $this = $(this);

         // selectCheckBoxAll($selectAllDom, $checkBoxDomAll)
         selectCheckBoxAll($this, $checkbox);
         });*/

        // 点击一行选中复选框
        $table.on('click', 'tr', function (e) {
            //e.stopPropagation();
            //e.preventDefault();

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
        return new tableSelect(this, options);
    };

})(jQuery);