unit uUBCompressors;

interface

uses 
  SyNodePluginIntf;

type
  TUBCompressorsPlugin = class(TCustomSMPlugin)
  private
  protected
    procedure Init(const rec: TSMPluginRec); override;
  end;

implementation

uses
  SysUtils,
  SpiderMonkey, SynCommons,
  {$IFDEF WIN32}
  SynBZ,
  {$ENDIF}
  SynZip;

{ TUBCompressorsPlugin }
{$IFDEF WIN32}
function nsm_unBzipM2(cx: PJSContext; argc: uintN; var vp: JSArgRec): Boolean; cdecl;
const
  sUsage = 'usage unBzipM2(buffer: ArrayBuffer): ArrayBuffer';
var
  in_argv: PjsvalVector;
  BufObj: PJSObject;
  bufFrom: pointer;
  BufLength: uint32;

  bzStream: TSynMemoryStream;
  bzD: TBZDecompressor;

  bzUncompressedLength, lRead: Longint;
  OutBufObj: PJSObject;
  bufOut: pointer;
begin
  Result := false;
  try
    in_argv := vp.argv;
    if (argc<>1) or not in_argv[0].isObject then
     raise ESMException.Create(sUsage);
    BufObj := in_argv[0].asObject;
    if BufObj.IsArrayBufferObject then
     raise ESMException.Create(sUsage);
    BufLength := BufObj.GetArrayBufferByteLength;
    bufFrom := BufObj.GetArrayBufferData;
    if BufLength<4 then
      raise ESMException.Create('it is not M2 bz2 file');

    bzStream := TSynMemoryStream.Create(bufFrom, BufLength);

    try
      bzStream.Read(bzUncompressedLength, SizeOf(bzUncompressedLength));
      OutBufObj := cx.NewArrayBuffer(bzUncompressedLength);
      bufOut := OutBufObj.GetArrayBufferData;
      bzD := TBZDecompressor.Create(bzStream);
      try
        lRead := bzD.Read(bufOut^, bzUncompressedLength);
        if lRead <> bzUncompressedLength then
          raise Exception.Create('invalid BZ2 content');
      finally
        bzD.Free;
      end;
    finally
      bzStream.Free;
    end;

    vp.rval := OutBufObj.ToJSValue;
    Result := true;
  except
    on E: Exception do
      JSError(cx, E);
  end;
end;
{$ENDIF}

function nsm_gzipFile(cx: PJSContext; argc: uintN; var vp: JSArgRec): Boolean; cdecl;
const
  sUsage = 'usage gzipFile(fileNameFrom, fileNameTo: string)';
var
  in_argv: PjsvalVector;
  aFrom, aTo: TFileName;
  buffer: RawByteString;
begin
  Result := false;
  try
    in_argv := vp.argv;
    if (argc<>2) or not in_argv[0].isString or not in_argv[1].isString then
     raise ESMException.Create(sUsage);
    aFrom := in_argv[0].AsJsString.ToString(cx);
    aTo := in_argv[1].AsJsString.ToString(cx);
    buffer := StringFromFile(aFrom);
    if buffer = '' then
      raise Exception.CreateFmt('invalid file "%s"', [aFrom]);
    CompressGZip(buffer, True);
    if not FileFromString(buffer, aTo) then
      RaiseLastOSError;
    Result := true;
  except
    on E: Exception do
      JSError(cx, E);
  end;
end;

function nsm_gunzipFile(cx: PJSContext; argc: uintN; var vp: JSArgRec): Boolean; cdecl;
const
  sUsage = 'usage gzipFile(fileNameFrom, fileNameTo: string)';
var
  in_argv: PjsvalVector;
  aFrom, aTo: TFileName;
  buffer: RawByteString;
begin
  Result := false;
  try
    in_argv := vp.argv;
    if (argc<>2) or not in_argv[0].isString or not in_argv[1].isString then
     raise ESMException.Create(sUsage);
    aFrom := in_argv[0].AsJSString.ToString(cx);
    aTo := in_argv[1].AsJSString.ToString(cx);
    buffer := StringFromFile(aFrom);
    if buffer = '' then
      raise Exception.CreateFmt('invalid file "%s"', [aFrom]);
    CompressGZip(buffer, False);
    if not FileFromString(buffer, aTo) then
      RaiseLastOSError;
    Result := true;
  except
    on E: Exception do
      JSError(cx, E);
  end;
end;

procedure TUBCompressorsPlugin.Init(const rec: TSMPluginRec);
begin
  inherited;
{$IFDEF WIN32}
  rec.Exp.ptr.DefineFunction(rec.cx, 'unBzipM2', nsm_unBzipM2, 1, StaticROAttrs);
{$ENDIF}
  rec.Exp.ptr.DefineFunction(rec.cx, 'gunzipFile', nsm_gunzipFile, 2, StaticROAttrs);
  rec.Exp.ptr.DefineFunction(rec.cx, 'gzipFile', nsm_gzipFile, 2, StaticROAttrs);
end;

end.
