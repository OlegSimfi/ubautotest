CREATE FUNCTION dbo.f_maxdate()
RETURNS datetime
AS
BEGIN
  RETURN CONVERT(DATETIME, '31.12.9999', 104);
END
GO

CREATE TYPE dbo.IDList AS TABLE (
  id bigint NULL
)
GO

CREATE TYPE dbo.StrList AS TABLE (
  id nvarchar(255) NULL
)
GO

create procedure dbo.ub_TreePath (@table nvarchar(max), @id bigint, @old_parent bigint, @new_parent bigint,@old_tree_path nvarchar(max) )
as
begin
    declare @sql nvarchar(max),@params nvarchar(max),@new_tree_path nvarchar(max);
	if (@new_parent is null)
		set @new_tree_path = '/'+cast(@id as nvarchar(max))+'/'
	else
	if (@new_parent = coalesce(@old_parent,-1)) 
		return;
	else Begin
		set @sql = 'select @new_tree_path = mi_treePath+cast(@id as nvarchar(max))+''/'' from '+@table+' where ID = @new_parent';
		set @params = N' @ID bigint, @new_tree_path nvarchar(max) output,@new_parent bigint';
		exec sp_executesql @sql, @params, @ID, @new_tree_path output,@new_parent;
	end		

	set @sql = 'update '+@table+' set mi_treePath = @new_tree_path where ID =  @id'
	set @params = N' @ID bigint, @new_tree_path nvarchar(max)';
	exec sp_executesql @sql, @params,@id,@new_tree_path;
	if (@old_parent is null)
		return;
	set @sql = 'update	'+@table+' set mi_treePath = replace(mi_treePath,@old_tree_path,@new_tree_path) 
				where	mi_treePath like @old_tree_path+''%''';
	set @params = N'@old_tree_path nvarchar(max), @new_tree_path nvarchar(max)';
	exec sp_executesql @sql, @params, @old_tree_path,@new_tree_path; 
end
GO

CREATE FUNCTION dbo.F_TIMELOG(@dt DATETIME) 
RETURNS BIGINT 
AS 
BEGIN 
  DECLARE @diff BIGINT 
  IF @dt IS NULL 
  BEGIN
    SET @diff = 0
  END
  ELSE 
  IF @dt >= '20380119' 
  BEGIN 
    SET @diff = CONVERT(BIGINT, DATEDIFF(S, '19700101', '20380119')) 
              + CONVERT(BIGINT, DATEDIFF(S, '20380119', @dt)) 
  END 
  ELSE 
    SET @diff = DATEDIFF(S, '19700101', @dt) 
  RETURN @diff * 1000
END
GO

create procedure dbo.ub_dropColumnConstraints (@table nvarchar(100),@col  nvarchar(100)) as 
begin 
    declare @CURSOR CURSOR 
    declare @sql_drop nvarchar(max) 
    set @CURSOR  = cursor scroll for 
        select  'alter table  '+@table+' drop constraint '+ cons.name 
    from  sys.sysconstraints sc 
    join sys.syscolumns  cols on(cols.id = sc.id and cols.colid = sc.colid) 
    join sys.sysobjects  cons  on(cons.id = sc.constid) 
    join sys.sysobjects  tabl  on(tabl.id = sc.id and  tabl.type = 'U' and tabl.id = object_id(@table) ) 
    where tabl.id = cols.id 
    and   cols.name = @col 
    open @cursor 
    fetch next from  @CURSOR into @sql_drop 
    while @@FETCH_STATUS = 0 begin 
    exec sp_executesql @sql_drop 
    fetch next from  @CURSOR into @sql_drop 
    end 
    close @CURSOR 
end