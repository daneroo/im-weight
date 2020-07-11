# S3 for im-weight

Minimal module to get/put single object (observationdata.json) in a bucket

- Should perform provisioning of keys (with pulumi) as in `im-qcic/s3` bash scripts
- Do it with bash scripts
- update to node?
- Update to pulumi?

## Provisioning

This is done with a higher level account (provisioner = im-dan)

- as provisioner
  - Create a User (the appuser)
  - Create a accessPolicy
  - Attach user to policy

- as the provisioner I want to rotate keys
  - Create an accessKey
  - push the new keys, and validate them
  - mark old one as inactive
  - remove inactive

- as the application
  - I can read/write a single object from s3
  - cannot list buckets, 
  - cannot create another object


