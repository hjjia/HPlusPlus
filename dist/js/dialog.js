/**
 * Created by huangjiajia on 2016/7/5.
 */
define(function (require, exports, module) {
    var $ = require('jquery');
    ;(function($,window){
        var Dialog = function()
        {

        };
        Dialog.prototype =
        {

        };
        var openBg = function(index)
        {
            var bg = $('.dialog-bg');
            if (bg.length <= 0)
            {
                $('body').append('<div class="dialog-bg"></div>')
            }

            $('.dialog-bg').on('click',function(){
                $(this).remove();
                closeAllDialog();
            });
        };

        var closeBg = function()
        {
            var dialogBg  = $('.dialog-bg'),
                dialogBox = $('.dialog-box');

            dialogBox.length == 1 && (dialogBg.fadeOut('fast',function(){dialogBg.remove()}));
        };

        var getMaxZIndex = function(maxZIndex)
        {
            $('.dialog-box,.dialog-msg-box').each(function(){
                var thisZindex = parseInt($(this).css('z-index'));
                if (thisZindex>maxZIndex)
                {
                    maxZIndex = thisZindex;
                }
            });
            return maxZIndex;
        };

        var openDialog = function(param)
        {
            //type,content,title,width,okBtnText,cancelBtnText,okBtnCallback,cancelBtnCallback,index

            var index = param.index || +new Date(),
                type              = param.type||'alert',
                title             = param.title || '提示',
                content           = param.content || '',
                width             = param.width || '',
                okBtnText         = param.okBtnText || '确认',
                cancelBtnText     = param.cancelBtnText || '取消',
                okBtnCallback     = param.okBtnCallback || function(index){Dialog.close(index);},
                cancelBtnCallback = param.cancelBtnCallback || function(index){Dialog.close(index);},
                icon              = param.icon || '',
                seconds           = param.seconds || 0,
                noBtn             = param.noBtn || '';

            
            var btnHtml   = '',
                style     = 'display:none;',
                iconHtml  = '',
                maxZIndex = 998;

            maxZIndex = getMaxZIndex(maxZIndex);

            style += 'z-index:' + (maxZIndex + 1) + ';';

            style   += width ? 'width:' + width + 'px;' : '';
            iconHtml = icon ? '<span class="dialog-icon-' + icon + '"></span>' : '';
            switch(type)
            {
                case 'alert':
                    if (!noBtn)
                    {
                        btnHtml = '<div class="btn no-unl bg-fe5d36 dialog-ok-btn dialog-ok-btn' + index + '">' + okBtnText + '</div>';
                    }                    
                    break;

                case 'confirm':
                    btnHtml = '<div class="btn no-unl bg-fe5d36  dialog-ok-btn dialog-ok-btn' + index + '">'+okBtnText + '</div>' +
                        '<div class="btn no-unl  dialog-cancel-btn dialog-cancel-btn' + index + '">' + cancelBtnText + '</div>';
                    break;

                case 'msg':

                    break;
                case 'open':
                    if(param.okBtnText in param) {
                        btnHtml = '<div class="btn no-unl bg-fe5d36  dialog-ok-btn dialog-ok-btn' + index + '">' + okBtnText + '</div>';
                    }

                    if(param.cancelBtnText in param) {
                        btnHtml += '<div class="btn no-unl  dialog-cancel-btn dialog-cancel-btn' + index + '">' + cancelBtnText + '</div>';
                    }

                    break;
            }

            //避免弹窗内容过高被窗口遮蔽，计算最大高度 ，加上overflow-y:auto
            var viewSize            = getViewSize(),
                dialogTitleHeight   = 44,
                dialogBtnWrapHeight = 61,
                safeHeight          = 60,
                maxHeight           = parseInt(viewSize.height-dialogTitleHeight-dialogBtnWrapHeight-safeHeight-viewSize.height*0.2);
            

                
            var html  = '<div style="' + style + '" class="dialog-box dialog-box' + index + '" dialog_index = ' + index + '>'+
                '<div class="dialog-title-wrap"><div class="dialog-title">' + title + '</div><div class="dialog-close-btn"></div></div>'+
                '<div style="overflow-y:auto;max-height:'+maxHeight+'px;" class="dialog-content-wrap">' + iconHtml+content + '</div>'+
                '<div class="dialog-btn-wrap">' + btnHtml + '</div>'+
                '</div>';


            $('body').append(html);
            $('body .dialog-box' + index).fadeIn();

            //由于拖动功能的right:0的异常（祥见拖动功能部分代码注释），改为js动态计算弹窗居中
            dialogWidth = $('.dialog-box' + index).width();
            $('.dialog-box' + index).css('left',(viewSize.width-dialogWidth)/2 + 'px') ;

            //绑定按钮事件
            switch(type)
            {
                case 'alert':
                    $('.dialog-box' + index + ' .dialog-ok-btn').on('click',function(){

                        if (typeof okBtnCallback == 'function')
                        {
                            okBtnCallback(index);
                        }
                        else
                        {
                            var dialogBox = $(this).parents('.dialog-box');
                                dialogBox.fadeOut('fast',function(){dialogBox.remove()});
                            closeBg();
                        }

                    });

                    if(seconds)
                    {
                        setTimeout("Dialog.close(" + index + ")",seconds * 1000);
                    }
                    break;

                case 'confirm':
                    $('.dialog-box' + index + ' .dialog-ok-btn').on('click',function(){
                        okBtnCallback(index);
                        //closeBg();
                    });
                    $('.dialog-box' + index + ' .dialog-cancel-btn').on('click',function(){
                        cancelBtnCallback(index);
                        //closeBg();
                    });
                    break;

                case 'msg':

                    break;

                case 'open':
                    $('.dialog-box' + index + ' .dialog-ok-btn').on('click',function(){
                        okBtnCallback(index);
                        //closeBg();
                    });
                    $('.dialog-box' + index + ' .dialog-cancel-btn').on('click',function(){
                        cancelBtnCallback(index);
                        //closeBg();
                    });
                    break;
            }
            $('.dialog-box .dialog-close-btn').on('click',function(){
                var dialogBox = $(this).parents('.dialog-box');
                    dialogBox.fadeOut('fast',function(){dialogBox.remove()});
                closeBg();
            });

            //添加窗口拖动事件，点击窗口标题栏触发,本插件通过修改元素left和top实现拖拽，被拖拽元素不能含有right:0，否则会出现左右拖动元素落后鼠标的异常情况
            $('.dialog-box .dialog-title-wrap').on('mousedown',function(event){
                var e    = event || window.event;
                moveThis = this; //暂未使用
                if (this.setCapture) 
                {
                    this.setCapture();
                }
                else if (window.captureEvents) 
                {
                    window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
                }

                moveDialogElem       = $(this).parent();
                movePointStartPos    = {'x':e.clientX,'y':e.clientY};
                moveElemStartPos     = {'top':parseInt(moveDialogElem.css('top')),'left':parseInt(moveDialogElem.css('left'))};
                
                //被拖拽窗口置顶
                var maxZIndex  = getMaxZIndex(1);
                var selfZIndex = parseInt(moveDialogElem.css('z-index'));
                if (maxZIndex > selfZIndex)
                {
                    moveDialogElem.css('z-index',maxZIndex+1);
                }
                
                document.onmousemove = documentMouseMove;
            });

            //释放拖动事件
            $('.dialog-box .dialog-title-wrap').on('mouseup',function(event){

                if (this.releaseCapture)
                {
                    this.releaseCapture();
                }
                else if (window.releaseEvents)
                {
                    window.releaseEvents(Event.MOUSEMOVE | Event.MOUSEUP);
                }

                document.onmousemove = null; 
                
            });

            return index;
        };

        var moveDialogElem    = null,
            movePointStartPos = null,
            moveElemStartPos  = null,
            moveThis          = null; //暂未使用
        var documentMouseMove = function(event)
        {
            var e     = event || window.event,
                pos   = {'x':e.clientX,'y':e.clientY},
                diffX = movePointStartPos.x - pos.x,
                diffY = movePointStartPos.y - pos.y;

                moveDialogElem.css('top',(moveElemStartPos.top-diffY)+'px');
                moveDialogElem.css('left',(moveElemStartPos.left-diffX)+'px');
        }

        var openMsgDialog = function(param)
        {
            var index = index || +new Date(),
                content           = param.content || '',
                width             = param.width   || '',
                icon              = param.icon    || '',
                seconds           = param.seconds || 3;

            var style     = '',
                iconHtml  = '',
                maxZIndex = 2;

            maxZIndex = getMaxZIndex(maxZIndex);
            style    += 'z-index:' + (maxZIndex + 1) + ';';
            style    += width ? 'width:' + width + 'px;' : '';
            iconHtml  = icon ? '<span class="dialog-icon-' + icon + '"></span>' : '';

            var html = '<div style="' + style + '" class="dialog-msg-box dialog-msg-box' + index + '" dialog_index = ' + index + '>' + iconHtml + content + '</div>';
            $('body').append(html);
            setTimeout("Dialog.close(" + index + ")",seconds * 1000);
        };

        var closeDialog = function(index)
        {
            var dialogBox = $('.dialog-box' + index + ' , .dialog-msg-box' + index);
                dialogBox.fadeOut('fast',function(){dialogBox.remove()});
        };

        var closeAllDialog = function()
        {
            var dialogBox = $('.dialog-box , .dialog-msg-box');
                dialogBox.fadeOut('fast',function(){dialogBox.remove()});
        };

        var getViewSize = function()
        {
            return { 
                        width : document.documentElement.clientWidth, 
                        height: document.documentElement.clientHeight 
                    };
        }

        Dialog.alert = function(options,title,icon,width,seconds,noBtn)
        {
            var param = {};

            param.type    = 'alert';
            param.seconds = 0;

            if(typeof options=='object')
            {
                options = options || {};
                param.title         = options.title     || '';
                param.content       = options.content   || '';
                param.width         = options.width     || '';
                param.icon          = options.icon      || '';
                param.seconds       = options.seconds   || '';
                param.okBtnText     = options.okBtnText || '';
                param.noBtn         = options.noBtn     || '';
                param.okBtnCallback = options.okBtnCallback || '';
            }
            else
            {
                param.content     = options || '';
                param.title       = title   || '';
                param.icon        = icon    || '';
                param.width       = width   || '';
                param.seconds     = seconds || '';
                param.noBtn       = noBtn   || '';
            }

            openBg();
            openDialog(param);
        };

        Dialog.close = function(index)
        {
            closeDialog(index);
            closeBg();
        };

        Dialog.closeAll = function () {
            closeAllDialog();
            closeBg();
        };

        Dialog.msg = function(options,seconds,width,icon)
        {
            var param = {};

            param.type    = 'msg';

            if(typeof options=='object')
            {
                options           = options         || {};
                param.content     = options.content || '';
                param.icon        = options.icon    || '';
                param.seconds     = options.seconds || '';
                param.width       = options.width   || '';
            }
            else
            {
                param.content     = options || '';
                param.seconds     = seconds || '';
                param.width       = width   || '';
                param.icon        = icon    || '';
            }
            openMsgDialog(param);
        };

        Dialog.tips = function (options,seconds,objId,direction) {
            var param = {};

            param.type = 'tips';

            if(typeof options == 'object') {
                options           = options           || {};
                options.content   = options.content   || '';
                options.seconds   = options.seconds   || '';
                options.objId     = options.objId     || '';
                options.direction = options.direction || '';
            }
            else {
                options.content   = options   || '';
                options.seconds   = seconds   || '';
                options.objId     = objId     || '';
                options.direction = direction || '';
            }
        };

        Dialog.confirm = function(options)
        {
            options = options || {};

            var param = {};

            param.type                = 'confirm';
            param.seconds             = 0;
            param.title               = options.title             || '';
            param.icon                = options.icon              || '';
            param.content             = options.content           || '';
            param.width               = options.width             || '';
            param.okBtnText           = options.okBtnText         || '';
            param.cancelBtnText       = options.cancelBtnText     || '';
            param.okBtnCallback       = options.okBtnCallback     || '';
            param.cancelBtnCallback   = options.cancelBtnCallback || '';
            openBg();
            return openDialog(param);
        };

        Dialog.open = function (options) {
            options                 = options || {};

            var param               = {};

            param.type              = 'open';
            param.seconds           = 0;
            param.title             = options.title             || '';
            param.icon              = options.icon              || '';
            param.content           = options.content           || '';
            param.width             = options.width             || '';
            param.okBtnText         = options.okBtnText         || '';
            param.cancelBtnText     = options.cancelBtnText     || '';
            param.okBtnCallback     = options.okBtnCallback     || '';
            param.cancelBtnCallback = options.cancelBtnCallback || '';

            openBg();
            return openDialog(param);
        };

        window.Dialog = Dialog;
    }($,window));

    module.exports = Dialog;
});
