/*
 * Version  : 1.1
 * Author   : Arun Kumar Sekar
 * Mail     : arunkumarsekar@hotmail.com
 * Plugin   : photoZoom.js
 */
(function($){
    $.fn.photoZoom = function(options){
        var defaults = {
            onMouseOver   : function(){},        // callback on mouse hover
            zoomStyle     : {"background-color"   : "#fff",
                "min-width"          : "50px",
                "min-height"         : "50px",
                "border"             : "1px solid #ccc",
                "-moz-box-shadow"    : "0 0 5px #888",
                "box-shadow"         : "0 0 5px #888",
                "-webkit-box-shadow" : "0 0 5px #888",
                "text-align"         : "center"},
            onMouseOut    : function(){},       // callback on mouse out
            attribute  : "src"
        };
        $this = $(this);
        $this.options = $.extend({},defaults, options);
        $this.coreObj = null;

        var functions = {

            obj         : null,
            maxWidth    : 0,
            divObj      : $this.coreObj,
            winWidth    : $(window).width(),
            winHeight   : $(window).height(),

            init : function(opt){
                this.obj = opt.obj;
                this.divObj = this.wrapResponsive();
                if($("body .photoZoom-Large").length === 0){
                    $("body").append(this.divObj);
                }
                this.bindEvents();
            },
            findImages : function(){
                var images = false;
                if(this.obj !== null){
                    images = $(this.obj).find("img");
                    if(images.length === 0){
                        images = false;
                    }
                }
                return images;
            },
            bindEvents:function(){
                var images = this.findImages();
                if(images){
                    $.each(images,function(i,imgObj){
                        $(imgObj).live({
                            mouseenter : function(){
                                functions.whenHover(this);
                            },
                            mousemove : function(e){
                                functions.whenMouseMove(this,e);
                            },
                            mouseleave : function(){
                                functions.whenHoverOut(this);
                            }
                        });
                    });
                }
            },
            whenHover:function(imgObj){
                var imgSrc = $(imgObj);
                this.divObj = $("body .photoZoom-Large");
                this.divObj.find("img").css("margin-top","0px");
                if ($this.options.attribute !== 'src' && imgSrc.attr( $this.options.attribute ) === void 0) {
                    $this.options.attribute = 'src';
                }
                this.images(imgSrc.attr( $this.options.attribute ));
                $this.options.onMouseOver(imgObj);
                this.divObj.show();
            },
            whenMouseMove:function(imgObj,e){

                var tmpImg = new Image();
                tmpImg.src = $(imgObj).attr( $this.options.attribute );
                var w = 0, h = 0,maxWidth = 0,maxHeight = 0,leftPos = 0,topPos = 0,rightPos = 0, x = 0, y = 0;

                w = this.winWidth;
                h = this.winHeight;
                x = e.pageX;
                y = e.pageY;

                var ratio = (w / 100 * 55);
                topPos = (y+10);
                imgObj = this.divObj.find("img");

                if(x > ratio){
                    // Right position
                    maxWidth = (tmpImg.width < (x-20)) ? tmpImg.width : (x-20);
                    rightPos = (x+10) - (tmpImg.width > (w-x))? (w-x) : tmpImg.width;
                    imgObj.css("max-width",maxWidth+"px");
                    this.divObj.css({"left":"",
                        "right":rightPos+"px",
                        "top": topPos+"px" });
                } else {
                    // Left Position
                    maxWidth = (tmpImg.width > (w-(x+20)))? (w-(x+20)) : tmpImg.width;
                    imgObj.css("max-width",maxWidth+"px");
                    this.divObj.css({"left":(x+10)+"px",
                        "right":"",
                        "top": topPos+"px" });
                }

                /* Bottom Layer */
                var hRatio = (h / 100 * 55);
                if(hRatio > y){
                    maxHeight = ((h - y) - 10);
                } else {
                    this.divObj.css({"top":(topPos - (imgObj.height() + 20))+"px"});
                    maxHeight = ((y - h) - 10);
                }
                maxHeight = (this.winHeight < maxHeight) ? this.winHeight : maxHeight;
                imgObj.css({'max-height':maxHeight+"px"});
            },
            whenHoverOut:function(imgObj){
                this.divObj.hide();
                $this.options.onMouseOut(imgObj);
            },
            wrapResponsive:function(){
                $newImage = $("<img />");
                $newImage.css({"max-width"  :"100%",
                    "position"   :"relative",
                    "padding"    :"0px",
                    "margin-top" :"40%"})
                    .attr("src","images/zoomLoader.gif");
                $newImage = $("<div class='photoZoom-Large'></div>")
                    .css($.extend($this.options.zoomStyle,{ "display": "none","position": "absolute"}))
                    .html($newImage);
                return $newImage;
            },
            images:function(src){
                this.divObj.find("img").attr("src",src);
            }
        };
        return $this.each(function(){
            functions.init({ "obj":this });
        });
    };
})(jQuery);