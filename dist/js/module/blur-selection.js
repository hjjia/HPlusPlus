/**
 * Created by huangjiajia on 2016/11/18.
 * Description: 模糊查询
 * Function: 1. 单选模糊查询 2. 多选模糊查询
 */
(function($) {

    var blurSelect = function (element, options) {
        var _this = this;

        _this.options = options;
        _this.$panel  = $(_this.options.panelClass);
    };

    blurSelect.DEFAULTS = {
        multiSelect: false,
        panelClass : '.js-blur-panel',
        inputClass : '.js-blur-input',
        wrapClass  : '.js-blur-wrap',
        ajax       : {
            type    : 'POST',
            url     : '',
            dataType: 'json',
            data    : ''
        }
    };

    blurSelect.prototype.select = function () {

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

    blurSelect.prototype.multiSelect = function () {
        var _this  = this,
            $panel = _this.$panel;

        /*
         * 1. 创建查询结果面板
         * 2. 监听input keyup事件
         * 3. 遍历结果
         */
        _this.createResultHtml();
        $panel.on('keyup', _this.inputClass, function () {
            var $this    = $(this),
                value    = $this.val(),
                ajaxType = _this.options.ajax;

            $.ajax({
                type: ajaxType.type,
                dataType: ajaxType.dataType,
                url: ajaxType.url,
                data: {value}
            })
        });
    };

    blurSelect.prototype.singleSelect = function () {
        
    };

    blurSelect.prototype.createResultHtml = function () {
        var html   = '',
            $panel = this.$panel;

        $panel.find(this.panelClass).remove();

        html += '<div class="blur-wrap">';
        html += '<ul class="list-block">';
        html += '</ul>';
        html += '</div>';

        $panel.append(html);
    }

})(jQuery);
