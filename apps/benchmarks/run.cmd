if not defined UB_CFG (
  SET UB_CFG=ubConfig.json
  echo A default config %UB_CFG% will be used
)

%UB_HOME%\ub -cfg %UB_CFG%