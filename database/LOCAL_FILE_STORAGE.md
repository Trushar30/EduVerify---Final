# Local File Storage Structure

## Overview
This document defines the local file storage structure for EduVerify. Files will be stored locally for temporary processing before being uploaded to Supabase Storage.

## Directory Structure

```
uploads/
├── temp/                          # Temporary upload storage
│   ├── submissions/              # Temporary submission files
│   │   └── {session-id}/
│   │       └── {filename}
│   └── avatars/                  # Temporary avatar uploads
│       └── {session-id}/
│           └── {filename}
│
├── cache/                        # Cached files
│   ├── analysis/                 # Analysis results cache
│   │   └── {submission-id}.json
│   └── thumbnails/               # Generated thumbnails
│       └── {file-id}.jpg
│
└── exports/                      # Generated export files
    ├── reports/                  # PDF reports
    │   └── {report-id}.pdf
    └── data/                     # CSV/Excel exports
        └── {export-id}.csv
```

## File Naming Convention

### Submissions
```
Format: {timestamp}_{sanitized-filename}.{ext}
Example: 1642345678_my_essay_final.pdf
```

### Avatars
```
Format: {user-id}_avatar.{ext}
Example: user-123abc_avatar.jpg
```

### Analysis Cache
```
Format: {submission-id}_analysis.json
Example: sub-456def_analysis.json
```

### Reports
```
Format: {class-id}_{assignment-id}_{timestamp}.pdf
Example: class-abc_assign-xyz_1642345678.pdf
```

## File Size Limits

| File Type | Max Size | Storage Duration |
|-----------|----------|------------------|
| Submissions (temp) | 10 MB | 1 hour |
| Avatars (temp) | 2 MB | 30 minutes |
| Analysis Cache | 1 MB | 24 hours |
| Export Reports | 50 MB | 7 days |

## Allowed File Types

### Submissions
- **Documents**: `.pdf`, `.doc`, `.docx`, `.txt`, `.rtf`
- **Code**: `.py`, `.js`, `.java`, `.cpp`, `.c`, `.html`, `.css`
- **Text**: `.md`, `.tex`

### Avatars
- **Images**: `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`

## Cleanup Strategy

### Automatic Cleanup
```javascript
// Run every hour
cleanupTempFiles({
  older_than: '1 hour',
  directories: ['uploads/temp/submissions', 'uploads/temp/avatars']
});

// Run daily
cleanupCacheFiles({
  older_than: '24 hours',
  directories: ['uploads/cache/analysis']
});

// Run weekly
cleanupExports({
  older_than: '7 days',
  directories: ['uploads/exports']
});
```

## File Processing Workflow

### Upload Flow
```
1. Client uploads file
   ↓
2. Save to temp directory: uploads/temp/submissions/{session-id}/
   ↓
3. Validate file (type, size, virus scan)
   ↓
4. Process file (extract text, generate preview)
   ↓
5. Upload to Supabase Storage
   ↓
6. Save file metadata to database
   ↓
7. Delete temp file
   ↓
8. Return file URL to client
```

## Security Measures

### File Validation
```javascript
const allowedTypes = {
  submissions: ['.pdf', '.docx', '.txt'],
  avatars: ['.jpg', '.png', '.webp']
};

function validateFile(file, type) {
  // Check extension
  const ext = path.extname(file.name).toLowerCase();
  if (!allowedTypes[type].includes(ext)) {
    throw new Error('Invalid file type');
  }
  
  // Check MIME type
  if (!file.mimetype.startsWith('application/') && 
      !file.mimetype.startsWith('image/')) {
    throw new Error('Invalid MIME type');
  }
  
  // Check size
  const maxSize = type === 'avatars' ? 2 * 1024 * 1024 : 10 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error('File too large');
  }
  
  return true;
}
```

### Sanitization
```javascript
function sanitizeFilename(filename) {
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, '_')  // Replace special chars
    .replace(/_{2,}/g, '_')         // Remove consecutive underscores
    .substring(0, 100);             // Limit length
}
```

## Environment Configuration

### .env Variables
```bash
# Local storage paths
LOCAL_UPLOAD_DIR=./uploads
LOCAL_TEMP_DIR=./uploads/temp
LOCAL_CACHE_DIR=./uploads/cache
LOCAL_EXPORT_DIR=./uploads/exports

# File size limits (in bytes)
MAX_SUBMISSION_SIZE=10485760    # 10 MB
MAX_AVATAR_SIZE=2097152          # 2 MB

# Cleanup settings
TEMP_FILE_TTL=3600              # 1 hour in seconds
CACHE_FILE_TTL=86400            # 24 hours
EXPORT_FILE_TTL=604800          # 7 days
```

## Backup Strategy

### Daily Backups
- Supabase Storage handles automatic backups
- Local exports backed up to external service
- Database snapshots taken daily

### Disaster Recovery
1. Restore database from Supabase backup
2. Re-sync files from Supabase Storage
3. Regenerate cached analysis if needed

## Monitoring

### Storage Metrics to Track
- Total storage usage
- Number of files per bucket
- Upload/download bandwidth
- Failed uploads
- Cleanup execution logs

### Alerts
- Storage > 80% capacity
- Upload failure rate > 5%
- Cleanup job failures
- Unusual file sizes or types

## Implementation Notes

### Directory Creation
```javascript
const fs = require('fs').promises;
const path = require('path');

async function ensureDirectories() {
  const dirs = [
    'uploads/temp/submissions',
    'uploads/temp/avatars',
    'uploads/cache/analysis',
    'uploads/cache/thumbnails',
    'uploads/exports/reports',
    'uploads/exports/data'
  ];
  
  for (const dir of dirs) {
    await fs.mkdir(dir, { recursive: true });
  }
}
```

### .gitignore Entry
```
# Local uploads (don't commit user files)
uploads/temp/
uploads/cache/
uploads/exports/

# Keep directory structure
!uploads/.gitkeep
!uploads/temp/.gitkeep
!uploads/cache/.gitkeep
!uploads/exports/.gitkeep
```
