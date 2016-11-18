/**
 * Created by huangjiajia on 2016/11/18.
 * Descrition: 模糊查询
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
        wrapClass  : '.js-blur-wrap'
    };

    blurSelect.prototype.select = function () {

        /*
         * 1. 判断是否为多选模糊查询  option -> multiSelect 默认为单模糊查询
         */
        if(this.options.multiSelect) { // 多选模糊查询

        }
        else {  // 单选模糊查询

        }
    };

    blurSelect.prototype.multiSelect = function () {

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
