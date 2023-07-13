UPDATE systems
SET hhm_config = '{"file_path": "/opt/files/SME01118/hhm", "modality": "MRI", "windowsVersion": "win_10"}',
hhm_file_config = '[{"query": "Application", "file_name": "Application.log", "pg_table": "siemens_mri", "parsers": ["re_v1"]}]'
WHERE id = 'SME01118';

UPDATE systems
SET hhm_config = '{"file_path": "/opt/files/SME01101/hhm", "modality": "MRI", "windowsVersion": "win_10"}',
hhm_file_config = '[{"query": "Application", "file_name": "Application.log", "pg_table": "siemens_mri", "parsers": ["re_v1"]}]'
WHERE id = 'SME01101';