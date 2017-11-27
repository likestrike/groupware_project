MyAlert = function(config){
	$.extend(this, config, {
		deleteConfirm: function(callback) {
			swal({
			  title: '삭제합니까?',
			  text: '삭제하면 관련 내용 다 사라집니다.!',
			  type: 'warning',
			  showCancelButton: true,
			  confirmButtonText: '네, 삭제합니다!',
			  cancelButtonText: '취소, 안할래요',
			}).then(function() {
				swal(
					'Deleted!',
					'글이 성공적으로 삭제 되었습니다.',
					'success'
				);
				if(callback){
	            	callback.fn.call();	
	            }
		     	return true;
		      

			}, function(dismiss) {
			  // dismiss can be 'cancel', 'overlay', 'close', 'timer'
			  if (dismiss === 'cancel') {
			    swal(
			      '취소',
			      '당신의 글은 안전합니다 :)',
			      'error'
			    );
			    return false;
			  }
			});
		}
	});
}
getURL = function(text){
	var urlRegex = /(http(s)?:\/\/[^ \n>]*)|\"(http(s)?:\/\/+)+[^"]*\"/gm; 
	return text.replace(urlRegex, function(url) {
    	var html = url.replace(/\"/g, "");
    	return html;
    })
}