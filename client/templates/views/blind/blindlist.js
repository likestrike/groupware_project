Template.blind.onRendered(function () {
	console.log('on create');
var wrapper_css = {
    'padding'    : '20px 30px',
    'background' : '#d73925',
    'display'    : 'none',
    'z-index'    : '999999',
    'font-size'  : '16px',
    'font-weight': 600
  }

  var link_css = {
    'color'          : 'rgba(255, 255, 255, 0.9)',
    'display'        : 'inline-block',
    'margin-right'   : '10px',
    'text-decoration': 'none'
  }

  var link_hover_css = {
    'text-decoration': 'underline',
    'color'          : '#f9f9f9'
  }

  var btn_css = {
    'margin-top' : '-5px',
    'border'     : '0',
    'box-shadow' : 'none',
    'color'      : '#d73925',
    'font-weight': '600',
    'background' : '#fff'
  }

  var close_css = {
    'color'    : '#fff',
    'font-size': '20px'
  }

  var wrapper = $('<div />').css(wrapper_css)
  var link    = $('<a />', { href: 'https://themequarry.com' })
    .html('타인의 비방, 직접적인 실명 또는 팀명을 게재 할 경우 그 내용을 불문하고 관리자가 직접 삭제 할 예정입니다. 진솔한 이야기는 사장님께 무기명 건의하기 >>')
    .css(link_css)
    .hover(function () {
      $(this).css(link_hover_css)
    }, function () {
      $(this).css(link_css)
    })
  var btn     = $('<a />', {
    'class': 'btn btn-default btn-sm',
    href   : 'https://themequarry.com'
  }).html('Let\'s Do It!').css(btn_css)
  var close   = $('<a />', {
    'class'         : 'pull-right',
    href            : '#',
    'data-toggle'   : 'tooltip',
    'data-placement': 'left',
    'title'         : 'Never show me this again!'
  }).html('&times;')
    .css(close_css)
    .click(function (e) {
      e.preventDefault()
      $(wrapper).slideUp()
      if (ds) {
        ds.setItem('no_show', true)
      }
    })

  wrapper.append(close)
  wrapper.append(link)
  wrapper.append(btn)
  $('.content-wrapper').prepend(wrapper)

  wrapper.hide(4).delay(500).slideDown()
});