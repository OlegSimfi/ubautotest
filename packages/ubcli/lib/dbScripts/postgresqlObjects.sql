CREATE OR REPLACE FUNCTION f_arridx (
  arr smallint [],
  value smallint
)
RETURNS integer AS
$body$
DECLARE
  i INTEGER;
  ind INTEGER;
BEGIN
  ind := -1;
  -- Attention! Must start from 0 and to array_length (not to array_length - 1)
  FOR i IN 0..array_length(arr, 1) LOOP
    IF (arr[i] = value) THEN
      ind := i;
      EXIT;
    END IF;
  END LOOP;
  RETURN ind;
END;
$body$
LANGUAGE 'plpgsql'
COST 1;
--

CREATE OR REPLACE FUNCTION f_get100ids()
  RETURNS bigint AS
$BODY$
DECLARE
  FID BIGINT;
BEGIN
  SELECT nextval('SEQ_UBMAIN') INTO FID;
  RETURN FID;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 1;
--
CREATE OR REPLACE FUNCTION f_get1id()
  RETURNS bigint AS
$BODY$
DECLARE
  FID BIGINT;
BEGIN
  SELECT nextval('SEQ_UBMAIN_BY1') INTO FID;
  RETURN FID;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 1;
--
CREATE OR REPLACE FUNCTION f_timelog(adate timestamp without time zone)
  RETURNS bigint AS
$BODY$
DECLARE
  FRes double precision;
BEGIN
  SELECT EXTRACT(EPOCH FROM adate) INTO FRes;
  RETURN trunc(FRes) * 1000;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 1;
--
CREATE OR REPLACE FUNCTION f_timelog(adate timestamp with time zone)
  RETURNS bigint AS
$BODY$
DECLARE
  FRes double precision;
BEGIN
  SELECT EXTRACT(EPOCH FROM adate) INTO FRes;
  RETURN trunc(FRes) * 1000;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 1;
--
CREATE OR REPLACE FUNCTION f_timelogtodate(avalue bigint)
  RETURNS timestamp with time zone AS
$BODY$
DECLARE
  FRes TIMESTAMPTZ;
BEGIN
  SELECT TIMESTAMP WITH TIME ZONE 'epoch' + (avalue / 1000) * INTERVAL '1 second' INTO FRes;
  RETURN FRes;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 1;
--
CREATE OR REPLACE FUNCTION f_to_char(aval text, aformat text)
  RETURNS character varying AS
$BODY$
BEGIN
  RETURN trim(aval);
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 1;
--
CREATE OR REPLACE FUNCTION f_to_char(aval character varying, aformat text)
  RETURNS character varying AS
$BODY$
BEGIN
  RETURN trim(aval);
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 1;
--
CREATE OR REPLACE FUNCTION f_to_char(aval timestamp without time zone, aformat text)
  RETURNS character varying AS
$BODY$
BEGIN
  RETURN trim(to_char(aval, aformat));
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 1;
--
CREATE OR REPLACE FUNCTION f_to_char(aval integer, aformat text)
  RETURNS character varying AS
$BODY$
BEGIN
  RETURN trim(to_char(aval, aformat));
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 1;
--
CREATE OR REPLACE FUNCTION f_to_char(aval bigint, aformat text)
  RETURNS character varying AS
$BODY$
BEGIN
  RETURN trim(to_char(aval, aformat));
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 1;
--
CREATE OR REPLACE FUNCTION f_to_char(aval numeric, aformat text)
  RETURNS character varying AS
$BODY$
BEGIN
  RETURN trim(to_char(aval, aformat));
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 1;
--
CREATE OR REPLACE FUNCTION f_to_char(aval timestamp with time zone, aformat text)
  RETURNS character varying AS
$BODY$
BEGIN
  RETURN trim(to_char(aval, aformat));
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 1;
--
CREATE OR REPLACE FUNCTION f_to_char(aval double precision, aformat text)
  RETURNS character varying AS
$BODY$
BEGIN
  RETURN trim(to_char(aval, aformat));
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 1;
--
CREATE OR REPLACE FUNCTION f_maxdate()
RETURNS timestamptz AS
$body$
DECLARE
  FRes timestamptz;
BEGIN
  SELECT to_timestamp('31.12.9999', 'dd.mm.yyyy') AT TIME ZONE 'UTC' INTO FRes;
  RETURN FRes;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
COST 1;
--