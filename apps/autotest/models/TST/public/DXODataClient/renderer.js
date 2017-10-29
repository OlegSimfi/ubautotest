window.render = function (names, dataSet, $table) {
  var $thead,
    $tbody

  $thead = $('<thead/>')
  $tbody = $('<tbody/>')
  $table = $table || $('#table')

  renderHead(names)
  renderBody(dataSet)

  $table.empty().append([$thead, $tbody])

  function renderHead (items) {
    var $tr = $('<tr/>')
    $.each(items || [], function () {
      $('<th/>').addClass(dasherize(this))
                .html(unpascalize(this))
                .appendTo($tr)
    })
    $thead.append($tr)
  }

  function renderBody (items) {
    $.each(items || [], function (index, record) {
      var $tr = $('<tr/>')
      if (record.key === undefined) {
        $.each(names, function () {
          $('<td/>').addClass(dasherize(this))
                        .html(record[this])
                        .appendTo($tr)
        })
        $tbody.append($tr)
        return
      }
      $('<td/>').addClass('group-header')
                    .attr('colspan', names.length)
                    .html('<b>' + record.key + '</b>')
                    .appendTo($tr)
      $tbody.append($tr)
      renderBody(record.items)
    })
  }

  function dasherize (text) {
    return String(text).replace(/[A-Z]/g, function (char, index) {
      return index === 0 ? char : '-'.concat(char)
    }).toLowerCase()
  }

  function unpascalize (text) {
    return String(text).replace(/[A-Z]/g, function (char, index) {
      return index === 0 ? char : ' '.concat(char).toLowerCase()
    })
  }
}
