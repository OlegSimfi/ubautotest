unit uUBComBridge;

interface
uses
  SyNodePluginIntf;

type
  TUBComBridgeSMPlugin = class(TCustomSMPlugin)
    procedure Init(const rec: TSMPluginRec); override;
    procedure UnInit; override;
  end;

implementation
uses
  SysUtils, Types, Windows,
  SpiderMonkey, SynCommons,
  Variants, ComObj, ActiveX;

function COM_ResolveObject(cx: PJSContext; var obj: PJSObject; var id: jsid; out resolved: Boolean): Boolean; cdecl; forward;
function COM_GetProperty(cx: PJSContext; var obj: PJSObject; var id: jsid; out vp: jsval):Boolean;cdecl; forward;
function COM_SetProperty(cx: PJSContext; var obj: PJSObject; var id: jsid; var vp: jsval; out res: JS_ObjectOpResult):Boolean; cdecl; forward;
function COM_Enumerate(cx: PJSContext; var obj: PJSObject): Boolean; cdecl; forward;
{$IFDEF SM52}
procedure COM_Finalize(var fop: JSFreeOp; obj: PJSObject); cdecl;  forward;
{$ELSE}
procedure COM_Finalize(var rt: PJSRuntime; obj: PJSObject); cdecl;  forward;
{$ENDIF}
const
{$IFDEF SM52}
  jsCOM_classOps: JSClassOps = (
//    addProperty:        JS_PropertyStub;
//    delProperty:        JS_DeletePropertyStub;
    getProperty:        COM_GetProperty;
    setProperty:        COM_SetProperty;
    enumerate:          COM_Enumerate; 
    resolve:            COM_ResolveObject;
//    convert:            JS_ConvertStub;
    finalize:           COM_Finalize;
    );

  jsCOM_class: JSClass = (name: 'COM';
    flags: JSCLASS_HAS_PRIVATE;
    cOps: @jsCOM_classOps
  );
{$ELSE}
  jsCOM_class: JSClass = (name: 'COM';
    flags: JSCLASS_HAS_PRIVATE ;
//    addProperty:        JS_PropertyStub;
//    delProperty:        JS_DeletePropertyStub;
    getProperty:        COM_GetProperty;
    setProperty:        COM_SetProperty;
    enumerate:          COM_Enumerate; 
    resolve:            COM_ResolveObject;
//    convert:            JS_ConvertStub;
    finalize:           COM_Finalize;
    );
{$ENDIF}
type
  TOleVariantRecord = object
    magic: integer;
    Val: OleVariant;
    constructor init(aVal: OleVariant);
    function IsMagicCorrect: boolean;
    function GetDispath: IDispatch;
    destructor Destroy;
  end;
  POleVariantRecord = ^TOleVariantRecord;

const
  OleVariantRecordMagic = 4443213;

function GetJSCOMObject(cx: PJSContext; IDisp: IDispatch): PJSObject;
var
  privateData: POleVariantRecord;
  TypeInfoCount: integer;
begin
  result := cx.NewObject(@jsCOM_class);
  new(privateData, Init(IDisp));
  result.PrivateData := privateData;

  OleCheck(IDisp.GetTypeInfoCount(TypeInfoCount));
  if TypeInfoCount = 0 then
    raise Exception.Create('ITypeInfo не поддерживается!');
end;

function OleVariantToJSVal(cx: PJSContext; OVar: OleVariant): jsval;
begin
  with TVarData(OVar) do
  case VType of
  varDispatch:
    if IDispatch(OVar)=nil then
      result.SetNull
    else
      result := GetJSCOMObject(cx, OVar).ToJSValue;
  varNull:
    Result.setNull;
  varEmpty:
    Result.setVoid;
  varBoolean:
    if VBoolean then
      Result.asBoolean := True else
      Result.asBoolean := False;
  varSmallint:
    Result.asInteger := VSmallInt;
  {$ifndef DELPHI5OROLDER}
  varShortInt:
    Result.asInteger := VShortInt;
  varWord:
    Result.asInteger := VWord;
  varLongWord:
    if (VLongWord>=cardinal(Low(integer))) and
      (VLongWord<=cardinal(High(integer))) then
      Result.asInteger := VLongWord else
      Result.asDouble := VLongWord;
  {$endif}
  varByte:
    Result.asInteger := VByte;
  varInteger:
    Result.asInteger := VInteger;
  varInt64:
    Result.asInt64 := VInt64;
  varSingle:
    Result.asDouble := VSingle;
  varDouble:
    Result.asDouble := VDouble;
  varCurrency:
    Result.asDouble := VCurrency;
  varDate:
    Result.asDate[cx] := VDate;
  varOleStr:
    Result.asJSString := cx.NewJSString(WideString(VAny));
//    SetWideString(cx,WideString(VAny));
  varString:
    Result.asJSString := cx.NewJSString(VAny,length(RawByteString(VAny)),
  {$ifndef UNICODE}   CP_UTF8);
  {$else}             StringCodePage(RawByteString(VAny)));
  varUString:
    Result.asJSString := cx.NewJSString(UnicodeString(VAny));
  {$endif}
  else
  if VType=varByRef or varVariant then
    Result := OleVariantToJSVal(cx,PVariant(VPointer)^) else
  if VType=varByRef or varOleStr then
    Result.asJSString := cx.NewJSString(PWideString(VAny)^) else
  {$ifdef UNICODE}
  if VType=varByRef or varUString then
    Result.asJSString := cx.NewJSString(PUnicodeString(VAny)^) else
  {$endif}
    raise ESMException.CreateFmt('Unhandled variant type %d',[VType]);
  end;
end;

function JSValToOleVariant(cx: PJSContext; val: jsval): OleVariant;
var
  t: JSType;
begin
  t := cx.TypeOfValue(val);
  case t of
    JSTYPE_VOID:
      VarClear(result);
    JSTYPE_NULL:
      SetVariantNull(Variant(result));
//    JSTYPE_OBJECT: begin
//      New(obj);
//      obj.ptr := Value.asObject;
//      TSMVariant.New(cx, obj, result, dkOwn);
//    end;
    JSTYPE_STRING:
      val.asJSString.ToVariant(cx,Variant(result));
    JSTYPE_NUMBER:
      if val.isInteger then
        result := val.asInteger else
        result := val.asDouble;
    JSTYPE_BOOLEAN:
      result := val.asBoolean;
    JSTYPE_FUNCTION:
      result := 'function'
//~~~     result := TransformToSynUnicode(cx);
    else
      raise ESMException.CreateFmt('Unhandled ToVariant(%d)',[ord(t)]);
  end;

end;

function COM_toJSONFunction(cx: PJSContext; argc: uintN; var vp: JSArgRec): Boolean; cdecl;
begin
  vp.rval := cx.NewJSString('COM object').ToJSVal;
  Result := True;
end;

procedure GetFuncDesc(IDisp: IDispatch; ID: TDispID; var Getter: TFuncDesc; var Setter: TFuncDesc; var Method:TFuncDesc);
var
  TypeInfo: ITypeInfo;
  TypeAttr: PTypeAttr;
  FuncDesc: PFuncDesc;
  i: integer;
begin
  Method.invkind := -1;
  Getter.invkind := -1;
  Setter.invkind := -1;

  OleCheck(IDisp.GetTypeInfo(0, LOCALE_SYSTEM_DEFAULT, TypeInfo));
  OleCheck(TypeInfo.GetTypeAttr(TypeAttr));
  for I := 0 to TypeAttr^.cFuncs-1 do begin
    OleCheck(TypeInfo.GetFuncDesc(i, FuncDesc));
    try
      if FuncDesc.memid = ID then begin
        if FuncDesc.invkind = INVOKE_FUNC then
          Method := FuncDesc^
        else if FuncDesc.invkind = INVOKE_PROPERTYGET then
          Getter := FuncDesc^
        else if FuncDesc.invkind = INVOKE_PROPERTYPUT then
          Setter := FuncDesc^;
      end;
    finally
      TypeInfo.ReleaseFuncDesc(FuncDesc);
    end;
  end
end;

function COM_CallFunction(cx: PJSContext; argc: uintN; var vp: JSArgRec): Boolean; cdecl;
var
  val: jsval;
  funcName: WideString;
  privateData: POleVariantRecord;
  IDisp: IDispatch;
  res: HRESULT;
  DispParams: TDispParams;
  MethodResult: OleVariant;
  ExcepInfo: TExcepInfo;
  params: PjsvalVector;
  rgvarg: PVariantArgList;
  i: integer;
  OleVar: OleVariant;

  Getter: TFuncDesc;
  Setter: TFuncDesc;
  Method:TFuncDesc;

  obj: PJSObject;
  prop_ids: JSIdArray;
  PropNameVal: jsval;
  propVal: jsval;

  NamedPropsCount: integer;
  PropsCount: integer;
  Names: POleStrList;
  IDs: PMemberIDList;
  ws: WideString;
begin
  funcName := vp.calleObject.GetFunctionId.ToSynUnicode(cx);
  try
    privateData := vp.thisObject[cx].PrivateData;
    IDisp := privateData^.GetDispath;

    params := vp.argv;
    NamedPropsCount := 0;
    PropsCount := 0;
    rgvarg := nil;
    IDs := nil;
    Names := nil;
    try
      if (argc=1) and (params[0].isObject) and not (params[0].isString)
          and not params[0].asObject.isDate(cx) then begin
        obj := params[0].asObject;
        prop_ids := obj.Enumerate(cx );
        try
          NamedPropsCount := prop_ids.length;
          PropsCount := NamedPropsCount;
          GetMem(Names, Sizeof(POleStr)*(NamedPropsCount+1));
          GetMem(IDs, Sizeof(TMemberID)*(NamedPropsCount+1));
          GetMem(rgvarg, Sizeof(TVariantArg)*(PropsCount));

          for i := 0 to PropsCount-1 do begin
            Assert(cx.IdToValue(prop_ids.vector[i], PropNameVal));
            Names^[PropsCount-i] := PWideChar(PropNameVal.asJSString.ToSynUnicode(cx));
            obj.GetPropertyById(cx, prop_ids.vector[i], val);

            OleVar := JSValToOleVariant(cx, val);
            rgvarg[PropsCount-1-i] := tagVariant(OleVar);
          end;
        finally
//          JS_DestroyIdArray(cx, prop_ids);
        end;
      end else begin

        NamedPropsCount := 0;
        PropsCount := argc;
        GetMem(Names, Sizeof(POleStr)*(NamedPropsCount+1));
        GetMem(IDs, Sizeof(TMemberID)*(NamedPropsCount+1));
        GetMem(rgvarg, Sizeof(TVariantArg)*(NamedPropsCount+PropsCount));
        for i := 0 to PropsCount-1 do begin
          val := params[i];
          OleVar := JSValToOleVariant(cx, val);
          rgvarg[PropsCount-1-i] := tagVariant(OleVar);
        end;
      end;

      Names^[0] := Pointer(funcName);

      OleCheck(IDisp.GetIDsOfNames(GUID_NULL,Names,NamedPropsCount+1,LOCALE_SYSTEM_DEFAULT,IDs));
      FillChar(DispParams, SizeOf(DispParams), 0);
      DispParams.rgvarg := rgvarg;
      DispParams.rgdispidNamedArgs := @(IDs^[1]);
      DispParams.cArgs := PropsCount;
      DispParams.cNamedArgs := NamedPropsCount;

      GetFuncDesc(IDisp, IDs^[0], Getter, Setter, Method);


      if Method.invkind<>-1 then
      begin
        res := IDisp.Invoke(IDs[0], GUID_NULL, 0, DISPATCH_METHOD, DispParams,
          @MethodResult, @ExcepInfo, nil);
      end else if Getter.invkind<>-1 then
        res := IDisp.Invoke(IDs[0], GUID_NULL, 0, DISPATCH_PROPERTYGET, DispParams,
          @MethodResult, @ExcepInfo, nil)
      else
        raise ESMException.CreateFmt('Cannot call %s function',[funcName]);

      OleCheck(res);

    finally
      FreeMem(Names, Sizeof(POleStr)*(NamedPropsCount+1));
      FreeMem(IDs, Sizeof(TMemberID)*(NamedPropsCount+1));
      FreeMem(rgvarg, Sizeof(TVariantArg)*(PropsCount));
    end;

    val := OleVariantToJSVal(cx, MethodResult);

    vp.rval := val;
    Result := true;
  except
    on E: Exception do begin
      Result := false;
      vp.rval := JSVAL_VOID;
      if ExcepInfo.bstrDescription = '' then
        JSError(cx, E)
      else begin
        ws := E.Message +' '+ExcepInfo.bstrDescription;
        JSErrorUC(cx, ws)
      end
    end;
  end;
end;

{$IFDEF SM52}
procedure COM_Finalize(var fop: JSFreeOp; obj: PJSObject); cdecl;
{$ELSE}
procedure COM_Finalize(var rt: PJSRuntime; obj: PJSObject); cdecl;
{$ENDIF}
var
  privateData: POleVariantRecord;
begin
  privateData := obj.PrivateData;
  privateData^.Destroy;
  Dispose(privateData);
end;

function COM_ResolveObject(cx: PJSContext; var obj: PJSObject; var id: jsid; out resolved: Boolean): Boolean; cdecl; 
var
  val: jsval;
  privateData: POleVariantRecord;
  propName: WideString;
  IDisp: IDispatch;
  iDispId : longint;
  res: HRESULT;
  err: EOleSysError;
begin
  if not cx.IdToValue(id, val)then
    raise ESMException.Create('COM_ResolveObject invalid id');
    
  propName := val.asJSString.ToSynUnicode(cx);
  
  if (propName = '__iterator__') or (propName = 'toJSON') then begin
    Result := true;
    exit;
  end;

  privateData := obj.PrivateData;
  IDisp := privateData^.GetDispath;
  res := IDisp.GetIDsOfNames(GUID_NULL,@propName,1,LOCALE_SYSTEM_DEFAULT,@iDispId);
  if Succeeded(res) then
    Result := true
  else begin
    err := EOleSysError.Create('', res, 0);
    try
      JSError(cx, ESMException.CreateFmt('Property %s not found. %s', [propName, err.Message]));
    finally
      err.free;
    end;
    Result := False;
  end;
end;

type
  TSMCOMIterator = record
    curIdx: integer;
    TypeInfo: ITypeInfo;
    TypeAttr: PTypeAttr;
  end;
  PSMCOMIterator = ^TSMCOMIterator;

function COM_Enumerate(cx: PJSContext; var obj: PJSObject): Boolean; cdecl;
//var
//  val: TSMValue;
//  privateData: POleVariantRecord;
//  IDisp: IDispatch;
//  iterator: PSMCOMIterator;
//  FuncDesc: PFuncDesc;
//  FuncDescNext: PFuncDesc;
//  pName: WideString;
begin
//  case enum_op of
//    JSENUMERATE_INIT,
//    JSENUMERATE_INIT_ALL: begin // Create new iterator state over enumerable properties.
//      privateData := JS_GetPrivate(obj);
//      IDisp := privateData^.GetDispath;
//      New(iterator);
//      iterator.curIdx := 0;
//      OleCheck(IDisp.GetTypeInfo(0, LOCALE_SYSTEM_DEFAULT, iterator.TypeInfo));
//      OleCheck(iterator.TypeInfo.GetTypeAttr(iterator.TypeAttr));
//      state := PRIVATE_TO_JSVAL(iterator);
//      if idp<>nil then
//        JS_ValueToId(cx, INT_TO_JSVAL(iterator.TypeAttr^.cFuncs), idp^);
//    end;
//    JSENUMERATE_NEXT: begin // Iterate once.
//      iterator := PSMCOMIterator(JSVAL_TO_PRIVATE(state));
//      if (iterator<>nil) and (iterator.curIdx < iterator.TypeAttr^.cFuncs) then begin
//        OleCheck(iterator.TypeInfo.GetFuncDesc(iterator.curIdx, FuncDesc));
//        try
//          OleCheck(iterator.TypeInfo.GetDocumentation(FuncDesc^.memid, @pName, nil, nil, nil));
//          val.SetWideString(cx, pName);
//          JS_ValueToId(cx,  val.AsJSVal, idp^);
//          inc(iterator.curIdx);
//          if iterator.curIdx < iterator.TypeAttr^.cFuncs then
//          try
//            OleCheck(iterator.TypeInfo.GetFuncDesc(iterator.curIdx, FuncDescNext));
//            if FuncDesc^.memid=FuncDescNext^.memid then
//              inc(iterator.curIdx);
//          finally
//            iterator.TypeInfo.ReleaseFuncDesc(FuncDescNext);
//          end;
//        finally
//          iterator.TypeInfo.ReleaseFuncDesc(FuncDesc);
//        end;
//
//      end else begin
//        iterator.TypeInfo.ReleaseTypeAttr(iterator.TypeAttr);
//        Dispose(iterator);
//        state := JSVAL_NULL;
//      end;
//    end;
//    JSENUMERATE_DESTROY: begin // Destroy iterator state.
//      iterator := PSMCOMIterator(JSVAL_TO_PRIVATE(state));
//      iterator.TypeInfo.ReleaseTypeAttr(iterator.TypeAttr);
//      Dispose(iterator);
//      state := JSVAL_NULL;
//    end;
//  end;
//  Result := JS_TRUE;
end;

function COM_GetProperty(cx: PJSContext; var obj: PJSObject; var id: jsid; out vp: jsval): Boolean; cdecl; 
var
  val: jsval;
  privateData: POleVariantRecord;
  propName: WideString;
  propNameA: WinAnsiString;
  IDisp: IDispatch;
  iDispId : longint;
  res: HRESULT;
  MethodResult: OleVariant;
  ExcepInfo: TExcepInfo;
  DispParams: TDispParams;

  Getter: TFuncDesc;
  Setter: TFuncDesc;
  Method:TFuncDesc;

  ws: WideString;
begin
  try
    if not cx.IdToValue(id, val) then
      raise ESMException.Create('COM_ResolveObject invalid id');
    propName := val.asJSString.ToSynUnicode(cx);

    if (propName = 'toJSON') then begin
      vp.asObject := cx.NewFunction(COM_toJSONFunction,0,0,nil);
      Result := True;
      exit;
    end;

    if (propName = '__iterator__') then begin
      vp := JSVAL_NULL;
      Result := true;
      exit;
    end;

    privateData := obj.PrivateData;
    IDisp := privateData^.GetDispath;
    OleCheck(IDisp.GetIDsOfNames(GUID_NULL,@propName,1,LOCALE_SYSTEM_DEFAULT,@iDispId));
    GetFuncDesc(IDisp, iDispId, Getter, Setter, Method);

    if (Method.invkind<>-1) or ((Getter.invkind<>-1) and (Getter.cParams>0)) then begin
      propNameA := WideStringToWinAnsi(propName);
      vp.asObject := cx.NewFunction(COM_CallFunction,0,0,pointer(propNameA))
    end else if Getter.invkind<>-1 then begin
      FillChar(DispParams, SizeOf(DispParams), 0);
      res := IDisp.Invoke(iDispId, GUID_NULL, 0, DISPATCH_PROPERTYGET, DispParams,
        @MethodResult, @ExcepInfo, nil);
      OleCheck(res);
      vp := OleVariantToJSVal(cx, MethodResult);
    end else
      raise ESMException.CreateFmt('Cannot get %s property',[propName]);

    Result := True;

  except
    on E: Exception do begin
      Result := false;
      vp := JSVAL_VOID;
      if ExcepInfo.bstrDescription = '' then
        JSError(cx, E)
      else begin
        ws := E.Message +' '+ExcepInfo.bstrDescription;
        JSErrorUC(cx, ws)
      end
    end;
  end;
end;

function COM_SetProperty(cx: PJSContext; var obj: PJSObject; var id: jsid; var vp: jsval; out res: JS_ObjectOpResult):Boolean; cdecl;
var
  val: jsval;
  privateData: POleVariantRecord;
  propName: WideString;
  IDisp: IDispatch;
  iDispId : longint;
  oVar: OleVariant;

  Getter: TFuncDesc;
  Setter: TFuncDesc;
  Method:TFuncDesc;
begin
  try

    if not cx.IdToValue(id, val) then
      raise ESMException.Create('COM_ResolveObject invalid id');

    privateData := obj.PrivateData;
    IDisp := privateData^.GetDispath;
    propName := val.asJSString.ToSynUnicode(cx);

    if (vp.ValType(cx) = JSTYPE_OBJECT) then begin
      if vp.asObject.isDate(cx) then
        oVar := vp.asDate[cx]
      else begin
        privateData := vp.asObject.PrivateData;
        if privateData^.IsMagicCorrect then
          oVar := privateData^.GetDispath;
      end;
      //TODO: Array
    end else
      oVar := JSValToOleVariant(cx, vp);

    OleCheck(IDisp.GetIDsOfNames(GUID_NULL,@propName,1,LOCALE_SYSTEM_DEFAULT,@iDispId));
    GetFuncDesc(IDisp, iDispId, Getter, Setter, Method);
    if Setter.invkind <> -1 then
      SetDispatchPropValue(IDisp, propName, oVar)
    else
      raise ESMException.CreateFmt('Property %s is readonly', [propName]);
    oVar := null;
    Result := True;

  except
    on E: Exception do begin
      Result := False;
      vp := JSVAL_VOID;
      JSError(cx, E);
    end;
  end;

end;

function nsm_createCOMObject(cx: PJSContext; argc: uintN; var vp: JSArgRec): Boolean; cdecl;
var
  val: jsval;
  params: PjsvalVector;
  str: string;
  obj: PJSObject;
  IDisp: IDispatch;
begin
  try
    if (argc<>1)then
      raise ESMException.Create('nsm_createCOMObject invalid ussage');
    params := vp.argv;
    if params[0].ValType(cx)=JSTYPE_STRING then
      str := params[0].asJSString.ToSynUnicode(cx)
    else
      raise ESMException.Create('nsm_createCOMObject invalid ussage');

    IDisp := CreateOleObject(str);
    obj := GetJSCOMObject(cx, IDisp);

    vp.rval := obj.ToJSValue;
    Result := True;
  except
    on E: Exception do begin
      Result := False;
      vp.rval := JSVAL_VOID;
      JSError(cx, E);
    end;
  end;
end;

{ TUBComBridgeSMPlugin }

procedure TUBComBridgeSMPlugin.Init(const rec: TSMPluginRec);
begin
  inherited;
  CoInitialize(nil);
  rec.Exp.ptr.DefineFunction(rec.cx, 'createCOMObject', nsm_createCOMObject, 1, StaticROAttrs);
end;

procedure TUBComBridgeSMPlugin.UnInit;
begin
  inherited;
    CoUninitialize;
end;

{ TOleVariantRecord }

destructor TOleVariantRecord.Destroy;
begin
  Val := null;
end;

function TOleVariantRecord.GetDispath: IDispatch;
begin
  if IsMagicCorrect then
    result := Val
  else
    result := nil;
end;

constructor TOleVariantRecord.init(aVal: OleVariant);
begin
  magic := OleVariantRecordMagic;
  Val := aVal;
end;

function TOleVariantRecord.IsMagicCorrect: boolean;
begin
  result := magic=OleVariantRecordMagic;
end;

initialization
end.
