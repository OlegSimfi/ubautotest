function getId(locator){
    var ext = browser.execute(function(query) {
        var elements = Ext.ComponentQuery.query(query);
        return elements[0].id;
    }, locator);
    return ext.value;
}

function getCss(locator) {
    return '#' + getId(locator);
}

module.exports={
    getId: getId,
    getCss: getCss
};



