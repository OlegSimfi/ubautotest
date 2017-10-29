/**
 * Created by pavel.mash on 12.11.2016.
 */

// todo override this in MSSQL
compareDefault: function (dataType, newValue, oldValue, constraintName, oldConstraintName) {
  // toLog('dataType=' + dataType + ',newValue=' + newValue + ',oldValue=' + oldValue);
  if (!newValue && !oldValue) { // jshint ignore:line
    return false
  }
  if (typeof oldValue === 'string') {
    oldValue = oldValue.toString().trim().replace('[datetime]', 'datetime') // special case for MS SQL datetime function: CONVERT(datetime,''31.12.9999'',(104)) bub DB return CONVERT([datetime],''31.12.9999'',(104))
  }

  if (this.compareDefaultConstraintName && (constraintName || oldConstraintName) &&
    ((constraintName || '').toUpperCase() !== (oldConstraintName || '').toUpperCase())) {
    return true
  }
  return (newValue !== oldValue) && (newValue !== "'" + oldValue + "'")
},