//@preDefine
/**
 * manager/TextManager
 */
W.defineModule("manager/TextManager", function() {
	
	W.log.info("define TextManager");
    return {
    	changeLang : function(callback){
    		W.log.info("change language !!! " + W.StbConfig.menuLanguage);
    		if(W.StbConfig.menuLanguage == "KOR"){
    			require(["lang/Text_kr"], function(texts){
        			W.Texts = texts.getTexts();
            		callback();
    			});
    		}else if(W.StbConfig.menuLanguage == "JPN"){
    			require(["lang/Text_ja"], function(texts){
        			W.Texts = texts.getTexts();
            		callback();
    			});
    		}else if(W.StbConfig.menuLanguage == "ENG"){
    			require(["lang/Text_en"], function(texts){
        			W.Texts = texts.getTexts();
            		callback();
    			});
    		}else if(W.StbConfig.menuLanguage == "ZHO"){
    			require(["lang/Text_ch"], function(texts){
        			W.Texts = texts.getTexts();
            		callback();
    			});
    		}
    	}
    };
});