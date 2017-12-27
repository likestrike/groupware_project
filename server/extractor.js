import { HTTP } from 'meteor/http'

if (Meteor.isServer) {
	Extractor_meta = function (params) {
		var html;
		var meta = {};

		if(params.substr(0, 4) === 'http') {
	      try {
	        var result = HTTP.call('GET', params, {encoding : 'binary'});
	        if(result.statusCode !== 200) {
	          console.log('bad status', result);
	          return meta;
	        }
	        html = result.content;
	        var contentType = result.headers['content-type'];
	        // console.log('result', result);
	      } catch (e) {
	        console.log('catch error', e);
	        return meta;
	      }
	    } else {
	      html = params;
	    }

	    // search and parse all <meta>
	    // var re = /<[\s]*meta[\s]*(?:name|property)[\s]*=[\s]*["\']?([^>"\']*)["\']?[\s]*content[\s]*=[\s]*["\']?([^>"\']*)["\']?[\s]*[\/]?[\s]*>/gmi;
        var re = /<meta.*?(?:name|property|http-equiv)=['"]([^'"]*?)['"][\w\W]*?content=['"]([^'"]*?)['"].*?>/gmi;

  //       var html = "Hello World";
		// html = html.replace(/\\'/g,"");

        // var re = /<meta.*?(?:name|property|http-equiv)=[\w\W]*?content=['"]([^'"]*?)['"].*?>/gmi;

	    while ((m = re.exec(html)) !== null) {
	      if (m.index === re.lastIndex) {
	          re.lastIndex++;
	      }
	      // console.log(m[1]);
	      if(m[1].trim() === 'description' || m[1].trim() === 'og:description') meta.description = m[2].trim();
	      if(m[1].trim() === 'og:image') meta.image = m[2].trim();
	      if(m[1].trim() === 'twitter:image') meta.twitterimage = m[2].trim();
	      if(m[1].trim() === 'og:title') meta.title = m[2].trim();
	      if(m[1].trim() === 'og:image:width') meta.width = m[2].trim();
	      if(m[1].trim() === 'og:image:height') meta.height = m[2].trim();
	      if(m[1].trim() === 'og:url') meta.url = m[2].trim();
	    }
	    if(typeof(meta.image) !== 'undefined'){
	    	if(typeof(meta.width) === 'undefined' && typeof(meta.height) === 'undefined'){
	    		meta.width = 80;
	    		meta.height = 80;
	    	}
	    	var text = meta.url;
	    	var videoid = text.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
	    	if(videoid != null) {
	    		meta.width = 480;
	    		meta.height = 360;	
	    	}
	    }


	    return meta;
	}
	Meteor.methods({
		Extractor_meta: function(params){
			check(params, String);
			return Extractor_meta(params);
		}
	});
}