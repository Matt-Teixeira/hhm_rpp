UPDATE systems
SET hhm_config = '{"file_path": "/opt/hhm-files/C0137/SHIP008/SME00865", "modality": "CV", "run_group": 1}',
hhm_file_config = '[{"query": "sysError", "file_name": "sysError.log", "pg_table": "ge_cv_syserror", "parsers": ["sys_error"]}]'
WHERE id = 'SME00865';

UPDATE systems
SET hhm_config = '{"file_path": "/opt/hhm-files/C0162/SHIP006/SME00498", "modality": "CV", "run_group": 1}',
hhm_file_config = '[{"query": "sysError", "file_name": "sysError.log", "pg_table": "ge_cv_syserror", "parsers": ["sys_error"]}]'
WHERE id = 'SME00498';

UPDATE systems
SET hhm_config = '{"file_path": "/opt/hhm-files/C027932/SHIP014/SME01442", "modality": "CV", "run_group": 1}',
hhm_file_config = '[{"query": "sysError", "file_name": "sysError.log", "pg_table": "ge_cv_syserror", "parsers": ["sys_error"]}]'
WHERE id = 'SME01442'; 