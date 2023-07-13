UPDATE systems
SET hhm_config = '{"file_path": "/opt/files/SME00865/hhm/sysError", "modality": "CV", "run_group": 1}',
hhm_file_config = '[{"query": "sysError", "file_name": "sysError.log", "pg_table": "ge_cv_syserror", "parsers": ["sys_error"]}]'
WHERE id = 'SME00865';

UPDATE systems -- OLD PATH
SET hhm_config = '{"file_path": "/opt/hhm-files/C0162/SHIP006/SME00498", "modality": "CV", "run_group": 1}',
hhm_file_config = '[{"query": "sysError", "file_name": "sysError.log", "pg_table": "ge_cv_syserror", "parsers": ["sys_error"]}]'
WHERE id = 'SME00498';

UPDATE systems
SET hhm_config = '{"file_path": "/opt/files/SME01442/hhm/sysError", "modality": "CV", "run_group": 1}',
hhm_file_config = '[{"query": "sysError", "file_name": "sysError.log", "pg_table": "ge_cv_syserror", "parsers": ["sys_error"]}]'
WHERE id = 'SME01442'; 