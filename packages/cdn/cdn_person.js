var me = cdn_person;
me.entity.addMethod('beforeinsert');
me.entity.addMethod('beforeupdate');

me.checkPhotoMimeType = function(ctxt, typesArray){
    var photo = ctxt.mParams.execParams.photo;
    if (photo) {
        toLog('photo: %', photo);
        var photoObj = JSON.parse(photo);
        var contentType = photoObj.ct;
        console.debug('contentType:', contentType);
        if (!photoObj.deleting){
            if (typesArray.indexOf(contentType) === -1) { //find contentType in typesArray
                throw new Error(UB.format(UB.i18n('errNotSupportedFileType'), contentType, typesArray.join(',')));
            }
        }
    }
};

/**
 * @param {ubMethodParams} ctxt
 * @return {Boolean}
 */
me.beforeinsert = function (ctxt) {
    var typesArray = ['application/jpg', 'image/jpeg'];
    this.checkPhotoMimeType(ctxt, typesArray);
    return true;
};

/**
 *  @param {ubMethodParams} ctxt
 * @return {Boolean}
 */
me.beforeupdate = function (ctxt) {
    var typesArray = ['application/jpg', 'image/jpeg'];
    this.checkPhotoMimeType(ctxt, typesArray);


    return true;
};
