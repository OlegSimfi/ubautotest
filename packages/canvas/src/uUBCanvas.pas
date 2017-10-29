unit uUBCanvas;

interface

uses
  SpiderMonkey,
  SyNodePluginIntf,
  SynGdiPlus,
  SynCommons,
  SyNodeProto,
  Graphics,
  SysUtils,
  Types, //TRect
  Classes; //TFontStyle

type
  TUBCanvasPlugin = class(TCustomSMPlugin)
  private
  protected
    procedure Init(const rec: TSMPluginRec); override;
  end;

  TCanvaImageTypes = (citBMP, citPNG, citJPEG, citGIF);

  TPointerMemoryStream = class(TCustomMemoryStream);

  {$ifdef VER150}
  TTextFormats = (tfBottom, tfCalcRect, tfCenter, tfEditControl, tfEndEllipsis,
    tfPathEllipsis, tfExpandTabs, tfExternalLeading, tfLeft, tfModifyString,
    tfNoClip, tfNoPrefix, tfRight, tfRtlReading, tfSingleLine, tfTop,
    tfVerticalCenter, tfWordBreak, tfHidePrefix, tfNoFullWidthCharBreak,
    tfPrefixOnly, tfTabStop, tfWordEllipsis, tfComposited);
  TTextFormat = set of TTextFormats;
  {$endif}


  TubCanvas = class
  private
//    FDC: HBITMAP;
//    FBmp: HBITMAP;
    FFontName: string;
    FFontColor: integer;
    FFontSize: integer;
    FFontStyle: TFontStyles;
  protected
    {$ifdef fpc}
    image: TPortableNetworkGraphic;
    {$else fpc}
       image: TBitmap;
    {$endif fpc}
    function getAsRawByteString: RawByteString;
    procedure freeHandles;
    // Warning! Canvas MUST be locked using Canvas.Lock before call ActivateFont
    procedure ActivateFont;
  public
    constructor Create;
    destructor Destroy; override;

    procedure drawImage( x, y, width, height: integer; imageIn: TStream; imageType: TCanvaImageTypes);
    procedure createNew(width, height: integer; color: integer);
    function createColor(r,g,b: byte): integer;
    procedure setFont(const name: string; color: integer; size: integer; style: TFontStyles); //(fsBold, fsItalic, fsUnderline, fsStrikeOut)
    function drawText(x, y: integer; text: SynUnicode; width: integer; height: integer; options : TTextFormat): TSize;
    function measureText(text: SynUnicode): TSize;
    procedure saveToFile(const fileName: string);
  end;

    { TubCanvasProtoObject }
  TubCanvasProtoObject = class(TSMCustomProtoObject) //(TSMSimpleRTTIProtoObject)
  protected
    procedure InitObject(aParent: PJSRootedObject); override;
  public
    function NewSMInstance(aCx: pJsContext; argc: uintN; var vp: JSArgRec): TObject; override;
  end;


implementation

uses
  Windows, //DrawTExtEx
  Math,
  SyNodeReadWrite;


procedure TubCanvas.ActivateFont;
begin
  with image.Canvas.Font do begin
    Name := FFontName;
    color := FFontColor;
    Size := FFontSize;
    style := FFontStyle;
  end;
end;

constructor TubCanvas.Create;
begin
  inherited Create();
end;

procedure TubCanvas.freeHandles;
begin
//  if (Fbmp <> 0) then
//    DeleteObject(Fbmp);
//
//  if FDC <> 0 then
//    DeleteDC(FDC);
//
//  Fbmp := 0; FDC := 0;
end;

destructor TubCanvas.Destroy;
begin
  if Assigned(image) then begin
     FreeAndNil(image);
  end;
  inherited Destroy;
end;

procedure TubCanvas.createNew(width, height : integer; color : integer);
var fcolor : integer;
begin
// MPV todo GDI
//  freeHandles;
//  FDC := CreateCompatibleDC(0);
//  Fbmp = CreateCompatibleBitmap(FDC, width, height);
//  SelectObject(FDC, Fbmp);

  if Assigned(image) then begin
     FreeAndNil(image);
  end;
//  image := {$ifdef VER150}TPngObject{$else}TPngImage{$endif}.CreateBlank(COLOR_RGB, 16, width, height );
//  image.Transparent := False;
  image := Graphics.TBitmap.Create();
  image.Canvas.Lock;
  try
//    image.SetSize(width, height);
    image.Width := width;
    image.Height := height;
    fcolor := color;
    if color <= 0 then begin
       fcolor := clWhite
    end;
    image.Canvas.Brush.Color := fcolor;
    image.Canvas.FillRect( Rect(0, 0, image.Width, image.Height) );
  finally
    image.Canvas.Unlock;
  end;
end;

type
  TDrawTextFlags = Cardinal;
function TTextFormat2TDrawTextFlags(Value: TTextFormat): TDrawTextFlags;
const
  DT_NOFULLWIDTHCHARBREAK = $00080000;
  CFlags: array[TTextFormats] of Cardinal = (
    DT_BOTTOM, DT_CALCRECT, DT_CENTER, DT_EDITCONTROL, DT_END_ELLIPSIS,
    DT_PATH_ELLIPSIS, DT_EXPANDTABS, DT_EXTERNALLEADING, DT_LEFT,
    DT_MODIFYSTRING, DT_NOCLIP, DT_NOPREFIX, DT_RIGHT, DT_RTLREADING,
    DT_SINGLELINE, DT_TOP, DT_VCENTER, DT_WORDBREAK, DT_HIDEPREFIX,
    DT_NOFULLWIDTHCHARBREAK, DT_PREFIXONLY, DT_TABSTOP, DT_WORD_ELLIPSIS,
    0 {tfComposited});
var
  LDrawTextFlag: TTextFormats;
begin
  Result := 0;
  for LDrawTextFlag := Low(TTextFormats) to High(TTextFormats) do
    if (LDrawTextFlag in Value) then
      Result := Result or CFlags[LDrawTextFlag];
end;

function TubCanvas.drawText( x, y: integer;  text: SynUnicode; width : integer; height : integer;
  options: TTextFormat ): TSize;
var frect: TRect;
    fheight : integer;
    ftext: SynUnicode;
begin
  fheight := height;
  if (fheight <= 0) then begin
    fheight :=  image.height - y;
  end;

  frect := rect(x, y, x + width, y + fheight);
  ftext := text;
  image.Canvas.Lock;
  try
    ActivateFont;
      if DrawTextExW( image.Canvas.Handle, PWideChar(ftext), Length(ftext),
          frect, TTextFormat2TDrawTextFlags(options), nil) = 0 then
        raise Exception.Create('DrawText fail');

     GetTextExtentPoint32W(image.Canvas.Handle, PWideChar(ftext), Length(ftext), Result);
  finally
    Image.Canvas.Unlock;
  end;

end;

function TubCanvas.measureText(text: SynUnicode): TSize;
var
   ftext : SynUnicode;
begin
  ftext := text;
  image.Canvas.Lock;
  try
    ActivateFont;
    GetTextExtentPoint32W(image.Canvas.Handle, PWideChar(ftext), Length(ftext), Result);
  finally
    image.Canvas.Unlock;
  end;
end;

procedure TubCanvas.saveToFile(const fileName : string);
begin
   image.SaveToFile(fileName);
end;

function TubCanvas.createColor( r, g, b : byte ): integer;
begin
  Result := (r or (g shl 8) or (b shl 16));
end;

procedure TubCanvas.setFont(const name: string; color: integer; size: integer; style: TFontStyles);
begin
  FFontName := name;
  FFontColor := color;
  FFontSize := size;
  FFontStyle := Style;
end;

function TubCanvas.getAsRawByteString: RawByteString;
var
  Pic: TSynPicture;
begin
  image.Canvas.Lock;
  try
    Pic := TSynPicture.Create;
    try
      Pic.Assign(image);
      if Pic.Empty then
        exit;
      SaveAsRawByteString(Pic,Result,gptPNG); //,80,300
    finally
      Pic.Free;
    end;
  finally
    image.Canvas.Unlock;
  end;
end;

procedure TubCanvas.drawImage( x, y, width, height: integer; imageIn: TStream; imageType: TCanvaImageTypes);
var
  nWidth, nHeight: integer;
  Pic: TSynPicture;
begin
  Pic := TSynPicture.Create;
  try
    Pic.LoadFromStream(imageIn);
    if Pic.Empty then
      exit;

    image.Canvas.Lock;
    try
      if ((height > 0) or (width > 0)) and ((Pic.width <> width) or (Pic.height <> height))  then begin
        nWidth := width;
        nHeight := height;
        if (height = 0) or (width = 0) then begin
           if nWidth = 0 then nWidth := ((height * Pic.Width) div Pic.Height);
           if nHeight = 0 then nHeight := ((width * Pic.Height) div Pic.Width);
        end;
        image.Canvas.StretchDraw( Rect(x, y, x + nWidth, y + nHeight), Pic);

      end else begin
        Pic.Draw( image.Canvas,  Rect(x, y, x + Pic.width, y + Pic.height));
      end;
    finally
      image.Canvas.Unlock;
    end;
  finally
    Pic.Free;
  end;
end;

// ************** TubCanvasProtoObject *****************
function GetCanvas(cx: PJSContext; vp: JSArgRec): TubCanvas;
var
  inst: PSMInstanceRecord;
begin
  if not IsInstanceObject(cx, vp.thisObject[cx], inst) then
    raise ESMException.Create('No privat data!');
  Result := (inst.Instance as TubCanvas);
end;

function CanvasProtoObject_createNew_imp(cx: PJSContext; argc: uintN; vals: PjsvalVector; thisObj, calleeObj: PJSObject): jsval; cdecl;
var
  width, height: integer;
  color: integer;
  inst: PSMInstanceRecord;
  canvas: TubCanvas;
begin
  if not IsInstanceObject(cx, thisObj, inst) then
    raise ESMException.Create('CanvasProtoObject_createNew invalid privat');

  canvas := TubCanvas(inst.instance);
  width := vals[0].asInteger;
  height := vals[1].asInteger;
  color := vals[2].asInteger;

  canvas.createNew(width, height, color);

  result := JSVAL_VOID;
end;

function CanvasProtoObject_createNew(cx: PJSContext; argc: uintN; var vp: JSArgRec): Boolean; cdecl;
begin
  Result := nsmCallFunc(cx, argc, vp, [3, ptInt, ptInt, ptInt, integer(@CanvasProtoObject_createNew_imp)]);
end;

function CanvasProtoObject_getContent(cx: PJSContext; argc: uintN; var vp: JSArgRec): Boolean; cdecl;
var
  canvas: TubCanvas;
begin
  try
    canvas := GetCanvas(cx, vp);
    vp.rval := SyNodeReadWrite.SMRead_impl(cx, argc, vp.argv, canvas.getAsRawByteString());
    Result := true;
  except
    on E: Exception do begin
      Result := false;
      JSError(cx, E);
    end;
  end;
end;

function CanvasProtoObject_createColor(cx: PJSContext; argc: uintN; var vp: JSArgRec): Boolean; cdecl;
const
    cUsage = 'usage createColor(r,g,b: integer)';
var
  canvas: TubCanvas;
  argv: PjsvalVector;
  res: jsval;
begin
  try
    argv := vp.argv;
    if (argc<3) or not argv[0].isInteger or not argv[1].isInteger or not argv[2].isInteger then
      raise ESMException.Create(cUsage);
    canvas := GetCanvas(cx, vp);
    res.asInteger := canvas.createColor(argv[0].asInteger, argv[1].asInteger, argv[2].asInteger);
    vp.rval := res;
    Result := true;
  except
    on E: Exception do begin
      Result := false;
      JSError(cx, E);
    end;
  end;
end;

function CanvasProtoObject_setFont(cx: PJSContext; argc: uintN; var vp: JSArgRec): Boolean; cdecl;
const
    cUsage = 'usage setFont(name: String; color: integer; size: integer; style: integer)';
var
  canvas: TubCanvas;
  argv: PjsvalVector;
  st: byte;
  style: TFontStyles;
begin
  try
    argv := vp.argv;
    if (argc<4) or not argv[0].isString or not argv[1].isInteger or not argv[2].isInteger or not argv[3].isInteger then
      raise ESMException.Create(cUsage);
    canvas := GetCanvas(cx, vp);

    st := argv[3].asInteger;
    style := TFontStyles(st);

    canvas.setFont(argv[0].asJSString.ToString(cx), argv[1].asInteger, argv[2].asInteger, style);
    vp.rval := JSVAL_VOID;
    Result := true;
  except
    on E: Exception do begin
      Result := false;
      JSError(cx, E);
    end;
  end;
end;

function CanvasProtoObject_drawText(cx: PJSContext; argc: uintN; var vp: JSArgRec): Boolean; cdecl;
const
    cUsage = 'usage drawText(x, y: integer;  text: String; width : integer; height : integer; options: integer)';
var
  canvas: TubCanvas;
  argv: PjsvalVector;
  opt: integer;
  width: integer;
  size : TSize;
  resultJS: PJSObject;
  val: jsval;
begin
  try
    argv := vp.argv;
    if (argc<6) or not argv[0].isInteger or not argv[1].isInteger or not argv[2].isString
        or not argv[3].isInteger or not argv[4].isInteger or not argv[5].isInteger then
      raise ESMException.Create(cUsage);
    canvas := GetCanvas(cx, vp);

    opt := argv[5].asInteger;
    width := argv[3].asInteger;

    size := canvas.drawText(argv[0].asInteger, argv[1].asInteger, argv[2].asJSString.ToSynUnicode(cx), argv[3].asInteger, argv[4].asInteger, TTextFormat(opt));

    resultJS := cx.NewObject(nil);
    val.asInteger := size.cx;
    resultJS.DefineProperty(cx, 'lineWidth',  val, StaticROAttrs);
    val.asInteger := size.cy;
    resultJS.DefineProperty(cx, 'lineHeight',  val, StaticROAttrs);

    if (width > 0) then begin
       val.asInteger := Ceil(size.cx / width) * size.cy;
       resultJS.DefineProperty(cx, 'height',  val, StaticROAttrs);
       val.asInteger := width;
       resultJS.DefineProperty(cx, 'weidth',  val, StaticROAttrs);
    end else begin
       val.asInteger := size.cy;
       resultJS.DefineProperty(cx, 'height',  val, StaticROAttrs);
       val.asInteger := size.cx;
       resultJS.DefineProperty(cx, 'weidth',  val, StaticROAttrs);
    end;

    vp.rval := resultJS.ToJSValue;
    Result := true;
  except
    on E: Exception do begin
      Result := false;
      JSError(cx, E);
    end;
  end;
end;

function CanvasProtoObject_drawImage(cx: PJSContext; argc: uintN; var vp: JSArgRec): Boolean; cdecl;
const
    cUsage = 'usage drawImage(x, y, width, height: integer; imageIn: ArrayBuffer; imageType: integer)';
var
  canvas: TubCanvas;
  argv: PjsvalVector;
  opt, dataLen: integer;
  data: pointer;
  dataJS: PJSObject;
  stream: TPointerMemoryStream;
  res: jsval;
begin
  try
    argv := vp.argv;
    if (argc<6) or not argv[0].isInteger or not argv[1].isInteger or not argv[2].isInteger
        or not argv[3].isInteger  or not argv[4].isObject  or not argv[5].isInteger  then
      raise ESMException.Create(cUsage);
    canvas := GetCanvas(cx, vp);

    opt := argv[5].asInteger;

    dataJS := argv[4].asObject;
    dataLen := dataJS.GetArrayBufferByteLength();
    data := dataJS.GetArrayBufferData;
    stream := TPointerMemoryStream.create;
    try
     stream.SetPointer(data, dataLen);
     canvas.drawImage(argv[0].asInteger, argv[1].asInteger, argv[2].asInteger,
        argv[3].asInteger, stream, TCanvaImageTypes(opt));
    finally
      stream.free;
    end;
    res.asInteger := 0;
    vp.rval := res;
    Result := true;
  except
    on E: Exception do begin
      Result := false;
      JSError(cx, E);
    end;
  end;
end;

function CanvasProtoObject_saveToFile(cx: PJSContext; argc: uintN; var vp: JSArgRec): Boolean; cdecl;
const
    cUsage = 'usage saveToFile(fileName : string)';
var
  canvas: TubCanvas;
  argv: PjsvalVector;
begin
  try
    argv := vp.argv;
    if (argc<1) or not argv[0].isString then
      raise ESMException.Create(cUsage);
    canvas := GetCanvas(cx, vp);
    canvas.saveToFile(argv[0].asJSString.ToString(cx));
    vp.rval := JSVAL_VOID;
    Result := true;
  except
    on E: Exception do begin
      Result := false;
      JSError(cx, E);
    end;
  end;
end;

function CanvasProtoObject_measureText(cx: PJSContext; argc: uintN; var vp: JSArgRec): Boolean; cdecl;
const
    cUsage = 'usage measureText(text: string)';
var
  canvas: TubCanvas;
  argv: PjsvalVector;
  size : TSize;
  resultJS: PJSObject;
  val: jsval;
begin
  try
    argv := vp.argv;
    if (argc<1) or not argv[0].isString then
      raise ESMException.Create(cUsage);
    canvas := GetCanvas(cx, vp);
    size := canvas.measureText(argv[0].asJSString.ToSynUnicode(cx));

    resultJS := cx.NewObject(nil);
    val.asInteger := size.cx;
    resultJS.DefineProperty(cx, 'width',  val, StaticROAttrs);
    val.asInteger := size.cy;
    resultJS.DefineProperty(cx, 'height',  val, StaticROAttrs);

    vp.rval := resultJS.ToJSValue;
    Result := true;
  except
    on E: Exception do begin
      Result := false;
      JSError(cx, E);
    end;
  end;
end;

procedure TubCanvasProtoObject.InitObject(aParent: PJSRootedObject);
begin
  definePrototypeMethod('createNew', CanvasProtoObject_createNew, 3, [jspEnumerate, jspPermanent, jspReadOnly]);
  definePrototypeMethod('getContent', CanvasProtoObject_getContent, 1, [jspEnumerate, jspPermanent, jspReadOnly]);
  definePrototypeMethod('createColor', CanvasProtoObject_createColor, 3, [jspEnumerate, jspPermanent, jspReadOnly]);
  definePrototypeMethod('setFont', CanvasProtoObject_setFont, 4, [jspEnumerate, jspPermanent, jspReadOnly]);
  definePrototypeMethod('drawText', CanvasProtoObject_drawText, 6, [jspEnumerate, jspPermanent, jspReadOnly]);
  definePrototypeMethod('drawImage', CanvasProtoObject_drawImage, 6, [jspEnumerate, jspPermanent, jspReadOnly]);
  definePrototypeMethod('saveToFile', CanvasProtoObject_saveToFile, 1, [jspEnumerate, jspPermanent, jspReadOnly]);

  inherited InitObject(aParent);
end;

function TubCanvasProtoObject.NewSMInstance(aCx: pJsContext; argc: uintN; var vp: JSArgRec): TObject;
begin
  Result := TubCanvas.Create();
end;

{ TUBCanvasPlugin }

procedure TUBCanvasPlugin.Init(const rec: TSMPluginRec);
begin
  inherited;
  defineEnum(rec.cx, TypeInfo(TTextFormats), rec.Exp);
  defineEnum(rec.cx, TypeInfo(TFontStyle), rec.Exp);
  defineClass(rec.cx, TubCanvas, TubCanvasProtoObject, rec.Exp);
end;

initialization
  Gdip.RegisterPictures;
end.
